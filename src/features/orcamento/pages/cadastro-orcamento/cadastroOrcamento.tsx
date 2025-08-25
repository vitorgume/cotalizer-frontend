import { useState } from 'react';
import DowloadImage from '../../../../assets/flecha 1.png';
import InputPadrao from '../../componentes/inputPadrao/inputPadrao';
import './cadastroOrcamento.css';
import { atualizarOrcamento, criarOrcamento, interpretarOrcamento } from '../../orcamento.service';
import Loading from '../../componentes/loading/Loading';
import type Orcamento from '../../../../models/orcamento';
import FormDinamico from '../../componentes/formDinamico/formDinamico';
import { notificarErro } from '../../../../utils/notificacaoUtils';
import { obterMe } from '../../../usuario/usuario.service';

export default function CadastroOrcamento() {
    const [titulo, setTitulo] = useState<string>('');
    const [conteudo, setConteudo] = useState<string>('');
    const [orcamentoCriado, setOrcamentoCriado] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [estruturaOrcamento, setEstruturaOrcamento] = useState<any | null>(null);
    const [urlPdf, setUrlPdf] = useState<string>('');

    const MAX_CARACTERES = 1600;

    async function handleInterpretar() {
        const idUsuario = await obterMe().then(resp => resp.dado?.usuarioId);
        if (!idUsuario) return;

        const novoOrcamento: Orcamento = {
            conteudoOriginal: conteudo,
            dataCriacao: '',
            titulo,
            urlArquivo: '',
            usuarioId: idUsuario,
            status: 'PENDENTE',
            tipoOrcamento: 'IA'
        };

        try {
            setLoading(true);
            const resposta = await interpretarOrcamento(novoOrcamento);
            setOrcamentoCriado(resposta.dado);
            setEstruturaOrcamento(resposta.dado?.orcamentoFormatado);
        } catch (error) {
            console.error('Erro ao interpretar orçamento:', error);
        } finally {
            setLoading(false);
        }
    }

    async function gerarOrcamento() {
        if (!orcamentoCriado) return;
        try {
            setLoading(true);
            const orcamentoSalvo = await criarOrcamento(orcamentoCriado);
            if (orcamentoSalvo.dado) {
                setUrlPdf(orcamentoSalvo.dado.urlArquivo);
            }
            setOrcamentoCriado(orcamentoSalvo.dado);
        } catch (err: any) {
            if (err.status === 400) {
                notificarErro(err.message);
            } else {
                notificarErro(err?.message ?? 'Erro ao cadastrar orçamento.');
            }
        } finally {
            setLoading(false);
        }
    }

    async function editarOrcamento(orcamentoFormatado: any) {
        if (!orcamentoCriado) return false;
        orcamentoCriado.orcamentoFormatado = orcamentoFormatado;
        try {
            const response = await atualizarOrcamento(orcamentoCriado);
            setOrcamentoCriado(response.dado);
            return true;
        } catch {
            console.log('Erro ao editar orçamento');
            return false;
        }
    }

    return (
        <div className="cadastro-orcamento-cointainer cotalizer-theme">
            {/* Atalho para o tradicional */}
            <div className="text-cadastro-tradicional glass-card">
                <p>Prefere montar item a item?</p>
                <a href="/orcamento/tradicional/cadastro" className="text-clique-aqui">Clique aqui</a>
            </div>

            {/* Título */}
            <div className="container-titulo">
                <h1 className="titulo-principal">Digite seu orçamento</h1>
                <p className="subtitulo-grad">que a IA faz o resto</p>
            </div>

            {/* Campo de título */}

            <InputPadrao
                placeholder="Título do orçamento"
                value={titulo}
                onChange={setTitulo}
                inativo={orcamentoCriado !== null}
                senha={false}
                limiteCaracteres={100}
            />


            {loading ? (
                <div className="glass-card bloco-loading">
                    <Loading message="Processando..." />
                </div>
            ) : (
                <div className="orcamento-estruturado">
                    {/* Passo 1 – texto livre */}
                    {!estruturaOrcamento && !urlPdf && (
                        <div className="glass-card bloco-texto">
                            <textarea
                                placeholder="Ex: Fazer orçamento pra Maria. 2 janelas de alumínio, 3 portas de madeira..."
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                className="textarea-ia"
                                maxLength={MAX_CARACTERES}
                            />
                            <p>{conteudo.length}/{MAX_CARACTERES}</p>
                            <div className="acoes">
                                <button className="btn primary-solid" onClick={handleInterpretar} disabled={!titulo || !conteudo}>
                                    Interpretar orçamento
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Passo 2 – formulário estruturado */}
                    {estruturaOrcamento && !urlPdf && (
                        <div className="glass-card bloco-form">
                            <FormDinamico
                                orcamentoEstrutura={estruturaOrcamento}
                                setOrcamentoEstrutura={setEstruturaOrcamento}
                                gerarPdf={gerarOrcamento}
                                editarOrcamento={editarOrcamento}
                            />
                        </div>
                    )}

                    {/* Passo 3 – preview PDF */}
                    {urlPdf && (
                        <div className="glass-card preview-pdf">
                            <div className="preview-head">
                                <h3>Visualização do PDF</h3>
                                <span className="badge-ia">IA aplicada</span>
                            </div>

                            <iframe
                                src={urlPdf}
                                width="100%"
                                height="600"
                                style={{ border: '1px solid #34495d', borderRadius: '12px' }}
                                title="Visualização do Orçamento"
                            />

                            {orcamentoCriado && (
                                <div className="botoes-pdf-orc">
                                    <a
                                        href={orcamentoCriado.urlArquivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn primary-solid"
                                    >
                                        Abrir em nova aba
                                    </a>

                                    <a
                                        href={orcamentoCriado.urlArquivo}
                                        download
                                        className="btn primary-outline icon-only"
                                        aria-label="Baixar PDF"
                                        title="Baixar PDF"
                                    >
                                        <img src={DowloadImage} alt="Baixar" />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
