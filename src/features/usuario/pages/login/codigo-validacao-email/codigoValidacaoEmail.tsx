import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './codigoValidacaoEmail.css';
import { reenviarCodigoEmail, verificarCodigo } from '../../../usuario.service';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notificarErro, notificarSucesso } from '../../../../../utils/notificacaoUtils';

export default function CodigoValidacaoEmail() {
    const [codigo, setCodigo] = useState<string | ''>('');
    const { email } = useParams<{ email: string }>();

    const navigate = useNavigate()

    async function validarCodigo() {
        if (email) {

            const verificaoEmail = {
                email: email,
                codigo: codigo 
            }

            const response = await verificarCodigo(verificaoEmail);

            if (response.erro) {
                notificarErro('Código inválido');
            } else {
                notificarSucesso('Código válido');
                navigate('/usuario/login');
            }
        }
    }

    async function reenviarCodigo() {
        if (email) {
            await reenviarCodigoEmail(email);
            notificarSucesso('Código enviado com sucesso');
        }
    }


    return (
        <div className='validacao-email-page'>
            <div className='validacao-email-container'>
                <div className='text-validaco-email-container'>
                    <p className='titulo-validacao-email'>Enviamos um código para o email <strong>{email}</strong></p>
                    <p>Insira o código</p>
                </div>

                <InputPadrao
                    placeholder='66554'
                    value={codigo}
                    onChange={setCodigo}
                    inativo={false}
                    senha={false}
                />

                <a href='#' onClick={reenviarCodigo}>Enviar novamente código</a>


                <button className='botao-gerar' onClick={validarCodigo}>Continuar</button>
            </div>
        </div>
    );
}