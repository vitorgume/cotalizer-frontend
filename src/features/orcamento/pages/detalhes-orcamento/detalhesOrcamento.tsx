import './detalhesOrcamento.css';
import { useState } from 'react';
import DeleteImage from '../../../../assets/delete_7022659 1.png';
import PdfExemplo from '../../../../assets/Documento A4 Orçamento Simples Azul 1.png';
import DowloadImage from '../../../../assets/flecha 1.png';
import ModalDelete from '../../componentes/modalDelete/modalDelete';

export default function DetalhesOrcamento() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    const handleDelete = () => {
        // Aqui você implementaria a lógica para deletar o orçamento
        console.log('Orçamento deletado');
        // Após deletar, você pode redirecionar o usuário para outra página
    };
    
    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };
    
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };
    return (
        <div className='detalhes-orcamento'>
            <header className='header-detalhes-orc'>
                <div className='titulo-header'>
                    <h1>Orçamento para Maria</h1>
                    <p>12/08</p>
                </div>
                <button onClick={handleOpenDeleteModal}><img src={DeleteImage} alt="Imagem de delete" /></button>
            </header>

            <div className='info-orcamento-texto'>
                <p>
                    Fazer orçamento pra Maria. Coloque 2 janelas de alumínio R$ 450 cada,
                    3 portas de madeira a 700 reais e entrega pra semana que vem.
                    Desconto de 5%. Incluir instalação.
                </p>
            </div>

            <div className='orcamento-group'>
                <h2>Vizualize seu orçamento</h2>

                <div className='pdf-group'>
                    <img src={PdfExemplo} alt="Pdf exemplo" />
                </div>

                <div className='botoes-orcamento-group'>
                    <button className='botao-dowload-pdf'><img src={DowloadImage} alt="Dowload de imagem" /></button>
                    {/* <button className='botao-ver-mais-pdf'>Ver mais</button> */}
                </div>
            </div>

            <ModalDelete 
                isOpen={showDeleteModal} 
                onClose={handleCloseDeleteModal} 
                onConfirm={handleDelete} 
                title="Orçamento para Maria"
            />
        </div>
    );
}