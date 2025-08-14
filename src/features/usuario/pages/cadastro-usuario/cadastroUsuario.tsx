import { useState } from 'react';
import InputPadrao from '../../../orcamento/componentes/inputPadrao/inputPadrao';
import UploadLogo from '../../components/uploadLogo/uploadLogo'; // Importe o componente
import './cadastroUsuario.css';
import type Usuario from '../../../../models/usuario';
import { cadastrarLogoUsuario, cadastrarUsuario } from '../../usuario.service';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../orcamento/componentes/loading/Loading';
import HeaderForms from '../../components/headerForms/headerForms';
import { identificarCpfOuCnpj } from '../../../../utils/identificarCpfCnpj';
import GoogleLoginButton from '../../components/botaoGoogleLogin/botaoLoginGoogle';

export default function CadastroUsuario() {
    const [nome, setNome] = useState<string | ''>('');
    const [email, setEmail] = useState<string | ''>('');
    const [telefone, setTelefone] = useState<string | ''>('');
    const [cpfCnpj, setCpfCnpj] = useState<string | ''>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [senha, setSenha] = useState<string | ''>('');
    const [logoFile, setLogoFile] = useState<File | null>(null); 
    const navigate = useNavigate();

    const handleLogoChange = (file: File | null) => {
        setLogoFile(file);
    };

    async function cadastrar(e: React.FormEvent) {
        e.preventDefault();
        
        let novoUsuario: Usuario = {} as Usuario;
        const validacaoCpfCnpj = identificarCpfOuCnpj(cpfCnpj);
        
        if (validacaoCpfCnpj === 'CPF') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: cpfCnpj,
                cnpj: '',
                senha: senha,
                plano: 'GRATIS',
                idCustomer: '',
                idAssinatura: '',
                url_logo: '',
                feedback: false
            }
        } else if (validacaoCpfCnpj === 'CNPJ') {
            novoUsuario = {
                nome: nome,
                email: email,
                telefone: telefone,
                cpf: '',
                cnpj: cpfCnpj,
                senha: senha,
                plano: 'GRATIS',
                idCustomer: '',
                idAssinatura: '',
                url_logo: '',
                feedback: false
            }
        }

        try {
            setLoading(true);
            
        
            if (logoFile) {
                const formData = new FormData();
                
                formData.append('usuario', JSON.stringify(novoUsuario));
                formData.append('logo', logoFile);
                
                await cadastrarUsuarioComLogo(formData);
            } else {
                await cadastrarUsuario(novoUsuario);
            }
        } catch (error) {
            console.error("Erro ao cadastrar usuário.");
        } finally {
            setLoading(false);
            navigate(`/validacao/email/${email}`);
        }
    }

    // Função auxiliar para cadastro com logo (você precisará implementar no service)
    const cadastrarUsuarioComLogo = async (formData: FormData) => {
        
        console.log('FormData criado com logo:', formData.get('logo'));
        const usuarioData = JSON.parse(formData.get('usuario') as string);
        const usuarioSalvo = await cadastrarUsuario(usuarioData);

        if(usuarioSalvo.dado && logoFile) {
            if(usuarioSalvo.dado.id) {
                await cadastrarLogoUsuario(usuarioSalvo.dado.id, logoFile);
            }
        }
        
    };

    return (
        <div>
            {loading ?
                <Loading message="Cadastrando..." />
                :
                <div className='cadastro-usuario-container'>
                    <HeaderForms
                        titulo='Cadastre-se'
                    />
                    <form className='form-cadastro-usuario' onSubmit={cadastrar}>
                        <InputPadrao
                            placeholder='Nome'
                            value={nome}
                            onChange={setNome}
                            inativo={false}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder='Email'
                            value={email}
                            onChange={setEmail}
                            inativo={false}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder='Telefone'
                            value={telefone}
                            onChange={setTelefone}
                            inativo={false}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder='CPF/CNPJ'
                            value={cpfCnpj}
                            onChange={setCpfCnpj}
                            inativo={false}
                            senha={false}
                        />
                        <InputPadrao
                            placeholder='Senha'
                            value={senha}
                            onChange={setSenha}
                            inativo={false}
                            senha={true}
                        />
                        
                        <UploadLogo
                            onLogoChange={handleLogoChange}
                        />
                        
                        <button type="submit" className='botao-gerar botao-cadastrar-usuario'>
                            Cadastre-se
                        </button>
                    </form>
                    <hr />
                    <div className='login-info-container'>
                        <div className='text-login-info'>
                            <p>Já possui uma conta?</p>
                            <Link to='/usuario/login'>Faça login</Link>
                        </div>
                        <GoogleLoginButton
                            label='Continue com o Google'
                        />
                    </div>
                </div>
            }
        </div>
    );
}