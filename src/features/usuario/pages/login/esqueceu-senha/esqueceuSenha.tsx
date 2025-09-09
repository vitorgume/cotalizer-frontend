import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './esqueceuSenha.css';
import { solicitarNovaSenha } from '../../../usuario.service';
import Loading from '../../../../orcamento/componentes/loading/loading';
import { notificarErro, notificarSucesso } from '../../../../../utils/notificacaoUtils';

export default function EsqueceuSenha() {
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [finalizado, setFinalizado] = useState<boolean>(false);

    async function solicitarAlteracaoSenha(e: React.FormEvent) {
        e.preventDefault();
        if (!email) return;
        try {
            setLoading(true);
            await solicitarNovaSenha(email);
            setFinalizado(true);
            notificarSucesso('Enviamos um link de recuperação para seu email.');
        } catch (err) {
            notificarErro('Não foi possível enviar o email. Tente novamente.');
            console.error('Erro ao solicitar nova senha', err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="forgot-page">
            {loading ? (
                <Loading message="Enviando para o email..." />
            ) : (
                <div className="forgot-card glass-card" role="dialog" aria-modal="true">
                    {!finalizado ? (
                        <form className="forgot-form" onSubmit={solicitarAlteracaoSenha}>
                            <div className="forgot-head">
                                <h1>Recuperar acesso</h1>
                                <p>Informe o email cadastrado para enviarmos o link de recuperação.</p>
                            </div>

                            <div className="form-field">
                                <label className="label-forgot">Email</label>
                                <InputPadrao
                                    placeholder="seuemail@exemplo.com"
                                    value={email}
                                    onChange={setEmail}
                                    inativo={false}
                                    senha={false}
                                    limiteCaracteres={100}
                                    mascara=''
                                    upperCase={false}
                                />
                            </div>

                            <button type="submit" className="btn-enviar">Enviar link</button>
                        </form>
                    ) : (
                        <div className="forgot-success">
                            <h2>Verifique sua caixa de entrada</h2>
                            <p>
                                Enviamos um email com instruções para redefinir sua senha.
                                Se não encontrar, confira também a pasta de spam.
                            </p>
                            <button className="btn-enviar" onClick={() => setFinalizado(false)}>
                                Enviar outro email
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
