import React, { useEffect, useState } from 'react';
import './notas.css';

interface NotaPickerProps {
  value?: number | null;
  onChange?: (v: number) => void;
  min?: number;
  max?: number;
  name?: string;
  required?: boolean;
};

export default function Notas({
  value = null,
  onChange,
  min = 0,
  max = 10,
  name = "nota",
  required = false,

}: NotaPickerProps) {
    const [internal, setInternal] = useState<number | null>(value);

  useEffect(() => setInternal(value), [value]);

  const handleSelect = (v: number) => {
    setInternal(v);
    onChange?.(v);
  };

  // [10..0] no DOM para o truque do :checked ~ label
  const valores = Array.from({ length: max - min + 1 }, (_, i) => max - i);

  return (
    <fieldset className="nps" aria-label={`Escolha uma nota de ${min} a ${max}`}>
      <legend className="sr-only">Nota</legend>

      <div className="nps-scale">
        {valores.map((v) => (
          <React.Fragment key={v}>
            <input
              type="radio"
              id={`nota-${v}`}
              name={name}
              value={v}
              checked={internal === v}
              onChange={() => handleSelect(v)}
              required={required}
            />
            <label htmlFor={`nota-${v}`}>{v}</label>
          </React.Fragment>
        ))}
      </div>
    </fieldset>
  );
}