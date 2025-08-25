import { useEffect, useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './alterarSenha.css';
import Loading from '../../../orcamento/componentes/loading/Loading';
import { editarSenha } from '../../usuario.service';
import { useNavigate, useParams } from 'react-router-dom';
// (Opcional) se usar suas notificações:
// import { notificarErro, notificarSucesso } from '../../../../utils/notificacaoUtils';

export default function AlterarSenha() {
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [tokenSalvo, setTokenSalvo] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [finalizado, setFinalizado] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    setTokenSalvo(token ?? null);
  }, [token]);

  async function alterarSenha(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setErro(null);

    if (!tokenSalvo) {
      setErro('Link inválido ou expirado.');
      return;
    }
    if (!novaSenha || novaSenha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      setLoading(true);
      await editarSenha(novaSenha, tokenSalvo);
      // notificarSucesso?.('Senha alterada com sucesso!');
      setFinalizado(true);
    } catch (err) {
      // notificarErro?.('Não foi possível alterar sua senha.');
      setErro('Não foi possível alterar sua senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="senha-page">
        <div className="glass-card senha-card">
          <Loading message="Salvando..." />
        </div>
      </div>
    );
  }

  return (
    <div className="senha-page">
      {finalizado ? (
        <div className="glass-card senha-sucesso">
          <h2>Senha alterada com sucesso! 🎉</h2>
          <button className="btn-primary" onClick={() => navigate('/usuario/login')}>
            Fazer login
          </button>
        </div>
      ) : (
        <form className="glass-card senha-card" onSubmit={alterarSenha} noValidate>
          <header className="senha-header">
            <h1>Definir nova senha</h1>
            <p className="subtitle">Crie uma senha segura para acessar sua conta.</p>
          </header>

          <div className="senha-field">
            <label className="senha-label">Nova senha</label>
            <InputPadrao
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={setNovaSenha}
              inativo={false}
              senha={true}
              limiteCaracteres={20}
            />
            <small className="senha-hint">Mínimo de 6 caracteres.</small>
            {erro && <p className="msg-erro" role="alert">{erro}</p>}
          </div>

          <footer className="senha-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate('/usuario/login')}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !novaSenha || novaSenha.length < 6}
            >
              Continuar
            </button>
          </footer>
        </form>
      )}
    </div>
  );
}
