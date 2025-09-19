import { useState, useMemo } from 'react';
import './cadastroOrcamentoTradicional.css';
import InputPadrao from '../../componentes/inputPadrao/inputPadrao';
import { ItemListagemProdutos } from '../../componentes/itemListagemProdutos/itemListagemProdutos';
import { FormsProdutoList } from '../../componentes/formsProdutoList/formsProdutoList';
import { cadastrarOrcamento, gerarPdfOrcamentoTradicional } from '../../orcamento.service';
import type { OrcamentoTradicional } from '../../../../models/orcamentoTradicional';
import type { CampoPersonalizado } from '../../../../models/campoPersonalizado';
import type { Produto } from '../../../../models/produto';
import Loading from '../../componentes/loading/loading';
import { useNavigate } from 'react-router-dom';
import { notificarErro } from '../../../../utils/notificacaoUtils';
import { obterMe } from '../../../usuario/usuario.service';
import { BotaoVoltar } from '../../../usuario/components/botaoVoltar/botaoVoltar';

export default function CadastroOrcamentoTradicional() {
    const [cliente, setCliente] = useState('');
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [customFields, setCustomFields] = useState<CampoPersonalizado[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const valorTotal = useMemo(() => {
        return produtos.reduce((acc, p) => acc + p.valor * p.quantidade, 0);
    }, [produtos]);

    const salvarOrcamento = async () => {
        const idUsuario = await obterMe().then(resp => resp.dado?.usuarioId);
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
            const resp = await cadastrarOrcamento(orcamento);

            if (resp?.dado && resp.dado.id) {
                await gerarPdfOrcamentoTradicional(resp.dado);
            }

            navigate('/menu');
        } catch (err: any) {
            if (err.status === 400) {
                notificarErro(err.message);
            } else {
                notificarErro(err?.message ?? 'Erro ao cadastrar orçamento.');
            }
        } finally {
            setLoading(false);
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
            prev.map(item => (item.id === id ? { ...item, [field]: value } : item))
        );
    };

    const removeCustomField = (id: string) => {
        setCustomFields(prev => prev.filter(item => item.id !== id));
    };

    const removeProduto = (id: string) => {
        setProdutos(prev => prev.filter(produto => produto.id !== id));
    };

    const addProduto = (produto: Omit<Produto, 'id'>) => {
        const newProduto: Produto = { ...produto, id: Date.now().toString() };
        setProdutos(prev => [...prev, newProduto]);
    };

    return (
        <div>
            {loading ? (
                <Loading message="Salvando orçamento..." />
            ) : (
                <div className="cadastro-container cotalizer-theme">
                    {/* HEADER */}
                    <header className="cadastro-header glass-card">
                        <BotaoVoltar absolute={true} />
                        <div className="header-top">
                            <h1>Novo orçamento tradicional</h1>
                            <p className="header-sub">Monte itens, adicione observações e gere o PDF.</p>
                        </div>
                        {/* <span className="badge-variant">Manual</span> */}
                        
                    </header>

                    {/* MAIN */}
                    <main className="cadastro-main">
                        {/* CLIENTE */}
                        <section className="secao-cliente glass-card">
                            <h2>Dados do cliente</h2>
                            <div className="grid-2">
                                <div className="input-group">
                                    <label>Cliente</label>
                                    <InputPadrao
                                        placeholder="Nome do cliente"
                                        value={cliente}
                                        onChange={setCliente}
                                        inativo={false}
                                        senha={false}
                                        limiteCaracteres={100}
                                        mascara=''
                                        upperCase={true}
                                    />
                                </div>

                                <div className="input-group">
                                    <label>CNPJ/CPF</label>
                                    <InputPadrao
                                        placeholder="00.000.000/0000-00 ou 000.000.000-00"
                                        value={cnpjCpf}
                                        onChange={setCnpjCpf}
                                        inativo={false}
                                        senha={false}
                                        limiteCaracteres={17}
                                        mascara='cpfCnpj'
                                        upperCase={true}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* PRODUTOS */}
                        <section className="secao-produtos glass-card">
                            <div className="secao-head">
                                <h2>Produtos</h2>   
                                <div className="kpi-total">
                                    Total atual:{' '}
                                    <strong>
                                        R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </strong>
                                </div>
                            </div>

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

                            <div className="forms-wrapper">
                                <FormsProdutoList onAddProduto={addProduto} />
                            </div>
                        </section>

                        {/* OBSERVAÇÕES */}
                        <section className="secao-observacoes glass-card">
                            <h2>Observações</h2>
                            <textarea
                                className="textarea-observacoes"
                                placeholder="Condições de pagamento, prazos, garantia, etc."
                                value={observacoes}
                                onChange={(e) => setObservacoes(e.target.value)}
                                maxLength={250}
                            />
                        </section>

                        {/* CAMPOS PERSONALIZADOS */}
                        <section className="secao-campos-personalizados glass-card">
                            <div className="secao-head">
                                <h2>Campos personalizados</h2>
                                <button type="button" className="btn primary-outline" onClick={addCustomField}>
                                    + Adicionar novo campo
                                </button>
                            </div>

                            <div className="campos-personalizados-lista">
                                {customFields.map((field) => (
                                    <div key={field.id} className="campo-personalizado">
                                        <input
                                            type="text"
                                            placeholder="Título do campo"
                                            className="chip-input"
                                            value={field.titulo}
                                            onChange={(e) => updateCustomField(field.id, 'titulo', e.target.value)}
                                            maxLength={100}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Valor"
                                            className="chip-input"
                                            value={field.valor}
                                            onChange={(e) => updateCustomField(field.id, 'valor', e.target.value)}
                                            maxLength={100}
                                        />
                                        <button
                                            type="button"
                                            className="btn danger-outline small"
                                            onClick={() => removeCustomField(field.id)}
                                            aria-label="Remover campo"
                                            title="Remover campo"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* FOOTER */}
                        <footer className="cadastro-footer glass-card">
                            <button type="button" className="btn secondary-outline" onClick={() => navigate(-1)}>
                                Cancelar
                            </button>
                            <button type="button" className="btn primary-solid" onClick={salvarOrcamento}>
                                Salvar orçamento
                            </button>
                        </footer>
                    </main>
                </div>
            )}
        </div>
    );
}
