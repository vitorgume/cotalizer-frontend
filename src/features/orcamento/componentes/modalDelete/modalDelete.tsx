import './modalDelete.css';
import DeleteImage from '../../../../assets/delete_7022659 1.png';

interface ModalDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

export default function ModalDelete({ isOpen, onClose, onConfirm, title }: ModalDeleteProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <h2>Confirmar exclusão</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>
                <div className="modal-content">
                    <div className="modal-icon">
                        <img src={DeleteImage} alt="Ícone de exclusão" />
                    </div>
                    <p>Tem certeza que deseja excluir o orçamento <strong>"{title}"</strong>?</p>
                    <p className="warning-text">Esta ação não poderá ser desfeita.</p>
                </div>
                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>Cancelar</button>
                    <button className="confirm-button" onClick={onConfirm}>Excluir</button>
                </div>
            </div>
        </div>
    );
}