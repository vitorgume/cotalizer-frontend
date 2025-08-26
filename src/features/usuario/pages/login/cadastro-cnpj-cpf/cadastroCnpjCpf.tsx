import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './cadastroCnpjCpf.css';
import { useNavigate, useParams } from 'react-router-dom';
import { alterarCpfCnpj, consultarUsuarioPeloId } from '../../../usuario.service';
import { identificarCpfOuCnpj } from '../../../../../utils/identificarCpfCnpj';
import { notificarErro, notificarSucesso } from '../../../../../utils/notificacaoUtils';

function digitsOnly(v: string) {
    return v.replace(/\D/g, '');
}

function formatCpfCnpj(v: string) {
    const d = digitsOnly(v).slice(0, 14);
    if (d.length <= 11) {
        // CPF: 000.000.000-00
        return d
            .replace(/^(\d{3})(\d)/, '$1.$2')
            .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
    }
    // CNPJ: 00.000.000/0000-00
    return d
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d{1,2})$/, '$1.$2.$3/$4-$5');
}

export default function CadastroCnpjCpf() {
    const [cpfCnpj, setCpfCnpj] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const tipoDetectado = (() => {
        const d = digitsOnly(cpfCnpj);
        if (d.length === 11) return 'CPF';
        if (d.length === 14) return 'CNPJ';
        return '';
    })();

    async function cadastraCpfCnpj(e: React.FormEvent) {
        e.preventDefault();
        if (!id) return;

        const clean = digitsOnly(cpfCnpj);
        if (clean.length < 11) {
            notificarErro('Digite um CPF/CNPJ válido.');
            return;
        }

        try {
            setLoading(true);
            const usuario = await consultarUsuarioPeloId(id);
            if (!usuario || !usuario.dado) {
                notificarErro('Usuário não encontrado.');
                return;
            }

            const validacao = identificarCpfOuCnpj(clean); // sua util já identifica/valida
            if (validacao === 'CPF' && clean.length === 11) {
                usuario.dado.cpf = clean;
                usuario.dado.cnpj = usuario.dado.cnpj ?? '';
            } else if (validacao === 'CNPJ' && clean.length === 14) {
                usuario.dado.cnpj = clean;
                usuario.dado.cpf = usuario.dado.cpf ?? '';
            } else {
                notificarErro('Documento inválido.');
                return;
            }

            await alterarCpfCnpj(id, usuario.dado);
            notificarSucesso('Documento salvo com sucesso!');
            navigate('/menu');
        } catch (err) {
            console.error(err);
            notificarErro('Não foi possível salvar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="cpfcnpj-page">
            <div className="cpfcnpj-card glass-card">
                <form className="cpfcnpj-form" onSubmit={cadastraCpfCnpj}>
                    <div className="cpfcnpj-head">
                        <h1>Digite seu CPF/CNPJ</h1>
                        <p>Usaremos para gerar e identificar seus orçamentos.</p>
                    </div>

                    <div className="form-field">
                        <label className="label-cpfcnpj">CPF/CNPJ</label>
                        <InputPadrao
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            value={cpfCnpj}
                            onChange={(v) => setCpfCnpj(formatCpfCnpj(v))}
                            inativo={loading}
                            senha={false}
                            limiteCaracteres={14}
                            mascara={cpfCnpj.length > 11 ? 'cnpj' : 'cpf'}
                        />
                        <div className="hint-row">
                            <span className="small-info">
                                {tipoDetectado ? `Detectado: ${tipoDetectado}` : 'Digite 11 dígitos (CPF) ou 14 (CNPJ)'}
                            </span>
                        </div>
                    </div>

                    <div className="cpfcnpj-actions">
                        <button
                            type="button"
                            className="btn-ghost"
                            onClick={() => navigate('/menu')}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading || digitsOnly(cpfCnpj).length < 11}
                        >
                            {loading ? 'Salvando…' : 'Continuar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
