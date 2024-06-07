import Cookies from 'universal-cookie';
const cookies = new Cookies();

const VerificaToken = async () => {
  try {
    const token = cookies.get('token');

    if (token) {
      const response = await fetch('https://sibae-5d2fe0c3da99.herokuapp.com/verificar-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Token válido. Autorizado');
        return true;
      } else {
        const data = await response.json();
        console.log('Falha na autenticação:', data.message);
        return false;
      }
    } else {
      console.log('Token não encontrado');
      return false;
    }
  } catch (error) {
    console.error('Erro durante a verificação de autenticação:', error);
    return false;
  }
};

export default VerificaToken;