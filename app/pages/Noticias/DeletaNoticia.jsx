import { Fragment, useState, useEffect } from "react";
import { Button, IconButton, Snackbar } from '@mui/material';

export function DeletaNoticias() {
    const [data, setData] = useState([]);
    const [id, setId] = useState("");

    useEffect(() => {
        load();
    }, []);

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

    async function load() {
        try {
            const response = await fetch("http://localhost:8080/noticia", {
                method: "GET"
            });
            if (!response.ok) {
                throw new Error("Erro ao carregar noticias!");
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }

    async function delete_(id, index) {
        let options = {
          method: "DELETE",
        }
    
        let response = await fetch("http://localhost:8080/noticias/" + id, options)
    
        if (response.status >= 400) {
          toast.error("Não foi possível apagar a noticias")
          return
        }
    
        toast.success("Noticia deletada com sucesso!")
    
        data.splice(index, 1)
        setData([...data])
        
      }

    return (
        <>    
            <div className="card">
                Id: <input type="number" value={id} onChange={e => setId(e.target.value)}></input><br></br>
                <Button variant="contained" color="error" onClick={() => delete_(id)}>Delete</Button>
            </div>
            <Snackbar
                open={open} 
                autoHideDuration={6000} 
                onClose={handleClose}
                message="Noticia cadastrado com sucesso!"
                action={action}>
            </Snackbar>
            
        </>
    );
}
