import { useState, useEffect } from 'react'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

// Páginas Gerais
import Login from './pages/Login'

// Páginas do Admin
import HomeAdmin from './pages/Admin/HomeAdmin'
import Dashboard from './pages/Admin/Dashboard'
import UserControl from './pages/Admin/UserControl';
import Cadastro from './pages/Admin/Cadastro';
import AlunosAdmin from './pages/Admin/AlunosAdmin';

// Páginas do Professor
import HomeProfessor from './pages/Professor/HomeProfessor'

// Páginas do Agente
import HomeAgente from './pages/Agente/HomeAgente'

// Funções
import EstaAutenticado from './functions/EstaAutenticado';
import NaoEncontrado from './functions/NaoEncontrado';
import permissaoUser from './functions/PermissaoUser';

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
            <Route path="/usuarios/criar" element={<Cadastro />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/alunos" element={<AlunosAdmin />} />
            </>
          )}

          {permissao === 'PROFESSOR' && (
            // Colocar as páginas do professor aqui
            <>
            <Route path="/home" element={<HomeProfessor />} />
            </>
          )}

          {permissao === 'AGENTE' && (
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