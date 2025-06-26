import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import HeaderForms from '../../components/headerForms/headerForms';
import './loginUsuario.css';
import { logarUsuario } from '../../usuario.service';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { useNavigate } from 'react-router-dom';

export default function LoginUsuario() {
    const [email, setEmail] = useState<string | ''>('');
    const [senha, setSenha] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    async function logar() {
        try {
            setLoading(true);
            const usuarioLogado = await logarUsuario(email, senha);

            if (usuarioLogado.dado) {
                localStorage.setItem('id-usuario', usuarioLogado.dado.usuarioId);
                localStorage.setItem('token', usuarioLogado.dado.token);
            }
        } catch (error) {
            console.error("Erro ao autenticar usuario.");
        } finally {
            setLoading(false);
            navigate('/menu');
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
                        />

                        <InputPadrao
                            placeholder='Senha'
                            value={senha}
                            onChange={setSenha}
                            inativo={false}
                        />

                        <button className='botao-gerar botao-entrar'>Entrar</button>
                    </form>
                </div>
            }
        </div>
    );
}