import { useState, useMemo } from 'react';
import './CadastroOrcamentoTradicional.css';
import InputPadrao from '../../componentes/inputPadrao/inputPadrao';
import { ItemListagemProdutos } from '../../componentes/itemListagemProdutos/itemListagemProdutos';
import { FormsProdutoList } from '../../componentes/formsProdutoList/formsProdutoList';
import { cadastrarOrcamento, gerarPdfOrcamentoTradicional } from '../../orcamento.service';
import type { OrcamentoTradicional } from '../../../../models/orcamentoTradicional';
import type { CampoPersonalizado } from '../../../../models/campoPersonalizado';
import type { Produto } from '../../../../models/produto';
import Loading from '../../componentes/loading/Loading';
import { useNavigate } from 'react-router-dom';
import { notificarErro } from '../../../../utils/notificacaoUtils';

export default function CadastroOrcamentoTradicional() {
    const [cliente, setCliente] = useState('');
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [customFields, setCustomFields] = useState<CampoPersonalizado[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    // Calcula o total dos produtos
    const valorTotal = useMemo(() => {
        return produtos.reduce((acc, p) => acc + p.valor * p.quantidade, 0);
    }, [produtos]);

    const salvarOrcamento = async () => {
        const idUsuario = localStorage.getItem('id-usuario');
        if (!idUsuario) {
            console.error('ID do usuário não encontrado');
            return;
        }
        
        const orcamento: OrcamentoTradicional = {
            cliente,
            cnpjCpf,
            observacoes,
            camposPersonalizados: customFields,
            produtos,
            tipoOrcamento: 'TRADICIONAL',
            status: 'PENDENTE',
            dataCriacao: '',
            idUsuario: idUsuario,
            valorTotal: valorTotal,
            urlArquivo: ''
        };

        try {
            setLoading(true);
            const orcamentoCadastrado = await cadastrarOrcamento(orcamento);
            if (orcamentoCadastrado.dado) {
                await gerarPdfOrcamentoTradicional(orcamentoCadastrado.dado);
            }
        } catch (error: any) {
            console.error('Erro ao cadastrar orçamento tradicional: ', error);

            if(error.message == 'Limite de orçamento atingindo para o plano do usuário.') {
                notificarErro("Limite de orçamento atingindo para o plano do usuário.");
            }
            
        } finally {
            setLoading(false);
            navigate('/menu');
        }
    };

    const addCustomField = () => {
        const newField: CampoPersonalizado = {
            id: Date.now().toString(),
            titulo: '',
            valor: ''
        };
        setCustomFields(prev => [...prev, newField]);
    };

    const updateCustomField = (id: string, field: keyof Omit<CampoPersonalizado, 'id'>, value: string) => {
        setCustomFields(prev =>
            prev.map(item =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const removeCustomField = (id: string) => {
        setCustomFields(prev => prev.filter(item => item.id !== id));
    };

    const removeProduto = (id: string) => {
        setProdutos(prev => prev.filter(produto => produto.id !== id));
    };

    const addProduto = (produto: Omit<Produto, 'id'>) => {
        const newProduto: Produto = {
            ...produto,
            id: Date.now().toString()
        };
        setProdutos(prev => [...prev, newProduto]);
    };

    return (
        <div>
            {loading 
                ? <Loading message='Salvando orçamento...' /> 
                :
                <div className="cadastro-container">
                    <header className="cadastro-header">
                        <h1>Novo Orçamento</h1>
                    </header>

                    <main className="cadastro-main">
                        <section className="secao-cliente">
                            <div className="input-group">
                                <label htmlFor="cliente">Cliente</label>
                                <InputPadrao
                                    placeholder="Nome do cliente"
                                    value={cliente}
                                    onChange={setCliente}
                                    inativo={false}
                                    senha={false}
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="cnpj-cpf">CNPJ/CPF</label>
                                <InputPadrao
                                    placeholder="000.000.000-00"
                                    value={cnpjCpf}
                                    onChange={setCnpjCpf}
                                    inativo={false}
                                    senha={false}
                                />
                            </div>
                        </section>

                        <section className="secao-produtos">
                            <h2>Produtos</h2>

                            <div className="lista-produtos">
                                {produtos.map((produto, index) => (
                                    <ItemListagemProdutos
                                        key={produto.id}
                                        titulo={produto.descricao}
                                        quantidade={produto.quantidade}
                                        preco={produto.valor}
                                        index={index}
                                        onRemove={() => removeProduto(produto.id)}
                                    />
                                ))}
                            </div>

                            <FormsProdutoList onAddProduto={addProduto} />

                            {produtos.length > 0 && (
                                <div className="secao-total">
                                    <h3>Total: R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                                </div>
                            )}
                        </section>

                        <section className="secao-observacoes">
                            <h2>Observações</h2>
                            <textarea
                                className="textarea-observacoes"
                                placeholder="Digite suas observações aqui..."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                            />
                        </section>

                        <section className="secao-campos-personalizados">
                            <h2>Campos Personalizados</h2>

                            <div className="campos-personalizados-lista">
                                {customFields.map((field) => (
                                    <div key={field.id} className="campo-personalizado">
                                        <input
                                            type="text"
                                            placeholder="Título do campo"
                                            className="input-campo-titulo"
                                            value={field.titulo}
                                            onChange={(e) => updateCustomField(field.id, 'titulo', e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Valor"
                                            className="input-campo-valor"
                                            value={field.valor}
                                            onChange={(e) => updateCustomField(field.id, 'valor', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn-remover-campo"
                                            onClick={() => removeCustomField(field.id)}
                                            aria-label="Remover campo"
                                        >
                                            ❌
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className="btn-adicionar-campo"
                                onClick={addCustomField}
                            >
                                + Adicionar novo campo
                            </button>
                        </section>

                        <footer className="cadastro-footer">
                            <button type="button" className="btn-cancelar">
                                Cancelar
                            </button>
                            <button onClick={salvarOrcamento} type="button" className="btn-salvar">
                                Salvar Orçamento
                            </button>
                        </footer>
                    </main>
                </div>
            }

        </div>
    );
}
