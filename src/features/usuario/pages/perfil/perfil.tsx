import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao'
import UploadLogo from '../../components/uploadLogo/uploadLogo'
import MetricaQuantidadeOrcamento from '../../components/metricaQuantidadeOrcamento/metricaQuantidadeOrcamento'
import { consultarUsuarioPeloId, atualizarUsuario } from '../../usuario.service'
import { listarPorUsuario, listarTradicionaisPorUsuario } from '../../../orcamento/orcamento.service'
import { cancelarAssinatura } from '../../pagamento.service'
import { cadastrarLogoUsuario } from '../../usuario.service'
import { notificarSucesso } from '../../../../utils/notificacaoUtils'
import type Usuario from '../../../../models/usuario'
import type Orcamento from '../../../../models/orcamento'
import './perfil.css'
import type { OrcamentoTradicional } from '../../../../models/orcamentoTradicional'

export default function Perfil() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [orcamentosIA, setOrcamentosIA] = useState<Orcamento[]>([]);
    const [orcamentosTradicional, setOrcamentoTradicional] = useState<OrcamentoTradicional[]>([])
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        nome: '',
        email: '',
        telefone: '',
        cpf: '',
        cnpj: ''
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [originalEmail, setOriginalEmail] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        const id = localStorage.getItem('id-usuario')!;
        async function init() {
            const respUser = await consultarUsuarioPeloId(id);
            console.log('Usuário: ', respUser);
            if (respUser.dado) {
                const u = respUser.dado;
                setUsuario(u);
                setOriginalEmail(u.email);
                setForm({
                    nome: u.nome,
                    email: u.email,
                    telefone: u.telefone,
                    cpf: u.cpf || '',
                    cnpj: u.cnpj || ''
                });
            }
            const respOrcs = await listarPorUsuario(id);
            if (respOrcs.dado?.content) {
                setOrcamentosIA(respOrcs.dado.content);
            }

            const respoOrcsTrad = await listarTradicionaisPorUsuario(id);
            if(respoOrcsTrad.dado?.content) {
                setOrcamentoTradicional(respoOrcsTrad.dado.content);
            }
        }
        init();
    }, [])

    function onEdit() {
        setIsEditing(true);
    }

    function onCancel() {
        if (usuario) {
            setForm({
                nome: usuario.nome,
                email: usuario.email,
                telefone: usuario.telefone,
                cpf: usuario.cpf || '',
                cnpj: usuario.cnpj || ''
            });
            setLogoFile(null);
        }
        setIsEditing(false);
    }

    async function onSave() {
        if (!usuario) return;

        const emailChanged = form.email !== originalEmail;

        if (usuario.id) {
            await atualizarUsuario(usuario.id, {
                nome: form.nome,
                email: form.email,
                telefone: form.telefone,
                cpf: form.cpf,
                cnpj: form.cnpj,
                senha: usuario.senha,
                plano: usuario.plano,
                idCustomer: usuario.idCustomer,
                idAssinatura: usuario.idAssinatura,
                url_logo: usuario.url_logo,
                feedback: usuario.feedback
            });
        }

        if (logoFile && usuario.id) {
            await cadastrarLogoUsuario(usuario.id, logoFile);
        }

        if (emailChanged) {
            navigate(`/validacao/email/${form.email}`);
            return;
        }

        if (usuario.id) {
            const resp = await consultarUsuarioPeloId(usuario.id);


            if (resp.dado) {
                setUsuario(resp.dado)
                setForm({
                    nome: resp.dado.nome,
                    email: resp.dado.email,
                    telefone: resp.dado.telefone,
                    cpf: resp.dado.cpf || '',
                    cnpj: resp.dado.cnpj || ''
                });
            }
        }
        notificarSucesso('Perfil atualizado com sucesso!');
        setLogoFile(null);
        setIsEditing(false);
    }

    const handleChange = (field: keyof typeof form) => (value: string) => {
        setForm({ ...form, [field]: value });
    }
    const handleLogoChange = (file: File | null) => {
        setLogoFile(file);
    }

    async function cancelar() {
        const idUsuario = localStorage.getItem('id-usuario');
        if (idUsuario) {
            await cancelarAssinatura(idUsuario);
            notificarSucesso('Assinatura cancelada com sucesso!');
        }
    }

    const obterPlanoPlus = () => navigate('/usuario/forms-cartao');

    return (
        <div className="page-perfil">
            <h1>Sua conta</h1>

            <div className="perfil-header">
                <div className="perfil-logo">
                    {usuario?.url_logo
                        ? <img src={usuario.url_logo} alt="Logo do Usuário" />
                        : <div className="placeholder-logo">Sem logo</div>
                    }
                </div>
                {!isEditing
                    ? <button onClick={onEdit} className="btn-editar-perfil">Editar</button>
                    : (
                        <>
                            <button onClick={onSave} className="btn-salvar-perfil">Salvar</button>
                            <button onClick={onCancel} className="btn-cancelar-edicao">Cancelar</button>
                        </>
                    )
                }
            </div>

            {isEditing && (
                <UploadLogo onLogoChange={handleLogoChange} />
            )}

            {/* Dados do Usuário */}
            <section className="sec-dados">
                <h3>Seus dados</h3>
                {usuario ? (
                    <div className="div-inputs">
                        <InputPadrao
                            placeholder="Nome"
                            value={form.nome}
                            onChange={handleChange('nome')}
                            inativo={!isEditing}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange('email')}
                            inativo={!isEditing}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder="Telefone"
                            value={form.telefone}
                            onChange={handleChange('telefone')}
                            inativo={!isEditing}
                            senha={false}
                        />
                        {form.cpf
                            ? (
                                <InputPadrao
                                    placeholder="CPF"
                                    value={form.cpf}
                                    onChange={handleChange('cpf')}
                                    inativo={!isEditing}
                                    senha={false}
                                />
                            ) : (
                                <InputPadrao
                                    placeholder="CNPJ"
                                    value={form.cnpj}
                                    onChange={handleChange('cnpj')}
                                    inativo={!isEditing}
                                    senha={false}
                                />
                            )
                        }
                    </div>
                ) : <p>Usuário não encontrado</p>}
            </section>

            {usuario && (
                <section className="sec-assinatura">
                    <div className="header-sec-assinatura">
                        <h3>Assinatura</h3>
                        {usuario.plano === 'GRATIS'
                            ? <p>Gratuito</p>
                            : <p className="text-assinatura-plus">Assinatura Plus</p>
                        }
                    </div>

                    <div className="metricas-sec-assinatura">
                        <p>Limite orçamentos</p>
                        <MetricaQuantidadeOrcamento
                            usado={orcamentosIA.length + orcamentosTradicional.length}
                            limite={usuario.plano === 'GRATIS' ? 5 : 100}
                        />
                    </div>

                    {usuario.plano === 'GRATIS'
                        ? <button onClick={obterPlanoPlus} className="botao-gerar">Obter Plus</button>
                        : (
                            <div className="div-botoes-assinatura">
                                <button
                                    onClick={() => window.location.href = "https://wa.me/554391899898"}
                                    className="botao-gerar"
                                >
                                    Plano personalizado
                                </button>
                                <button onClick={cancelar} className="botao-cancelar-assinatura">
                                    Cancelar assinatura
                                </button>
                            </div>
                        )
                    }
                </section>
            )}
        </div>
    );
}
