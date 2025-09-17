// src/features/usuario/components/modalLogo/ModalLogo.tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './modalLogo.css';

type ModalLogoProps = {
    open: boolean;
    fechar: () => void;
};

export default function ModalLogo({ open, fechar }: ModalLogoProps) {
    const navigate = useNavigate();
    const dialogRef = useRef<HTMLDivElement | null>(null);

    function irParaPerfilLogo() {
        fechar();
        // abre a tela de perfil já focada em "logo"
        navigate('/usuario/perfil?tab=logo');
    }


    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        dialogRef.current?.focus();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') fechar();
        };
        window.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [open, fechar]);

    return (
        <div className={`modal-logo modal ${open ? 'is-open' : ''}`} aria-hidden={!open}>
            <div className="modal__backdrop" onClick={fechar} />

            <div
                className="modal__dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ml-title"
                aria-describedby="ml-desc"
                tabIndex={-1}
                ref={dialogRef}
            >
                <button className="modal__close" onClick={fechar} aria-label="Fechar">✕</button>

                <div className="head">
                    <div className="icon" aria-hidden="true">
                        {/* ícone de upload/logo */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
                            <path d="M5 20h14v-2H5v2zm7-18L5.33 8.67l1.41 1.41L11 5.83V16h2V5.83l4.26 4.25 1.41-1.41L12 2z" />
                        </svg>
                    </div>
                    <div className="head-text">
                        <h2 id="ml-title" className="title">Adicione o seu logotipo</h2>
                        <p id="ml-desc" className="subtitle">
                            Deixe seus PDFs com a cara da sua empresa. É rapidinho — você pode enviar um PNG/JPG agora.
                        </p>
                    </div>
                </div>

                <div className="content">
                    <div className="preview">
                        <div className="logo-slot" aria-hidden="true">
                            <div className="circle" />
                            <span className="hint">Prévia</span>
                        </div>

                        <ul className="benefits">
                            <li>Logo aplicado automaticamente no PDF</li>
                            <li>Propostas mais profissionais</li>
                            <li>Padronização visual</li>
                        </ul>
                    </div>

                    <div className="cta">
                        <div className="tips">
                            <div className="subtitle">Dicas</div>
                            <ul className="tips-list">
                                <li>Prefira imagem quadrada ou circular</li>
                                <li>Fundo transparente (PNG) fica top</li>
                                <li>Tamanho sugerido: 512×512px</li>
                            </ul>
                        </div>

                        <div className="actions">
                            <button className="btn btn-primary" onClick={irParaPerfilLogo} autoFocus>
                                Adicionar logo agora
                            </button>
                            <button className="btn btn-outline" onClick={fechar}>
                                Depois
                            </button>
                        </div>

                        <div className="footnote">Você pode alterar a logo quando quiser.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
