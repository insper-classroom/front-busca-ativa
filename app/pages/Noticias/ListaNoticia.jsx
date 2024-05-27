import { Button } from "@mui/material"
import { useEffect, useState } from "react"




export function ListarNoticias() {
    const [data, setData] = useState([])

    useEffect(() => {
      load()
    }, [])
  
    async function load() {
      let response = await fetch("http://localhost:8080/noticias", {method: "GET"})
  
      if (response.status >= 400) {
        return
      }
  
      let responseData = await response.json()
      
      setData(responseData)
    }


      return (
        <div className="card">
        <table>
          <tbody>
            <tr>
              <td>Id</td>
              <td>Titulo</td>
              <td>Texto</td>
              <td>Disponível</td>
              <td>Data</td>
            </tr>
            {data.map((noticia, index) => {
              
              return <tr key={index}>
              <td>{noticia.id}</td>
              <td>{noticia.titulo}</td>
              <td>{noticia.texto}</td>
              <td>{noticia.disponivel ? <p>Sim</p> : <p>Não</p>}</td>
              <td>{noticia.data}</td>
          </tr>
            })}
            
          </tbody>
        </table>
      </div>
      
      )
}