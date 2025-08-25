import { useNavigate } from 'react-router-dom';
import './modalAvaliar.css';
import { X } from 'lucide-react';

interface ModalAvaliarProps {
    fechar: () => void;
}

export default function ModalAvaliar({fechar}: ModalAvaliarProps) {

    const navigate = useNavigate();

    function responderAvaliacao() {
        const idUsuario = localStorage.getItem('id-usuario');

        if(idUsuario) {
            navigate(`/avaliacao/${idUsuario}`);
            return;
        }
    }

    return (
        <div className='modal-overlay'>
            <div className='modal-avaliar-content'>
                <button className='botao-sair' onClick={() => fechar()}><X color="#ffffff" size={30} /></button>


                <div className='text-modal-avaliar'>
                    <p>Responda nossa <span className='acento'>pesquisa</span> </p>    
                    <p>E nos ajude a <span className='acento'>melhorar</span></p>
                </div>    

                <button className='botao-responder' onClick={responderAvaliacao}>Responder</button>
            </div>
        </div>
    )
}