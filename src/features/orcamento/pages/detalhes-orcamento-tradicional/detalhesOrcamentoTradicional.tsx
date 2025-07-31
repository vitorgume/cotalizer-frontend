import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './detalhesOrcamentoTradicional.css';
import DeleteImage from '../../../../assets/delete_7022659 1.png';
import DowloadImage from '../../../../assets/flecha 1.png';
import type { OrcamentoTradicional } from '../../../../models/orcamentoTradicional';
import Loading from '../../componentes/loading/Loading';
import { atualizarOrcamentoTradicional, consultarTradicionalPorId, deletarTradicional } from '../../orcamento.service';
import { extrairNomeArquivo } from '../../../../utils/urlUtils';
import { notificarSucesso } from '../../../../utils/notificacaoUtils';
import ModalDelete from '../../componentes/modalDelete/modalDelete';


export default function DetalhesOrcamentoTradicional() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [orcamento, setOrcamento] = useState<OrcamentoTradicional | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [statusOrcamento, setStatusOrcamento] = useState<'aprovado' | 'reprovado' | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const carregarOrcamento = async () => {
            if (!id) {
                console.error('ID do orçamento não fornecido');
                navigate('/menu');
                return;
            }

            try {
                const orcamentoData = await consultarTradicionalPorId(id);
                setOrcamento(orcamentoData.dado);
                
                if(orcamentoData.dado?.status === 'APROVADO') {
                    setStatusOrcamento('aprovado');
                } else if (orcamentoData.dado?.status === 'REPROVADO') {
                    setStatusOrcamento('reprovado');
                }

            } catch (error) {
                console.error('Erro ao carregar orçamento:', error);
            } finally {
                setLoading(false);
            }
        };

        carregarOrcamento();
    }, [navigate]);

    const formatarData = (data: string) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    const formatarMoeda = (valor: number) => {
        return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const voltarParaMenu = () => {
        navigate('/menu');
    };

    if (loading) {
        return <Loading message="Carregando orçamento..." />;
    }

    if (!orcamento) {
        return (
            <div className="visualizacao-container">
                <div className="erro-container">
                    <h2>Orçamento não encontrado</h2>
                    <button onClick={voltarParaMenu} className="btn-voltar">
                        Voltar ao Menu
                    </button>
                </div>
            </div>
        );
    }

    const handleAprovar = () => {
        if (orcamento) {
            setStatusOrcamento('aprovado');
            orcamento.status = 'APROVADO';
            atualizarOrcamentoTradicional(orcamento);
            notificarSucesso("Aprovado com sucesso")
        }
    };

    const handleReprovar = () => {
        if (orcamento) {
            setStatusOrcamento('reprovado');
            orcamento.status = 'REPROVADO';
            atualizarOrcamentoTradicional(orcamento);
            notificarSucesso("Reprovado com sucesso")
        }

    };

    const handleOpenDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        try {
            if (orcamento) {
                if (orcamento.id) {
                    await deletarTradicional(orcamento.id);
                    navigate("/menu");
                }
            }
        } catch (error) {
            console.error('Erro ao carregar orçamento:', error);
        }
    };

    return (
        <div className="visualizacao-container">
            <header className="visualizacao-header">
                <h1>Visualizar Orçamento</h1>

                <div className='botoes-header'>
                    <button
                        className={`botao-reprovacao ${statusOrcamento === 'reprovado' ? 'ativo' : ''}`}
                        onClick={handleReprovar}
                    >
                        {statusOrcamento === 'reprovado' ? 'Reprovado' : 'Reprovar'}
                    </button>

                    <button
                        className={`botao-aprovacao ${statusOrcamento === 'aprovado' ? 'ativo' : ''}`}
                        onClick={handleAprovar}
                    >
                        {statusOrcamento === 'aprovado' ? 'Aprovado' : 'Aprovar'}
                    </button>

                    <button className='botao-excluir' onClick={handleOpenDeleteModal}>
                        <img src={DeleteImage} alt="Imagem de delete" />
                    </button>
                </div>
            </header>

            <main className="visualizacao-main">
                <section className="secao-info-geral">
                    <div className="info-item">
                        <span className="info-label">Data de Criação:</span>
                        <span className="info-valor">{formatarData(orcamento.dataCriacao)}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Tipo:</span>
                        <span className="info-valor">{orcamento.tipoOrcamento}</span>
                    </div>
                </section>

                <section className="secao-cliente-visualizacao">
                    <h2>Dados do Cliente</h2>
                    <div className="dados-cliente">
                        <div className="dado-item">
                            <span className="dado-label">Cliente:</span>
                            <span className="dado-valor">{orcamento.cliente}</span>
                        </div>
                        <div className="dado-item">
                            <span className="dado-label">CNPJ/CPF:</span>
                            <span className="dado-valor">{orcamento.cnpjCpf}</span>
                        </div>
                    </div>
                </section>

                <section className="secao-produtos-visualizacao">
                    <h2>Produtos</h2>
                    <div className="tabela-produtos">
                        <div className="cabecalho-tabela">
                            <span>Descrição</span>
                            <span>Quantidade</span>
                            <span>Valor Unit.</span>
                            <span>Total</span>
                        </div>
                        {orcamento.produtos.map((produto) => (
                            <div key={produto.id} className="linha-produto">
                                <span className="produto-descricao">{produto.descricao}</span>
                                <span className="produto-quantidade">{produto.quantidade}</span>
                                <span className="produto-valor">{formatarMoeda(produto.valor)}</span>
                                <span className="produto-total">{formatarMoeda(produto.valor * produto.quantidade)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="total-orcamento">
                        <span className="total-label">Valor Total:</span>
                        <span className="total-valor">{formatarMoeda(orcamento.valorTotal)}</span>
                    </div>
                </section>

                {orcamento.observacoes && (
                    <section className="secao-observacoes-visualizacao">
                        <h2>Observações</h2>
                        <div className="observacoes-conteudo">
                            {orcamento.observacoes}
                        </div>
                    </section>
                )}

                {orcamento.camposPersonalizados.length > 0 && (
                    <section className="secao-campos-personalizados-visualizacao">
                        <h2>Campos Personalizados</h2>
                        <div className="campos-personalizados-grid">
                            {orcamento.camposPersonalizados.map((campo) => (
                                <div key={campo.id} className="campo-personalizado-item">
                                    <span className="campo-titulo">{campo.titulo}:</span>
                                    <span className="campo-valor">{campo.valor}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className='orcamento-group'>
                    <h2>Vizualize seu orçamento</h2>

                    <iframe
                        src={orcamento.urlArquivo}
                        width="100%"
                        height="600px"
                        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                        title="Visualização do Orçamento"
                    ></iframe>

                    <div className='botoes-orcamento-group'>
                        <a href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamento.urlArquivo)}`} download target="_blank" rel="noopener noreferrer" className='botao-dowload-pdf'>
                            <img src={DowloadImage} alt="Download de imagem" />
                        </a>

                        <a
                            href={orcamento.urlArquivo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="botao-visualizar"
                        >
                            Abrir em nova aba
                        </a>
                    </div>
                </div>

                <footer className="visualizacao-footer">
                    <button type="button" className="btn-voltar" onClick={voltarParaMenu}>
                        Voltar ao Menu
                    </button>
                </footer>
            </main>

            <ModalDelete
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title={orcamento.cliente}
            />
        </div>
    );
}