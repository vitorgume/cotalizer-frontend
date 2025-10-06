import InputPadrao from "../inputPadrao/inputPadrao";
import { useState, useEffect, useMemo } from "react";
import "./formDinamico.css";
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
  editarOrcamento,
}: FormDinamicoProps) {
  const [editado, setEditado] = useState(false);
  const [totalFinal, setTotalFinal] = useState(0);
  const [subtotalFinal, setSubtotalFinal] = useState(0);
  const [descontoVlr, setDescontoVlr] = useState(0);

  // extrai número de "5%", "5,5", "5.5%", "  10  %" etc.
  const parsePercentNumber = (v: unknown): number => {
    if (typeof v === "number") return v;
    if (v == null) return 0;
    const cleaned = String(v)
      .trim()
      .replace(/[^\d.,-]/g, "")  // remove tudo que não é dígito, ponto, vírgula, sinal
      .replace(/\./g, "")        // tira separadores de milhar
      .replace(",", ".");        // vírgula -> ponto
    const n = Number(cleaned);
    if (Number.isNaN(n)) return 0;
    // clamp opcional 0..100
    return Math.max(0, Math.min(100, n));
  };

  const toMoney = (n: number) =>
    (Number.isFinite(n) ? n : 0).toFixed(2).replace(".", ",");

  const HIDDEN_KEYS = useMemo(
    () => new Set(["subtotal", "total", "valorTotal", "descontoCalculado"]),
    []
  );

  const calcularTotal = (itens: any[], desconto: unknown = 0) => {
    const subtotal = itens.reduce((acc, item) => {
      const q = parseDecimalFlexible(item?.quantidade);
      const vu = parseDecimalFlexible(item?.valor_unit);
      return acc + q * vu;
    }, 0);

    const pct = parsePercentNumber(desconto);
    const valorDesconto = (subtotal * pct) / 100;
    return { subtotal, valorDesconto, total: subtotal - valorDesconto };
  };


  const atualizarOrcamentoComTotal = (novoOrcamento: any) => {
    const { total } = calcularTotal(novoOrcamento.itens, novoOrcamento.desconto);
    // guarda o total calculado dentro do estado (se você quiser persistir)
    setOrcamentoEstrutura({ ...novoOrcamento, total });
  };

  // --- efeitos ----------------------------------------------------

  useEffect(() => {
    setEditado(true);
    const { subtotal, valorDesconto, total } = calcularTotal(
      orcamentoEstrutura.itens ?? [],
      orcamentoEstrutura.desconto
    );
    setSubtotalFinal(subtotal);
    setDescontoVlr(valorDesconto);
    setTotalFinal(total);
  }, [orcamentoEstrutura]); // recalcula sempre que o objeto mudar

  // --- ações ------------------------------------------------------

  async function handleSalvar() {
    try {
      const response = await editarOrcamento(orcamentoEstrutura);
      setEditado(!response);
    } catch (erro) {
      console.error("Erro ao salvar orçamento:", erro);
    }
  }

  function adicionarItem() {
    const novosItens = [
      ...(orcamentoEstrutura.itens ?? []),
      { produto: "", quantidade: 0, valor_unit: 0 },
    ];
    atualizarOrcamentoComTotal({ ...orcamentoEstrutura, itens: novosItens });
  }

  function removerItem(index: number) {
    const itens = orcamentoEstrutura.itens ?? [];
    if (itens.length <= 1) return;
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    atualizarOrcamentoComTotal({ ...orcamentoEstrutura, itens: novosItens });
  }


  const parseDecimalFlexible = (v: any): number => {
    if (v == null) return 0;
    let s = String(v).trim();

    if (s === '') return 0;

    // Caso tenha vírgula (BR): remove milhares "." e troca vírgula por ponto
    if (s.includes(',')) {
      // permite "1," (vira "1")
      if (/,\s*$/.test(s)) s = s.replace(/,\s*$/, '');
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      // Caso só pontos: considera o ÚLTIMO ponto como decimal e remove os demais (milhares)
      const lastDot = s.lastIndexOf('.');
      if (lastDot > -1) {
        s = s.slice(0, lastDot).replace(/\./g, '') + '.' + s.slice(lastDot + 1);
      }
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  };

  const atualizarItem = (index: number, campo: string, valor: any) => {
    const raw =
      valor && typeof valor === "object" && "target" in valor
        ? (valor.target as HTMLInputElement).value
        : valor;

    let coerced: any;

    if (campo === "produto") {
      coerced = String(raw ?? "");
    } else if (campo === "valor_unit") {
      // 👇 mantém como string (ex.: "1.234,5") para não “comer” a vírgula
      coerced = String(raw ?? "");
    } else if (campo === "quantidade") {
      // Inteiro (ou troque por parseDecimalFlexible se quiser decimal)
      coerced = Math.max(0, Number(String(raw).replace(/[^\d]/g, "")) || 0);
    } else {
      coerced = String(raw ?? "");
    }

    const itens = orcamentoEstrutura.itens ?? [];
    const novosItens = [...itens];
    novosItens[index] = { ...novosItens[index], [campo]: coerced };

    atualizarOrcamentoComTotal({ ...orcamentoEstrutura, itens: novosItens });
  };



  // --- render -----------------------------------------------------

  function renderCampo(chave: string, valor: any, path: string[] = []) {
    const fullPath = [...path, chave];

    // 1) Esconde campos derivados
    if (HIDDEN_KEYS.has(chave)) return null;

    // 2) Itens (tabela)
    if (
      chave === "itens" &&
      Array.isArray(valor) &&
      valor.every((v) => typeof v === "object")
    ) {
      return (
        <div key={fullPath.join(".")} className="itens-orcamento glass-card">
          <div className="itens-header">
            <h3>Itens</h3>
            <button type="button" className="botao-adicionar" onClick={adicionarItem}>
              + Adicionar item
            </button>
          </div>

          {valor.map((item, index) => (
            <div key={index} className="item-container glass-subcard">
              <div className="item-header">
                <h4>Item {index + 1}</h4>
                {valor.length > 1 && (
                  <button
                    type="button"
                    className="botao-remover"
                    onClick={() => removerItem(index)}
                    aria-label={`Remover Item ${index + 1}`}
                  >
                    Remover
                  </button>
                )}
              </div>

              <div className="item-grid">
                <div className="campo-descricao">
                  <h4>Descrição</h4>
                  <textarea
                    placeholder="Produto"
                    value={item.produto ?? ""}
                    onChange={(e) => atualizarItem(index, "produto", e.target.value)}
                    className="textarea-podruto"
                  />
                </div>

                <div className="campo-quantidade">
                  <h4>Quantidade</h4>
                  <InputPadrao
                    placeholder="Quantidade"
                    value={String(item.quantidade ?? "")}
                    onChange={(v: any) => atualizarItem(index, "quantidade", v)}
                    inativo={!editado}
                    senha={false}
                    limiteCaracteres={1000}
                    mascara=""
                    upperCase={true}
                  />
                </div>

                <div className="campo-valor">
                  <h4>Valor unitário</h4>
                  <InputPadrao
                    placeholder="Valor Unitário"
                    value={String(item.valor_unit ?? "")}
                    onChange={(v: string) => atualizarItem(index, "valor_unit", v)}
                    inativo={!editado}
                    senha={false}
                    limiteCaracteres={1000}
                    mascara="numeroDecimal"
                    upperCase={false}
                  />
                </div>
              </div>

              <div className="subtotal-item">
                <span>
                  Subtotal: R$ {toMoney(
                    parseDecimalFlexible(item.quantidade) * parseDecimalFlexible(item.valor_unit)
                  )}
                </span>
              </div>

              <hr />
            </div>
          ))}
        </div>
      );
    }

    // 3) Arrays genéricos
    if (Array.isArray(valor)) {
      return (
        <div key={fullPath.join(".")} className="campo-array glass-card">
          <h3>{formatarChave(chave)}</h3>
          {valor.map((item, index) => (
            <div key={index} className="item-array">
              {typeof item === "object" ? (
                Object.entries(item).map(([k, v]) =>
                  renderCampo(k, v, [...fullPath, index.toString()])
                )
              ) : (
                <InputPadrao
                  placeholder={`${formatarChave(chave)} [${index}]`}
                  value={String(item ?? "")}
                  onChange={(val: string) => {
                    const novoItem = [...valor];
                    (novoItem as any)[index] = val;
                    const novoOrcamento = { ...orcamentoEstrutura };
                    let ref: any = novoOrcamento;
                    for (let i = 0; i < fullPath.length - 1; i++) ref = ref[fullPath[i]];
                    ref[fullPath[fullPath.length - 1]] = novoItem;
                    setOrcamentoEstrutura(novoOrcamento);
                  }}
                  inativo={!editado}
                  senha={false}
                  limiteCaracteres={100}
                  mascara=""
                  upperCase={true}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    // 4) Objetos genéricos
    if (typeof valor === "object" && valor !== null) {
      return (
        <div key={fullPath.join(".")} className="campo-objeto glass-card">
          <h3>{formatarChave(chave)}</h3>
          {Object.entries(valor).map(([k, v]) => renderCampo(k, v, fullPath))}
        </div>
      );
    }

    // 5) Campos simples (inclui 'desconto')
    const isDesconto = chave.toLowerCase() === "desconto";

    return (
      <div key={fullPath.join(".")} className="campo-simples glass-card">
        <h4>{formatarChave(chave)}</h4>
        <InputPadrao
          placeholder={isDesconto ? "Desconto (%)" : formatarChave(chave)}
          value={String(valor ?? "")}                 // sempre string para evitar uncontrolled
          onChange={(val: string) => {
            // mantém o que o usuário digitou (ex.: "5%")
            const novoOrcamento = { ...orcamentoEstrutura };
            let ref: any = novoOrcamento;
            for (let i = 0; i < fullPath.length - 1; i++) ref = ref[fullPath[i]];
            ref[fullPath[fullPath.length - 1]] = val;

            // se for desconto, já atualiza o total derivado
            if (isDesconto) {
              const { total } = calcularTotal(novoOrcamento.itens ?? [], val);
              novoOrcamento.total = total;
            }
            setOrcamentoEstrutura(novoOrcamento);
          }}
          inativo={!editado}
          senha={false}
          limiteCaracteres={100}
          mascara=""
          upperCase={true}
        />
      </div>
    );
  }

  return (
    <div className="formulario-dinamico">
      <div className="fd-head">
        <div className="fd-title">
          <span className="fd-chip">Orçamento</span>
          <h2>Editor dinâmico</h2>
          <p>Padronize itens, descontos e gere o PDF com a mesma estética da sua landing.</p>
        </div>
      </div>

      {/* filtra campos derivados antes de renderizar */}
      {Object.entries(orcamentoEstrutura)
        .filter(([k]) => !HIDDEN_KEYS.has(k))
        .map(([chave, valor]) => renderCampo(chave, valor))}

      <div className="total-orcamento glass-cta">
        <div className="detalhes-total">
          <div className="linha-total">
            <span>Subtotal:</span>
            <span>R$ {toMoney(subtotalFinal)}</span>
          </div>
          {parsePercentNumber(orcamentoEstrutura.desconto) > 0 && (
            <div className="linha-total desconto">
              <span>
                Desconto ({String(orcamentoEstrutura.desconto ?? "").toString()}):
              </span>
              <span>- R$ {toMoney(descontoVlr)}</span>
            </div>
          )}
          <div className="linha-total total-final">
            <h3>Total:</h3>
            <h3>R$ {toMoney(totalFinal)}</h3>
          </div>
        </div>
      </div>

      <div className="botoes-forms-orcamento">
        {editado ? (
          <button className="botao-primario" onClick={handleSalvar}>
            Salvar
          </button>
        ) : (
          <button className="botao-primario" onClick={() => gerarPdf(orcamentoEstrutura)}>
            Gerar PDF
          </button>
        )}
      </div>
    </div>
  );
}
