import { useState } from 'react'
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';

import Home from '../pages/Home'
import Login from '../pages/Login'

import VerificaToken from '../functions/VerificaToken'
import RotasProtegidas from '../functions/RotasProtegidas';
import NaoEncontrado from '../functions/NaoEncontrado';

const isAuthenticated = async () => {
  return await VerificaToken();
}

function App() {
  return (
    <>
      <Routes>
        <Route
              path="/"
              element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />}
            />

        <Route path="/login" element={<Login />} />
        <Route element={<RotasProtegidas/>} >
          <Route path="/home" element={<Home />} />

        </Route>

        <Route path="*" element={<NaoEncontrado />} />

        
      </Routes>
    </>
  )
}

export default App
