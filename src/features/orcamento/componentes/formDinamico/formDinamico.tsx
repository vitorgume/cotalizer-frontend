import InputPadrao from "../inputPadrao/inputPadrao";
import { useState } from "react";
import './formDinamico.css';
import InputPadraoDinamico from "../inputPadraoFormDinamico/inputPadraoDinamico";

interface FormDinamicoProps {
    orcamentoEstrutura: any;
    setOrcamentoEstrutura: (orcamento: any) => void;
    gerarPdf: (orcamento: any) => void;
}

export default function FormDinamico({ orcamentoEstrutura, setOrcamentoEstrutura, gerarPdf }: FormDinamicoProps) {
    return (
        <div className="formulario-dinamico">
            {/* Campos fixos */}

            <InputPadraoDinamico
                titulo="Cliente"
                valorPlaceholder="Cliente"
                orcamentoEstrutura={orcamentoEstrutura}
                setOrcamentoEstrutura={setOrcamentoEstrutura}
            />

            <h3>Data de entrega</h3>
            <InputPadrao
                placeholder="Data de entrega"
                value={orcamentoEstrutura.dataEntrega}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, dataEntrega: valor })}
            />

            <h3>Desconto</h3>
            <InputPadrao
                placeholder="Desconto (%)"
                value={orcamentoEstrutura.desconto}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, desconto: Number(valor) })}
            />

            <h3>Observações</h3>
            <InputPadrao
                placeholder="Observações"
                value={orcamentoEstrutura.observacoes}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, observacoes: valor })}
            />

            <h3>Itens</h3>
            <div className="itens-orcamento">
                {orcamentoEstrutura.itens.map((item: any, index: number) => (
                    <div key={index} className="item-container">
                        <h4>Descrição</h4>
                        <InputPadrao
                            placeholder="Descrição"
                            value={item.descricao}
                            onChange={(valor) => {
                                const novosItens = [...orcamentoEstrutura.itens];
                                novosItens[index].descricao = valor;
                                setOrcamentoEstrutura({ ...orcamentoEstrutura, itens: novosItens });
                            }}
                        />

                        <h4>Quantidade</h4>
                        <InputPadrao
                            placeholder="Quantidade"
                            value={item.quantidade}
                            onChange={(valor) => {
                                const novosItens = [...orcamentoEstrutura.itens];
                                novosItens[index].quantidade = Number(valor);
                                setOrcamentoEstrutura({ ...orcamentoEstrutura, itens: novosItens });
                            }}
                        />

                        <h4>Valor unitário</h4>
                        <InputPadrao
                            placeholder="Valor Unitário"
                            value={item.valorUnitario}
                            onChange={(valor) => {
                                const novosItens = [...orcamentoEstrutura.itens];
                                novosItens[index].valorUnitario = Number(valor);
                                setOrcamentoEstrutura({ ...orcamentoEstrutura, itens: novosItens });
                            }}
                        />

                        <hr />
                    </div>
                ))}
            </div>

            {/* Total */}
            <h3>Total</h3>
            <InputPadrao
                placeholder="Total"
                value={orcamentoEstrutura.total}
                onChange={(valor) => setOrcamentoEstrutura({ ...orcamentoEstrutura, total: Number(valor) })}
            />

            <div>
                <button
                    className="botao-gerar"
                    onClick={() => gerarPdf(orcamentoEstrutura)}
                >
                    Gerar PDF
                </button>

                <button>Salvar</button>
            </div>

        </div>
    );
}