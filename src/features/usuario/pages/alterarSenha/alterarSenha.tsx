import { useEffect, useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './alterarSenha.css';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { editarSenha } from '../../usuario.service';
import { useParams } from 'react-router-dom';

export default function AlterarSenha() {
  const [novaSenha, setNovaSenha] = useState<string | ''>('');
  const [tokenSalvo, setTokenSalvo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [finalizado, setFinalizado] = useState<boolean>(false);

  const { token } = useParams<{ token: string }>();

  useEffect(() => {

    console.log(token);

    if (token)
      setTokenSalvo(token);

  }, []);

  function alterarSenha() {
    if (tokenSalvo) {



      try {
        editarSenha(novaSenha, tokenSalvo);
        setLoading(true);
      } finally {
        setLoading(false);
        setFinalizado(true);
      }

    }

  }

  return (
    <div>
      {finalizado ?
        <div className='solicitacao-senha-finalizado'>
          <p>Senha alterada com sucesso !</p>
        </div>
        : (
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
        )
      }
    </div>
  );
}