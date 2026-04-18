const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const config = { ...defaultOptions, ...options };
    if (config.body && typeof config.body === 'object') {
        config.body = JSON.stringify(config.body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            // Se não autorizado, redireciona para login (segurança)
            if (response.status === 401 && endpoint !== '/auth/login') {
                window.location.href = '/admin/login';
                return null;
            }
            throw new Error(data.error || 'Erro na requisição');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export const api = {
    login: (username, password) => fetchAPI('/auth/login', { method: 'POST', body: { username, password } }),
    logout: () => fetchAPI('/auth/logout', { method: 'POST' }),
    getMetrics: () => fetchAPI('/metrics')
};
