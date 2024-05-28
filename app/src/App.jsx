import { useState, useEffect } from 'react'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from './pages/Login'

import HomeAdmin from './pages/Admin/HomeAdmin'
import HomeProfessor from './pages/Professor/HomeProfessor'
import HomeAgente from './pages/Agente/HomeAgente'

import VerificaToken from './functions/VerificaToken'
import EstaAutenticado from './functions/EstaAutenticado';
import NaoEncontrado from './functions/NaoEncontrado';
import permissaoUser from './functions/PermissaoUser';

const isAuthenticated = async () => {
  return await VerificaToken();
} 

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
          {permissao === 'admin' && (
            // Colocar as páginas do admin aqui
            <Route path="/home" element={<HomeAdmin />} />
          )}
          {permissao === 'professor' && (
            // Colocar as páginas do professor aqui
            <Route path="/home" element={<HomeProfessor />} />

          )}
          {permissao === 'agente' && (
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
export default App;
