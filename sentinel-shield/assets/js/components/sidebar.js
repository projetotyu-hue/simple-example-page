export function renderSidebar(activeMenu = 'dashboard') {
    const sidebarHTML = `
        <aside class="sidebar">
            <div class="sidebar-header login-logo">
                Sentinel Admin
            </div>
            <nav style="display: flex; flex-direction: column; height: 100%;">
                <div style="flex: 1; overflow-y: auto;">
                    <a href="/admin/dashboard" class="nav-link ${activeMenu === 'dashboard' ? 'active' : ''}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;">
                            <rect x="3" y="3" width="7" height="9"></rect>
                            <rect x="14" y="3" width="7" height="5"></rect>
                            <rect x="14" y="12" width="7" height="9"></rect>
                            <rect x="3" y="16" width="7" height="5"></rect>
                        </svg>
                        Dashboard
                    </a>
                    
                    <div style="margin: 16px 0 8px 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">E-commerce</div>
                    <a href="/admin/sales" class="nav-link ${activeMenu === 'sales' ? 'active' : ''}">Gestão de Vendas</a>
                    <a href="/admin/products" class="nav-link ${activeMenu === 'products' ? 'active' : ''}">Produtos</a>
                    <a href="/admin/payments" class="nav-link ${activeMenu === 'payments' ? 'active' : ''}">Pagamentos</a>
                    <a href="/admin/clients" class="nav-link ${activeMenu === 'clients' ? 'active' : ''}">Clientes</a>
                    
                    <div style="margin: 16px 0 8px 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">Marketing & Dados</div>
                    <a href="/admin/analytics" class="nav-link ${activeMenu === 'analytics' ? 'active' : ''}">Analytics</a>
                    <a href="/admin/map" class="nav-link ${activeMenu === 'map' ? 'active' : ''}">Mapa de Clientes</a>
                    <a href="/admin/sites" class="nav-link ${activeMenu === 'sites' ? 'active' : ''}">Multi-Sites</a>
                    <a href="/admin/pages" class="nav-link ${activeMenu === 'pages' ? 'active' : ''}">Páginas</a>
                    
                    <div style="margin: 16px 0 8px 16px; font-size: 0.75rem; text-transform: uppercase; color: var(--text-secondary); font-weight: 600;">Sistema</div>
                    <a href="/admin/logs" class="nav-link ${activeMenu === 'logs' ? 'active' : ''}">Logs</a>
                    <a href="/admin/monitoring" class="nav-link ${activeMenu === 'monitoring' ? 'active' : ''}">Monitoramento</a>
                </div>
                
                <a href="#" class="nav-link" id="logoutBtn" style="color: var(--error-color); margin-top: auto;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 12px;">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    Sair
                </a>
            </nav>
        </aside>
    `;

    document.getElementById('sidebar-container').innerHTML = sidebarHTML;

    // Adicionar evento de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const { api } = await import('../api.js');
            await api.logout();
            window.location.href = '/admin/login';
        });
    }
}
