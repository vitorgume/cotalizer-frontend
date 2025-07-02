import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './cadastroUsuario.css';
import type Usuario from '../../../../models/usuario';
import { cadastrarUsuario } from '../../usuario.service';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/Loading';
import HeaderForms from '../../components/headerForms/headerForms';
import { identificarCpfOuCnpj } from '../../../../utils/identificarCpfCnpj';

export default function CadastroUsuario() {
    const [nome, setNome] = useState<string | ''>('');
    const [email, setEmail] = useState<string | ''>('');
    const [telefone, setTelefone] = useState<string | ''>('');
    const [cpfCnpj, setCpfCnpj] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [senha, setSenha] = useState<string | ''>('');

    const navigate = useNavigate();

    

    async function cadastrar() {
        let novoUsuario: Usuario = {} as Usuario;
        const validacaoCpfCnpj = identificarCpfOuCnpj(cpfCnpj);

        if (validacaoCpfCnpj === 'CPF') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: cpfCnpj,
                cnpj: '',
                senha: senha
            }
        } else if (validacaoCpfCnpj === 'CNPJ') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: '',
                cnpj: cpfCnpj,
                senha: senha
            }
        }

        try {
            setLoading(true);
            await cadastrarUsuario(novoUsuario);
        } catch (error) {
            console.error("Erro ao cadastrar usuário.");
        } finally {
            setLoading(false);
            navigate(`/validacao/email/${email}`);
        }

    }

    return (
        <div>

            {loading ? 
                <Loading message="Cadastrando..." />
            :
                <div className='cadastro-usuario-container'>
                    
                    <HeaderForms
                        titulo='Cadastre-se'

                    />

                    <form className='form-cadastro-usuario' action="" onSubmit={cadastrar}>
                        <InputPadrao
                            placeholder='Nome'
                            value={nome}
                            onChange={setNome}
                            inativo={false}
                        />

                        <InputPadrao
                            placeholder='Email'
                            value={email}
                            onChange={setEmail}
                            inativo={false}
                        />

                        <InputPadrao
                            placeholder='Telefone'
                            value={telefone}
                            onChange={setTelefone}
                            inativo={false}
                        />

                        <InputPadrao
                            placeholder='CPF/CNPJ'
                            value={cpfCnpj}
                            onChange={setCpfCnpj}
                            inativo={false}
                        />

                        <InputPadrao
                            placeholder='Senha'
                            value={senha}
                            onChange={setSenha}
                            inativo={false}
                        />

                        <button className='botao-gerar botao-cadastrar-usuario'>Cadastre-se</button>
                    </form>
                </div>
            }
        </div>
    );
}