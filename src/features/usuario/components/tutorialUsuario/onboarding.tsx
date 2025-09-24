import React, { useEffect, useMemo, useRef, useState } from "react";
import "./onboarding.css";
import img1 from "../../../../assets/img1.svg";
import img2 from "../../../../assets/img2.svg";
import img3 from "../../../../assets/img3.svg";
import img4 from "../../../../assets/img4.svg";

type Props = {
  onClose?: () => void;
  onFinish?: () => void;
  initialIndex?: number;
  className?: string;
};

export default function OnboardingCarousel({
  onClose,
  onFinish,
  initialIndex = 0,
  className = "",
}: Props) {
  const slides = [
    {
      id: "s1",
      stepLabel: "INTRODUÇÃO",
      title: "Crie orçamentos em segundos",
      subtitle:
        "Aprenda a criar orçamentos em segundos! Digite o pedido do cliente em linguagem natural. Nós organizamos, calculamos e formatamos tudo para você.",
      image: img1,
      imageAlt: "Documento ilustrativo",
    },
    {
      id: "s2",
      stepLabel: "INTRODUÇÃO",
      title: "Descreva o que precisa",
      subtitle:
        "Descreva seus produtos e serviços naturalmente: nome do produto, quantidade e valor unitário. Ex.: “Fazer um orçamento para o Carlos. São 8 luminárias de LED a R$ 180 cada, 15 metros de trilho...”",
      image: img2,
      imageAlt: "Pessoa digitando",
    },
    {
      id: "s3",
      stepLabel: "INTRODUÇÃO",
      title: "Personalize e finalize",
      subtitle:
        "Revise seus itens, adicione descontos, impostos e sua logo. Gere o PDF pronto para enviar ao cliente.",
      image: img3,
      imageAlt: "Customização no celular",
    },
    {
      id: "s4",
      stepLabel: "INTRODUÇÃO",
      title: "Envie e acompanhe",
      subtitle: "Faça o download e envie para seu cliente. Boas vendas!",
      image: img4,
      imageAlt: "Entrega do orçamento",
    },
  ];

  const [index, setIndex] = useState(Math.min(initialIndex, slides.length - 1));
  const containerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ startX: number; deltaX: number } | null>(null);

  const total = slides.length;
  const pct = useMemo(() => ((index + 1) / total) * 100, [index, total]);
  const isLast = index === total - 1;
  const isFirst = index === 0;

  const go = (to: number) => setIndex(Math.max(0, Math.min(total - 1, to)));
  const next = () => (isLast ? onFinish?.() : go(index + 1));
  const prev = () => go(index - 1);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, total, onClose]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    const x = e.touches[0]?.clientX ?? 0;
    setDrag({ startX: x, deltaX: 0 });
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!drag) return;
    const x = e.touches[0]?.clientX ?? 0;
    setDrag({ ...drag, deltaX: x - drag.startX });
  };
  const onTouchEnd = () => {
    if (!drag) return;
    const threshold = 60; // px
    if (drag.deltaX <= -threshold) next();
    else if (drag.deltaX >= threshold) prev();
    setDrag(null);
  };

  return (
    <div
      className={`onb-root ${className}`}
      role="dialog"
      aria-modal="true"
      aria-label="Bem-vindo ao Cotalizer"
    >
      <div className="onb-header">
        <div className="onb-title">Bem-vindo ao Cotalizer</div>
        <button className="onb-skip" onClick={onClose} aria-label="Pular tutorial">
          Pular
        </button>
      </div>

      <div className="onb-progress" aria-hidden="true">
        <div className="onb-progress-bar" style={{ width: `${pct}%` }} />
      </div>

      <div
        className="onb-body"
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((s, i) => (
          <section
            key={s.id}
            className={`onb-slide ${i === index ? "is-active" : ""}`}
            aria-hidden={i !== index}
          >
            {s.stepLabel && (
              <div className="onb-step">
                <span className="onb-step-dot" aria-hidden="true" />
                <span className="onb-step-text">{s.stepLabel}</span>
              </div>
            )}

            <h2 className="onb-h2">{s.title}</h2>
            {s.subtitle && <p className="onb-sub">{s.subtitle}</p>}

            {s.image && (
              <div className="onb-illust-wrapper">
                {/* Imagem responsiva; use import ou /assets */}
                <img className="onb-illust" src={s.image} alt={s.imageAlt ?? ""} />
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="onb-footer">
        <div className="onb-dots" role="tablist" aria-label="Slides do tutorial">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`onb-dot ${i === index ? "is-active" : ""}`}
              aria-label={`Ir ao slide ${i + 1}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="onb-actions">
          <button className="onb-btn onb-btn-secondary" onClick={prev} disabled={isFirst}>
            Anterior
          </button>
          <button className="onb-btn onb-btn-primary" onClick={next}>
            {isLast ? "Começar" : "Próximo"}
          </button>
        </div>
      </div>
    </div>
  );
}
