import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetalhesOrcamento from './features/orcamento/pages/detalhes-orcamento/detalhesOrcamento';
import { ToastContainer } from 'react-toastify';
import ListagemOrcamentos from './features/orcamento/pages/listagem-ocamentos/listagemOrcamentos';
import CadastroOrcamento from './features/orcamento/pages/cadastro-orcamento/cadastroOrcamento';

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
            <Route path='/orcamento/:id' element={<DetalhesOrcamento/>} />
            <Route path='/orcamentos' element={<ListagemOrcamentos/>} />
            <Route path='/orcamento/cadastro' element={<CadastroOrcamento/>} />
        </Routes>
    </Router>
  )
}

export default App
