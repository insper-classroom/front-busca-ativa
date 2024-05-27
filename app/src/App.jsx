import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Grid } from '@mui/material'
import './App.css'
import { CadastrarNoticias } from '../pages/Noticias/CadastraNoticia'
import { ListarNoticias } from '../pages/Noticias/ListaNoticia'
import { EditarNoticias } from '../pages/Noticias/EditaNoticia'
import { BrowserRouter } from 'react-router-dom'
import { DeletaNoticias } from '../pages/Noticias/DeletaNoticia'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Grid container>
      <Grid item xs={20}>
          <Grid item xs={12}>
            <Link to="/">Home</Link>
          </Grid>

          <Grid item xs={12}>
            <Link to="/cadastrarNoticia">Cadastrar Noticia</Link>
          </Grid>

          <Grid item xs={12}>
            <Link to="/listarNoticias">Listar Noticias</Link>
          </Grid>

          <Grid item xs={12}>
            <Link to="/editarNoticia">Editar Noticia</Link>
          </Grid>

          <Grid item xs={12}>
            <Link to="/deletarNoticia">Deletar Noticia</Link>
          </Grid>



        </Grid>
      
      
        <Grid item xs={8}>
          <Routes>
            <Route path="/cadastrarNoticia" element={<CadastrarNoticias />} />
            <Route path="/listarNoticias" element={<ListarNoticias/>} />
            <Route path="/editarNoticia" element={<EditarNoticias/>} />
            <Route path="/deletarNoticia" element={<DeletaNoticias/>} />
          </Routes>
        </Grid>
      </Grid>
    </>
  )
}

export default App
