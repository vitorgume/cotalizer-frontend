import './metricaQuantidadeOrcamento.css';

interface MetricaQuantidadeOrcamentoProps {
  usado: number;
  limite: number;
}

export default function MetricaQuantidadeOrcamento({usado, limite}: MetricaQuantidadeOrcamentoProps) {
    const percentual = Math.min((usado / limite) * 100, 100);

    return (
        <div className="metrica-container">
            <div className="barra">
                <div className="barra-usada" style={{ width: `${percentual}%` }}></div>
            </div>
            <div className="valores">
                <span>{usado}</span>
                <span>{limite}</span>
            </div>
        </div>
    );
}