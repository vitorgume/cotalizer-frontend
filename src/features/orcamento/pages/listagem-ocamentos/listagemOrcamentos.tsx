import { useEffect, useState, useMemo } from "react";
import InputPadrao from "../../componentes/inputPadrao/inputPadrao";
import { deletar, listarPorUsuario, listarTradicionaisPorUsuario } from '../../orcamento.service';
import OrcamentoItem from "../../componentes/orcamentoItem/orcamentoItem";
import type Orcamento from "../../../../models/orcamento";
import ModalDelete from "../../componentes/modalDelete/modalDelete";
import './listagemOrcamentos.css';
import Loading from "../../componentes/loading/Loading";
import type { OrcamentoTradicional } from "../../../../models/orcamentoTradicional";
import { obterMe } from "../../../usuario/usuario.service";

type Tab = "IA" | "TRAD";

export default function ListagemOrcamentos() {
    const [iaOrcamentos, setIaOrcamentos] = useState<Orcamento[]>([]);
    const [tradOrcamentos, setTradOrcamentos] = useState<OrcamentoTradicional[]>([]);
    const [selectedTab, setSelectedTab] = useState<Tab>("IA");
    const [termoBusca, setTermoBusca] = useState("");
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let alive = true;

        async function obterIdUsuario(): Promise<string | undefined> {
            const resp = await obterMe();
            return resp.dado?.usuarioId;
        }

        (async () => {
            const idUsu = await obterIdUsuario();
            if (!idUsu || !alive) return;

            setLoading(true);
            try {
                const [iaRes, tradRes] = await Promise.all([
                    listarPorUsuario(idUsu),
                    listarTradicionaisPorUsuario(idUsu),
                ]);

                if (!alive) return;
                if (iaRes.dado) setIaOrcamentos(iaRes.dado.content);
                if (tradRes.dado) setTradOrcamentos(tradRes.dado.content);
            } catch (err) {
                console.error(err);
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => { alive = false; };
    }, []);


    const listaFiltrada = useMemo(() => {
        const base = selectedTab === "IA"
            ? (iaOrcamentos as (Orcamento | OrcamentoTradicional)[])
            : (tradOrcamentos as (Orcamento | OrcamentoTradicional)[]);

        if (!termoBusca.trim()) return base;

        const termo = termoBusca.toLowerCase();
        return base.filter((orc) => {
            if (selectedTab === "IA") {
                const o = orc as Orcamento;
                return (
                    (o.titulo ?? "").toLowerCase().includes(termo) ||
                    (o.conteudoOriginal ?? "").toLowerCase().includes(termo)
                );
            } else {
                const t = orc as OrcamentoTradicional;
                return (
                    (t.cliente ?? "").toLowerCase().includes(termo) ||
                    (t.observacoes ?? "").toLowerCase().includes(termo)
                );
            }
        });
    }, [iaOrcamentos, tradOrcamentos, selectedTab, termoBusca]);

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setOrcamentoSelecionado(null);
    };

    const handleDelete = async () => {
        if (!orcamentoSelecionado) return;
        try {
            if (orcamentoSelecionado.id) {
                await deletar(orcamentoSelecionado.id);
                setIaOrcamentos((l) => l.filter((o) => o.id !== orcamentoSelecionado.id));
                // @ts-ignore (id também existe no trad via mapeamento da API)
                setTradOrcamentos((l) => l.filter((o) => o.id !== orcamentoSelecionado.id));
            }
        } catch (e) {
            console.error("Erro ao deletar", e);
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="listagem-page">
            <div className="listagem-card card-shell">
                <header className="listagem-header">
                    <div className="titulo-wrap">
                        <h1>Seus orçamentos</h1>
                        <p>Gerencie seus orçamentos por tipo e pesquise rapidamente.</p>
                    </div>

                    <div className="tabs">
                        <button
                            className={`tab ${selectedTab === "IA" ? "active" : ""}`}
                            onClick={() => setSelectedTab("IA")}
                            type="button"
                        >
                            Orçamentos IA
                        </button>
                        <button
                            className={`tab ${selectedTab === "TRAD" ? "active" : ""}`}
                            onClick={() => setSelectedTab("TRAD")}
                            type="button"
                        >
                            Orçamentos Tradicionais
                        </button>
                    </div>
                </header>

                <InputPadrao
                    placeholder={`Buscar em ${selectedTab === "IA" ? "IA" : "Tradicionais"}...`}
                    value={termoBusca}
                    onChange={setTermoBusca}
                    inativo={false}
                    senha={false}
                    limiteCaracteres={100}
                />


                <main className="result-area">
                    {loading ? (
                        <Loading message="Carregando orçamentos..." />
                    ) : listaFiltrada.length > 0 ? (
                        <div className="lista">
                            {listaFiltrada.map((orc: any) => (
                                <div className="lista-item" key={orc.id}>
                                    <OrcamentoItem
                                        orcamento={orc}
                                        /* Mantém o componente existente; o visual já foi ajustado no CSS dele */
                                        misturado={false}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty card-glass">
                            <p>
                                Nenhum orçamento {selectedTab === "IA" ? "IA" : "tradicional"} encontrado.
                            </p>
                        </div>
                    )}
                </main>

                <footer className="listagem-footer">
                    <div className="legend">
                        <span className="dot dot-ia" /> <span>IA</span>
                        <span className="sep">•</span>
                        <span className="dot dot-trad" /> <span>Tradicional</span>
                    </div>
                </footer>
            </div>

            <ModalDelete
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title={orcamentoSelecionado?.titulo || "Excluir orçamento"}
            />
        </div>
    );
}
