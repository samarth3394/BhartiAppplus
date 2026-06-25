/**
 * Nexvora — Core JavaScript
 * API helpers, notifications, navigation, modal management
 */

// ─── API Helper ──────────────────────────────────────────────────────────

async function api(url, options = {}) {
    const defaults = {
        headers: { 'Content-Type': 'application/json' },
    };

    const config = { ...defaults, ...options };
    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
        config.body = JSON.stringify(options.body);
    }
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/login';
            return;
        }
        throw error;
    }
}

// ─── Toast Notifications ────────────────────────────────────────────────

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${icons[type] || '📌'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ─── Modal Management ───────────────────────────────────────────────────

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
});

// ─── User Info ──────────────────────────────────────────────────────────

async function loadUserInfo() {
    try {
        const data = await api('/api/auth/me');
        if (data.user) {
            const nameEl = document.getElementById('user-name');
            const emailEl = document.getElementById('user-email');
            const avatarEl = document.getElementById('user-avatar');

            if (nameEl) nameEl.textContent = data.user.full_name;
            if (emailEl) emailEl.textContent = data.user.email;
            if (avatarEl) avatarEl.textContent = getInitials(data.user.full_name);
        }
    } catch (err) {
        // Silent fail — user will be redirected if unauthorized
    }
}

// ─── App Switcher ───────────────────────────────────────────────────────

async function loadAppSwitcher() {
    try {
        const data = await api('/api/dashboard/apps');
        const select = document.getElementById('app-switcher-select');
        if (!select) return;

        select.innerHTML = '';

        if (data.apps && data.apps.length > 0) {
            data.apps.forEach(app => {
                const option = document.createElement('option');
                option.value = app.id;
                option.textContent = app.name;
                if (app.id === data.current_app_id) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">No apps — create one</option>';
        }
    } catch (err) {
        // Silent fail
    }
}

async function switchApp(appId) {
    if (!appId) return;
    try {
        await api(`/api/dashboard/switch/${appId}`, { method: 'POST' });
        window.location.reload();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Sidebar ────────────────────────────────────────────────────────────

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Close sidebar on click outside (for mobile)
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    
    if (sidebar && sidebar.classList.contains('open') && menuBtn) {
        // If click is outside both the sidebar and the hamburger menu button
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// ─── Logout ─────────────────────────────────────────────────────────────

async function logout() {
    try {
        await api('/api/auth/logout', { method: 'POST' });
        window.location.href = '/login';
    } catch (err) {
        window.location.href = '/login';
    }
}

// ─── Utilities ──────────────────────────────────────────────────────────

function getInitials(name) {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatDateTime(isoString) {
    if (!isoString) return '--';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function timeAgo(isoString) {
    if (!isoString) return '';
    const now = new Date();
    const date = new Date(isoString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return formatDate(isoString);
}

function formatDuration(seconds) {
    if (!seconds || seconds < 60) return `${seconds || 0}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
}

function severityColor(severity) {
    const colors = {
        low: 'var(--info)',
        medium: 'var(--warning)',
        high: '#f97316',
        critical: 'var(--danger)',
    };
    return colors[severity] || 'var(--text-muted)';
}
