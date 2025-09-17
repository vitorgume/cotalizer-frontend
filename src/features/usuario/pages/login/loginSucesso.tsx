import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/loading';
import { hydrateAccessToken } from '../../../../utils/axios';
import { obterMe } from '../../usuario.service';

export default function LoginSucesso() {
    const navigate = useNavigate();

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                
                await hydrateAccessToken();

                const me = await obterMe();
                const id = me.dado?.usuarioId;
                if (!id) throw new Error('Usuário não identificado');

                if (!alive) return;

                navigate('/menu');
            } catch {
                if (!alive) return;
                navigate('/usuario/login', { replace: true });
            }
        })();
        return () => { alive = false; };
    }, [navigate]);

    return <Loading message="Redirecionando..." />;
}