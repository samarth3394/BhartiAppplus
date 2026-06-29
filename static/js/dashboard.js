/**
 * Dashboard Page — Health score, stats, charts, activity feed
 */

let bugSeverityChart = null;

document.addEventListener('DOMContentLoaded', loadDashboard);

async function loadDashboard() {
    try {
        const data = await api('/api/dashboard/stats');

        document.getElementById('dashboard-loader').classList.add('hidden');

        if (!data.has_app) {
            document.getElementById('no-app-state').classList.remove('hidden');
            return;
        }

        document.getElementById('dashboard-content').classList.remove('hidden');

        // Health Score Ring
        const score = data.health_score.total;
        const ring = document.getElementById('health-ring-progress');
        const circumference = 2 * Math.PI * 68; // r=68
        const offset = circumference - (score / 100) * circumference;
        ring.style.strokeDashoffset = offset;

        // Color based on score
        let ringColor = '#10b981'; // green
        if (score < 80) ringColor = '#f59e0b'; // yellow
        if (score < 50) ringColor = '#ef4444'; // red
        ring.style.stroke = ringColor;

        document.getElementById('health-score-value').textContent = Math.round(score);
        document.getElementById('health-score-value').style.color = ringColor;

        document.getElementById('uptime-score').textContent = data.health_score.uptime_score + '/40';
        document.getElementById('bug-score').textContent = data.health_score.bug_score + '/30';
        document.getElementById('maint-score').textContent = data.health_score.maintenance_score + '/30';

        // Bug counts
        document.getElementById('active-bugs').textContent = data.bugs.active;
        document.getElementById('resolved-bugs').textContent = data.bugs.resolved;

        // Update badge
        const bugsBadge = document.getElementById('bugs-badge');
        if (data.bugs.active > 0) {
            bugsBadge.textContent = data.bugs.active;
            bugsBadge.classList.remove('hidden');
        }

        // Uptime
        document.getElementById('uptime-24h').textContent = data.uptime.percentage_24h + '%';
        document.getElementById('uptime-7d').textContent = data.uptime.percentage_7d + '%';
        document.getElementById('uptime-30d').textContent = data.uptime.percentage_30d + '%';

        // Server status
        const statusDot = document.getElementById('server-status-dot');
        const statusText = document.getElementById('server-status');
        if (data.uptime.is_up) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Online';
            statusText.style.color = 'var(--success)';
        } else {
            statusDot.className = 'status-dot offline';
            statusText.textContent = 'Offline';
            statusText.style.color = 'var(--danger)';
        }

        // SSL info
        const sslInfo = document.getElementById('ssl-info');
        if (data.ssl.days_remaining !== null) {
            sslInfo.textContent = `SSL: ${data.ssl.days_remaining} days left`;
            if (data.ssl.days_remaining < 30) {
                sslInfo.style.color = 'var(--warning)';
            }
        } else {
            sslInfo.textContent = 'SSL: N/A';
        }

        // Maintenance
        document.getElementById('pending-tasks').textContent = data.maintenance.total_tasks;
        if (data.maintenance.overdue_tasks > 0) {
            document.getElementById('overdue-count').textContent = data.maintenance.overdue_tasks;
            document.getElementById('overdue-trend').classList.remove('hidden');

            const maintBadge = document.getElementById('maintenance-badge');
            maintBadge.textContent = data.maintenance.overdue_tasks;
            maintBadge.classList.remove('hidden');
        }

        // Bug severity chart
        renderBugSeverityChart(data.bugs.severity);

        // Load activity feed
        loadActivity();

    } catch (err) {
        document.getElementById('dashboard-loader').classList.add('hidden');
        showToast('Failed to load dashboard: ' + err.message, 'error');
    }
}

function renderBugSeverityChart(severity) {
    const ctx = document.getElementById('bug-severity-chart');
    if (!ctx) return;

    if (bugSeverityChart) bugSeverityChart.destroy();

    bugSeverityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                data: [
                    severity.critical || 0,
                    severity.high || 0,
                    severity.medium || 0,
                    severity.low || 0,
                ],
                backgroundColor: [
                    '#ef4444',
                    '#f97316',
                    '#f59e0b',
                    '#06b6d4',
                ],
                borderWidth: 0,
                borderRadius: 4,
                spacing: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Inter', size: 12 },
                        padding: 16,
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8
                    }
                }
            }
        }
    });
}

async function loadActivity() {
    try {
        const data = await api('/api/dashboard/activity');
        const feed = document.getElementById('activity-feed');

        if (!data.activities || data.activities.length === 0) {
            feed.innerHTML = '<div class="empty-state" style="padding:var(--space-xl);"><p class="text-muted">No recent activity</p></div>';
            return;
        }

        feed.innerHTML = data.activities.map(activity => `
            <div class="activity-item animate-in">
                <div class="activity-avatar">
                    ${activity.user ? getInitials(activity.user.full_name) : '⚡'}
                </div>
                <div class="activity-content">
                    <div class="activity-text">
                        <strong>${activity.user ? activity.user.full_name : 'System'}</strong>
                        ${escapeHtml(activity.action)}
                    </div>
                    <div class="activity-time">${timeAgo(activity.created_at)}</div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        // Silent fail
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
