const names = [
    "Ana S.", "Carlos R.", "Maria L.", "João P.", "Juliana M.", 
    "Ricardo F.", "Fernanda O.", "Lucas T.", "Beatriz G.", "Marcos V.",
    "Sueli A.", "Roberto K.", "Patrícia D.", "Gabriel H.", "Camila B."
];

const cities = [
    "São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", 
    "Curitiba, PR", "Porto Alegre, RS", "Salvador, BA", 
    "Fortaleza, CE", "Brasília, DF", "Goiânia, GO", "Manaus, AM"
];

function createNotification() {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const time = Math.floor(Math.random() * 5) + 1;

    const toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = `
        <div class="sp-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </div>
        <div class="sp-content">
            <div class="sp-title"><strong>${name}</strong> acabou de comprar!</div>
            <div class="sp-meta">${city} • há ${time} min</div>
            <div class="sp-status">✓ Aguardando envio</div>
        </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 5000);
}

// Inicia as notificações após 5 segundos
setTimeout(() => {
    createNotification();
    setInterval(createNotification, 15000);
}, 5000);
