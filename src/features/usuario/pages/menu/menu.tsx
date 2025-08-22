import './menu.css';
import OrcamentoItem from '../../../orcamento/componentes/orcamentoItem/orcamentoItem';
import TextoResumo from '../../components/textoResumo/textoResumo';
import { useEffect, useState } from 'react';
import type Usuario from '../../../../models/usuario';
import type Orcamento from '../../../../models/orcamento';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { consultarUsuarioPeloId } from '../../usuario.service';
import { listarPorUsuario, listarTradicionaisPorUsuario } from '../../../orcamento/orcamento.service';
import ModalAvaliar from '../../components/modalAvaliar/modalAvaliar';
import { User } from 'lucide-react';


export default function Menu() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [orcamentos, setOrcamentos] = useState<any[] | []>([]);
    const [loading, setLoading] = useState(false);
    const [modalAvaliar, setModalAvaliar] = useState<boolean>(false);


    const navigate = useNavigate();

    function parseValor(v: unknown): number {
        if (v == null) return 0;
        if (typeof v === 'number' && Number.isFinite(v)) return v;
        if (typeof v === 'string') {
            const s = v
                .replace(/\s+/g, '')
                .replace(/[R$]/g, '')
                .replace(/\./g, '')
                .replace(/,/g, '.');
            const n = parseFloat(s);
            return Number.isNaN(n) ? 0 : n;
        }
        return 0;
    }

    function getTotalOrcamento(o: any): number {
        const bruto = o?.orcamentoFormatado?.total ?? o?.valorTotal ?? o?.total ?? 0;
        return parseValor(bruto);
    }

    function calcularValorTotal(orcamentos: any[]) {
        const total = orcamentos.reduce((acc, o) => acc + getTotalOrcamento(o), 0);
        return total.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    function obterCincoOrcamentosMaisRecentes(orcamentos: any[]) {
        return orcamentos
            .slice()
            .sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime())
            .slice(0, 5);
    }

    function botaoPerfil() {
        navigate('/usuario/perfil');
    }

    useEffect(() => {
        const usuarioId = localStorage.getItem('id-usuario');
        if (!usuarioId) {
            navigate('/menu');
            return;
        }
        setLoading(true);

        function abrirModalAvaliar(usuario: Usuario, orcamentos: any[]) {
            if (usuario) {
                if (!usuario.feedback && orcamentos.length === 3) {
                    setModalAvaliar(true);
                }
            }
        }

        async function carregarDados() {
            try {
                if (usuarioId) {
                    const usuarioResponse = await consultarUsuarioPeloId(usuarioId);

                    const [iaRes, tradRes] = await Promise.all([
                        listarPorUsuario(usuarioId),
                        listarTradicionaisPorUsuario(usuarioId)
                    ]);

                    if (!usuarioResponse.dado || !iaRes.dado || !tradRes.dado) {
                        throw new Error('Falha ao carregar dados');
                    }

                    const iaList: Orcamento[] = iaRes.dado.content.map(o => ({
                        ...o,
                        tipoOrcamento: 'IA'
                    }));

                    const tradList: Orcamento[] = tradRes.dado.content.map(t => (
                        {
                            id: t.id,
                            conteudoOriginal: '',
                            orcamentoFormatado: { total: t.valorTotal },
                            dataCriacao: t.dataCriacao,
                            titulo: t.cliente,
                            urlArquivo: t.urlArquivo,
                            usuarioId: t.idUsuario,
                            status: t.status,
                            tipoOrcamento: 'TRADICIONAL'
                        }
                    ));

                    const todos = [...iaList, ...tradList].sort(
                        (a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime()
                    );

                    abrirModalAvaliar(usuarioResponse.dado, todos);

                    setUsuario(usuarioResponse.dado);
                    setOrcamentos(todos);
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                navigate('/menu');
            } finally {
                setLoading(false);
            }
        }

        carregarDados();
    }, []);

    return (
        <>
            {!loading ? (
                <div className="menu-page">
                    <div className="menu-container">
                        <header className="header-menu">
                            {usuario ? <h1>Olá, {usuario.nome} !</h1> : <h1>Olá, visitante !</h1>}
                            <User color="#ffffff" onClick={botaoPerfil} className='user-icon' size={35}/>

                        </header>

                        <div className="card-info-geral card">
                            <div className="div-dir-info">
                                <h2>Resumo mensal</h2>
                                <TextoResumo titulo="Orçamentos:" valor={String(orcamentos.length)} />
                                <TextoResumo
                                    titulo="Aprovados:"
                                    valor={String(orcamentos.filter(orc => orc.status === 'APROVADO').length)}
                                />
                                <TextoResumo
                                    titulo="Reprovados:"
                                    valor={String(orcamentos.filter(orc => orc.status === 'REPROVADO').length)}
                                />
                            </div>
                            <div className="div-valores">
                                <p className="valor-total-info-geral">R$ {calcularValorTotal(orcamentos)}</p>
                                <p className="valor-total-info-aprovado">R$ {calcularValorTotal(orcamentos.filter(orc => orc.status === 'APROVADO'))}</p>
                                <p className="valor-total-info-reprovado">R$ {calcularValorTotal(orcamentos.filter(orc => orc.status === 'REPROVADO'))}</p>
                            </div>
                        </div>

                        <button className="btn-novo-orcamento" onClick={() => navigate('/orcamento/cadastro')}>Novo Orçamento</button>


                        <div className="lista-orcamentos-container card">
                            <div className="header-lista-orcamentos">
                                <h2>Mais recentes</h2>
                                <Link to="/orcamentos" className="link-secundario">
                                    <p>Ver mais</p>
                                </Link>
                            </div>

                            {orcamentos.length > 0 ? (
                                obterCincoOrcamentosMaisRecentes(orcamentos).map(orc => (
                                    <OrcamentoItem key={orc.id} orcamento={orc} misturado={true} />
                                ))
                            ) : (
                                <p className="texto-suave">Nenhum orçamento encontrado</p>
                            )}
                        </div>

                        {modalAvaliar && <ModalAvaliar fechar={() => setModalAvaliar(false)} />}
                    </div>
                </div>
            ) : (
                <Loading message="Carregando..." />
            )}
        </>
    );
}