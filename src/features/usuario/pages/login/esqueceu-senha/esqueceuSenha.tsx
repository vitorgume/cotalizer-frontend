import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './esqueceuSenha.css';
import { solicitarNovaSenha } from '../../../usuario.service';
import Loading from '../../../../orcamento/componentes/loading/Loading';

export default function EsqueceuSenha() {

    const [email, setEmail] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [finalizado, setFinalizado] = useState<boolean>(false);

    function solicitarAlteracaoSenha() {

        if (email) {
            try {
                setLoading(true);
                solicitarNovaSenha(email)
            } catch (err) {
                console.error('Erro ao solicitar nova senha', err);
            } finally {
                setLoading(false);
                setFinalizado(true);
            }

        }

    }

    return (

        <div className='page-esqueceu-senha'>
            {finalizado ?
                <div className='solicitacao-senha-finalizado'>
                    <p>Continue a sua recuperação de senha pelo seu email</p>
                </div>
                : (
                    <div className='container-esqueceu-senha'>

                        {loading ?
                            <Loading message='Enviando para o email...' />
                            : (
                                <form className='form-esqueceu-senha' onSubmit={solicitarAlteracaoSenha}>

                                    <p>Digite o email usado no cadastro da sua conta</p>
                                    <InputPadrao
                                        placeholder='Email'
                                        value={email}
                                        onChange={setEmail}
                                        inativo={false}
                                        senha={false}
                                    />

                                    <button className='botao-gerar'>Enviar</button>
                                </form>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}