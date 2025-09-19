// Perfil.tsx
import { useEffect, useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type Usuario from '../../../../models/usuario'
import { notificarSucesso } from '../../../../utils/notificacaoUtils'
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao'
import MetricaQuantidadeOrcamento from '../../components/metricaQuantidadeOrcamento/metricaQuantidadeOrcamento'
import UploadLogo from '../../components/uploadLogo/uploadLogo'
import { cancelarAssinatura } from '../../pagamento.service'
import { atualizarUsuario, cadastrarLogoUsuario, consultarUsuarioPeloId, obterMe } from '../../usuario.service'

import { serverLogout } from '../../../../utils/axios'

import AssinaturaForms from '../assinatura/assinaturaForms'
import './perfil.css'
import { BotaoVoltar } from '../../components/botaoVoltar/botaoVoltar'
import Planos from '../../components/planos/planos'

export default function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [originalEmail, setOriginalEmail] = useState<string>('');
    const [abrirAssinatura, setAbrirAssinatura] = useState(false);
    const [planos, setPlanos] = useState<boolean>(false);
    const [shouldScrollPlanos, setShouldScrollPlanos] = useState<boolean>(false);
    const [planoSelecionado, setPlanoSelecionado] = useState<string>('');
    const [limite, setLimite] = useState<number>(0);
    const [planoFormatado, setPlanoFormatado] = useState<string>('');

    const planosRef = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const sp = new URLSearchParams(location.search);
        if (sp.get('tab') === 'planos') setPlanos(true);
        if (sp.get('scroll') === '1') setShouldScrollPlanos(true);
        if (sp.get('tab') === 'logo') setIsEditing(true);
    }, [location.search]);

    useEffect(() => {
        if (!planos || !shouldScrollPlanos) return;

        const doScroll = () => {
            planosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        };

        // 2 RAFs para esperar layout pintar…
        const raf1 = requestAnimationFrame(() => {
            const raf2 = requestAnimationFrame(() => {
                doScroll();
            });
            // fallback adicional se algo subir a página depois
            const t1 = setTimeout(doScroll, 120);
            const t2 = setTimeout(doScroll, 320);

            // cleanup
            return () => {
                cancelAnimationFrame(raf2);
                clearTimeout(t1);
                clearTimeout(t2);
            };
        });

        // zera a flag (evita tentar de novo em updates menores)
        const clearFlag = setTimeout(() => setShouldScrollPlanos(false), 400);

        return () => {
            cancelAnimationFrame(raf1);
            clearTimeout(clearFlag);
        };
    }, [planos, shouldScrollPlanos]);

    useEffect(() => {
        async function obterIdUsuario(): Promise<string | undefined> {
            const resp = await obterMe();
            return resp.dado?.usuarioId;
        }

        function carregarLimite(usuario: Usuario) {
            if (usuario) {
                switch (usuario.plano) {
                    case 'GRATIS': {
                        setPlanoFormatado('Plano Gratuito');
                        setLimite(5);
                        break;
                    }
                    case 'PLUS': {
                        setPlanoFormatado('Plano Plus');
                        setLimite(100);
                        break;
                    }
                    case 'ENTERPRISE': {
                        setPlanoFormatado('Plano Enterprise');
                        setLimite(5000);
                        break;
                    }
                }
            }
        }

        (async () => {
            const id = await obterIdUsuario();
            if (!id) {
                navigate('/menu');
                return;
            }
            async function init() {
                const respUser = await consultarUsuarioPeloId(id || '');
                if (respUser.dado) {
                    const u = respUser.dado;
                    carregarLimite(u);
                    setUsuario(u);
                    setOriginalEmail(u.email);
                    setForm({
                        nome: u.nome, email: u.email, telefone: u.telefone
                    });
                }
            }
            init();
        })();
    }, []);

    async function recarregarUsuario() {
        const id = await obterMe().then(resp => resp.dado?.usuarioId);
        if (!id) return;
        const resp = await consultarUsuarioPeloId(id);
        if (resp.dado) setUsuario(resp.dado);
    }

    function onEdit() { setIsEditing(true); }
    function onCancel() {
        if (usuario) {
            setForm({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone });
            setLogoFile(null);
        }
        setIsEditing(false);
    }

    async function onSave() {
        if (!usuario) return;
        const emailChanged = form.email !== originalEmail;

        if (usuario.id) {
            await atualizarUsuario(usuario.id, {
                nome: form.nome, email: form.email, telefone: form.telefone,
                senha: usuario.senha, plano: usuario.plano, idCustomer: usuario.idCustomer, idAssinatura: usuario.idAssinatura,
                url_logo: usuario.url_logo, feedback: usuario.feedback, quantidade_orcamentos: usuario.quantidade_orcamentos,
                tipo_cadastro: usuario.tipo_cadastro
            });
        }

        if (logoFile && usuario.id) await cadastrarLogoUsuario(usuario.id, logoFile);

        if (emailChanged) {
            navigate(`/validacao/email/${form.email}`);
            return;
        }

        if (usuario.id) {
            const resp = await consultarUsuarioPeloId(usuario.id);
            if (resp.dado) {
                setUsuario(resp.dado);
                setForm({
                    nome: resp.dado.nome, email: resp.dado.email, telefone: resp.dado.telefone
                });
            }
        }
        notificarSucesso('Perfil atualizado com sucesso!');
        setLogoFile(null);
        setIsEditing(false);
    }

    const handleChange = (field: keyof typeof form) => (value: string) => setForm({ ...form, [field]: value });
    const handleLogoChange = (file: File | null) => setLogoFile(file);

    async function cancelar() {
        if (usuario && usuario.id) {
            await cancelarAssinatura(usuario.id);
            notificarSucesso('Assinatura cancelada com sucesso!');
        }
    }

    // ⬇️ Handler de logout
    async function onLogout() {
        try {
            await serverLogout();
        } finally {
            // Limpa estados locais e vai para login
            setUsuario(null);
            setForm({ nome: '', email: '', telefone: '' });
            setLogoFile(null);
            setIsEditing(false);
            notificarSucesso('Você saiu da sua conta.');
            window.location.href = 'https://cotalizer.com'
        }
    }

    return (
        <div className="page-perfil cotalizer-theme">
            <header className="perfil-header glass-card">
                <div className="perfil-identidade">
                    <div className="perfil-logo">
                        {usuario?.url_logo
                            ? <img src={usuario.url_logo} alt="Logo do Usuário" />
                            : <div className="placeholder-logo">Sem logo</div>}
                    </div>
                    <div className="perfil-titulos">
                        <h1>Sua conta</h1>
                        {usuario && (
                            <p className="perfil-subtitulo">{usuario.nome} • {usuario.email}</p>
                        )}
                        {usuario && (
                            <span className={`badge-plano ${usuario.plano === 'GRATIS' ? 'badge-free' : 'badge-plus'}`}>
                                {planoFormatado}
                            </span>
                        )}
                    </div>
                </div>

                <div className="perfil-acoes">
                    {!isEditing ? (
                        <>
                            <button onClick={onEdit} className="btn primary-outline">Editar</button>
                        </>
                    ) : (
                        <>
                            <button onClick={onSave} className="btn primary-solid">Salvar</button>
                            <button onClick={onCancel} className="btn danger-ghost">Cancelar</button>
                        </>
                    )}
                </div>

                <BotaoVoltar absolute={true} />

                {/* Botão fixo no canto superior direito */}
                <button
                    onClick={onLogout}
                    className="btn danger-ghost btn-logout-topright btn-sair"
                    aria-label="Sair da conta"
                    title="Sair"
                >
                    Sair
                </button>
            </header>


            {isEditing && (
                <div className="upload-logo-container glass-card">
                    <UploadLogo onLogoChange={handleLogoChange} />
                </div>
            )}

            <section className="sec-dados glass-card">
                <h3>Seus dados</h3>
                {usuario ? (
                    <div className="div-inputs">
                        <InputPadrao
                            placeholder="Nome"
                            value={form.nome}
                            onChange={handleChange('nome')}
                            inativo={!isEditing}
                            senha={false}
                            limiteCaracteres={100}
                            mascara=''
                            upperCase={true}
                        />
                        <InputPadrao
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange('email')}
                            inativo={!isEditing}
                            senha={false}
                            limiteCaracteres={100}
                            mascara=''
                            upperCase={false}
                        />
                        <InputPadrao
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange('telefone')}
                            inativo={!isEditing}
                            senha={false}
                            limiteCaracteres={14}
                            mascara='telefone'
                            upperCase={true}
                        />
                    </div>
                ) : <p>Usuário não encontrado</p>}
            </section>

            {usuario && (
                <section className="sec-assinatura glass-card">
                    <div className="header-sec-assinatura">
                        <h3>Assinatura</h3>
                        <p className={usuario.plano === 'GRATIS' ? 'plano-free' : 'text-assinatura-plus'}>
                            {planoFormatado}
                        </p>
                    </div>

                    <div className="metricas-sec-assinatura">
                        <div className="metricas-head">
                            <p>Limite de orçamentos</p>
                            <span className="pill-usage">{usuario.quantidade_orcamentos}/{limite}</span>
                        </div>
                        <MetricaQuantidadeOrcamento usado={usuario.quantidade_orcamentos} limite={limite} />
                    </div>


                    {planos ? (
                        <button onClick={() => setPlanos(false)} className="btn primary-solid">
                            Fechar
                        </button>
                    ) : (
                        (() => {
                            switch (usuario.plano) {
                                case "GRATIS":
                                    return (
                                        <button onClick={() => setPlanos(true)} className="btn primary-solid">
                                            Obter Plus
                                        </button>
                                    );
                                case "PLUS":
                                    return (
                                        <>
                                            <button onClick={() => setPlanos(true)} className="btn primary-solid">
                                                Obter Enterprise
                                            </button>
                                            <button onClick={cancelar} className="btn danger-ghost">
                                                Cancelar assinatura
                                            </button>
                                        </>
                                    );
                                case "ENTERPRISE":
                                    return (
                                        <>
                                            <button onClick={() => setPlanos(true)} className="btn primary-solid">
                                                Ver planos
                                            </button>
                                            <button onClick={cancelar} className="btn danger-ghost">
                                                Cancelar assinatura
                                            </button>
                                        </>
                                    );
                                default:
                                    return null;
                            }
                        })()
                    )}
                </section>
            )}

            {planos && usuario &&
                <div id="planos" ref={planosRef} className="ancora-planos">
                    <Planos
                        onAssinar={() => setAbrirAssinatura(true)}
                        open={planos}
                        onPlanoSelecionado={setPlanoSelecionado}
                        usuario={usuario}
                    />
                </div>
            }

            {usuario && (
                <AssinaturaForms
                    open={abrirAssinatura}
                    onClose={() => setAbrirAssinatura(false)}
                    idUsuario={usuario.id!}
                    emailInicial={usuario.email}
                    nomeInicial={usuario.nome}
                    onAssinou={recarregarUsuario}
                    plano={planoSelecionado}
                />
            )}
        </div>
    );
}
