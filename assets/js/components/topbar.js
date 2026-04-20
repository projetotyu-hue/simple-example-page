export function renderTopbar() {
    const topbarHTML = `
        <header class="topbar">
            <div class="topbar-left">
                <!-- Espaço reservado para breadcrumbs ou título secundário -->
            </div>
            <div class="topbar-right">
                <div class="status-indicator" style="display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-secondary);">
                    <span style="display: block; width: 8px; height: 8px; border-radius: 50%; background: var(--success-color); box-shadow: 0 0 8px var(--success-color);"></span>
                    Sistema Online
                </div>
                <div style="width: 1px; height: 24px; background: var(--border-color); margin: 0 8px;"></div>
                <div class="user-profile">
                    <div style="text-align: right;">
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-primary);">Administrador</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted);">Sentinel Shield</div>
                    </div>
                    <div class="user-avatar">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                </div>
            </div>
        </header>
    `;

    document.getElementById('topbar-container').innerHTML = topbarHTML;
}
