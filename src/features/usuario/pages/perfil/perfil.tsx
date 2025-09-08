import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type Usuario from '../../../../models/usuario'
import { notificarSucesso } from '../../../../utils/notificacaoUtils'
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao'
import MetricaQuantidadeOrcamento from '../../components/metricaQuantidadeOrcamento/metricaQuantidadeOrcamento'
import UploadLogo from '../../components/uploadLogo/uploadLogo'
import { cancelarAssinatura } from '../../pagamento.service'
import { atualizarUsuario, cadastrarLogoUsuario, consultarUsuarioPeloId, obterMe } from '../../usuario.service'
import AssinaturaForms from '../assinatura/assinaturaForms'
import './perfil.css'

export default function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({ nome: '', email: '', telefone: '', cpf: '', cnpj: '' });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [originalEmail, setOriginalEmail] = useState<string>('');
    const [abrirAssinatura, setAbrirAssinatura] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function obterIdUsuario(): Promise<string | undefined> {
            const resp = await obterMe();
            return resp.dado?.usuarioId;
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
                    setUsuario(u);
                    setOriginalEmail(u.email);
                    setForm({
                        nome: u.nome, email: u.email, telefone: u.telefone, cpf: u.cpf || '', cnpj: u.cnpj || ''
                    });
                }
            }
            init();
        })();


    }, [])

    async function recarregarUsuario() {
        const id = await obterMe().then(resp => resp.dado?.usuarioId);

        if(!id) return;

        const resp = await consultarUsuarioPeloId(id);
        if (resp.dado) setUsuario(resp.dado);
    }

    function onEdit() { setIsEditing(true); }
    function onCancel() {
        if (usuario) {
            setForm({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone, cpf: usuario.cpf || '', cnpj: usuario.cnpj || '' });
            setLogoFile(null);
        }
        setIsEditing(false);
    }

    async function onSave() {
        if (!usuario) return;
        const emailChanged = form.email !== originalEmail;

        if (usuario.id) {
            await atualizarUsuario(usuario.id, {
                nome: form.nome, email: form.email, telefone: form.telefone, cpf: form.cpf, cnpj: form.cnpj,
                senha: usuario.senha, plano: usuario.plano, idCustomer: usuario.idCustomer, idAssinatura: usuario.idAssinatura,
                url_logo: usuario.url_logo, feedback: usuario.feedback, quantidade_orcamentos: usuario.quantidade_orcamentos
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
                    nome: resp.dado.nome, email: resp.dado.email, telefone: resp.dado.telefone,
                    cpf: resp.dado.cpf || '', cnpj: resp.dado.cnpj || ''
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

    const limite = usuario?.plano === 'GRATIS' ? 5 : 100;

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
                                {usuario.plano === 'GRATIS' ? 'Plano Grátis' : 'Assinatura Plus'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="perfil-acoes">
                    {!isEditing ? (
                        <button onClick={onEdit} className="btn primary-outline">Editar</button>
                    ) : (
                        <>
                            <button onClick={onSave} className="btn primary-solid">Salvar</button>
                            <button onClick={onCancel} className="btn danger-ghost">Cancelar</button>
                        </>
                    )}
                </div>
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
                        />
                        <InputPadrao
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange('email')}
                            inativo={!isEditing}
                            senha={false}
                            limiteCaracteres={100}
                            mascara=''
                        />
                        <InputPadrao
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange('telefone')}
                            inativo={!isEditing}
                            senha={false}
                            limiteCaracteres={14}
                            mascara='telefone'
                        />
                        {form.cpf ? (
                            <InputPadrao
                                placeholder="CPF"
                                value={form.cpf}
                                onChange={handleChange('cpf')}
                                inativo={!isEditing}
                                senha={false}
                                limiteCaracteres={10}
                                mascara='cpf'
                            />
                        ) : (
                            <InputPadrao
                                placeholder="CNPJ"
                                value={form.cnpj}
                                onChange={handleChange('cnpj')}
                                inativo={!isEditing}
                                senha={false}
                                limiteCaracteres={14}
                                mascara='cnpj'
                            />
                        )}
                    </div>
                ) : <p>Usuário não encontrado</p>}
            </section>

            {usuario && (
                <section className="sec-assinatura glass-card">
                    <div className="header-sec-assinatura">
                        <h3>Assinatura</h3>
                        <p className={usuario.plano === 'GRATIS' ? 'plano-free' : 'text-assinatura-plus'}>
                            {usuario.plano === 'GRATIS' ? 'Gratuito' : 'Assinatura Plus'}
                        </p>
                    </div>

                    <div className="metricas-sec-assinatura">
                        <div className="metricas-head">
                            <p>Limite de orçamentos</p>
                            <span className="pill-usage">{usuario.quantidade_orcamentos}/{limite}</span>
                        </div>
                        <MetricaQuantidadeOrcamento usado={usuario.quantidade_orcamentos} limite={limite} />
                    </div>

                    {usuario.plano === 'GRATIS' ? (
                        <button onClick={() => setAbrirAssinatura(true)} className="btn primary-solid">Obter Plus</button>
                    ) : (
                        <div className="div-botoes-assinatura">
                            <button
                                onClick={() => window.location.href = "https://wa.me/554391899898"}
                                className="btn primary-outline"
                            >
                                Plano personalizado
                            </button>
                            <button onClick={cancelar} className="btn danger-ghost">
                                Cancelar assinatura
                            </button>
                        </div>
                    )}
                </section>
            )}

            {usuario && (
                <AssinaturaForms
                    open={abrirAssinatura}
                    onClose={() => setAbrirAssinatura(false)}
                    idUsuario={usuario.id!}
                    emailInicial={usuario.email}
                    nomeInicial={usuario.nome}
                    onAssinou={recarregarUsuario}
                />
            )}
        </div>
    );
}
