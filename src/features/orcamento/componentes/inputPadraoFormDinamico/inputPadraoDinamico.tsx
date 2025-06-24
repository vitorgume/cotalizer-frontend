import InputPadrao from "../inputPadrao/inputPadrao";
import './inputPadraoDinamico.css';

interface InputPadraoDinamicoProps {
    orcamentoEstrutura: any;
    setOrcamentoEstrutura: (orcamentoEstrutura: any) => void;
    titulo: string;
    valorPlaceholder: string;
}

export default function InputPadraoDinamico({orcamentoEstrutura, setOrcamentoEstrutura, titulo, valorPlaceholder}: InputPadraoDinamicoProps) {
    return (
        <div className="container-input-dinamico">
            <h3>{titulo}</h3>
            <InputPadrao
                placeholder={valorPlaceholder}
                value={orcamentoEstrutura.cliente}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, cliente: valor })}
            />
        </div>
    );
}