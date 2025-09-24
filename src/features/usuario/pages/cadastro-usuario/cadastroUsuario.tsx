import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './cadastroUsuario.css';
import type Usuario from '../../../../models/usuario';
import { cadastrarUsuario } from '../../usuario.service';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/loading';
import HeaderForms from '../../components/headerForms/headerForms';
import { notificarErro, notificarSucesso } from '../../../../utils/notificacaoUtils';
import GoogleLoginButton from '../../components/botaoGoogleLogin/botaoLoginGoogle';

function digitsOnly(v: string) {
    return v.replace(/\D/g, '');
}

export default function CadastroUsuario() {
    const [nome, setNome] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [telefone, setTelefone] = useState<string>('');
    const [senha, setSenha] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();



    async function cadastrar(e: React.FormEvent) {
        e.preventDefault();

        if (!nome.trim() || !email.trim() || !senha.trim()) {
            notificarErro('Preencha nome, e-mail e senha.');
            return;
        }

        let novoUsuario: Usuario = {
            nome,
            email,
            telefone: digitsOnly(telefone),
            senha,
            plano: 'GRATIS',
            idCustomer: '',
            idAssinatura: '',
            url_logo: '',
            feedback: false,
            quantidade_orcamentos: 0,
            tipo_cadastro: 'TRADICIONAL',
            onboarding: false
        };

        try {
            setLoading(true);

            await cadastrarUsuario(novoUsuario);
            
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
                                    upperCase={true}
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
                                    upperCase={false}
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
                                    upperCase={true}
                                />
                            </div>

                            <div className="form-field">
                                <label>Senha</label>
                                <InputPadrao
                                    placeholder="********"
                                    value={senha}
                                    onChange={setSenha}
                                    inativo={false}
                                    senha={true}
                                    limiteCaracteres={20}
                                    mascara=''
                                    upperCase={true}
                                />
                            </div>
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
