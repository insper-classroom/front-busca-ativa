import { useState, useEffect } from 'react'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login'

import HomeAdmin from './pages/Admin/HomeAdmin'
import HomeProfessor from './pages/Professor/HomeProfessor'
import HomeAgente from './pages/Agente/HomeAgente'

import EstaAutenticado from './functions/EstaAutenticado';
import NaoEncontrado from './functions/NaoEncontrado';
import permissaoUser from './functions/PermissaoUser';
import Logout from './functions/Logout';

function App() {  
  const [permissao, setPermissao] = useState(null);
  
  useEffect(() => {
    const verificarPermissao = async () => {
      const permissaoUsuario = await permissaoUser(); 
      console.log('Permissão do usuário:', permissaoUsuario);
      setPermissao(permissaoUsuario);
    };    
    verificarPermissao();
  }, []);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={permissao === null ? <Navigate to="/login" /> : <Navigate to="/home" />}
        />

        <Route path="/login" element={<Login />} />

        <Route element={<EstaAutenticado/>} >
          {permissao === 'Admin' && (
            // Colocar as páginas do admin aqui
            <Route path="/home" element={<HomeAdmin />} />

          )}

          {permissao === 'Professor' && (
            // Colocar as páginas do professor aqui
            <Route path="/home" element={<HomeProfessor />} />

          )}

          {permissao === 'Agente' && (
            // Colocar as páginas do agente aqui  
            <Route path="/home" element={<HomeAgente />} />

          )}

        </Route>
        
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
      <Logout />

    </>
  )
}

export default App
