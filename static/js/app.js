/**
 * Nexvora — Core JavaScript
 * API helpers, notifications, navigation, modal management
 */

// ─── Utilities ─────────────────────────────────────────────────────────────

// Spotlight Effect Tracking
document.addEventListener('mousemove', (e) => {
    document.querySelectorAll('.card, .stat-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// Command Palette Logic
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const palette = document.getElementById('command-palette');
        if (palette) {
            const isHidden = palette.classList.contains('hidden');
            if (isHidden) {
                palette.classList.remove('hidden');
                // Small delay to allow display block to apply before opacity transition
                setTimeout(() => {
                    palette.style.opacity = '1';
                    palette.querySelector('.cmd-box').style.transform = 'scale(1)';
                    document.getElementById('cmd-input').focus();
                }, 10);
            } else {
                closeCommandPalette();
            }
        }
    }
    if (e.key === 'Escape') {
        closeCommandPalette();
    }
});

function closeCommandPalette() {
    const palette = document.getElementById('command-palette');
    if (palette && !palette.classList.contains('hidden')) {
        palette.style.opacity = '0';
        palette.querySelector('.cmd-box').style.transform = 'scale(0.95)';
        setTimeout(() => palette.classList.add('hidden'), 200);
    }
}

// Click outside to close palette
document.addEventListener('click', (e) => {
    const palette = document.getElementById('command-palette');
    if (palette && e.target === palette) {
        closeCommandPalette();
    }
});

function escapeHtml(unsafe) {
    if (unsafe == null) return '';
    return String(unsafe)
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

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
            throw new Error(data.detail || data.error || `HTTP ${response.status}`);
        }

        return data;
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            window.location.href = '/auth/login';
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
            const topbarProfile = document.getElementById('topbar-profile-icon');

            if (nameEl) nameEl.textContent = data.user.full_name;
            if (emailEl) emailEl.textContent = data.user.email;
            
            if (topbarProfile) {
                if (data.user.avatar_url) {
                    topbarProfile.innerHTML = `<img src="${data.user.avatar_url}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
                    topbarProfile.style.border = 'none'; // Optional: remove border if image
                } else {
                    topbarProfile.innerHTML = `<span style="font-size:12px; font-weight:bold;">${getInitials(data.user.full_name)}</span>`;
                }
            }
        }
    } catch (err) {
        // Silent fail — user will be redirected if unauthorized
    }
}

// ─── Workspace Switcher ───────────────────────────────────────────────────

async function loadWorkspaceSwitcher() {
    try {
        const data = await api('/api/workspaces');

        // Also populate app creation modal workspace select if it exists
        const appWorkspaceSelect = document.getElementById('app-workspace');
        if (appWorkspaceSelect) {
            appWorkspaceSelect.innerHTML = '<option value="">Personal (Standalone App)</option>';
            if (data.workspaces && data.workspaces.length > 0) {
                data.workspaces.forEach(ws => {
                    const option = document.createElement('option');
                    option.value = ws.id;
                    option.textContent = ws.name;
                    if (ws.id === data.current_workspace_id) {
                        option.selected = true;
                    }
                    appWorkspaceSelect.appendChild(option);
                });
            }
        }
        
        // Update Dynamic Header Context
        window.currentWorkspaceName = 'Personal Workspace';
        if (data.current_workspace_id && data.workspaces) {
            const ws = data.workspaces.find(w => w.id === data.current_workspace_id);
            if (ws) window.currentWorkspaceName = ws.name;
        }
        updateDynamicHeader();
    } catch (err) {
        // Silent fail
    }
}


// ─── App Switcher ───────────────────────────────────────────────────────

async function loadAppSwitcher() {
    try {
        const data = await api('/api/apps');
        const select = document.getElementById('app-switcher-select');
        if (!select) return;

        select.innerHTML = '';
        window.currentAppName = null;

        if (data.apps && data.apps.length > 0) {
            data.apps.forEach(app => {
                const option = document.createElement('option');
                option.value = app.id;
                option.textContent = app.name;
                if (app.id === data.current_app_id) {
                    option.selected = true;
                    window.currentAppName = app.name;
                }
                select.appendChild(option);
            });
        } else {
            select.innerHTML = '<option value="">No apps — create one</option>';
        }
        
        updateDynamicHeader();
    } catch (err) {
        // Silent fail
    }
}

function updateDynamicHeader() {
    const headerTitle = document.getElementById('dynamic-header-title');
    if (!headerTitle) return;
    
    let html = '';
    
    // Workspace Badge
    if (window.currentWorkspaceName === 'Personal Workspace') {
        html += `<span style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); background: var(--bg-secondary); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--border-default);"><i data-lucide="user" style="width: 14px; height: 14px;"></i> Personal</span>`;
    } else if (window.currentWorkspaceName) {
        html += `<span style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 500; color: var(--text-muted); background: rgba(59, 130, 246, 0.1); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(59, 130, 246, 0.2);"><i data-lucide="briefcase" style="width: 14px; height: 14px; color: #3b82f6;"></i> ${window.currentWorkspaceName}</span>`;
    }
    
    // App Name
    if (window.currentAppName) {
        html += `<span style="color: var(--text-muted); margin: 0 4px;">/</span> <span style="font-size: 1.1rem; color: var(--text-primary); font-weight: 600;">${window.currentAppName}</span>`;
    } else {
        html += `<span style="color: var(--text-muted); margin: 0 4px;">/</span> <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 400;">Dashboard</span>`;
    }
    
    headerTitle.innerHTML = html;
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function switchApp(appId) {
    if (!appId) return;
    try {
        await api(`/api/apps/switch/${appId}`, { method: 'POST' });
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
