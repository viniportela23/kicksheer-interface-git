class ApiService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async request(endpoint, method = 'GET', data = null, isFormData = false) {
        let url = `${this.baseUrl}/${endpoint}`;
        const headers = {};
        const config = {
            method,
            headers,
            credentials: 'include'
        };

        // Para métodos GET, adiciona parâmetros na URL
        if (method === 'GET' && data) {
            const params = new URLSearchParams();
            Object.keys(data).forEach(key => {
                if (data[key] !== null && data[key] !== undefined) {
                    params.append(key, data[key]);
                }
            });
            url += `?${params.toString()}`;
        } 
        // Para outros métodos, trata o corpo normalmente
        else if (method !== 'GET') {
            headers['Content-Type'] = 'application/json';
            if (data) {
                config.body = JSON.stringify(data);
            }
        }

        // Adiciona token se existir
        const token = AuthService.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            headers['Token-Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro na requisição');
            }
            
            // Só atualiza o token se vier na resposta
            if (responseData.token) {
                AuthService.setToken(responseData.token);
            }

            return responseData;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }

    async login(username, password, remember) {
        return this.request('auth/login', 'POST', { username, password, remember });
    }

    async listaRepositorios(id = null, status = null) {
        return this.request('lista/repositorios', 'GET', { id ,status });
    }

    async addRepositorios(link_repositorio, diretorio, link_page, status) {
        return this.request('adiciona/repositorios', 'POST', { link_repositorio, diretorio, link_page, status });
    }

    async editRepositorio(id, status, link_repositorio = null, diretorio = null, link_page = null) {
        return this.request('update/repositorios', 'PUT', { id, link_repositorio, diretorio, link_page, status });
    }

    async acaoRepositorio(id, modo) {
        return this.request('acao/repositorios', 'PUT', { id, modo });
    }

    async deletRepositorio(id) {
        return this.request('deletar/repositorios', 'DELETE', { id });
    }
    
}