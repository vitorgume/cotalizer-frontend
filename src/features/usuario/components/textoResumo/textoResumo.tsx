import './textoResumo.css';

export default function TextoResumo({titulo, valor}: {titulo: string, valor: string}) {
    return (
        <div className="div-texto-resumo">
            <p>{titulo}</p>
            <p className='valor-texto-resumo'>{valor}</p>
        </div>
    )
}