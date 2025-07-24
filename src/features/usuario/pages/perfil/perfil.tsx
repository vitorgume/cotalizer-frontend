import { useEffect, useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import MetricaQuantidadeOrcamento from '../../components/metricaQuantidadeOrcamento/metricaQuantidadeOrcamento';
import './perfil.css';
import type Usuario from '../../../../models/usuario';
import { consultarUsuarioPeloId } from '../../usuario.service';
import { listarPorUsuario } from '../../../orcamento/orcamento.service';
import type Orcamento from '../../../../models/orcamento';
import { useNavigate } from 'react-router-dom';
import { cancelarAssinatura } from '../../pagamento.service';
import { notificarSucesso } from '../../../../utils/notificacaoUtils';

export default function Perfil() {

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [orcamentos, setOrcamentos] = useState<Orcamento[] | []>([])

    const navigate = useNavigate();

    useEffect(() => {
        async function carregarUsuario(id: string) {
            const usuarioConsultado = await consultarUsuarioPeloId(id);

            if (usuarioConsultado.dado) {
                setUsuario(usuarioConsultado.dado);
            }
        }

        async function carregarOrcamentos(id:string) {
            const orcamentos = await listarPorUsuario(id);

            if(orcamentos.dado && orcamentos.dado.content) {
                setOrcamentos(orcamentos.dado.content);
            }
        }

        const id = localStorage.getItem('id-usuario');

        if (id) {
            carregarUsuario(id);
            carregarOrcamentos(id);
        }
    }, [])

    async function cancelar() {

        const idUsuario = localStorage.getItem('id-usuario');

        if(idUsuario) {
            await cancelarAssinatura(idUsuario);
        }

        notificarSucesso('Assinatura cancelada com sucesso !')
    }

    function obterPlanoPlus() {
        navigate('/usuario/forms-cartao');
    }
    
    return (
        <div className='page-perfil'>
            <h1>Sua conta</h1>

            <section className='sec-dados'>
                <h3>Seus dados</h3>

                {usuario ? (
                    <div className='div-inputs'>
                        <InputPadrao
                            placeholder={usuario.nome}
                            value=''
                            onChange={() => { }}
                            inativo={true}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder={usuario.email}
                            value=''
                            onChange={() => { }}
                            inativo={true}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder={usuario.telefone}
                            value=''
                            onChange={() => { }}
                            inativo={true}
                            senha={false}
                        />
                        {usuario.cpf
                            ? (
                                <InputPadrao
                                    placeholder={usuario.cpf}
                                    value=''
                                    onChange={() => { }}
                                    inativo={true}
                                    senha={false}
                                />
                            )
                            : (
                                <InputPadrao
                                    placeholder={usuario.cnpj}
                                    value=''
                                    onChange={() => { }}
                                    inativo={true}
                                    senha={false}
                                />
                            )
                        }

                    </div>
                ) : <p>Usuário não encontrado</p>
                }
            </section>

            {usuario && (
                <section className='sec-assinatura'>
                    <div className='header-sec-assinatura'>
                        <h3>Assinatura</h3>

                        {usuario.plano === 'GRATIS'
                            ? <p>Gratuito</p>
                            : <p className='text-assinatura-plus'>Assinatura Plus</p>
                        }

                    </div>

                    <div className='metricas-sec-assinatura'>
                        <p>Limite orçamentos</p>
                        {usuario.plano === 'GRATIS'
                            ? <MetricaQuantidadeOrcamento
                                usado={orcamentos.length}
                                limite={5}
                            />
                            : <MetricaQuantidadeOrcamento
                                usado={orcamentos.length}
                                limite={100}
                            />
                        }
                    </div>

                    {usuario.plano === 'GRATIS'
                        ? <button onClick={obterPlanoPlus} className='botao-gerar'>Obter Plus</button>
                        :
                        (
                            <div className='div-botoes-assinatura'>
                                <button onClick={() => window.location.href="https://wa.me/554391899898"} className='botao-gerar'>Plano personalizado</button>
                                <button onClick={cancelar} className='botao-cancelar-assinatura'>Cancelar assinatura</button>
                            </div>
                        )
                    }

                </section>
            )}

        </div>
    )
}