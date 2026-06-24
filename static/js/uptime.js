/**
 * Uptime Monitor — Status, response time chart, incidents
 */

let responseTimeChart = null;
let currentPeriod = '24h';

document.addEventListener('DOMContentLoaded', () => {
    loadUptimeStatus();
    loadUptimeHistory('24h');
    loadIncidents();
});

async function loadUptimeStatus() {
    try {
        const data = await api('/api/uptime/status');

        // Status banner
        const dot = document.getElementById('uptime-status-dot');
        const text = document.getElementById('uptime-status-text');

        if (data.is_up) {
            dot.className = 'status-dot online';
            text.textContent = 'All Systems Operational';
            text.style.color = 'var(--success)';
            document.getElementById('status-banner').style.borderColor = 'var(--success-border)';
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'System Down';
            text.style.color = 'var(--danger)';
            document.getElementById('status-banner').style.borderColor = 'var(--danger-border)';
        }

        if (data.latest_check) {
            document.getElementById('uptime-last-check').textContent =
                `Last checked: ${timeAgo(data.latest_check.checked_at)}`;
            document.getElementById('uptime-response-time').textContent =
                `Response time: ${Math.round(data.latest_check.response_time_ms || 0)}ms`;
        }

        // Stats
        if (data.stats) {
            document.getElementById('stat-uptime-24h').textContent = data.stats['24h'].uptime_pct + '%';
            document.getElementById('stat-checks-24h').textContent = data.stats['24h'].total_checks;
            document.getElementById('stat-uptime-7d').textContent = data.stats['7d'].uptime_pct + '%';
            document.getElementById('stat-resp-7d').textContent = Math.round(data.stats['7d'].avg_response_ms);
            document.getElementById('stat-uptime-30d').textContent = data.stats['30d'].uptime_pct + '%';
            document.getElementById('stat-resp-30d').textContent = Math.round(data.stats['30d'].avg_response_ms);
        }

        // SSL
        if (data.ssl_expiry) {
            const daysLeft = Math.ceil((new Date(data.ssl_expiry) - new Date()) / (1000 * 60 * 60 * 24));
            document.getElementById('stat-ssl-days').textContent = daysLeft;
            if (daysLeft < 30) {
                document.getElementById('stat-ssl-days').style.color = 'var(--warning)';
            }
        }

        // Monitor URL in settings
        if (data.app) {
            document.getElementById('monitor-url').value = data.app.url || '';
            const settings = data.app.settings || {};
            document.getElementById('monitoring-enabled').checked = settings.monitoring_enabled !== false;
        }

    } catch (err) {
        showToast('Failed to load uptime status', 'error');
    }
}

async function loadUptimeHistory(period) {
    try {
        const data = await api(`/api/uptime/history?period=${period}`);
        renderResponseTimeChart(data.checks, period);
    } catch (err) {
        showToast('Failed to load uptime history', 'error');
    }
}

function renderResponseTimeChart(checks, period) {
    const ctx = document.getElementById('response-time-chart');
    if (!ctx) return;

    if (responseTimeChart) responseTimeChart.destroy();

    const labels = checks.map(c => {
        const d = new Date(c.checked_at);
        if (period === '24h') return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    });

    const responseTimes = checks.map(c => c.response_time_ms || 0);
    const upStatus = checks.map(c => c.is_up);

    responseTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Response Time (ms)',
                data: responseTimes,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: checks.length > 50 ? 0 : 3,
                pointBackgroundColor: upStatus.map(up => up ? '#10b981' : '#ef4444'),
                pointBorderColor: upStatus.map(up => up ? '#10b981' : '#ef4444'),
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: '#334155',
                    borderWidth: 1,
                    cornerRadius: 8,
                    padding: 12,
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#64748b',
                        font: { family: 'Inter', size: 11 },
                        maxRotation: 0,
                        maxTicksLimit: 12,
                    },
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: {
                        color: '#64748b',
                        font: { family: 'Inter', size: 11 },
                        callback: val => val + 'ms',
                    },
                    beginAtZero: true,
                }
            }
        }
    });
}

function switchPeriod(period) {
    currentPeriod = period;
    document.querySelectorAll('.period-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.period === period);
    });
    loadUptimeHistory(period);
}

async function loadIncidents() {
    try {
        const data = await api('/api/uptime/incidents');
        const container = document.getElementById('incidents-list');

        if (!data.incidents || data.incidents.length === 0) {
            container.innerHTML = '<div class="empty-state" style="padding:var(--space-xl);"><p class="text-muted">🎉 No incidents recorded — your app is running great!</p></div>';
            return;
        }

        container.innerHTML = data.incidents.map(incident => `
            <div class="incident-item">
                <div class="incident-status ${incident.resolved_at ? 'resolved' : 'active'}"></div>
                <div class="incident-info">
                    <div class="incident-duration">
                        ${incident.resolved_at ? 'Resolved' : '🔴 Active'} —
                        Duration: ${formatDuration(incident.duration_seconds)}
                    </div>
                    <div class="incident-time">
                        Started: ${formatDateTime(incident.started_at)}
                        ${incident.resolved_at ? ' • Resolved: ' + formatDateTime(incident.resolved_at) : ''}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        // Silent fail
    }
}

function openMonitorSettings() {
    openModal('monitor-settings-modal');
}

async function saveMonitorSettings() {
    const url = document.getElementById('monitor-url').value;
    const enabled = document.getElementById('monitoring-enabled').checked;

    try {
        await api('/api/uptime/configure', {
            method: 'POST',
            body: { url, monitoring_enabled: enabled },
        });
        showToast('Monitoring settings saved!', 'success');
        closeModal('monitor-settings-modal');
        loadUptimeStatus();
    } catch (err) {
        showToast(err.message, 'error');
    }
}
