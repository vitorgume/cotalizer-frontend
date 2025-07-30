import { useEffect, useState, useMemo } from "react";
import InputPadrao from "../../componentes/inputPadrao/inputPadrao";
import { deletar, listarPorUsuario, listarTradicionaisPorUsuario } from '../../orcamento.service';
import OrcamentoItem from "../../componentes/orcamentoItem/orcamentoItem";
import type Orcamento from "../../../../models/orcamento";
import ModalDelete from "../../componentes/modalDelete/modalDelete";
import './listagemOrcamentos.css';
import Loading from "../../componentes/loading/Loading";
import type { OrcamentoTradicional } from "../../../../models/orcamentoTradicional";

type Tab = "IA" | "TRAD";

export default function ListagemOrcamentos() {
    const [iaOrcamentos, setIaOrcamentos] = useState<Orcamento[]>([]);
    const [tradOrcamentos, setTradOrcamentos] = useState<OrcamentoTradicional[]>([]);
    const [selectedTab, setSelectedTab] = useState<Tab>("IA");
    const [termoBusca, setTermoBusca] = useState("");
    const [orcamentoSelecionado, setOrcamentoSelecionado] = useState<Orcamento | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // 1) Carrega as duas listas ao montar
    useEffect(() => {
        const idUsu = localStorage.getItem("id-usuario");
        if (!idUsu) return;

        setLoading(true);
        Promise.all([
            listarPorUsuario(idUsu),
            listarTradicionaisPorUsuario(idUsu),
        ])
            .then(([iaRes, tradRes]) => {
                if (iaRes.dado) setIaOrcamentos(iaRes.dado.content);
                if (tradRes.dado) setTradOrcamentos(tradRes.dado.content);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false)
            });
    }, []);

    // 2) Filtra a lista visível de acordo com a aba e o termo de busca
    const listaFiltrada = useMemo(() => {
        // escolhe a base certa de acordo com a aba
        const base = selectedTab === "IA"
            ? iaOrcamentos as (Orcamento | OrcamentoTradicional)[]
            : tradOrcamentos as (Orcamento | OrcamentoTradicional)[];

        if (!termoBusca.trim()) {
            return base;
        }
        const termo = termoBusca.toLowerCase();

        return base.filter((orc) => {
            if (selectedTab === "IA") {
                // aqui TS já sabe que orc é do tipo Orcamento
                const o = orc as Orcamento;
                return (
                    o.titulo.toLowerCase().includes(termo) ||
                    o.conteudoOriginal.toLowerCase().includes(termo)
                );
            } else {
                // aqui TS já sabe que orc é do tipo OrcamentoTradicional
                const t = orc as OrcamentoTradicional;
                return (
                    t.cliente.toLowerCase().includes(termo) ||
                    t.observacoes.toLowerCase().includes(termo)
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
                // remove de ambas as listas por via das dúvidas
                setIaOrcamentos((l) => l.filter((o) => o.id !== orcamentoSelecionado.id));
                setTradOrcamentos((l) => l.filter((o) => o.id !== orcamentoSelecionado.id));
            }
        } catch (e) {
            console.error("Erro ao deletar", e);
        } finally {
            handleCloseDeleteModal();
        }
    };

    return (
        <div className="listagem-orcamentos">
            <h1 className="titulo">Seus orçamentos</h1>

            {/* === Abas de seleção === */}
            <div className="abas-tipo">
                <button
                    className={selectedTab === "IA" ? "active" : ""}
                    onClick={() => setSelectedTab("IA")}
                >
                    Orçamentos IA
                </button>
                <button
                    className={selectedTab === "TRAD" ? "active" : ""}
                    onClick={() => setSelectedTab("TRAD")}
                >
                    Orçamentos Tradicionais
                </button>
            </div>

            {/* === Busca texto === */}
            <InputPadrao
                placeholder="Buscar por título ou conteúdo"
                value={termoBusca}
                onChange={setTermoBusca}
                inativo={false}
                senha={false}
            />

            {/* === Conteúdo principal === */}
            {loading ? (
                <Loading message="Carregando orçamentos..." />
            ) : listaFiltrada.length > 0 ? (
                listaFiltrada.map((orc) => (
                    <OrcamentoItem
                        key={orc.id}
                        orcamento={orc}
                    />
                ))
            ) : (
                <p className="mensagem-vazia">
                    Nenhum orçamento {selectedTab === "IA" ? "IA" : "tradicional"} encontrado.
                </p>
            )}

            {/* === Modal de confirmação de delete === */}
            <ModalDelete
                isOpen={showDeleteModal}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDelete}
                title={orcamentoSelecionado?.titulo || "Excluir orçamento"}
            />
        </div>
    );
}
