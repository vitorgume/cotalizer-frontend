import { useEffect, useState, useMemo } from "react";
import InputPadrao from "../../componentes/inputPadrao/inputPadrao";
import { deletar, listarPorUsuario } from '../../orcamento.service';
import OrcamentoItem from "../../componentes/orcamentoItem/orcamentoItem";
import type Orcamento from "../../../../models/orcamento";
import ModalDelete from "../../componentes/modalDelete/modalDelete";
import './listagemOrcamentos.css';
import Loading from "../../componentes/loading/Loading";

export default function ListagemOrcamentos() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [orcamentos, setOrcamentos] = useState<Orcamento[] | []>([]);
    const [termoBusca, setTermoBusca] = useState('');
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState(true);

    const orcamentosFiltrados = useMemo(() => {
        return orcamentos.filter(orc => {
            if (!termoBusca.trim()) return true;

            const termoLowerCase = termoBusca.toLowerCase();
            return (
                orc.titulo.toLowerCase().includes(termoLowerCase) ||
                orc.conteudoOriginal.toLowerCase().includes(termoLowerCase)
            );
        });
    }, [orcamentos, termoBusca]);

    const handleDelete = async () => {
        try {
            if (orcamentoSelecionado) {
                if (orcamentoSelecionado.id) {
                    await deletar(orcamentoSelecionado.id);
                    setOrcamentos(orcamentos.filter(orc => orc.id !== orcamentoSelecionado.id));
                    handleCloseDeleteModal();
                }

            }
        } catch (error) {
            console.error('Erro ao deletar orçamento:', error);
        }
    };

    const handleOpenDeleteModal = (orcamento: Orcamento) => {
        setOrcamentoSelecionado(orcamento);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setOrcamentoSelecionado(null);
    };

    useEffect(() => {
        async function carregarOrcamentos(idUsuario: string) {
            try {
                const orcamentos = await listarPorUsuario(idUsuario);
                if (orcamentos.dado) {
                    setOrcamentos(orcamentos.dado.content);
                }
            } catch (error) {
                console.error('Erro ao carregar orçamento:', error);
            }
        }

        const idUsu = localStorage.getItem('id-usuario');

        if(idUsu)
            carregarOrcamentos(idUsu);
        
    }, []);

    return (
        <div className="listagem-orcamentos">
            <h1 className="titulo">Seus orçamentos</h1>

            <InputPadrao
                placeholder="O que procura ?"
                value={termoBusca}
                onChange={setTermoBusca}
                inativo={false}
                senha={false}
            />

            {orcamentos.length > 0 ? (
                <>
                    {orcamentosFiltrados.length > 0 ? (
                        orcamentosFiltrados.map(orc => (
                            <OrcamentoItem
                                key={orc.id}
                                handleOpenDeleteModal={() => handleOpenDeleteModal(orc)}
                                orcamento={orc}
                                deleteButton={true}
                            />
                        ))
                    ) : (
                        <p className="mensagem-busca">
                            Nenhum orçamento encontrado para a busca "{termoBusca}".
                        </p>
                    )}
                </>
            ) : (
                loading ? (
                    <Loading message="Carregando orçamento..." />
                ) : (
                    <div className="orcamento-nao-encontrado">
                        <p>Orçamento não encontrado</p>
                    </div>
                )
            )}

            <ModalDelete
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title={orcamentoSelecionado?.titulo || "Excluir orçamento"}
            />
        </div>
    );
}
