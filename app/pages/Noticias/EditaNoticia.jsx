import { Fragment, useState } from "react"
import { Button, IconButton, Snackbar } from '@mui/material'

/**
 * Function to handle the registration of a new course.
 */
export function EditarNoticias() {
    
    const [id, setId] = useState()
    const [texto, setTexto] = useState("")
    const [disponivel, setDisponivel] = useState()
  

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
    };

    const action = (
        <Fragment>
          <Button color="secondary" size="small" onClick={handleClose}>
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            
          </IconButton>
        </Fragment>
      );

    function click() {
        // Mudar AQUI ----------------------------
        let data = {
        "texto": texto,
        "disponivel": disponivel
        }
        //----------------------------------------

        fetch("http://localhost:8080/noticias/"+id, { // Mudar AQUI
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
            "Content-Type": "application/json"
            }
            }).then(response => {
            setOpen(true)
            }).catch(response => {
            alert("Erro ao editar noticia!") // Mudar AQUI
            alert(response.status)
        });
    }
    // Mudar AQUI ----------------------------
    return (
        <>    
            <div className="card">
                Id: <input type="number" value={id} onChange={e => setId(e.target.value)}></input><br></br>
                Texto: <input type="text" value={texto} onChange={e => setTexto(e.target.value)}></input><br></br>
                Disponivel: <input type="text" value={disponivel} onChange={e => setDisponivel(e.target.value)}></input><br></br>
                <Button onClick={() => click()} variant="outlined">Editar</Button>
            </div>
            <Snackbar
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose}
                message="Noticia editada com sucesso!"
                action={action}>
            </Snackbar>
        </>
    )
}