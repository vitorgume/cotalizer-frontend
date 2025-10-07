// ListagemOrcamentos.tsx
import { useEffect, useState, useMemo } from "react";
import InputPadrao from "../../componentes/inputPadrao/inputPadrao";
import { deletar, listarPorUsuario, listarTradicionaisPorUsuario } from '../../orcamento.service';
import OrcamentoItem from "../../componentes/orcamentoItem/orcamentoItem";
import type Orcamento from "../../../../models/orcamento";
import ModalDelete from "../../componentes/modalDelete/modalDelete";
import './listagemOrcamentos.css'
import Loading from "../../componentes/loading/loading";
import type { OrcamentoTradicional } from "../../../../models/orcamentoTradicional";
import { obterMe } from "../../../usuario/usuario.service";
import { BotaoVoltar } from "../../../usuario/components/botaoVoltar/botaoVoltar";
import type Page from "../../../../models/page";

type Tab = "IA" | "TRAD";

const PAGE_SIZE = 10;

export default function ListagemOrcamentos() {
    // páginas vindas do backend
    const [iaPage, setIaPage] = useState<Page<Orcamento> | null>(null);
    const [tradPage, setTradPage] = useState<Page<OrcamentoTradicional> | null>(null);

    // controle de UI
    const [selectedTab, setSelectedTab] = useState<Tab>("IA");
    const [termoBusca, setTermoBusca] = useState("");
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // páginas atuais por aba
    const [iaPageIndex, setIaPageIndex] = useState(0);
    const [tradPageIndex, setTradPageIndex] = useState(0);

    const [usuarioId, setUsuarioId] = useState<string | undefined>(undefined);

    // carregar usuário e primeira página de cada aba
    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const resp = await obterMe();
                if (!alive) return;
                const id = resp.dado?.usuarioId;
                setUsuarioId(id);
            } finally {
                // nada
            }
        })();

        return () => { alive = false; };
    }, []);

    // carregar página IA quando mudar pageIndex ou usuarioId
    useEffect(() => {
        if (!usuarioId) return;
        let alive = true;
        setLoading(true);
        (async () => {
            try {
                const iaRes = await listarPorUsuario(usuarioId, iaPageIndex, PAGE_SIZE);
                if (!alive) return;
                if (iaRes.dado) setIaPage(iaRes.dado);
            } catch (e) {
                // interceptor já notificou
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [usuarioId, iaPageIndex]);

    // carregar página TRAD quando mudar pageIndex ou usuarioId
    useEffect(() => {
        if (!usuarioId) return;
        let alive = true;
        setLoading(true);
        (async () => {
            try {
                const tradRes = await listarTradicionaisPorUsuario(usuarioId, tradPageIndex, PAGE_SIZE);
                if (!alive) return;
                if (tradRes.dado) setTradPage(tradRes.dado);
            } catch (e) {
                // interceptor já notificou
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [usuarioId, tradPageIndex]);

    // lista base da aba atual
    const baseLista = selectedTab === "IA" ? (iaPage?.content ?? []) : (tradPage?.content ?? []);

    // busca local (client-side) dentro da página atual
    const listaFiltrada = useMemo(() => {
        if (!termoBusca.trim()) return baseLista;
        const termo = termoBusca.toLowerCase();
        if (selectedTab === "IA") {
            return (baseLista as Orcamento[]).filter(o =>
                (o.titulo ?? "").toLowerCase().includes(termo) ||
                (o.conteudoOriginal ?? "").toLowerCase().includes(termo)
            );
        } else {
            return (baseLista as OrcamentoTradicional[]).filter(t =>
                (t.cliente ?? "").toLowerCase().includes(termo) ||
                (t.observacoes ?? "").toLowerCase().includes(termo)
            );
        }
    }, [baseLista, selectedTab, termoBusca]);

    const totalElements = selectedTab === "IA" ? (iaPage?.totalElements ?? 0) : (tradPage?.totalElements ?? 0);
    const totalPages = selectedTab === "IA" ? (iaPage?.totalPages ?? 0) : (tradPage?.totalPages ?? 0);
    const pageIndex = selectedTab === "IA" ? iaPageIndex : tradPageIndex;

    function setPageIndex(next: number) {
        if (selectedTab === "IA") setIaPageIndex(next);
        else setTradPageIndex(next);
    }

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setOrcamentoSelecionado(null);
    };

    const handleDelete = async () => {
        if (!orcamentoSelecionado?.id) return;
        try {
            await deletar(orcamentoSelecionado.id);
            // reload da página atual para refletir backend
            if (selectedTab === "IA") {
                // se apagar o último da página e não for a primeira, volte uma página
                const isLastItem = (iaPage?.content.length ?? 1) === 1;
                setIaPageIndex((idx) => (isLastItem && idx > 0 ? idx - 1 : idx));
            } else {
                const isLastItem = (tradPage?.content.length ?? 1) === 1;
                setTradPageIndex((idx) => (isLastItem && idx > 0 ? idx - 1 : idx));
            }
        } finally {
            handleCloseDeleteModal();
        }
    };

    const start = totalElements === 0 ? 0 : pageIndex * PAGE_SIZE + 1;
    const end = Math.min((pageIndex + 1) * PAGE_SIZE, totalElements);

    return (
        <div className="listagem-page">
            <div className="listagem-card card-shell">
                <header className="listagem-header">
                    <BotaoVoltar absolute={true}  />
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
                    onChange={(v) => setTermoBusca(v)}
                    inativo={false}
                    senha={false}
                    limiteCaracteres={100}
                    mascara=""
                    upperCase={true}
                />

                <main className="result-area">
                    {loading ? (
                        <Loading message="Carregando orçamentos..." />
                    ) : listaFiltrada.length > 0 ? (
                        <div className="lista">
                            {listaFiltrada.map((orc: any) => (
                                <div className="lista-item" key={orc.id}>
                                    <OrcamentoItem orcamento={orc} misturado={false} />
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

                {/* ====== PAGINAÇÃO ====== */}
                <div className="pagination-row">
                    <div className="pagination-info">
                        {totalElements > 0 ? (
                            <span>Mostrando <strong>{start}-{end}</strong> de <strong>{totalElements}</strong></span>
                        ) : <span>Nenhum registro</span>}
                    </div>

                    <div className="pagination-controls">
                        <button
                            className="pg-btn"
                            disabled={pageIndex <= 0}
                            onClick={() => setPageIndex(0)}
                            aria-label="Primeira página"
                        >
                            «
                        </button>
                        <button
                            className="pg-btn"
                            disabled={pageIndex <= 0}
                            onClick={() => setPageIndex(pageIndex - 1)}
                            aria-label="Página anterior"
                        >
                            Anterior
                        </button>

                        {/* números (compacto) */}
                        {Array.from({ length: totalPages }).slice(0, 7).map((_, i) => {
                            // janela simples: atual -2 .. atual +2 (ajuste se quiser)
                            const shouldShow =
                                i === 0 ||
                                i === totalPages - 1 ||
                                Math.abs(i - pageIndex) <= 2;

                            if (!shouldShow) {
                                if (i === 1 && pageIndex > 3) return <span key="l" className="pg-ellipsis">…</span>;
                                if (i === totalPages - 2 && pageIndex < totalPages - 4) return <span key="r" className="pg-ellipsis">…</span>;
                                return null;
                            }
                            return (
                                <button
                                    key={i}
                                    className={`pg-btn ${i === pageIndex ? "active" : ""}`}
                                    onClick={() => setPageIndex(i)}
                                >
                                    {i + 1}
                                </button>
                            );
                        })}

                        <button
                            className="pg-btn"
                            disabled={pageIndex >= totalPages - 1 || totalPages === 0}
                            onClick={() => setPageIndex(pageIndex + 1)}
                            aria-label="Próxima página"
                        >
                            Próximo
                        </button>
                        <button
                            className="pg-btn"
                            disabled={pageIndex >= totalPages - 1 || totalPages === 0}
                            onClick={() => setPageIndex(totalPages - 1)}
                            aria-label="Última página"
                        >
                            »
                        </button>
                    </div>
                </div>

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
