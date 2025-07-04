import InputPadrao from "../inputPadrao/inputPadrao";
import { useState, useEffect } from "react";
import './formDinamico.css';

interface FormDinamicoProps {
    orcamentoEstrutura: any;
    setOrcamentoEstrutura: (orcamento: any) => void;
    gerarPdf: (orcamento: any) => void;
    editarOrcamento: (orcamentoFormatado: any) => Promise<boolean>;
}

export default function FormDinamico({ orcamentoEstrutura, setOrcamentoEstrutura, gerarPdf, editarOrcamento }: FormDinamicoProps) {
    const [editado, setEditado] = useState(false);

    // Função para calcular o total dos itens
    const calcularTotal = (itens: any[], desconto: number = 0) => {
        const subtotal = itens.reduce((acc, item) => {
            const quantidade = Number(item.quantidade) || 0;
            const valorUnitario = Number(item.valorUnitario) || 0;
            return acc + (quantidade * valorUnitario);
        }, 0);
        
        const valorDesconto = (subtotal * desconto) / 100;
        return subtotal - valorDesconto;
    };

    // Função para atualizar o orçamento com o total recalculado
    const atualizarOrcamentoComTotal = (novoOrcamento: any) => {
        const totalCalculado = calcularTotal(novoOrcamento.itens, novoOrcamento.desconto);
        const orcamentoAtualizado = {
            ...novoOrcamento,
            total: totalCalculado
        };
        setOrcamentoEstrutura(orcamentoAtualizado);
    };

    // Marcar como editado sempre que algo mudar
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
            descricao: '',
            quantidade: 0,
            valorUnitario: 0
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

    // Função para atualizar item específico
    const atualizarItem = (index: number, campo: string, valor: any) => {
        const novosItens = [...orcamentoEstrutura.itens];
        novosItens[index] = {
            ...novosItens[index],
            [campo]: campo === 'descricao' ? valor : Number(valor) || 0
        };
        
        atualizarOrcamentoComTotal({
            ...orcamentoEstrutura,
            itens: novosItens
        });
    };

    return (
        <div className="formulario-dinamico">

            <h3>Cliente</h3>
            <InputPadrao
                placeholder="Cliente"
                value={orcamentoEstrutura.cliente}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, cliente: valor })}
                inativo={!editado}
                senha={false}
            />

            <h3>Data de entrega</h3>
            <InputPadrao
                placeholder="Data de entrega"
                value={orcamentoEstrutura.dataEntrega}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, dataEntrega: valor })}
                inativo={!editado}
                senha={false}
            />

            <h3>Desconto</h3>
            <InputPadrao
                placeholder="Desconto (%)"
                value={orcamentoEstrutura.desconto}
                onChange={(valor) => {
                    const novoDesconto = Number(valor) || 0;
                    atualizarOrcamentoComTotal({
                        ...orcamentoEstrutura,
                        desconto: novoDesconto
                    });
                }}
                inativo={!editado}
                senha={false}
            />

            <h3>Observações</h3>
            <InputPadrao
                placeholder="Observações"
                value={orcamentoEstrutura.observacoes}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, observacoes: valor })}
                inativo={!editado}
                senha={false}
            />

            <div className="itens-header">
                <h3>Itens</h3>
                <button type="button" className="botao-adicionar" onClick={adicionarItem}>+ Adicionar item</button>
            </div>
            
            <div className="itens-orcamento">
                {orcamentoEstrutura.itens.map((item: any, index: number) => (
                    <div key={index} className="item-container">
                        <div className="item-header">
                            <h4>Item {index + 1}</h4>
                            {orcamentoEstrutura.itens.length > 1 && (
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
                                <InputPadrao
                                    placeholder="Descrição"
                                    value={item.descricao}
                                    onChange={(valor) => atualizarItem(index, 'descricao', valor)}
                                    inativo={!editado}
                                    senha={false}
                                />
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
                                    value={item.valorUnitario}
                                    onChange={(valor) => atualizarItem(index, 'valorUnitario', valor)}
                                    inativo={!editado}
                                    senha={false}
                                />
                            </div>
                        </div>
                        
                        {/* Mostrar subtotal do item */}
                        <div className="subtotal-item">
                            <span>Subtotal: R$ {((item.quantidade || 0) * (item.valorUnitario || 0)).toFixed(2).replace('.', ',')}</span>
                        </div>
                        
                        <hr />
                    </div>
                ))}
            </div>

            <div className="total-orcamento">
                <div className="detalhes-total">
                    <div className="linha-total">
                        <span>Subtotal: R$ {calcularTotal(orcamentoEstrutura.itens, 0).toFixed(2).replace('.', ',')}</span>
                    </div>
                    {orcamentoEstrutura.desconto > 0 && (
                        <div className="linha-total desconto">
                            <span>Desconto ({orcamentoEstrutura.desconto}%): -R$ {((calcularTotal(orcamentoEstrutura.itens, 0) * orcamentoEstrutura.desconto) / 100).toFixed(2).replace('.', ',')}</span>
                        </div>
                    )}
                    <div className="linha-total total-final">
                        <h3>Total: R$ {orcamentoEstrutura.total.toFixed(2).replace('.', ',')}</h3>
                    </div>
                </div>
            </div>

            <div className="botoes-forms-orcamento">
                {editado ? (
                    <button
                        className="botao-gerar"
                        onClick={handleSalvar}
                    >Salvar</button>
                ) : (
                    <button
                        className="botao-gerar"
                        onClick={() => gerarPdf(orcamentoEstrutura)}
                    >Gerar PDF</button>
                )}
            </div>
        </div>
    );
}