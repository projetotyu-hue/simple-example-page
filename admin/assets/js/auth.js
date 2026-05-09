import { api } from '../../assets/js/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const submitBtn = document.getElementById('submitBtn');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorAlert.style.display = 'none';
            
            const username = loginForm.username.value.trim();
            const password = loginForm.password.value;

            // Basic frontend validation (Backend re-validates everything)
            if (!username || !password) {
                errorAlert.textContent = 'Preencha todos os campos.';
                errorAlert.style.display = 'block';
                return;
            }

            try {
                // UI feedback
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner"></span> Validando...';

                await api.login(username, password);
                
                // Redireciona em caso de sucesso
                window.location.href = '/admin/dashboard';
            } catch (error) {
                errorAlert.textContent = error.message || 'Credenciais inválidas. Acesso negado.';
                errorAlert.style.display = 'block';
                
                // Animação de tremor para feedback de erro
                const box = document.querySelector('.login-box');
                box.style.animation = 'none';
                box.offsetHeight; // trigger reflow
                box.style.animation = 'shake 0.4s ease-in-out';
                
                // Reinicia botões
                submitBtn.disabled = false;
                submitBtn.textContent = 'Acessar Painel';
                loginForm.password.value = ''; // Limpa senha por segurança
            }
        });
    }

    // Add shake animation dynamic style
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes shake {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);
});
