import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetalhesOrcamento from './features/orcamento/pages/detalhes-orcamento/detalhesOrcamento';
import { ToastContainer } from 'react-toastify';
import ListagemOrcamentos from './features/orcamento/pages/listagem-ocamentos/listagemOrcamentos';
import CadastroOrcamento from './features/orcamento/pages/cadastro-orcamento/cadastroOrcamento';
import Menu from './features/usuario/pages/menu/menu';
import CadastroUsuario from './features/usuario/pages/cadastro-usuario/cadastroUsuario';
import LoginUsuario from './features/usuario/pages/login/login-usuario/loginUsuario';
import LoginSucesso from './features/usuario/pages/login/loginSucesso/loginSucesso';
import CodigoValidacaoEmail from './features/usuario/pages/login/codigo-validacao-email/codigoValidacaoEmail';
import CadastroCnpjCpf from './features/usuario/pages/login/cadastro-cnpj-cpf/cadastroCnpjCpf';
import AlterarSenha from './features/usuario/pages/alterarSenha/alterarSenha';


function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
            <Route path='/orcamento/:id' element={<DetalhesOrcamento/>} />
            <Route path='/orcamentos' element={<ListagemOrcamentos/>} />
            <Route path='/orcamento/cadastro' element={<CadastroOrcamento/>} />
            <Route path='/menu' element={<Menu/>} />
            <Route path='/usuario/cadastro' element={<CadastroUsuario/>} />
            <Route path='/usuario/login' element={<LoginUsuario/>} />
            <Route path='/login/sucesso' element={<LoginSucesso/>} />
            <Route path='/validacao/email/:email' element={<CodigoValidacaoEmail />} />
            <Route path='/usuario/cadastro/cpf-cnpj/:id' element={<CadastroCnpjCpf />} />
            <Route path='/usuario/alterar/senha' element={<AlterarSenha />} />
        </Routes>
    </Router>
  )
}

export default App
