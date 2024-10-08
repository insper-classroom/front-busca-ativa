import { useState, useEffect } from 'react';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Páginas Gerais
import Login from './pages/Login';

// Páginas do Admin
import HomeAdmin from './pages/Admin/HomeAdmin';
import Dashboard from './pages/Admin/Dashboard';
import UserControl from './pages/Admin/UserControl';
import CadastroUsuario from './pages/Admin/CadastroUsuario';

// Páginas do Professor
import HomeProfessor from './pages/Professor/HomeProfessor';
import AdicionarTarefa from './pages/Professor/Tarefas';

// Páginas do Agente
import HomeAgente from './pages/Agente/HomeAgente';

// Páginas Compartilhadas
import CadastroAluno from './pages/Compartilhadas/Agente&Admin/CadastroAluno';
import ListaAluno from './pages/Compartilhadas/Agente&Admin/ListaAluno';
import DadosAluno from './pages/Compartilhadas/Agente&Admin/DadosAluno';
import Casos from './pages/Compartilhadas/Agente&Admin/Casos';

// Funções
import EstaAutenticado from './functions/EstaAutenticado';
import NaoEncontrado from './functions/NaoEncontrado';
import permissaoUser from './functions/PermissaoUser';

/**
 * Componente principal da aplicação.
 * Gerencia as rotas e permissões de acesso dos usuários.
 */
function App() {
  const [permissao, setPermissao] = useState(null); // Estado para armazenar a permissão do usuário
  const [verificandoPermissao, setVerificandoPermissao] = useState(true); // Estado para verificar a permissão do usuário

  useEffect(() => {
    const verificarPermissao = async () => {
      const permissaoUsuario = await permissaoUser(); // Obtém a permissão do usuário
      console.log('Permissão do usuário:', permissaoUsuario);
      setPermissao(permissaoUsuario); // Armazena a permissão no estado
      setVerificandoPermissao(false); // Define que a verificação foi concluída
    };
    verificarPermissao();
  }, []);

  // Exibe um div vazio enquanto a permissão está sendo verificada
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
        <Route element={<EstaAutenticado />}>
          {permissao === 'ADMIN' && (
            // Rotas do admin
            <>
              <Route path="/home" element={<HomeAdmin />} />
              <Route path="/usuarios" element={<UserControl />} />
              <Route path="/usuarios/criar" element={<CadastroUsuario />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/alunos" element={<ListaAluno />} />
              <Route path="/alunos/:id" element={<DadosAluno />} />
              <Route path="/alunos/criar" element={<CadastroAluno />} />
              <Route path="/casos/:id" element={<Casos />} />
            </>
          )}
          {permissao === 'PROFESSOR' && (
            // Rotas do professor
            <>
              <Route path="/home" element={<HomeProfessor />} />
              <Route path="/tarefas/:id" element={<AdicionarTarefa />} />
            </>
          )}
          {permissao === 'AGENTE' && (
            // Rotas do agente
            <>
              <Route path="/home" element={<HomeAgente />} />
              <Route path="/alunos" element={<ListaAluno />} />
              <Route path="/alunos/:id" element={<DadosAluno />} />
              <Route path="/alunos/criar" element={<CadastroAluno />} />
              <Route path="/casos/:id" element={<Casos />} />
            </>
          )}
        </Route>
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </>
  );
}

export default App;
