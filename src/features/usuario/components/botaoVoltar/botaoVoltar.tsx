import { useNavigate } from "react-router-dom";
import './botaoVoltar.css';

interface BotaoVoltarProps {
    absolute: boolean;
}

export function BotaoVoltar({ absolute }: BotaoVoltarProps) {

    const navigate = useNavigate();
    const classCss = absolute ? "btn primary-outline btn-back-topleft" : "btn primary-outline";

    function onBack() {
        if (window.history.length > 1) navigate(-1);
        else navigate('/menu');
    }

    return (
        <button
            onClick={onBack}
            className={classCss}
            aria-label="Voltar"
            title="Voltar"
        >
            Voltar
        </button>
    )
}