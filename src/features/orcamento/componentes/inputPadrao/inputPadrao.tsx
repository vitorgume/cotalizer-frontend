import { useState } from 'react';
import './inputPadrão.css';

interface InpuPadraoProps {
    placeholder: string;
    value?: string;
    onChange?: (value: string) => void;
    inativo: boolean;
    senha: boolean;
}

export default function InputPadrao({ placeholder, value = '', onChange, inativo, senha}: InpuPadraoProps) {
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const alternarVisibilidade = () => {
        setMostrarSenha((prev) => !prev);
    };

    return (
        <div className="input-padrao-wrapper">
            <input
                type={senha && !mostrarSenha ? 'password' : 'text'}
                className="input-padrao"
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                disabled={inativo}
            />

            {senha && (
                <button
                    type="button"
                    onClick={alternarVisibilidade}
                    className='button-visibilidade-senha'
                >
                    {mostrarSenha ? 'Ocultar' : 'Ver'}
                </button>
            )}
        </div>
    );
}