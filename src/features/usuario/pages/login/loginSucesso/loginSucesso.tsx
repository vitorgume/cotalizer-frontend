import { useEffect } from 'react';
import './loginSucesso.css';
import { useNavigate } from 'react-router-dom';
import { getId } from '../../../../../utils/idTokenUtil';

export default function LoginSucesso() {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (token) {
            localStorage.setItem('token', token);
    
            const idUsuario = getId(token);
            if (idUsuario) {
                localStorage.setItem('id-usuario', idUsuario);
            }

            navigate(`/usuario/cadastro/cpf-cnpj/${idUsuario}`, { replace: true });
        } else {
            const tokenExistente = localStorage.getItem('token');
            if (!tokenExistente) {
                navigate('/usuario/login');
            }
        }
    }, [navigate]);

    return <p>Redirecionando...</p>;
}