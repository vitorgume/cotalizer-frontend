import { useState } from 'react';
import './avaliacao.css';
import Notas from '../../components/notas/notas';
import { useNavigate, useParams } from 'react-router-dom';
import { avaliar } from '../../usuario.service';
import type Avaliacao from '../../../../models/avaliacao';
import { notificarErro } from '../../../../utils/notificacaoUtils';
import Loading from '../../../orcamento/componentes/loading/Loading';

export default function AvaliacaoForms() {
    const [nota, setNota] = useState<number | null>(null);
    const [motivo, setMotivo] = useState<string>('');
    const [sugestao, setSugestao] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [sucesso, setSucesso] = useState<boolean>(true);
    const [erroNota, setErroNota] = useState<string | null>(null);

    // const { id } = useParams<{ id: string }>();
    const id = '688cfe0eb8c5c4b505f38871'

    const navigate = useNavigate();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!id) return;
        if (nota === null) {
            setErroNota('Selecione uma nota de 0 a 10.');
            return;
        }

        const novaAvaliacao: Avaliacao = {
            idUsuario: id,
            nota,
            motivoNota: motivo,
            sugestaoMelhoria: sugestao
        };

        try {
            setLoading(true);
            setErroNota(null);
            await avaliar(novaAvaliacao);     // aguarda a API
            setSucesso(true);
        } catch (err) {
            console.error('Erro ao avaliar: ', err);
            notificarErro('Problema ao enviar avaliação');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='avaliacao-page'>
            {loading ? (
                <Loading message='Enviando avaliação' />
            ) : sucesso ? (
                <div className='avaliacao-sucesso'>
                    <h2>Obrigado pela sua avaliação!</h2>
                    <button className='botao-gerar' onClick={() => navigate('/menu')}>Voltar</button>
                </div>
            ) : (
                <form className='form-avaliacao' onSubmit={handleSubmit} noValidate>

                    <section className='section-avaliacao'>
                        <div className='enumciado-form-avaliacao'>
                            <label className='label-form-avaliacao'>
                                De <span className='acento'>0 a 10</span> qual a sua nota de <span className='acento'>experiência</span> com nosso site
                            </label>
                            <label className='subenunciado'>Obrigatório</label>
                        </div>

                        <div aria-describedby={erroNota ? 'erro-nota' : undefined} aria-invalid={!!erroNota}>
                            <Notas value={nota} onChange={(v) => { setNota(v); setErroNota(null); }} required />
                        </div>
                        {erroNota && <p id="erro-nota" className="msg-erro">{erroNota}</p>}

                        {nota !== null && nota >= 9 && (
                            <div className='avaliacao-google-container'>
                                <label className='label-form-avaliacao'>Nos avalie também no <span className='acento'>Google</span></label>
                                <button className='botao-gerar' type='button'>Avaliar</button>
                            </div>
                        )}
                    </section>

                    <section className='section-avaliacao'>
                        <div className='enumciado-form-avaliacao'>
                            <label className='label-form-avaliacao'>Motivo da sua <span className='acento'>nota</span> ?</label>
                            <label className='subenunciado'>Opcional</label>
                        </div>
                        <textarea
                            className='textarea-avaliacao'
                            name="avaliacao"
                            cols={30}
                            rows={10}
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                        />
                    </section>

                    <section className='section-avaliacao'>
                        <div className='enumciado-form-avaliacao'>
                            <label className='label-form-avaliacao'>Sugestão de <span className='acento'>melhoria</span></label>
                            <label className='subenunciado'>Opcional</label>
                        </div>
                        <textarea
                            className='textarea-avaliacao'
                            name="sugestao"
                            cols={30}
                            rows={10}
                            value={sugestao}
                            onChange={(e) => setSugestao(e.target.value)}
                        />
                    </section>

                    <div className='botoes-form-avaliacao'>
                        <button className='botao-cancelar' type='button'>Cancelar</button>
                        <button className='botao-gerar' type='submit' disabled={loading || nota === null}>
                            Enviar
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
