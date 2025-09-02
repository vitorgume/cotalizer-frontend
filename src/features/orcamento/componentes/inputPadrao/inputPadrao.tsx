import { useState, useMemo, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import './inputPadrao.css';

interface InputPadraoProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  inativo: boolean;
  senha: boolean;
  limiteCaracteres: number;
  mascara: string;
}

export default function InputPadrao({
  placeholder,
  value,
  onChange,
  inativo,
  senha,
  limiteCaracteres,
  mascara,
}: InputPadraoProps) {

  const isControlled = typeof value === 'string' && typeof onChange === 'function';
  const [inner, setInner] = useState<string>('');
  const val = isControlled ? (value as string) : inner;

  useEffect(() => {
    if (!isControlled) setInner('');
  }, []);

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const alternarVisibilidade = () => setMostrarSenha((prev) => !prev);

  const computedMask = useMemo(() => {
    switch (mascara) {
      case 'telefone':
        return '(00) 00000-0000';
      case 'cpfCnpj':
        return [
          { mask: '000.000.000-00' },
          { mask: '00.000.000/0000-00' }
        ];
      case 'cpf':
        return '000.000.000-00';
      case 'cnpj':
        return '00.000.000/0000-00';
      default:
        return '';
    }
  }, [mascara, val]);


  const autoComplete =
    mascara === 'telefone' ? 'tel' : senha ? 'current-password' : 'off';
  const inputMode =
    mascara === 'telefone' ? 'tel' :
      mascara === 'cpf' || mascara === 'cnpj' ? 'numeric' :
        undefined;

  const handleAccept = (masked: string) => {
    if (isControlled) {
      onChange?.(masked);
    } else {
      setInner(masked);
      onChange?.(masked);
    }
  };

  const handleChangePlain = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    if (isControlled) {
      onChange?.(next);
    } else {
      setInner(next);
      onChange?.(next);
    }
  };

  const isMasked = !!computedMask && !senha;

  return (
    <div className={`inputp-wrap ${inativo ? 'is-disabled' : ''}`} aria-disabled={inativo}>
      {isMasked ? (
        <IMaskInput
          key={null}
          mask={computedMask as any}
          value={val}
          onAccept={handleAccept}
          disabled={inativo}
          className="inputp-field"
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          type={senha && !mostrarSenha ? 'password' : 'text'}
          className="inputp-field"
          placeholder={placeholder}
          value={val}
          onChange={handleChangePlain}
          disabled={inativo}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={limiteCaracteres}
        />
      )}

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
