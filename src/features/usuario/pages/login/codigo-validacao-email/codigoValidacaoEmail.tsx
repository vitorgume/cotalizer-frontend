import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './codigoValidacaoEmail.css';
import { reenviarCodigoEmail, verificarCodigo } from '../../../usuario.service';
import { useNavigate, useParams } from 'react-router-dom';
import { notificarErro, notificarSucesso } from '../../../../../utils/notificacaoUtils';

export default function CodigoValidacaoEmail() {
  const [codigo, setCodigo] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();

  const handleCodigoChange = (v: string) => {
    // mantém apenas dígitos e limita a 6
    const onlyDigits = v.replace(/\D/g, '').slice(0, 6);
    setCodigo(onlyDigits);
  };

  async function validarCodigo(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !codigo) return;

    try {
      setLoading(true);
      const verificaoEmail = { email, codigo };
      const response = await verificarCodigo(verificaoEmail);

      if (response?.erro) {
        notificarErro('Código inválido');
      } else {
        notificarSucesso('Código validado com sucesso!');
        navigate('/usuario/login');
      }
    } catch (err) {
      notificarErro('Não foi possível validar o código. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function reenviarCodigo() {
    if (!email) return;
    try {
      setReenviando(true);
      await reenviarCodigoEmail(email);
      notificarSucesso('Código reenviado para seu email.');
    } catch (err) {
      notificarErro('Falha ao reenviar o código. Tente novamente.');
      console.error(err);
    } finally {
      setReenviando(false);
    }
  }

  return (
    <div className="val-email-page">
      <div className="val-card glass-card" role="dialog" aria-modal="true">
        <form className="val-form" onSubmit={validarCodigo}>
          <div className="val-head">
            <h1>Confirme seu email</h1>
            <p>
              Enviamos um código para <strong>{email}</strong>. Insira-o abaixo
              para continuar.
            </p>
          </div>

          <div className="form-field">
            <label className="label-val">Código</label>
            <InputPadrao
              placeholder="000000"
              value={codigo}
              onChange={handleCodigoChange}
              inativo={false}
              senha={false}
              limiteCaracteres={6}
            />
            <span className="small-info">Dica: verifique a caixa de spam.</span>
          </div>

          <div className="val-actions">
            <button
              type="button"
              className="link-resend"
              onClick={reenviarCodigo}
              disabled={reenviando}
            >
              {reenviando ? 'Reenviando...' : 'Reenviar código'}
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || codigo.length < 4}
            >
              {loading ? 'Validando...' : 'Continuar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
