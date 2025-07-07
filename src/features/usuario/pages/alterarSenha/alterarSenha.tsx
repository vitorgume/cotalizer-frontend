import { useEffect, useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './alterarSenha.css';
import Loading from '../../../orcamento/componentes/loading/Loading';

export default function AlterarSenha() {
  const [novaSenha, setNovaSenha] = useState<string | ''>('');
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenUrl = params.get('token');
    setToken(tokenUrl);
  }, []);

  function alterarSenha() {
    if (token) {

      const idUsuario = localStorage.getItem('id-usuario');

      if (idUsuario) {
        try {
          editarSenha(idUsuario, novaSenha, token);
          setLoading(true);
        } finally {
          setLoading(false);
        }
      }
    }

  }

  return (
    <div>
      {loading ?
        (
          <Loading message="Salvando..." />

        ) :
        (
          <div className='cadastro-nova-senha-page'>
            <div className='cadastro-nova-senha-container'>

              <p className='titulo-validacao-email'>Digite sua nova senha</p>

              <InputPadrao
                placeholder='Senha'
                value={novaSenha}
                onChange={setNovaSenha}
                inativo={false}
                senha={false}
              />

              <button className='botao-gerar' onClick={alterarSenha}>Continuar</button>
            </div>
          </div>
        )
      }
    </div>
  );
}