/**
 * Server Infrastructure Monitoring — Charts and Metrics
 */

let usageChart = null;
let currentClientKey = null;

document.addEventListener('DOMContentLoaded', () => {
    // We need the client key for the setup instructions. 
    // We can fetch the current app details using the dashboard api.
    loadAppDetails();
    loadMetrics();
    // Auto refresh every 60 seconds
    setInterval(loadMetrics, 60000);
});

async function loadAppDetails() {
    try {
        const data = await api('/api/dashboard/apps');
        const currentAppId = data.current_app_id;
        const currentApp = data.apps.find(a => a.id === currentAppId);
        if (currentApp) {
            currentClientKey = currentApp.client_key;
        }
    } catch(e) {}
}

async function loadMetrics() {
    const period = document.getElementById('metric-period').value;
    try {
        const data = await api(`/api/server/metrics?period=${period}`);
        
        if (!data.metrics || data.metrics.length === 0) {
            document.querySelector('.stats-grid').classList.add('hidden');
            document.querySelector('.chart-container').classList.add('hidden');
            document.getElementById('no-metrics-state').classList.remove('hidden');
            return;
        }

        document.querySelector('.stats-grid').classList.remove('hidden');
        document.querySelector('.chart-container').classList.remove('hidden');
        document.getElementById('no-metrics-state').classList.add('hidden');

        // Render current stats
        const latest = data.metrics[data.metrics.length - 1];
        document.getElementById('current-cpu').textContent = `${latest.cpu_percent.toFixed(1)}%`;
        document.getElementById('current-ram').textContent = `${latest.ram_percent.toFixed(1)}%`;
        document.getElementById('current-disk').textContent = `${latest.disk_percent.toFixed(1)}%`;

        renderChart(data.metrics);
    } catch (err) {
        showToast('Failed to load server metrics', 'error');
    }
}

function renderChart(metrics) {
    const ctx = document.getElementById('usageChart').getContext('2d');
    
    // Labels: Time
    const labels = metrics.map(m => {
        const d = new Date(m.timestamp);
        return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    });

    const cpuData = metrics.map(m => m.cpu_percent);
    const ramData = metrics.map(m => m.ram_percent);

    if (usageChart) {
        usageChart.destroy();
    }

    usageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'CPU Usage (%)',
                    data: cpuData,
                    borderColor: '#2997ff', // Apple Blue
                    backgroundColor: 'rgba(41, 151, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 10
                },
                {
                    label: 'RAM Usage (%)',
                    data: ramData,
                    borderColor: '#32d74b', // Apple Green
                    backgroundColor: 'rgba(50, 215, 75, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0,
                    pointHitRadius: 10
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#f5f5f7' }
                },
                tooltip: {
                    backgroundColor: 'rgba(28, 28, 30, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#a1a1a6',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#a1a1a6' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a1a1a6', maxTicksLimit: 10 }
                }
            }
        }
    });
}

function openAgentModal() {
    if (!currentClientKey) {
        showToast('App details not fully loaded yet', 'warning');
        return;
    }
    const host = window.location.protocol + '//' + window.location.host;
    document.getElementById('agent-host-url').textContent = host;
    document.getElementById('agent-endpoint-url').textContent = `${host}/api/ingest/metrics`;
    document.getElementById('agent-client-key').textContent = currentClientKey;
    
    openModal('agent-modal');
}
