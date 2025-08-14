import InputPadrao from "../inputPadrao/inputPadrao";
import { useState, useEffect } from "react";
import './formDinamico.css';
import { formatarChave } from "../../../../utils/formatacaoJson";

interface FormDinamicoProps {
    orcamentoEstrutura: any;
    setOrcamentoEstrutura: (orcamento: any) => void;
    gerarPdf: (orcamento: any) => void;
    editarOrcamento: (orcamentoFormatado: any) => Promise<boolean>;
}

export default function FormDinamico({
    orcamentoEstrutura,
    setOrcamentoEstrutura,
    gerarPdf,
    editarOrcamento
}: FormDinamicoProps) {
    const [editado, setEditado] = useState(false);

    const calcularTotal = (itens: any[], desconto: number = 0) => {
        const subtotal = itens.reduce((acc, item) => {
            const quantidade = Number(item.quantidade) || 0;
            const valorUnitario = Number(item.valor_unit) || 0;
            return acc + (quantidade * valorUnitario);
        }, 0);
        const valorDesconto = (subtotal * desconto) / 100;
        return subtotal - valorDesconto;
    };

    const atualizarOrcamentoComTotal = (novoOrcamento: any) => {
        const totalCalculado = calcularTotal(novoOrcamento.itens, novoOrcamento.desconto);
        const orcamentoAtualizado = {
            ...novoOrcamento,
            total: totalCalculado
        };
        setOrcamentoEstrutura(orcamentoAtualizado);
    };

    useEffect(() => {
        setEditado(true);
    }, [orcamentoEstrutura]);

    async function handleSalvar() {
        try {
            const response = await editarOrcamento(orcamentoEstrutura);
            setEditado(!response);
        } catch (erro) {
            console.error('Erro ao salvar orçamento:', erro);
        }
    }

    function adicionarItem() {
        const novosItens = [...orcamentoEstrutura.itens, {
            produto: '',
            quantidade: 0,
            valor_unit: 0
        }];
        atualizarOrcamentoComTotal({
            ...orcamentoEstrutura,
            itens: novosItens
        });
    }

    function removerItem(index: number) {
        if (orcamentoEstrutura.itens.length <= 1) return;
        const novosItens = [...orcamentoEstrutura.itens];
        novosItens.splice(index, 1);
        atualizarOrcamentoComTotal({
            ...orcamentoEstrutura,
            itens: novosItens
        });
    }

    const atualizarItem = (index: number, campo: string, valor: any) => {
        const novosItens = [...orcamentoEstrutura.itens];
        novosItens[index] = {
            ...novosItens[index],
            [campo]: campo === 'produto' ? valor : Number(valor) || 0
        };
        atualizarOrcamentoComTotal({
            ...orcamentoEstrutura,
            itens: novosItens
        });
    };

    function renderCampo(chave: string, valor: any, path: string[] = []) {
        const fullPath = [...path, chave];

        if (chave === 'itens' && Array.isArray(valor) && valor.every(v => typeof v === 'object')) {
            return (
                <div key={fullPath.join('.')} className="itens-orcamento">
                    <div className="itens-header">
                        <h3>Itens</h3>
                        <button type="button" className="botao-adicionar" onClick={adicionarItem}>+ Adicionar item</button>
                    </div>

                    {valor.map((item, index) => (
                        <div key={index} className="item-container">
                            <div className="item-header">
                                <h4>Item {index + 1}</h4>
                                {valor.length > 1 && (
                                    <button
                                        type="button"
                                        className="botao-remover"
                                        onClick={() => removerItem(index)}
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>

                            <div className="item-grid">
                                <div className="campo-descricao">
                                    <h4>Descrição</h4>
                                    <textarea
                                        placeholder='Produto'
                                        value={item.produto}
                                        onChange={(valor) => atualizarItem(index, 'produto', valor.target.value)}
                                        className='textarea-podruto'
                                    ></textarea>
                                </div>
                                <div className="campo-quantidade">
                                    <h4>Quantidade</h4>
                                    <InputPadrao
                                        placeholder="Quantidade"
                                        value={item.quantidade}
                                        onChange={(valor) => atualizarItem(index, 'quantidade', valor)}
                                        inativo={!editado}
                                        senha={false}
                                    />
                                </div>
                                <div className="campo-valor">
                                    <h4>Valor unitário</h4>
                                    <InputPadrao
                                        placeholder="Valor Unitário"
                                        value={item.valor_unit}
                                        onChange={(valor) => atualizarItem(index, 'valor_unit', valor)}
                                        inativo={!editado}
                                        senha={false}
                                    />
                                </div>
                            </div>

                            <div className="subtotal-item">
                                <span>Subtotal: R$ {((item.quantidade || 0) * (item.valor_unit || 0)).toFixed(2).replace('.', ',')}</span>
                            </div>
                            <hr />
                        </div>
                    ))}
                </div>
            );
        }

        if (Array.isArray(valor)) {
            return (
                <div key={fullPath.join('.')} className="campo-array">
                    <h3>{formatarChave(chave)}</h3>
                    {valor.map((item, index) => (
                        <div key={index} className="item-array">
                            {typeof item === 'object'
                                ? Object.entries(item).map(([k, v]) =>
                                    renderCampo(k, v, [...fullPath, index.toString()])
                                )
                                : (
                                    <InputPadrao
                                        placeholder={`${formatarChave(chave)} [${index}]`}
                                        value={item}
                                        onChange={(val: string) => {
                                            const novoItem = [...valor];
                                            novoItem[index] = val;
                                            const novoOrcamento = { ...orcamentoEstrutura };
                                            let ref: any = novoOrcamento;
                                            for (let i = 0; i < fullPath.length - 1; i++) {
                                                ref = ref[fullPath[i]];
                                            }
                                            ref[fullPath[fullPath.length - 1]] = novoItem;
                                            setOrcamentoEstrutura(novoOrcamento);
                                        }}
                                        inativo={!editado}
                                        senha={false}
                                    />
                                )}
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof valor === 'object' && valor !== null) {
            return (
                <div key={fullPath.join('.')} className="campo-objeto">
                    <h3>{formatarChave(chave)}</h3>
                    {Object.entries(valor).map(([k, v]) => renderCampo(k, v, fullPath))}
                </div>
            );
        }

        return (
            <div key={fullPath.join('.')} className="campo-simples">
                <h4>{formatarChave(chave)}</h4>
                <InputPadrao
                    placeholder={formatarChave(chave)}
                    value={valor}
                    onChange={(val: string) => {
                        const valorFormatado = isNaN(Number(val)) ? val : Number(val);
                        const novoOrcamento = { ...orcamentoEstrutura };
                        let ref: any = novoOrcamento;
                        for (let i = 0; i < fullPath.length - 1; i++) {
                            ref = ref[fullPath[i]];
                        }
                        ref[fullPath[fullPath.length - 1]] = valorFormatado;
                        setOrcamentoEstrutura(novoOrcamento);
                    }}
                    inativo={!editado}
                    senha={false}
                />
            </div>
        );
    }

    return (
        <div className="formulario-dinamico">
            {Object.entries(orcamentoEstrutura).map(([chave, valor]) =>
                renderCampo(chave, valor)
            )}

            <div className="total-orcamento">
                <div className="detalhes-total">
                    <div className="linha-total">
                        <span>Subtotal: R$ {((calcularTotal(orcamentoEstrutura.itens, 0) - (calcularTotal(orcamentoEstrutura.itens, 0) * orcamentoEstrutura.desconto) / 100)).toFixed(2).replace('.', ',')}</span>
                    </div>
                    {orcamentoEstrutura.desconto > 0 && (
                        <div className="linha-total desconto">
                            <span>Desconto ({orcamentoEstrutura.desconto}%): -R$ {((calcularTotal(orcamentoEstrutura.itens, 0) * orcamentoEstrutura.desconto) / 100).toFixed(2).replace('.', ',')}</span>
                        </div>
                    )}
                    {orcamentoEstrutura.total != undefined
                        ?
                        <div className="linha-total total-final">
                            <h3>Total: R$ {orcamentoEstrutura.total.toFixed(2).replace('.', ',')}</h3>
                        </div>
                        :
                        <div>
                            <h3>Total: R$ {calcularTotal(orcamentoEstrutura.itens, 0).toFixed(2).replace('.', ',')}</h3>
                        </div>
                    }

                </div>
            </div>

            <div className="botoes-forms-orcamento">
                {editado ? (
                    <button className="botao-gerar" onClick={handleSalvar}>Salvar</button>
                ) : (
                    <button className="botao-gerar" onClick={() => gerarPdf(orcamentoEstrutura)}>Gerar PDF</button>
                )}
            </div>
        </div>
    );
}
