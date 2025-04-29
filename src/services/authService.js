import axios from 'axios';

// URL base da API
const API_URL = process.env.REACT_APP_API_S; 

// Função para fazer login
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/login`, { email, password });
        const { accessToken } = response.data;

        // Armazenar o access token no localStorage
        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    } catch (error) {
        console.error("Erro ao fazer login:", error.response?.data || error.message);
        throw error;
    }
};

export const checkAccessToken = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        try{
            const response = await axios.post(API_URL+'/api/token/verify', {
                token: accessToken,
            });
            if (response.status === 200) {
                return true;
            } 
        }
        catch (error){
            console.error(error);
        }
    }
    console.log("Sem token de acesso")
    try {
        axios.defaults.withCredentials = true;
        const response = await axios.post(`${API_URL}/api/token/refresh`, {
            withCredentials: true,
          });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

// Função para fazer logout
export const logout = async () => {
    // Remover o access token do localStorage
    localStorage.removeItem('accessToken');
    await axios.get(`${API_URL}/api/logout`, {
        withCredentials: true,
    });    
};

export const accessAuthApi = (type,endpoint,data = null) =>{
    const accessToken = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${accessToken}`,}
    if (checkAccessToken()){
        switch(type){
            case 'GET':
                return axios.get(`${API_URL}${endpoint}`, { params: data || {}, headers: headers });
            case 'POST':
                return axios.post(`${API_URL}${endpoint}`, data, { headers:headers });
            case 'PUT':
                return axios.put(`${API_URL}${endpoint}`, data, { headers:headers });
            case 'DELETE':
                return axios.delete(`${API_URL}${endpoint}`, { params: data || {}, headers:headers });
            default:
                throw new Error("Type wrong in request")
        }
    } else {
        return Promise.reject(new Error("Erro ao fazer requisição: Faça login novamente"));
    }
};
