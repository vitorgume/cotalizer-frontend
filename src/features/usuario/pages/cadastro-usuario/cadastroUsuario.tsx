import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import './cadastroUsuario.css';
import Logo from '../../../../assets/ChatGPT_Image_6_de_jun._de_2025__14_33_15-removebg-preview 2.png';
import type Usuario from '../../../../models/usuario';
import { cadastrarUsuario } from '../../usuario.service';
import { useNavigate } from 'react-router-dom';

export default function CadastroUsuario() {
    const [nome, setNome] = useState<string | ''>('');
    const [email, setEmail] = useState<string | ''>('');
    const [telefone, setTelefone] = useState<string | ''>('');
    const [cpfCnpj, setCpfCnpj] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    
    const navigate = useNavigate();

    function identificarCpfOuCnpj(valor: string): 'CPF' | 'CNPJ' | 'Inválido' {
        const somenteNumeros = valor.replace(/\D/g, '');

        if (somenteNumeros.length === 11) {
            return 'CPF';
        } else if (somenteNumeros.length === 14) {
            return 'CNPJ';
        } else {
            return 'Inválido';
        }
    }

    async function cadastrar() {
        let novoUsuario: Usuario = {} as Usuario;
        const validacaoCpfCnpj = identificarCpfOuCnpj(cpfCnpj);

        if (validacaoCpfCnpj === 'CPF') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: cpfCnpj,
                cnpj: ''
            }
        } else if (validacaoCpfCnpj === 'CNPJ') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: '',
                cnpj: cpfCnpj
            }
        }

        try {
            setLoading(true);
            await cadastrarUsuario(novoUsuario);
        } catch(error) {
            console.error("Erro ao cadastrar usuário.");
        } finally {
            setLoading(false);
            navigate('/login');
        }
        
    }

    return (
        <div className='cadastro-usuario-container'>
            <header className='header-cadastro-usuario'>
                <div className='container-header-centralizado'>
                    <div className='div-header-cadastro-usuario'>
                        <img src={Logo} alt="Logo" />
                        <h1>OrçaJá</h1>
                    </div>
                    <h2>Cadastre-se</h2>
                </div>
            </header>

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

                <button className='botao-gerar botao-cadastrar-usuario'>Se cadastre</button>
            </form>
        </div>
    );
}