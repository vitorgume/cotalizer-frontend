import { useState } from 'react';
import DowloadImage from '../../../../assets/flecha 1.png';
import InputPadrao from '../../componentes/inputPadrao/inputPadrao';
import './cadastroOrcamento.css';
import { atualizarOrcamento, criarOrcamento, interpretarOrcamento } from '../../orcamento.service';
import Loading from '../../componentes/loading/Loading';
import type Orcamento from '../../../../models/orcamento';
import FormDinamico from '../../componentes/formDinamico/formDinamico';
import { extrairNomeArquivo } from '../../../../utils/urlUtils';

export default function CadastroOrcamento() {
    const [titulo, setTitulo] = useState<string | ''>('');
    const [conteudo, setConteudo] = useState<string | ''>('');
    const [orcamentoCriado, setOrcamentoCriado] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [estruturaOrcamento, setEstruturaOrcamento] = useState<any | null>(null);
    const [urlPdf, setUrlPdf] = useState<string>('');

    async function handleInterpretar() {
        const idUsuario = localStorage.getItem('id-usuario');

        if (idUsuario) {
            const novoOrcamento: Orcamento = {
                conteudoOriginal: conteudo,
                dataCriacao: '',
                titulo: titulo,
                urlArquivo: '',
                usuarioId: idUsuario
            }

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
    }

    async function gerarOrcamento() {

        if (orcamentoCriado) {
            try {
                setLoading(true);
                const orcamentoSalvo = await criarOrcamento(orcamentoCriado);

                console.log(orcamentoSalvo);

                if (orcamentoSalvo.dado) {
                    setUrlPdf(orcamentoSalvo.dado.urlArquivo);
                }

                setOrcamentoCriado(orcamentoSalvo.dado);
            } catch (error) {
                console.error('Erro ao carregar orçamento:', error);
            } finally {
                setLoading(false);
            }
        } else {
            console.log("Orçamento não foi criado");
        }
    }


    async function editarOrcamento(orcamentoFormatado: any) {
        if (orcamentoCriado) {
            setOrcamentoCriado(orcamentoCriado.orcamentoFormatado = orcamentoFormatado);
            try {
                const response = await atualizarOrcamento(orcamentoCriado);
                setOrcamentoCriado(response.dado);
                return true;
            } catch (err) {
                console.log("Erro ao editar orçamento");
                return false;
            }
        }

        return false;
    }

    return (
        <div className='cadastro-orcamento-cointainer'>
            <div className='container-titulo'>
                <p>Digite seu orçamento</p>
                <p className='segundo-titulo'>Que a IA faz</p>
            </div>

            <InputPadrao
                placeholder='Titulo'
                value={titulo}
                onChange={setTitulo}
                inativo={orcamentoCriado !== null}
            />

            {loading ? (
                <Loading message="Processando..." />
            ) : (
                <div className='orcamento-estruturado'>

                    {!estruturaOrcamento && !urlPdf && (
                        <>
                            <textarea
                                placeholder='Ex: Fazer orçamento pra Maria. 2 janelas de alumínio, 3 portas de madeira...'
                                value={conteudo}
                                onChange={(e) => setConteudo(e.target.value)}
                                className='textarea-padrao'
                            ></textarea>

                            <button className='botao-gerar' onClick={handleInterpretar}>
                                Interpretar orçamento
                            </button>
                        </>
                    )}

                    {estruturaOrcamento && !urlPdf && (
                        <FormDinamico
                            orcamentoEstrutura={estruturaOrcamento}
                            setOrcamentoEstrutura={setEstruturaOrcamento}
                            gerarPdf={gerarOrcamento}
                            editarOrcamento={editarOrcamento}
                        />
                    )}

                    {urlPdf && (
                        <div className="preview-pdf">
                            <h3>Visualização do PDF:</h3>
                            <iframe
                                src={urlPdf}
                                width="100%"
                                height="600px"
                                style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                                title="Visualização do Orçamento"
                            ></iframe>

                            {orcamentoCriado &&
                                <div className='botoes-pdf-orc'>
                                    <a
                                        href={orcamentoCriado?.urlArquivo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="botao-visualizar"
                                    >
                                        Abrir em nova aba
                                    </a>

                                    <a href={`http://localhost:8080/arquivos/download/${extrairNomeArquivo(orcamentoCriado.urlArquivo)}`} download target="_blank" rel="noopener noreferrer" className='botao-dowload-pdf'>
                                        <img src={DowloadImage} alt="Download de imagem" />
                                    </a>

                                </div>
                            }
                        </div>
                    )}
                </div>
            )}
        </div >
    );
}