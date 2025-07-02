import { useState } from 'react';
import InputPadrao from '../../../../orcamento/componentes/inputPadrao/inputPadrao';
import './cadastroCnpjCpf.css';
import { useNavigate, useParams } from 'react-router-dom';
import { alterarCpfCnpj, consultarUsuarioPeloId } from '../../../usuario.service';
import { identificarCpfOuCnpj } from '../../../../../utils/identificarCpfCnpj';

export default function CadastroCnpjCpf() {
    const [cpfCnpj, setcpfCnpj] = useState<string | ''>('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    async function cadastraCpfCnpj() {
        if (id) {
            const usuario = await consultarUsuarioPeloId(id);
            const validacaoCpfCnpj = identificarCpfOuCnpj(cpfCnpj);

            if (usuario && usuario.dado) {
                if (validacaoCpfCnpj === 'CPF') {
                    usuario.dado.cpf = cpfCnpj;
                } else if (validacaoCpfCnpj === 'CNPJ') {
                    usuario.dado.cnpj = cpfCnpj;
                }

                await alterarCpfCnpj(id, usuario.dado)
                navigate('/menu');
            }

        }
    }

    return (
        <div className='cadastro-cpfcnpj-page'>
            <div className='cadastro-cpfcnpj-container'>

                <p className='titulo-validacao-email'>Digite seu CPF/CNPJ ?</p>

                <InputPadrao
                    placeholder='CPF/CNPJ'
                    value={cpfCnpj}
                    onChange={setcpfCnpj}
                    inativo={false}
                />

                <button className='botao-gerar' onClick={cadastraCpfCnpj}>Continuar</button>
            </div>
        </div>
    );
}