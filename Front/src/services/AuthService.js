import axios from 'axios';

class AuthService {
    static isAuthenticated() {
        // Verifica se o usuário está autenticado

            return !!localStorage.getItem('token');

    }
    static async login(username, password, selectedOption) {
        const rg = username
        const password1 = password
        const jsonData = {
            rg: rg,
            password: password1,
        };
        let endpoint = '';

        switch (selectedOption) {
            case 'Medico':
                endpoint = 'http://localhost:8080/medico/sigin';
                break;
            case 'Gestor':
                endpoint = 'http://localhost:8080/gestor/sigin';
                break;
            default:
                alert('Selecione Medico ou Gestor');
                break;
        }
        if (endpoint) {
            const res = await axios.post(endpoint, jsonData);
            return new Promise(async (resolve, reject) => {
                try {
                    setTimeout(() => {
                        if (res.data.accessToken != null) {
                            localStorage.setItem('token', res.data.accessToken);
                            localStorage.setItem('rg', jsonData.rg)
                            resolve(); // Resolve the promise after successful Axios request
                        } else {
                            reject(new Error('Credenciais inválidas'));
                        }
                    }, 1000);
                } catch (error) {
                    console.error('Erro ao fazer a solicitação POST:', error);
                    reject(error); // Reject the promise in case of an Axios error
                }
            });
        }
        // Simula uma requisição assíncrona de login
        //res.data.data; // '{"answer":42}'
        //res.data.headers['Content-Type'];

    }
    static logout() {
        // Desautentica o usuário
        localStorage.removeItem('token');
    }
}
export default AuthService;