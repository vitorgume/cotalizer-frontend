// ModalPlanos.tsx
import './modalPlanos.css';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ModalPlanosProps {
  open: boolean;        
  fechar: () => void;
  plano: string;
}

export default function ModalPlanos({ open, fechar, plano }: ModalPlanosProps) {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [planoFormatado, setPlanoFormatado] = useState<string>('');
  const [limiteOrcamentos, setLimiteOrcamentos] = useState<number>(0);
  const [proximoPlano, setProximoPlano] = useState<{titulo: string, valor: string, limite: number}>({titulo: '', valor: '', limite: 0});

  function irParaPlanos() {
    fechar();
    navigate('/usuario/perfil?tab=planos&scroll=1');
  }

  // trava scroll do body + foco + ESC
  useEffect(() => {
    
    function formatarPlano() {
      switch (plano) {
        case 'GRATIS':
          setPlanoFormatado('Gratuito');
          setLimiteOrcamentos(5);
          setProximoPlano({titulo: 'Plus', valor: 'R$ 29,90', limite: 100});
          break;
        case 'PLUS':
          setPlanoFormatado('Plus');
          setProximoPlano({titulo: 'Enterprise', valor: 'R$ 59,90', limite: 500});
          setLimiteOrcamentos(100);
          break;
        default:
          setPlanoFormatado('Enterprise');
          setProximoPlano({titulo: 'Personalizado', valor: 'A combinar', limite: 1000});
          setLimiteOrcamentos(500);
          break;
      }
    }
    
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar();
    };
    window.addEventListener('keydown', onKeyDown);

    formatarPlano();
    
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, fechar]);

  return (
    <div
      className={`modal modal-planos ${open ? 'is-open' : ''}`}
      aria-hidden={!open}
    >
      <div className="modal__backdrop" onClick={fechar} />

      <div
        className="modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        tabIndex={-1}
        ref={dialogRef}
      >
        <button className="modal__close" type="button" aria-label="Fechar" onClick={fechar}>
          ✕
        </button>

        {/* --- cabeçalho --- */}
        <div className="head">
          <div className="icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm-1 5h2v7h-2V7zm0 9h2v2h-2v-2z" />
            </svg>
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <h2 className="title" id="dialog-title">Você atingiu o limite do plano {planoFormatado}</h2>
            <p className="subtitle" id="dialog-desc">
              Você já enviou <strong>{limiteOrcamentos} orçamentos</strong> neste mês. Migre para o <strong>{proximoPlano.titulo}</strong> e
              continue enviando sem parar.
            </p>
          </div>
        </div>

        {/* --- conteúdo --- */}
        <div className="content">
          <div>
            <div className="limit-box" aria-live="polite">
              <div className="limit">
                <strong>Uso mensal</strong>
                <span className="subtitle"><span id="qtd-atu">5</span>/<span id="qtd-max">{limiteOrcamentos}</span> orçamentos</span>
              </div>
              <div className="progress" aria-hidden="true">
                <i style={{ transform: 'scaleX(1)' }} />
              </div>
            </div>

            <ul className="features" style={{ marginTop: 14 }}>
              <li>Até <strong>{proximoPlano.limite} orçamentos/mês</strong></li>
              <li>Geração de PDF com o seu logo</li>
              <li>Templates básicos de orçamento</li>
            </ul>
          </div>

          <div>
            <div className="subtitle">{proximoPlano.titulo}</div>	
            <div className="price">{proximoPlano.valor} <span className="per">/ mês</span></div>

            <div className="actions">
              <button className="btn btn-primary" autoFocus onClick={irParaPlanos}>
                Fazer upgrade
              </button>
              <button className="btn btn-outline" onClick={irParaPlanos}>
                Ver planos
              </button>
              <button className="btn-link" onClick={fechar}>
                Ficar no {planoFormatado} por enquanto
              </button>
            </div>
            <div className="footnote">Cancele quando quiser. Sem fidelidade.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
