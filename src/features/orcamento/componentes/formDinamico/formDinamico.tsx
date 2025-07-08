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

    function renderCampo(chave: string, valor: any, path: string[] = []) {
        const fullPath = [...path, chave];

        const handleChange = (novoValor: any) => {
            const novoOrcamento = { ...orcamentoEstrutura };
            let ref: any = novoOrcamento;
            for (let i = 0; i < fullPath.length - 1; i++) {
                ref = ref[fullPath[i]];
            }
            ref[fullPath[fullPath.length - 1]] = novoValor;
            setOrcamentoEstrutura(novoOrcamento);
        };

        if (Array.isArray(valor)) {
            return (
                <div key={fullPath.join('.')} className="campo-array">
                    <h3>{chave}</h3>
                    {valor.map((item, index) => (
                        <div key={index} className="item-array">
                            {typeof item === 'object'
                                ? Object.entries(item).map(([k, v]) =>
                                    renderCampo(k, v, [...fullPath, index.toString()])
                                )
                                : (
                                    <InputPadrao
                                        placeholder={`${chave} [${index}]`}
                                        value={item}
                                        onChange={(val: string) => {
                                            const novoItem = [...valor];
                                            novoItem[index] = val;
                                            handleChange(novoItem);
                                        }}
                                        inativo={!editado}
                                        senha={false}
                                    />
                                )}
                            <hr />
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof valor === 'object' && valor !== null) {
            return (
                <div key={fullPath.join('.')} className="campo-objeto">
                    <h3>{chave}</h3>
                    {Object.entries(valor).map(([k, v]) => renderCampo(k, v, fullPath))}
                </div>
            );
        }

        return (
            <div key={fullPath.join('.')} className="campo-simples">
                <h4>{chave}</h4>
                <InputPadrao
                    placeholder={chave}
                    value={valor}
                    onChange={(val: string) => {
                        const valorFormatado = isNaN(Number(val)) ? val : Number(val);
                        handleChange(valorFormatado);
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