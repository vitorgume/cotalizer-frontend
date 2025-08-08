import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import HeaderForms from '../../../components/headerForms/headerForms';
import './loginUsuario.css';
import { logarUsuario } from '../../../usuario.service';
import Loading from '../../../../orcamento/componentes/loading/Loading';
import { Link, useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../../../components/botaoGoogleLogin/botaoLoginGoogle';
import { notificarErro } from '../../../../../utils/notificacaoUtils';

export default function LoginUsuario() {
    const [email, setEmail] = useState<string | ''>('');
    const [senha, setSenha] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    async function logar(event: React.FormEvent) {
        event.preventDefault();            
        setLoading(true);

        try {
            setLoading(true);
            const usuarioLogado = await logarUsuario(email, senha);

            if (usuarioLogado.dado?.token) {
                localStorage.setItem('id-usuario', usuarioLogado.dado.usuarioId);
                localStorage.setItem('token', usuarioLogado.dado.token);
                navigate('/menu');
            } else {
                notificarErro('Credenciais incorretas. Tente novamente.');
            }
        } catch (error) {
            notificarErro('Não foi possível conectar. Verifique sua internet.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {loading ?
                <Loading message="Autenticando..." />
                : <div className='login-usuario-container'>
                    <HeaderForms
                        titulo='Bem vindo de volta'
                    />

                    <form className='form-login-usuario' onSubmit={logar}>
                        <InputPadrao
                            placeholder='Email'
                            value={email}
                            onChange={setEmail}
                            inativo={false}
                            senha={false}
                        />

                        <InputPadrao
                            placeholder='Senha'
                            value={senha}
                            onChange={setSenha}
                            inativo={false}
                            senha={true}
                        />
                        <Link
                            style={{ alignSelf: 'flex-start', color: '#3B82F6' }}
                            to={'http://localhost:5173/usuario/esqueceu-senha'}
                        >
                            <p>Esqueceu a senha ?</p>
                        </Link>

                        <button className='botao-gerar botao-entrar'>Entrar</button>
                    </form>
                    <GoogleLoginButton
                        label='Entrar com o Google'
                    />
                </div>
            }
        </div>
    );
}