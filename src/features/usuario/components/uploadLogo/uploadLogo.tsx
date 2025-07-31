import { useState, useRef } from 'react';
import './UploadLogo.css';

interface UploadLogoProps {
    onLogoChange: (file: File | null) => void;
    logoPreview?: string | null;
}

export default function UploadLogo({ onLogoChange, logoPreview }: UploadLogoProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(logoPreview || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (file: File) => {
        // Validar tipo de arquivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Por favor, selecione apenas arquivos de imagem (JPEG, PNG, GIF, WEBP)');
            return;
        }

        // Validar tamanho (máximo 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('O arquivo deve ter no máximo 5MB');
            return;
        }

        // Criar preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Chamar callback
        onLogoChange(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveLogo = () => {
        setPreview(null);
        onLogoChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="upload-logo-container">
            <label className="upload-logo-label">Logo da Empresa (Opcional)</label>
            
            {preview ? (
                <div className="logo-preview-container">
                    <img src={preview} alt="Preview do logo" className="logo-preview" />
                    <div className="logo-actions">
                        <button 
                            type="button" 
                            className="btn-change-logo"
                            onClick={handleClick}
                        >
                            Alterar
                        </button>
                        <button 
                            type="button" 
                            className="btn-remove-logo"
                            onClick={handleRemoveLogo}
                        >
                            Remover
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    className={`upload-logo-area ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleClick}
                >
                    <div className="upload-logo-content">
                        <div className="upload-icon">📸</div>
                        <p className="upload-text">
                            Clique para selecionar ou arraste uma imagem aqui
                        </p>
                        <p className="upload-hint">
                            JPEG, PNG, GIF ou WEBP (máx. 5MB)
                        </p>
                    </div>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}