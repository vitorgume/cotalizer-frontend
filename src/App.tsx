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
import EsqueceuSenha from './features/usuario/pages/login/esqueceu-senha/esqueceuSenha';
import Perfil from './features/usuario/pages/perfil/perfil';
import AssinaturaForms from './features/usuario/pages/assinatura/assinaturaForms';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CadastroOrcamentoTradicional from './features/orcamento/pages/cadastro-orcamento-tradicional/cadastroOrcamentoTradicional';
import DetalhesOrcamentoTradicional from './features/orcamento/pages/detalhes-orcamento-tradicional/detalhesOrcamentoTradicional';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path='/orcamento/:id' element={<DetalhesOrcamento />} />
          <Route path='/orcamentos' element={<ListagemOrcamentos />} />
          <Route path='/orcamento/cadastro' element={<CadastroOrcamento />} />
          <Route path='/orcamento/tradicional/cadastro' element={<CadastroOrcamentoTradicional />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/usuario/cadastro' element={<CadastroUsuario />} />
          <Route path='/usuario/login' element={<LoginUsuario />} />
          <Route path='/login/sucesso' element={<LoginSucesso />} />
          <Route path='/validacao/email/:email' element={<CodigoValidacaoEmail />} />
          <Route path='/usuario/cadastro/cpf-cnpj/:id' element={<CadastroCnpjCpf />} />
          <Route path='/usuario/alterar/senha/:token' element={<AlterarSenha />} />
          <Route path='/usuario/esqueceu-senha' element={<EsqueceuSenha />} />
          <Route path='/usuario/perfil' element={<Perfil />} />
          <Route path='/usuario/forms-cartao' element={<AssinaturaForms />} />
          <Route path='/orcamento/tradicional/:id' element={<DetalhesOrcamentoTradicional />} />
        </Routes>
      </Router>
    </Elements>
  )
}

export default App
