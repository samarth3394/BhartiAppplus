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
    const container = ctx ? ctx.parentElement : null;
    if (!ctx || !container) return;

    if (responseTimeChart) responseTimeChart.destroy();
    
    // Remove existing empty state if any
    const existingEmpty = container.querySelector('.chart-empty-state');
    if (existingEmpty) existingEmpty.remove();

    if (!checks || checks.length === 0) {
        ctx.style.display = 'none';
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'chart-empty-state';
        emptyDiv.style = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.9rem; flex-direction: column; gap: 8px;';
        emptyDiv.innerHTML = '<i data-lucide="activity" style="width: 24px; height: 24px; opacity: 0.5;"></i><p>No response time data yet. Add a URL in settings and wait a few minutes.</p>';
        container.appendChild(emptyDiv);
        if (window.lucide) window.lucide.createIcons();
        return;
    } else {
        ctx.style.display = 'block';
    }

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
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
            container.innerHTML = '<div class="empty-state" style="padding:var(--space-xl);"><p class="text-muted" style="display: flex; align-items: center; justify-content: center;"><i data-lucide="check-circle" style="color: var(--success); margin-right: 8px;"></i>All systems operational. No downtime incidents have been recorded.</p></div>';
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            return;
        }

        container.innerHTML = data.incidents.map(incident => {
            let aiSection = '';
            if (incident.ai_analysis) {
                const ai = incident.ai_analysis;
                const confColor = ai.confidence > 80 ? 'var(--success)' : (ai.confidence > 50 ? 'var(--warning)' : 'var(--danger)');
                aiSection = `
                    <div style="margin-top:var(--space-md); padding:var(--space-md); background:rgba(59,130,246,0.05); border-left: 3px solid var(--primary); border-radius:4px;">
                        <div style="display:flex; align-items:center; gap:var(--space-xs); margin-bottom:var(--space-xs);">
                            <i class="ri-brain-line" style="color:var(--primary);"></i>
                            <strong style="color:var(--text-primary); font-size:0.9rem;">AI Root Cause Analysis</strong>
                        </div>
                        <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:var(--space-sm);">${ai.root_cause}</p>
                        <div style="display:flex; gap:var(--space-md); font-size:0.8rem;">
                            <span style="color:var(--text-muted);">Confidence: <strong style="color:${confColor};">${ai.confidence}%</strong></span>
                            <span style="color:var(--text-muted);">Revenue Impact: <strong>${ai.revenue_impact.toUpperCase()}</strong></span>
                        </div>
                    </div>
                `;
            }

            return `
            <div class="incident-item">
                <div class="incident-status ${incident.resolved_at ? 'resolved' : 'active'}"></div>
                <div class="incident-info" style="width:100%;">
                    <div class="incident-duration">
                        ${incident.resolved_at ? 'Resolved' : '🔴 Active'} —
                        Duration: ${formatDuration(incident.duration_seconds)}
                    </div>
                    <div class="incident-time">
                        Started: ${formatDateTime(incident.started_at)}
                        ${incident.resolved_at ? ' • Resolved: ' + formatDateTime(incident.resolved_at) : ''}
                    </div>
                    ${aiSection}
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
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
