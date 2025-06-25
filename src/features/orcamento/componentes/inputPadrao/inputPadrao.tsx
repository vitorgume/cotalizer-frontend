import './inputPadrão.css';

interface InpuPadraoProps {
    placeholder: string;
    value?: string;
    onChange?: (value: string) => void;
    ativo: boolean;
}

export default function InputPadrao({placeholder, value = '', onChange, ativo}: InpuPadraoProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <input 
            type="text" 
            className="input-padrao" 
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            disabled={ativo}
        />
    );
}