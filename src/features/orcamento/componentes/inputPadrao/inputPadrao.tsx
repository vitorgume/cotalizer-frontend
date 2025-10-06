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
  upperCase: boolean;
}

export default function InputPadrao({
  placeholder,
  value,
  onChange,
  inativo,
  senha,
  limiteCaracteres,
  mascara,
  upperCase
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
      case 'numeroDecimal':
        return {
          mask: Number,
          scale: 2,
          thousandsSeparator: '.',
          radix: ',',              
          mapToRadix: ['.'],       
          normalizeZeros: true,
          padFractionalZeros: false
        };
      default:
        return '';
    }
  }, [mascara]);

  const autoComplete =
    mascara === 'telefone' ? 'tel' : senha ? 'current-password' : 'off';

  const inputMode =
    mascara === 'telefone' ? 'tel'
      : mascara === 'cpf' || mascara === 'cnpj' ? 'numeric'
        : mascara === 'numeroDecimal' ? 'decimal' 
          : undefined;

  const handleAccept = (masked: string, maskRef?: any) => {
    let out: string;

    if (mascara === 'numeroDecimal') {
      const typed = maskRef?.typedValue;
      if (typeof typed === 'number' && !isNaN(typed)) {
        out = String(typed);          
      } else {
  
        out = masked.replace(/\./g, '').replace(',', '.'); 
      }
    } else {
      out = masked;
    }

    if (isControlled) {
      onChange?.(out);
    } else {
      setInner(masked); 
      onChange?.(out);
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

  const displayValue = useMemo(() => {
    if (senha) return val ?? ''; 
    if (mascara === 'numeroDecimal') {
      return (val ?? '').toString().replace(/\./g, ',');
    }
    return val ?? '';
  }, [val, mascara, senha]);

  return (
    <div className={`inputp-wrap ${inativo ? 'is-disabled' : ''}`} aria-disabled={inativo}>
      {isMasked ? (
        <IMaskInput
          key={`mask-${mascara}`}
          mask={computedMask as any}
          value={displayValue}
          onAccept={(val: string, maskRef: any) => handleAccept(val, maskRef)}
          disabled={inativo}
          className="inputp-field"
          placeholder={placeholder}
          inputMode={inputMode}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          id={placeholder}
          type={senha && !mostrarSenha ? 'password' : 'text'}
          className="inputp-field"
          placeholder={placeholder}
          value={displayValue}
          onChange={handleChangePlain}
          disabled={inativo}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={limiteCaracteres}
          autoCapitalize={upperCase ? undefined : 'none'}
        />
      )}

      {senha && (
        <button
          type="button"
          onClick={alternarVisibilidade}
          className="inputp-toggle"
          title={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={mostrarSenha}
          aria-controls={placeholder}
        >
          {mostrarSenha ? 'Ocultar' : 'Ver'}
        </button>
      )}
    </div>
  );
}
