
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UploadAttachmentProps {
  bucketName?: string;
  onUploadComplete?: (url: string, path: string) => void;
  allowedTypes?: string[]; // e.g. ['image/png', 'application/pdf']
  maxSizeMB?: number;
}

export default function UploadAttachment({ 
  bucketName = 'attachments', 
  onUploadComplete,
  allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  maxSizeMB = 10
}: UploadAttachmentProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate type
      if (!allowedTypes.includes(selectedFile.type)) {
        setError(`Tipo de arquivo não permitido. Aceitos: ${allowedTypes.map(t => t.split('/')[1]).join(', ')}`);
        return;
      }

      // Validate size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
        return;
      }

      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!user) {
      setError("Você precisa estar logado para fazer upload.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setSuccess(true);
      if (onUploadComplete) {
        onUploadComplete(publicUrl, filePath);
      }
      
      // Reset after delay
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      console.error('Error uploading:', err);
      setError(err.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="w-full max-w-md p-4 bg-adv-grayLight/50 border border-white/10 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white flex items-center gap-2">
          <Upload className="w-4 h-4 text-adv-gold" />
          Anexar Documento
        </h3>
        {uploading && <span className="text-xs text-adv-gold animate-pulse">Enviando...</span>}
      </div>

      {!file ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Clique para selecionar</span> ou arraste</p>
            <p className="text-xs text-gray-500">PDF, DOCX, JPG (MAX. {maxSizeMB}MB)</p>
          </div>
          <input type="file" className="hidden" onChange={handleFileChange} accept={allowedTypes.join(',')} />
        </label>
      ) : (
        <div className="bg-black/40 rounded-lg p-3 relative group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-adv-petrol/20 rounded-lg">
              <FileText className="w-5 h-5 text-adv-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            
            {success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <button 
                onClick={clearFile}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                disabled={uploading}
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-3 h-3" />
              {error}
            </div>
          )}

          {!success && !error && (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className={`mt-3 w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                uploading 
                  ? 'bg-adv-gold/50 cursor-not-allowed' 
                  : 'bg-adv-gold hover:bg-adv-goldLight text-adv-black'
              }`}
            >
              {uploading ? 'Enviando...' : 'Confirmar Upload'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
