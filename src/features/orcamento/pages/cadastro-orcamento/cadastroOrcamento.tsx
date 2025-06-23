import { useState } from 'react';
import DowloadImage from '../../../../assets/flecha 1.png';
import InputPadrao from '../../componentes/inputPadrao/inputPadrao';
import './cadastroOrcamento.css';
import type Orcamento from '../../../../models/orcamento';
import { criarOrcamento } from '../../orcamento.service';
import { removerFilePrefix } from '../../../../utils/fileUtils';
import Loading from '../../componentes/loading/Loading';

export default function CadastroOrcamento() {
    const [titulo, setTitulo] = useState<string | ''>('');
    const [conteudo, setConteudo] = useState<string | ''>('');
    const [orcamentoCriado, setOrcamentoCriado] = useState<Orcamento | null>(null);
    const [loading, setLoading] = useState<boolean>(false);


    function handlerChange(e: any) {
        setConteudo(e.target.value);
    }

    async function gerarOrcamento() {
        try {
            setLoading(true);

            const novoOrcamento: Orcamento = {
                id: '',
                conteudoOriginal: conteudo,
                dataCriacao: '',
                titulo: titulo,
                urlArquivo: '',
                usuarioId: '684b08848082583d9c6a9111'
            }

            const orcamentoSalvo = await criarOrcamento(novoOrcamento);
            setOrcamentoCriado(orcamentoSalvo.dado);
        } catch (error) {
            console.error('Erro ao carregar orçamento:', error);
        } finally {
            setLoading(false);
        }
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
            />

            <textarea
                name=""
                id=""
                placeholder='Duas tesouras, cinco lápis...'
                value={conteudo}
                onChange={handlerChange}
            ></textarea>

            <button className='botao-gerar' onClick={gerarOrcamento} >Gerar</button>

            <h2>Vizualize seu orçamento</h2>

            {loading && (
                <Loading message="Gerando seu orçamento..." />
            )}

            {orcamentoCriado?.urlArquivo && (
                <div className="preview-pdf">
                    <h3>Visualização do PDF:</h3>

                    <iframe
                        src={orcamentoCriado.urlArquivo}
                        width="100%"
                        height="600px"
                        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
                        title="Visualização do Orçamento"
                    ></iframe>

                    <a
                        href={orcamentoCriado.urlArquivo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="botao-visualizar"
                    >
                        Abrir em nova aba
                    </a>
                </div>
            )}

            <button className='botao-dowload-pdf'><img src={DowloadImage} alt="Dowload de imagem" /></button>
        </div>
    );
}