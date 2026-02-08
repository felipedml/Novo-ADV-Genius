import React, { useState } from 'react';
import { 
    CreditCard, Download, CheckCircle, AlertTriangle, ExternalLink, 
    Activity, Settings, Save, Server, Shield, Globe, RefreshCw, X,
    Database, Users, Cpu, FileText
} from 'lucide-react';

// Mock Data for Plans
const PLANS = [
    { id: 'starter', name: 'ADV Starter', price: 'R$ 97', features: ['1 Usuário', '50k Tokens/mês', 'Sem OCR'] },
    { id: 'pro', name: 'ADV Genius Pro', price: 'R$ 297', features: ['5 Usuários', '1M Tokens/mês', 'OCR Ilimitado', 'Análise Documental'] },
    { id: 'enterprise', name: 'ADV Enterprise', price: 'Sob Consulta', features: ['Usuários Ilimitados', 'API Dedicada', 'SSO', 'Gerente de Conta'] },
];

const Billing: React.FC = () => {
    // UI States
    const [isConfiguringGateway, setIsConfiguringGateway] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(false);
    const [showPlans, setShowPlans] = useState(false);
    const [showUsageDetails, setShowUsageDetails] = useState(false); // New State
    const [showTerms, setShowTerms] = useState(false); // New State
    const [loading, setLoading] = useState(false);

    // Form States (Simulating Data Persistence)
    const [gateway, setGateway] = useState('Stripe');
    const [apiKey, setApiKey] = useState('sk_live_********************4242');
    const [webhookUrl, setWebhookUrl] = useState('https://api.advgenius.com.br/webhooks/stripe');
    const [cardLast4, setCardLast4] = useState('8842');
    const [currentPlanId, setCurrentPlanId] = useState('pro');

    // Mock Invoices
    const invoices = [
        { id: 'inv_001', date: '01/05/2024', amount: 'R$ 297,00', status: 'paid', pdfUrl: '#' },
        { id: 'inv_002', date: '01/04/2024', amount: 'R$ 297,00', status: 'paid', pdfUrl: '#' },
        { id: 'inv_003', date: '01/03/2024', amount: 'R$ 297,00', status: 'paid', pdfUrl: '#' },
    ];

    const handleSaveGateway = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsConfiguringGateway(false);
            alert("Gateway de pagamento conectado com sucesso!");
        }, 1500);
    };

    const handleUpdateCard = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsEditingCard(false);
            setCardLast4('1234'); 
            alert("Método de pagamento atualizado.");
        }, 1500);
    };

    const handleChangePlan = (planId: string) => {
        setLoading(true);
        setTimeout(() => {
            setCurrentPlanId(planId);
            setLoading(false);
            setShowPlans(false);
            alert(`Plano alterado para ${PLANS.find(p => p.id === planId)?.name}`);
        }, 1000);
    };

    const handleDownloadInvoice = (id: string) => {
        alert(`Iniciando download da fatura ${id}...`);
    };

    const currentPlan = PLANS.find(p => p.id === currentPlanId) || PLANS[1];

    return (
        <div className="flex flex-col h-full bg-adv-gray text-white p-8 overflow-y-auto animate-in fade-in duration-500 relative">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                        <CreditCard className="w-8 h-8 text-adv-gold" />
                        Billing & Integrações
                    </h1>
                    <p className="text-gray-400">Gerencie assinaturas, métodos de pagamento e conexões bancárias.</p>
                </div>
                <button 
                    onClick={() => setIsConfiguringGateway(!isConfiguringGateway)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${isConfiguringGateway ? 'bg-adv-gold text-black border-adv-gold' : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'}`}
                >
                    <Settings className="w-4 h-4" />
                    {isConfiguringGateway ? 'Fechar Configuração' : 'Configurar Gateway'}
                </button>
            </div>

            {/* GATEWAY CONFIGURATION PANEL */}
            {isConfiguringGateway && (
                <div className="bg-black/40 border border-adv-gold/30 rounded-xl p-6 mb-8 animate-in slide-in-from-top space-y-6 shadow-2xl">
                    <div className="flex items-center gap-2 text-adv-gold mb-2">
                        <Server className="w-5 h-5" />
                        <h3 className="font-bold text-lg">Integração de Pagamento (Backend)</h3>
                    </div>
                    <p className="text-sm text-gray-400">Configure as chaves de API para processar pagamentos reais (Stripe, Iugu, Asaas ou Pagar.me).</p>
                    
                    <form onSubmit={handleSaveGateway} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Provedor</label>
                            <select 
                                value={gateway} 
                                onChange={(e) => setGateway(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:border-adv-gold outline-none"
                            >
                                <option value="Stripe">Stripe</option>
                                <option value="Iugu">Iugu</option>
                                <option value="Asaas">Asaas</option>
                                <option value="PagarMe">Pagar.me</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ambiente</label>
                            <div className="flex items-center gap-4 bg-black border border-white/10 rounded-lg p-2.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="env" className="accent-adv-gold" /> Sandbox
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="env" className="accent-adv-gold" defaultChecked /> Production
                                </label>
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">API Secret Key</label>
                            <div className="relative">
                                <input 
                                    type="password" 
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pr-10 text-white font-mono text-sm focus:border-adv-gold outline-none"
                                />
                                <Shield className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Webhook URL (Para callback de status)</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg p-3 pr-10 text-gray-400 font-mono text-sm focus:border-adv-gold outline-none"
                                    readOnly
                                />
                                <Globe className="absolute right-3 top-3 w-4 h-4 text-blue-500" />
                            </div>
                        </div>
                        <div className="col-span-2 flex justify-end gap-3 pt-2">
                            <button 
                                type="button"
                                onClick={() => setIsConfiguringGateway(false)} 
                                className="px-4 py-2 text-gray-400 hover:text-white text-sm"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="bg-adv-gold text-black px-6 py-2 rounded-lg font-bold hover:bg-adv-goldDim transition-colors flex items-center gap-2"
                            >
                                {loading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4" />}
                                Salvar Integração
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* MAIN DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                
                {/* 1. PLAN CARD */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden group hover:border-adv-gold/30 transition-colors flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Plano Atual</h3>
                            <Activity className="w-5 h-5 text-adv-gold" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold text-white">{currentPlan.name}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                             <span className="text-sm text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-900/50 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Ativo
                            </span>
                            <span className="text-xs text-gray-500">Renova em 01/06/2024</span>
                        </div>
                        <ul className="text-xs text-gray-400 space-y-1 mb-6">
                            {currentPlan.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-adv-gold"/> {f}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <button 
                        onClick={() => setShowPlans(true)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition-colors border border-white/10"
                    >
                        Alterar Plano
                    </button>
                </div>

                {/* 2. PAYMENT METHOD CARD */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
                     <div>
                        <div className="flex justify-between items-start mb-4">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Método de Pagamento</h3>
                             {isEditingCard ? <AlertTriangle className="w-5 h-5 text-adv-gold animate-pulse"/> : <CreditCard className="w-5 h-5 text-gray-500"/>}
                        </div>
                        
                        {isEditingCard ? (
                            <form onSubmit={handleUpdateCard} className="space-y-3">
                                <input type="text" placeholder="Número do Cartão" className="w-full bg-black border border-white/10 rounded p-2 text-xs text-white focus:border-adv-gold outline-none" required />
                                <div className="flex gap-2">
                                    <input type="text" placeholder="MM/AA" className="w-1/2 bg-black border border-white/10 rounded p-2 text-xs text-white focus:border-adv-gold outline-none" required />
                                    <input type="text" placeholder="CVC" className="w-1/2 bg-black border border-white/10 rounded p-2 text-xs text-white focus:border-adv-gold outline-none" required />
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-adv-gold text-black text-xs font-bold py-2 rounded">
                                    {loading ? 'Validando...' : 'Salvar Cartão'}
                                </button>
                                <button type="button" onClick={() => setIsEditingCard(false)} className="w-full text-xs text-gray-500 hover:text-white">Cancelar</button>
                            </form>
                        ) : (
                            <>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-9 bg-gray-200 rounded flex items-center justify-center shadow-lg relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400"></div>
                                        <div className="flex -space-x-3 relative z-10">
                                            <div className="w-5 h-5 rounded-full bg-red-600 opacity-90"></div>
                                            <div className="w-5 h-5 rounded-full bg-yellow-500 opacity-90"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white tracking-wide">Mastercard •••• {cardLast4}</p>
                                        <p className="text-xs text-gray-500">Expira em 12/28</p>
                                    </div>
                                </div>
                                <div className="bg-green-900/10 border border-green-500/20 rounded p-2 mb-2">
                                    <p className="text-[10px] text-green-400 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3"/> Gateway {gateway} Conectado
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    
                    {!isEditingCard && (
                        <button 
                            onClick={() => setIsEditingCard(true)}
                            className="w-full text-adv-gold hover:text-white text-sm font-bold py-2 border border-adv-gold/30 rounded-lg hover:bg-adv-gold/10 transition-colors flex items-center justify-center gap-2"
                        >
                            Atualizar Cartão
                        </button>
                    )}
                </div>

                {/* 3. CONSUMPTION METRICS */}
                <div className="bg-black/30 border border-white/10 rounded-xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                         <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Consumo da Franquia</h3>
                            <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-white font-medium">Geração de Tokens (IA)</span>
                                    <span className="text-gray-400">450k / 1M</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-adv-gold h-1.5 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span className="text-white font-medium">Documentos (Docs)</span>
                                    <span className="text-gray-400">12 / 100</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: '12%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center">
                             <p className="text-xs text-gray-500">Ciclo fecha em 15 dias</p>
                             <button onClick={() => setShowUsageDetails(true)} className="text-xs text-adv-gold hover:underline">Ver detalhes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* INVOICES TABLE */}
            <div className="bg-black/30 border border-white/10 rounded-xl overflow-hidden shadow-xl flex-1">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <div>
                        <h3 className="text-lg font-bold text-white">Histórico de Faturas</h3>
                        <p className="text-xs text-gray-500">Visualize e baixe seus comprovantes fiscais.</p>
                    </div>
                    <button 
                        onClick={() => alert("Gerando relatório CSV consolidado...")}
                        className="text-xs text-adv-gold hover:text-white flex items-center gap-1 border border-adv-gold/30 px-3 py-1.5 rounded hover:bg-adv-gold/10 transition-colors"
                    >
                        <Download className="w-3 h-3" /> Exportar Relatório
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4 pl-6">Status</th>
                                <th className="p-4">Data</th>
                                <th className="p-4">Valor</th>
                                <th className="p-4">Referência</th>
                                <th className="p-4 text-right pr-6">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <span className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-900/20 px-2 py-1 rounded w-fit border border-green-900/50">
                                            <CheckCircle className="w-3 h-3" /> Paga
                                        </span>
                                    </td>
                                    <td className="p-4 text-white font-medium">{inv.date}</td>
                                    <td className="p-4 text-white font-mono">{inv.amount}</td>
                                    <td className="p-4 text-gray-400 text-xs">ref: {gateway}_sub_{inv.id.slice(-4)}</td>
                                    <td className="p-4 text-right pr-6">
                                        <button 
                                            onClick={() => handleDownloadInvoice(inv.id)}
                                            className="text-gray-500 hover:text-white p-2 rounded hover:bg-white/10 transition-colors" 
                                            title="Baixar PDF"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PLANS MODAL */}
            {showPlans && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-adv-gray border border-white/10 rounded-2xl w-full max-w-4xl p-8 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => setShowPlans(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-white">Escolha o plano ideal</h2>
                            <p className="text-gray-400 mt-2">Upgrade ou downgrade a qualquer momento.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {PLANS.map(plan => (
                                <div key={plan.id} className={`border rounded-xl p-6 flex flex-col relative ${currentPlanId === plan.id ? 'bg-adv-petrol/20 border-adv-gold' : 'bg-black/40 border-white/10'}`}>
                                    {currentPlanId === plan.id && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-adv-gold text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase">Atual</span>
                                    )}
                                    <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-adv-gold mb-6">{plan.price} <span className="text-sm text-gray-500 font-normal">/mês</span></p>
                                    
                                    <ul className="space-y-3 mb-8 flex-1">
                                        {plan.features.map((f, i) => (
                                            <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button 
                                        onClick={() => handleChangePlan(plan.id)}
                                        disabled={currentPlanId === plan.id || loading}
                                        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${
                                            currentPlanId === plan.id 
                                            ? 'bg-white/10 text-gray-400 cursor-not-allowed' 
                                            : 'bg-white text-black hover:bg-adv-gold'
                                        }`}
                                    >
                                        {currentPlanId === plan.id ? 'Plano Atual' : loading ? 'Processando...' : 'Selecionar'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* USAGE DETAILS MODAL */}
            {showUsageDetails && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-adv-gray border border-white/10 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative animate-in zoom-in-95">
                        <button onClick={() => setShowUsageDetails(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-adv-gold" /> Relatório de Consumo Detalhado
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Cpu className="w-4 h-4 text-blue-400"/> IA & Processamento</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Gemini 3 Pro</span>
                                        <span className="text-white">120k tokens</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Gemini 3 Flash</span>
                                        <span className="text-white">300k tokens</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-400">
                                        <span>Sonar / Search</span>
                                        <span className="text-white">30k tokens</span>
                                    </div>
                                    <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-white">
                                        <span>Total</span>
                                        <span className="text-adv-gold">450k / 1M</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Database className="w-4 h-4 text-green-400"/> Armazenamento</h4>
                                    <div className="text-2xl font-bold text-white mb-1">1.2 GB</div>
                                    <p className="text-xs text-gray-500">de 50 GB disponíveis</p>
                                    <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full" style={{width: '2.4%'}}></div>
                                    </div>
                                </div>
                                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-purple-400"/> Assentos</h4>
                                    <div className="text-2xl font-bold text-white mb-1">3 / 5</div>
                                    <p className="text-xs text-gray-500">Usuários Ativos</p>
                                    <div className="w-full bg-gray-800 h-1 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-purple-500 h-full" style={{width: '60%'}}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-900/10 border border-blue-500/20 p-4 rounded-xl">
                                <p className="text-xs text-blue-200">
                                    <strong className="text-blue-400">Dica:</strong> Seu ciclo atual encerra em 01/06. O consumo de tokens excedente será cobrado automaticamente conforme tabela vigente (R$ 5,00 a cada 100k tokens extras).
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TERMS MODAL */}
            {showTerms && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-adv-gray border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-in zoom-in-95">
                         <button onClick={() => setShowTerms(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-lg font-bold text-white mb-4"><FileText className="inline w-5 h-5 mr-2" />Termos de Uso</h3>
                        <div className="h-64 overflow-y-auto bg-black/30 p-4 rounded border border-white/5 text-xs text-gray-400 leading-relaxed mb-4">
                            <p className="mb-2">1. ACEITAÇÃO. Ao utilizar o ADV Genius, você concorda com estes termos.</p>
                            <p className="mb-2">2. PAGAMENTOS. As faturas são geradas mensalmente via Stripe/Gateway configurado.</p>
                            <p className="mb-2">3. CANCELAMENTO. Você pode cancelar a qualquer momento antes da renovação.</p>
                            <p>4. DADOS. Seus dados são protegidos conforme a LGPD.</p>
                        </div>
                        <button onClick={() => setShowTerms(false)} className="w-full bg-white/10 hover:bg-white/20 py-2 rounded text-sm text-white font-bold">Entendi</button>
                    </div>
                </div>
            )}
            
            <div className="mt-8 text-center pb-4">
                <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
                    <ShieldCheckIcon className="w-3 h-3" />
                    Pagamentos seguros via {gateway} SSL.
                    <button onClick={() => setShowTerms(true)} className="text-gray-500 hover:text-adv-gold hover:underline transition-colors ml-1">Termos de Uso</button>
                </p>
            </div>
        </div>
    );
};

// Helper Icon for Footer
const ShieldCheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default Billing;