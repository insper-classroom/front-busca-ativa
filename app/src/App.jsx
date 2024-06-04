import { useState, useEffect } from 'react'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

// Páginas Gerais
import Login from './pages/Login'

// Páginas do Admin
import HomeAdmin from './pages/Admin/HomeAdmin'
import Dashboard from './pages/Admin/Dashboard'
import UserControl from './pages/Admin/UserControl';
import CadastroUsuario from './pages/Admin/CadastroUsuario';
import AlunosAdmin from './pages/Admin/AlunosAdmin';
import CadastroAluno from './pages/Admin/CadastroAluno';
import DadosAlunos from './pages/Admin/DadosAlunos';

// Páginas do Professor
import HomeProfessor from './pages/Professor/HomeProfessor'

// Páginas do Agente
import HomeAgente from './pages/Agente/HomeAgente'

// Funções
import EstaAutenticado from './functions/EstaAutenticado';
import NaoEncontrado from './functions/NaoEncontrado';
import permissaoUser from './functions/PermissaoUser';
import Logout from './functions/Logout';
import { PaginaAluno } from './pages/PaginaAluno';

function App() {  
  const [permissao, setPermissao] = useState(null);
  const [verificandoPermissao, setVerificandoPermissao] = useState(true); 

  useEffect(() => {
    const verificarPermissao = async () => {
      const permissaoUsuario = await permissaoUser(); 
      console.log('Permissão do usuário:', permissaoUsuario);
      setPermissao(permissaoUsuario);
      setVerificandoPermissao(false);
    };    
    verificarPermissao();
  }, []);

  if (verificandoPermissao) {
    return <div></div>;
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={permissao === null ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />

        <Route path="/login" element={<Login />} />

        <Route element={<EstaAutenticado/>} >
          {permissao === 'ADMIN' && (
            // Colocar as páginas do admin aqui
            <>
            <Route path="/home" element={<HomeAdmin />} />
            <Route path="/usuarios" element={<UserControl />} />
            <Route path="/usuarios/criar" element={<CadastroUsuario />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alunos" element={<AlunosAdmin />} />
            <Route path="/alunos/:id" element={<DadosAlunos />} />
            <Route path="/alunos/criar" element={<CadastroAluno />} />
            <Route path="/paginaAluno" element={<PaginaAluno />} />
            </>
          )}

          {permissao === 'professor' && (
            // Colocar as páginas do professor aqui
            <>
            <Route path="/home" element={<HomeProfessor />} />
            </>
          )}

          {permissao === 'agente' && (
            // Colocar as páginas do agente aqui  
            <>
            <Route path="/home" element={<HomeAgente />} />
            </>
          )}

        </Route>

        <Route path="*" element={<NaoEncontrado />} />

      </Routes>
    </>
  )
}

export default App;