import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles } from 'lucide-react';
import { obterMe } from '../../usuario.service';
import './modalAvaliar.css';

interface ModalAvaliarProps {
    fechar: () => void;
}

export default function ModalAvaliar({ fechar }: ModalAvaliarProps) {
    const navigate = useNavigate();
    const dialogRef = useRef<HTMLDivElement | null>(null);

    async function responderAvaliacao() {
        const idUsuario = await obterMe().then((resp) => resp.dado?.usuarioId);
        if (idUsuario) {
            fechar();
            navigate(`/avaliacao/${idUsuario}`);
        }
    }

    // Acessibilidade: trava o scroll, foca o modal e fecha no ESC
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();

        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
        window.addEventListener('keydown', onKey);

        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [fechar]);

    return (
        <div
            className="modal-avaliar"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ma-title"
            aria-describedby="ma-desc"
        >
            <div className="modal__backdrop" onClick={fechar} />

            <div className="modal__dialog" tabIndex={-1} ref={dialogRef}>
                <button className="modal__close" onClick={fechar} aria-label="Fechar">
                    <X size={18} />
                </button>

                <div className="ma-head">
                    <div className="ma-icon" aria-hidden="true">
                        <Sparkles size={18} />
                    </div>
                    <div className="ma-titles">
                        <h2 id="ma-title">Sua opinião importa </h2>
                        <p id="ma-desc">
                            Topa responder uma pesquisa rapidinha para melhorar o Cotalizer?
                            <strong> Leva menos de 1 minuto.</strong>
                        </p>
                    </div>
                </div>

                <ul className="ma-benefits">
                    <li>Você ajuda a priorizar os próximos recursos</li>
                    <li>Deixa a plataforma ainda mais simples</li>
                    <li>Nós lemos todas as respostas</li>
                </ul>

                <div className="ma-actions">
                    <button className="btn btn-primary" onClick={responderAvaliacao} autoFocus>
                        Responder agora
                    </button>
                    <button className="btn btn-outline" onClick={fechar}>
                        Depois
                    </button>
                </div>
            </div>
        </div>
    );
}
