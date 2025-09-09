import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import HeaderForms from '../../../components/headerForms/headerForms';
import './loginUsuario.css';
import { logarUsuario } from '../../../usuario.service';
import Loading from '../../../../orcamento/componentes/loading/loading';
import { Link, useNavigate } from 'react-router-dom';
import { notificarErro } from '../../../../../utils/notificacaoUtils';
import GoogleLoginButton from '../../../components/botaoGoogleLogin/botaoLoginGoogle';

export default function LoginUsuario() {
    const [email, setEmail] = useState<string | ''>('');
    const [senha, setSenha] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    async function logar(event: React.FormEvent) {
        event.preventDefault();
        setLoading(true);

        try {
            const usuarioLogado = await logarUsuario(email, senha);
            if (usuarioLogado.dado?.token) {
                navigate('/menu');
            } else {
                notificarErro('Credenciais incorretas. Tente novamente.');
            }
        } catch {
            notificarErro('Não foi possível conectar. Verifique sua internet.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <Loading message="Autenticando..." />;

    return (
        <div className="login-page">
            <div className="login-card glass-card">
                <HeaderForms titulo="Bem-vindo de volta" />

                <form className="form-login-usuario" onSubmit={logar}>
                    <div className="form-field">
                        <label className="label-login">Email</label>
                        <InputPadrao
                            placeholder="seuemail@exemplo.com"
                            value={email}
                            onChange={setEmail}
                            inativo={false}
                            senha={false}
                            limiteCaracteres={100}
                            mascara=''
                            upperCase={false}
                        />
                    </div>

                    <div className="form-field">
                        <label className="label-login">Senha</label>
                        <InputPadrao
                            placeholder="••••••••"
                            value={senha}
                            onChange={setSenha}
                            inativo={false}
                            senha={true}
                            limiteCaracteres={20}
                            mascara=''
                            upperCase={true}
                        />
                    </div>

                    <div className="row-aux">
                        <Link to="/usuario/esqueceu-senha" className="link-esqueceu">
                            Esqueceu a senha?
                        </Link>
                    </div>

                    <button type="submit" className="btn-entrar">Entrar</button>

                    <div className="divider">
                        <span>ou</span>
                    </div>

                    <div className="google-wrapper">
                        <GoogleLoginButton label="Entrar com o Google" />
                    </div> 
                </form>
            </div>
        </div>
    );
}