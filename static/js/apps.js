/**
 * App Management — CRUD, app cards, switching
 */

let allApps = [];
let deletingAppId = null;

document.addEventListener('DOMContentLoaded', loadApps);

async function loadApps() {
    try {
        const data = await api('/api/apps');
        allApps = data.apps || [];
        const currentAppId = data.current_app_id;
        const grid = document.getElementById('apps-grid');

        if (allApps.length === 0) {
            grid.classList.add('hidden');
            document.getElementById('no-apps-state').classList.remove('hidden');
            return;
        }

        document.getElementById('no-apps-state').classList.add('hidden');
        grid.classList.remove('hidden');

        grid.innerHTML = allApps.map(app => `
            <div class="app-card ${app.id === currentAppId ? 'active' : ''} animate-in"
                 onclick="switchToApp('${app.id}')">
                <div class="app-card-header">
                    <div class="app-icon">📱</div>
                    <div>
                        <div class="app-card-name">${escapeHtml(app.name)}</div>
                        <div class="app-card-url">${app.url || 'No URL configured'}</div>
                    </div>
                    ${app.id === currentAppId ? '<span class="badge badge-open" style="margin-left:auto;">Active</span>' : ''}
                </div>
                <p class="text-muted text-sm" style="margin-bottom:var(--space-lg);">${escapeHtml(app.description || 'No description')}</p>
                <div style="display:flex;gap:var(--space-sm);margin-top:auto;">
                    ${app.is_owner ? `
                        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openEditAppModal('${app.id}')">Edit</button>
                        <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();openSDKModal('${app.id}')">
                            <i data-lucide="code" style="width:14px;height:14px;"></i> SDK
                        </button>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="event.stopPropagation();openDeleteModal('${app.id}', '${escapeAttr(app.name)}')">Delete</button>
                    ` : `
                        <span class="badge badge-${app.role || 'viewer'}">${app.role || 'member'}</span>
                    `}
                </div>
            </div>
        `).join('');
    } catch (err) {
        showToast('Failed to load apps', 'error');
    }
}

async function switchToApp(appId) {
    try {
        await api(`/api/apps/switch/${appId}`, { method: 'POST' });
        showToast('Switched app!', 'success');
        loadApps();
        loadAppSwitcher();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Create/Edit App ────────────────────────────────────────────────────

function openCreateAppModal() {
    document.getElementById('app-edit-id').value = '';
    document.getElementById('app-name').value = '';
    document.getElementById('app-url').value = '';
    document.getElementById('app-description').value = '';
    
    const wsSelect = document.getElementById('app-workspace');
    if (wsSelect) wsSelect.value = window.currentWorkspaceId || '';
    
    document.getElementById('app-modal-title').textContent = 'New Application';
    document.getElementById('app-submit-btn').textContent = 'Create App';
    openModal('app-modal');
}

function openEditAppModal(appId) {
    const app = allApps.find(a => a.id === appId);
    if (!app) return;

    document.getElementById('app-edit-id').value = app.id;
    document.getElementById('app-name').value = app.name;
    document.getElementById('app-url').value = app.url || '';
    document.getElementById('app-description').value = app.description || '';
    
    const wsSelect = document.getElementById('app-workspace');
    if (wsSelect) wsSelect.value = app.workspace_id || '';
    
    document.getElementById('app-modal-title').textContent = 'Edit Application';
    document.getElementById('app-submit-btn').textContent = 'Update App';
    openModal('app-modal');
}

async function submitApp() {
    const editId = document.getElementById('app-edit-id').value;
    const name = document.getElementById('app-name').value.trim();

    if (!name) {
        showToast('App name is required', 'warning');
        return;
    }

    const body = {
        name,
        url: document.getElementById('app-url').value.trim(),
        description: document.getElementById('app-description').value.trim(),
    };
    
    const wsSelect = document.getElementById('app-workspace');
    if (wsSelect) {
        body.workspace_id = wsSelect.value || "personal";
    }

    try {
        if (editId) {
            await api(`/api/apps/${editId}`, { method: 'PUT', body });
            showToast('App updated!', 'success');
            closeModal('app-modal');
            loadApps();
            loadAppSwitcher();
        } else {
            await api('/api/apps', { method: 'POST', body });
            showToast('App created!', 'success');
            
            // If this was the first app, go straight to dashboard
            if (allApps.length === 0) {
                window.location.href = '/dashboard';
                return;
            } else {
                closeModal('app-modal');
                loadApps();
                loadAppSwitcher();
            }
        }
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Delete App ─────────────────────────────────────────────────────────

function openDeleteModal(appId, appName) {
    deletingAppId = appId;
    document.getElementById('delete-app-name').textContent = `"${appName}"`;
    openModal('delete-app-modal');
}

async function confirmDeleteApp() {
    if (!deletingAppId) return;
    try {
        await api(`/api/apps/${deletingAppId}`, { method: 'DELETE' });
        showToast('App deleted', 'success');
        closeModal('delete-app-modal');
        deletingAppId = null;
        loadApps();
        loadAppSwitcher();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── SDK Setup ────────────────────────────────────────────────────────────

function openSDKModal(appId) {
    const app = allApps.find(a => a.id === appId);
    if (!app || !app.client_key) {
        showToast('Client Key not generated yet', 'error');
        return;
    }
    
    document.getElementById('sdk-client-key').value = app.client_key;
    
    const host = window.location.protocol + '//' + window.location.host;
    const snippet = `<script src="${host}/static/js/nexvora.js"><\/script>\n<script>\n  window.Nexvora.init({\n    clientKey: '${app.client_key}',\n    endpoint: '${host}/api/ingest/error'\n  });\n<\/script>`;
    
    document.getElementById('sdk-snippet').value = snippet;
    openModal('sdk-modal');
}

// ─── Helpers ────────────────────────────────────────────────────────────

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function escapeAttr(text) {
    return text.replace(/'/g, "\\'").replace(/"/g, '\\"');
}
