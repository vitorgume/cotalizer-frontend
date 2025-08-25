import { useState } from 'react';
import './inputPadrao.css';

interface InputPadraoProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  inativo: boolean;
  senha: boolean;
  limiteCaracteres: number;
}

export default function InputPadrao({
  placeholder,
  value = '',
  onChange,
  inativo,
  senha,
  limiteCaracteres
}: InputPadraoProps) {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  const alternarVisibilidade = () => setMostrarSenha((prev) => !prev);

  return (
    <div
      className={`inputp-wrap ${inativo ? 'is-disabled' : ''}`}
      aria-disabled={inativo}
    >
      <input
        type={senha && !mostrarSenha ? 'password' : 'text'}
        className="inputp-field"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={inativo}
        autoComplete={senha ? 'current-password' : 'off'}
        maxLength={limiteCaracteres}
      />

      {senha && (
        <button
          type="button"
          onClick={alternarVisibilidade}
          className="inputp-toggle"
          title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {mostrarSenha ? 'Ocultar' : 'Ver'}
        </button>
      )}
    </div>
  );
}
