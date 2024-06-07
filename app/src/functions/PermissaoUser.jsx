import Cookies from 'universal-cookie';
const cookies = new Cookies();

const permissaoUser = async () => {
    try {
        const token = cookies.get('token');
        
        if (token) {
            const response = await fetch(`https://sibae-5d2fe0c3da99.herokuapp.com/usuarios-permissao`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ token })
            });

            if (response.ok) {
                const data = await response.json();
                cookies.set('permissao', data.permissao);
                return data.permissao;
            } else {
                console.error('Erro na resposta da API', response.statusText);
                return null;
            }
        } else {
            console.error('Token não encontrado');
            return null;
        }
    } catch (error) {
        console.error('Erro na requisição', error);
        return null;
    }
};

export default permissaoUser;