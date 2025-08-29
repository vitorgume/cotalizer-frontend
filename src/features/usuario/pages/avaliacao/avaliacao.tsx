import { useState } from 'react';
import './avaliacao.css';
import Notas from '../../components/notas/notas';
import { useNavigate, useParams } from 'react-router-dom';
import { avaliar } from '../../usuario.service';
import type Avaliacao from '../../../../models/avaliacao';
import { notificarErro, notificarSucesso } from '../../../../utils/notificacaoUtils';
import Loading from '../../../orcamento/componentes/loading/loading';

export default function AvaliacaoForms() {
    const [nota, setNota] = useState<number | null>(null);
    const [motivo, setMotivo] = useState<string>('');
    const [sugestao, setSugestao] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [sucesso, setSucesso] = useState<boolean>(false);
    const [erroNota, setErroNota] = useState<string | null>(null);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const MAX_CARACTERES = 500;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!id) return;

        if (nota === null) {
            setErroNota('Selecione uma nota de 0 a 10.');
            requestAnimationFrame(() => {
                const first = document.querySelector<HTMLInputElement>('input[name="nota"]');
                first?.focus();
                first?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
            return;
        }

        const novaAvaliacao: Avaliacao = {
            idUsuario: id,
            nota,
            motivoNota: motivo,
            sugestaoMelhoria: sugestao,
        };

        try {
            setLoading(true);
            setErroNota(null);
            await avaliar(novaAvaliacao);
            notificarSucesso('Avaliação enviada! Obrigado ✨');
            setSucesso(true);
        } catch (err) {
            console.error('Erro ao avaliar: ', err);
            notificarErro('Problema ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="avaliacao-page">
            {loading ? (
                <Loading message="Enviando avaliação" />
            ) : sucesso ? (
                <div className="avaliacao-sucesso glass-card">
                    <h2>Obrigado pela sua avaliação! 🎉</h2>
                    <button className="btn-primary" onClick={() => navigate('/menu')}>Voltar</button>
                </div>
            ) : (
                <form className="avaliacao-card glass-card" onSubmit={handleSubmit} noValidate>
                    <header className="avaliacao-header">
                        <h1>Sua experiência</h1>
                        <p className="subtitle">Nos ajude a melhorar — leva menos de 1 minuto.</p>
                    </header>

                    {/* Bloco da nota */}
                    <section className="section-avaliacao">
                        <div className="enunciado">
                            <label className="label-form-avaliacao">
                                De <span className="acento">0 a 10</span>, qual a sua nota de <span className="acento">experiência</span>?
                            </label>
                            <span className="subenunciado">Obrigatório</span>
                        </div>

                        <div
                            aria-describedby={erroNota ? 'erro-nota' : undefined}
                            aria-invalid={!!erroNota}
                            className="notas-wrapper"
                        >
                            <Notas value={nota} onChange={(v) => { setNota(v); setErroNota(null); }} required />
                        </div>
                        {erroNota && <p id="erro-nota" className="msg-erro" role="alert">{erroNota}</p>}

                        {nota !== null && nota >= 9 && (
                            <div className="avaliacao-google-container">
                                <label className="label-form-avaliacao">
                                    Curtiu? Deixe também sua avaliação no <span className="acento">Google</span>
                                </label>
                                <a
                                    className="btn-secondary"
                                    href="https://www.google.com/search?q=avaliar+empresa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Avaliar no Google
                                </a>
                            </div>
                        )}
                    </section>

                    {/* Motivo */}
                    <section className="section-avaliacao">
                        <div className="enunciado">
                            <label className="label-form-avaliacao">Motivo da sua <span className="acento">nota</span></label>
                            <span className="subenunciado">Opcional</span>
                        </div>
                        <textarea
                            className="textarea-avaliacao"
                            name="avaliacao"
                            placeholder="Conte um pouco sobre o que funcionou (ou não) para você…"
                            rows={8}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            maxLength={MAX_CARACTERES}
                        />
                    </section>

                    {/* Sugestão */}
                    <section className="section-avaliacao">
                        <div className="enunciado">
                            <label className="label-form-avaliacao">Sugestão de <span className="acento">melhoria</span></label>
                            <span className="subenunciado">Opcional</span>
                        </div>
                        <textarea
                            className="textarea-avaliacao"
                            name="sugestao"
                            placeholder="Tem alguma ideia específica que poderíamos implementar?"
                            rows={8}
                            value={sugestao}
                            onChange={(e) => setSugestao(e.target.value)}
                            maxLength={MAX_CARACTERES}
                        />
                    </section>

                    <footer className="botoes-form-avaliacao">
                        <button className="btn-ghost" type="button" onClick={() => navigate('/menu')}>
                            Cancelar
                        </button>
                        <button className="btn-primary" type="submit" disabled={loading}>
                            Enviar
                        </button>
                    </footer>
                </form>
            )}
        </div>
    );
}
