import { api } from '/assets/js/api.js';
import { renderSidebar } from '/assets/js/components/sidebar.js';
import { renderTopbar } from '/assets/js/components/topbar.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderSidebar('dashboard');
    renderTopbar();
    
    try {
        const data = await api.getMetrics();
        if (data) {
            renderDashboard(data);
        }
    } catch (e) {
        console.error("Failed to load metrics", e);
    }
});

function renderDashboard(data) {
    document.getElementById('totalAcessos').textContent = data.metrics.total_accesses || '--';
    
    const threatCount = data.logs.filter(l => l.status === 'FAILED').length;
    document.getElementById('totalAmeacas').textContent = threatCount || '--';

    const tbody = document.getElementById('logsTableBody');
    if (data.logs && data.logs.length > 0) {
        tbody.innerHTML = '';
        data.logs.forEach(log => {
            const tr = document.createElement('tr');
            const badgeClass = log.status === 'SUCCESS' ? 'success' : 'error';
            const dateStr = new Date(log.timestamp).toLocaleString();
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><span class="badge ${badgeClass}">${log.event_type}</span></td>
                <td>${log.ip}</td>
                <td>${log.device}</td>
                <td>${log.username || '-'}</td>
            `;
            tbody.appendChild(tr);
        });
    } else {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 32px; color: var(--text-muted);">Nenhuma atividade registrada ainda.</td></tr>';
    }

    const regionsList = document.getElementById('regionsList');
    const regionsContainer = document.getElementById('regionsContainer');
    const mapEmptyState = document.getElementById('mapEmptyState');
    
    const regions = data.metrics.regions || {};
    if (Object.keys(regions).length === 0) {
        mapEmptyState.style.display = 'flex';
        regionsContainer.style.display = 'none';
    } else {
        mapEmptyState.style.display = 'none';
        regionsContainer.style.display = 'block';
        regionsList.innerHTML = '';
        const sorted = Object.entries(regions).sort((a,b) => b[1] - a[1]);
        sorted.forEach(([state, count]) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${state}</td><td style="text-align: right; font-weight: 600;">${count}</td>`;
            regionsList.appendChild(tr);
        });
    }
}
