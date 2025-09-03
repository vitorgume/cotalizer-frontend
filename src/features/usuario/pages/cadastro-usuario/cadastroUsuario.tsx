import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import UploadLogo from '../../components/uploadLogo/uploadLogo';
import './cadastroUsuario.css';
import type Usuario from '../../../../models/usuario';
import { cadastrarLogoUsuario, cadastrarUsuario } from '../../usuario.service';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/loading';
import HeaderForms from '../../components/headerForms/headerForms';
import { identificarCpfOuCnpj } from '../../../../utils/identificarCpfCnpj';
import { notificarErro, notificarSucesso } from '../../../../utils/notificacaoUtils';
import GoogleLoginButton from '../../components/botaoGoogleLogin/botaoLoginGoogle';

function digitsOnly(v: string) {
    return v.replace(/\D/g, '');
}

export default function CadastroUsuario() {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [cpfCnpj, setCpfCnpj] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleLogoChange = (file: File | null) => setLogoFile(file);

    async function cadastrar(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim() || !email.trim() || !senha.trim()) {
            notificarErro('Preencha nome, e-mail e senha.');
            return;
        }

        const cleanDoc = digitsOnly(cpfCnpj);
        const tipo = identificarCpfOuCnpj(cleanDoc);

        if (cleanDoc && tipo !== 'CPF' && tipo !== 'CNPJ') {
            notificarErro('CPF/CNPJ inválido.');
            return;
        }

        let novoUsuario: Usuario = {
            nome,
            email,
            telefone: digitsOnly(telefone),
            cpf: tipo === 'CPF' ? cleanDoc : '',
            cnpj: tipo === 'CNPJ' ? cleanDoc : '',
            senha,
            plano: 'GRATIS',
            idCustomer: '',
            idAssinatura: '',
            url_logo: '',
            feedback: false,
            quantidade_orcamentos: 0
        };

        try {
            setLoading(true);

            const usuarioSalvo = await cadastrarUsuario(novoUsuario);

            if (usuarioSalvo?.dado?.id && logoFile) {
                await cadastrarLogoUsuario(usuarioSalvo.dado.id, logoFile);
            }

            notificarSucesso('Cadastro realizado!');
            navigate(`/validacao/email/${email}`);
        } catch (error) {
            console.error('Erro ao cadastrar usuário.', error);
            notificarErro('Não foi possível cadastrar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="signup-page">
            {loading ? (
                <Loading message="Cadastrando..." />
            ) : (
                <div className="signup-card glass-card">
                    <HeaderForms titulo="Cadastre-se" />
                    <form className="form-cadastro-usuario" onSubmit={cadastrar}>
                        <div className="grid-2">
                            <div className="form-field">
                                <label>Nome</label>
                                <InputPadrao
                                    placeholder="Seu nome completo"
                                    value={nome}
                                    onChange={setNome}
                                    inativo={false}
                                    senha={false}
                                    limiteCaracteres={100}
                                    mascara=""
                                />
                            </div>

                            <div className="form-field">
                                <label>E-mail</label>
                                <InputPadrao
                                    placeholder="seuemail@exemplo.com"
                                    value={email}
                                    onChange={setEmail}
                                    inativo={false}
                                    senha={false}
                                    limiteCaracteres={100}
                                    mascara=""
                                />
                            </div>

                            <div className="form-field">
                                <label>Telefone</label>
                                <InputPadrao
                                    placeholder="(00) 00000-0000"
                                    value={telefone}
                                    onChange={setTelefone}
                                    inativo={false}
                                    senha={false}
                                    limiteCaracteres={15}
                                    mascara="telefone"
                                />
                            </div>

                            <div className="form-field">
                                <label>CPF/CNPJ</label>
                                <InputPadrao
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    value={cpfCnpj}
                                    onChange={setCpfCnpj}
                                    inativo={false}
                                    senha={false}
                                    limiteCaracteres={14}
                                    mascara='cpfCnpj'
                                />
                            </div>

                            <div className="form-field full">
                                <label>Senha</label>
                                <InputPadrao
                                    placeholder="********"
                                    value={senha}
                                    onChange={setSenha}
                                    inativo={false}
                                    senha={true}
                                    limiteCaracteres={20}
                                    mascara=''
                                />
                            </div>
                        </div>

                        <div className="upload-logo-wrap">
                            <UploadLogo onLogoChange={handleLogoChange} />
                        </div>

                        <button type="submit" className="btn-primary btn-cadastrar">
                            Cadastrar
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>ou</span>
                    </div>

                    <div className="auth-alt">
                        <GoogleLoginButton label="Continue com o Google" />
                    </div> 

                    <div className="auth-footer">
                        <span>Já possui uma conta?</span>
                        <Link to="/usuario/login">Faça login</Link>
                    </div>
                </div>
            )}
        </div>
    );
}
