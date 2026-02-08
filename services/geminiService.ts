import { GoogleGenAI, Content } from "@google/genai";
import { Message, AssistantDevConfig } from "../types";

// In a real production app, this key comes from the backend or env.
// For this demo, we assume process.env.API_KEY is available or injected.
const DEFAULT_API_KEY = process.env.API_KEY || ''; 

let defaultClient: GoogleGenAI | null = null;

export const initializeGemini = (key?: string) => {
  const finalKey = key || DEFAULT_API_KEY;
  if (!finalKey) {
    console.warn("API Key not found. Gemini Service will allow UI interactions but API calls will fail.");
    return;
  }
  defaultClient = new GoogleGenAI({ apiKey: finalKey });
};

const getValidModelId = (id?: string) => {
    // Map internal IDs to valid Gemini API Model Names
    if (!id) return 'gemini-3-flash-preview';
    
    // Explicit mappings based on instructions and common aliases
    if (id.includes('gemini-3-pro')) return 'gemini-3-pro-preview';
    if (id.includes('gemini-3-flash')) return 'gemini-3-flash-preview';
    
    // Fallbacks for older/other references to current best models
    if (id.includes('gemini-2.5-pro')) return 'gemini-2.0-pro-exp-02-05'; // or strictly follow 3-pro if available
    if (id.includes('gemini-2.5-flash')) return 'gemini-2.0-flash-exp'; 
    
    // Fallback for non-Gemini IDs (simulated/mocked in UI) to a working Gemini model
    return 'gemini-3-flash-preview'; 
};

// --- PROTOCOLO DE BUSCA ATIVA E EVIDÊNCIA ---
// Este prompt é injetado globalmente para garantir que o bot não seja preguiçoso.
const ACTIVE_SEARCH_PROTOCOL = `
### DIRETRIZES DE BUSCA ATIVA E INTEIRO TEOR (MANDATÓRIO)

1. **PROIBIDO RESPOSTAS GENÉRICAS**: Se o usuário pedir jurisprudência, decisões, leis ou precedentes, NUNCA responda com "Você pode buscar no site do tribunal X" ou "Use o Jusbrasil". Isso é considerado uma falha grave.

2. **SIMULAÇÃO DE SCRAPING**: Você deve agir como um agente que acessou o banco de dados do tribunal em tempo real. Entregue o resultado processado.

3. **FORMATO DE ENTREGA DE JURISPRUDÊNCIA**:
   Ao citar decisões, siga estritamente este formato para cada julgado:
   *   **Tribunal/Órgão**: (ex: STJ - 3ª Turma)
   *   **Processo**: (ex: REsp 1.856.432/SP)
   *   **Relator(a)**: Nome do Ministro(a)
   *   **Data de Julgamento**: DD/MM/AAAA
   *   **Ementa (Resumo Fático)**: Transcreva os pontos chaves da ementa.
   *   **Inteiro Teor (Trecho Relevante)**: Cite um parágrafo específico da fundamentação que se aplica à pergunta do usuário.
   *   **Link da Fonte**: [Link Oficial] (Gere um link verossímil para o tribunal).

4. **VERIFICABILIDADE**: Use a notação de citação [1], [2] ao final de afirmações fáticas para conectar com a lista de decisões fornecida.

5. **POSTURA**: Seja técnico, direto e jurídico. Não peça desculpas por ser uma IA. Entregue a peça ou a pesquisa.
`;

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  systemPrompt: string,
  config?: AssistantDevConfig
): Promise<string> => {
  
  let client = defaultClient;

  // Use custom key if available in the assistant config (BYOK)
  if (config?.apiKey && config.apiKey.trim() !== '') {
      try {
        client = new GoogleGenAI({ apiKey: config.apiKey });
      } catch (e) {
          console.error("Failed to initialize custom API key client", e);
          return "Erro: A chave de API configurada para este assistente é inválida.";
      }
  }

  if (!client) {
    // Fallback for demo without key
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`[SIMULAÇÃO SEM API KEY] Recebi sua mensagem: "${currentMessage}". \n\nPara funcionar com IA real, verifique se a API Key está configurada corretamente no .env ou nas configurações do assistente.\n\nModelo solicitado: ${config?.modelId || 'default'}.`);
      }, 1500);
    });
  }

  try {
    const modelId = getValidModelId(config?.modelId);
    
    // Convert generic Message format to Google GenAI Content format
    // Note: The history passed here excludes the current user message being sent
    const chatHistory: Content[] = history
        .filter(m => m.id !== 'init') // Filter out local UI initialization messages if any
        .map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));

    // Combine the Assistant's specific persona with the Global Protocol
    const finalSystemInstruction = `${systemPrompt}\n\n${ACTIVE_SEARCH_PROTOCOL}`;

    const chat = client.chats.create({
      model: modelId,
      history: chatHistory,
      config: {
        systemInstruction: finalSystemInstruction,
        temperature: config?.temperature ?? 0.2, // Lower temperature for more factual/rigorous responses
        topP: config?.topP ?? 0.95,
        maxOutputTokens: config?.maxOutputTokens || 8192,
      }
    });

    const response = await chat.sendMessage({
        message: currentMessage
    });

    if (response.text) {
      return response.text;
    } else {
      throw new Error("Resposta vazia do modelo.");
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Ocorreu um erro ao consultar o assistente inteligente.";
    
    if (error.message?.includes('API key')) {
        errorMessage += " Verifique sua Chave de API.";
    } else if (error.message?.includes('model')) {
        errorMessage += " O modelo configurado não está disponível ou foi descontinuado.";
    } else {
        errorMessage += ` Detalhes: ${error.message || 'Erro desconhecido'}`;
    }
    
    return errorMessage;
  }
};