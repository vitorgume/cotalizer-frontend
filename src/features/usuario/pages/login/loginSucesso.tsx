import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/loading';
import { hydrateAccessToken, setAccessToken } from '../../../../utils/axios';
import { obterMe } from '../../usuario.service';

export default function LoginSucesso() {
    const navigate = useNavigate();

    const location = useLocation();

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                const params = new URLSearchParams(location.search);
                const urlToken = params.get("token");
                if (urlToken) {
                    setAccessToken(urlToken);
                    window.history.replaceState({}, "", location.pathname);
                }

                await hydrateAccessToken();

                const me = await obterMe();
                const id = me.dado?.usuarioId;
                if (!id) throw new Error("Usuário não identificado");

                if (!alive) return;

                navigate(`/usuario/cadastro/cpf-cnpj/${id}`, { replace: true });
            } catch {
                if (!alive) return;
                navigate("/usuario/login", { replace: true });
            }
        })();

        return () => {
            alive = false;
        };
    }, [location, navigate]);


    return <Loading message="Redirecionando..." />;
}