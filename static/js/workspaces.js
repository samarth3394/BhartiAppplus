// workspaces.js

document.addEventListener('DOMContentLoaded', () => {
    loadWorkspacesGrid();
});

async function loadWorkspacesGrid() {
    const grid = document.getElementById('workspaces-grid');
    if (!grid) return;

    try {
        const res = await fetch('/api/workspaces');
        if (!res.ok) throw new Error('Failed to load workspaces');
        
        const data = await res.json();
        const workspaces = data.workspaces || [];
        const currentId = data.current_workspace_id;

        if (workspaces.length === 0) {
            grid.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-state-icon">🏢</div>
                <h3>No workspaces yet</h3>
                <p>Create a workspace for your company or team.</p>
                <button class="btn btn-primary" onclick="openCreateWorkspaceModal()">Create Workspace</button>
            </div>`;
            return;
        }

        grid.innerHTML = workspaces.map(w => `
            <div class="card" style="border: ${w.id === currentId ? '2px solid var(--primary)' : '1px solid var(--border-default)'}">
                <div class="card-body" style="padding: 1.5rem;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h3 style="margin:0; font-size: 1.25rem;">${escapeHtml(w.name)}</h3>
                        ${w.id === currentId ? '<span class="badge badge-success">Active</span>' : ''}
                    </div>
                    <p class="text-muted mt-sm mb-md">Role: <span style="text-transform: capitalize;">${escapeHtml(w.role)}</span></p>
                    
                    <div style="display:flex; gap: 8px;">
                        ${w.id !== currentId ? 
                            `<button class="btn btn-primary btn-sm" onclick="switchWorkspace('${w.id}')">Switch Context</button>` : 
                            `<button class="btn btn-secondary btn-sm" disabled>Current</button>`
                        }
                        ${w.role === 'admin' ? `<button class="btn btn-danger btn-sm" onclick="deleteWorkspace('${w.id}', '${escapeHtml(w.name)}')"><i data-lucide="trash-2" style="width:14px;"></i></button>` : ''}
                    </div>
                </div>
            </div>
        `).join('');
        lucide.createIcons();

        if (currentId) {
            document.getElementById('workspace-members-section').style.display = 'block';
            loadWorkspaceMembers(currentId);
        } else {
            document.getElementById('workspace-members-section').style.display = 'none';
        }

    } catch (e) {
        console.error(e);
        grid.innerHTML = `<div class="text-danger p-md">Error loading workspaces.</div>`;
    }
}

async function loadWorkspaceMembers(workspaceId) {
    const grid = document.getElementById('workspace-members-grid');
    if (!grid) return;
    
    try {
        const res = await fetch(`/api/workspaces/${workspaceId}/members`);
        if (!res.ok) throw new Error('Failed to load members');
        const data = await res.json();
        const members = data.members || [];
        
        if (members.length === 0) {
            grid.innerHTML = '<div class="text-muted p-md">No members in this workspace yet.</div>';
            return;
        }
        
        grid.innerHTML = members.map(m => `
            <div class="member-card">
                <div class="member-avatar">${m.user ? m.user.full_name.charAt(0).toUpperCase() : m.invite_email.charAt(0).toUpperCase()}</div>
                <div class="member-info">
                    <div class="member-name">${m.user ? escapeHtml(m.user.full_name) : escapeHtml(m.invite_email) + ' (Pending)'}</div>
                    <div class="member-role">${escapeHtml(m.role)}</div>
                </div>
                <div class="member-actions">
                    <button class="btn btn-icon text-danger" onclick="removeWorkspaceMember('${workspaceId}', '${m.id}')" title="Remove Member">
                        <i data-lucide="user-minus"></i>
                    </button>
                </div>
            </div>
        `).join('');
        lucide.createIcons();
    } catch (e) {
        console.error(e);
        grid.innerHTML = '<div class="text-danger p-md">Error loading members.</div>';
    }
}

function openCreateWorkspaceModal() {
    document.getElementById('workspace-name').value = '';
    document.getElementById('create-workspace-modal').classList.add('active');
}

async function createWorkspace() {
    const name = document.getElementById('workspace-name').value.trim();
    if (!name) return showToast('Workspace name is required', 'error');

    try {
        const res = await fetch('/api/workspaces', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name })
        });
        const data = await res.json();
        if (res.ok) {
            showToast('Workspace created successfully', 'success');
            closeModal('create-workspace-modal');
            window.location.reload();
        } else {
            showToast(data.detail || 'Error creating workspace', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Network error', 'error');
    }
}

async function deleteWorkspace(id, name) {
    if (!confirm(`Are you sure you want to delete workspace "${name}"? All apps inside it might be affected or lost.`)) return;
    
    try {
        const res = await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Workspace deleted', 'success');
            window.location.reload();
        } else {
            const data = await res.json();
            showToast(data.detail || 'Failed to delete workspace', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Error', 'error');
    }
}

function openInviteModal() {
    document.getElementById('invite-email').value = '';
    document.getElementById('invite-role').value = 'developer';
    document.getElementById('invite-workspace-modal').classList.add('active');
}

async function sendWorkspaceInvite() {
    const email = document.getElementById('invite-email').value.trim();
    const role = document.getElementById('invite-role').value;
    if (!email) return showToast('Email is required', 'error');
    
    // get current workspace ID from global
    if (!window.currentWorkspaceId) {
        return showToast('No active workspace selected', 'error');
    }

    try {
        const res = await fetch(`/api/workspaces/${window.currentWorkspaceId}/members`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, role })
        });
        const data = await res.json();
        
        if (res.ok) {
            showToast('Invite sent', 'success');
            closeModal('invite-workspace-modal');
            loadWorkspaceMembers(window.currentWorkspaceId);
        } else {
            showToast(data.detail || 'Failed to send invite', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Network error', 'error');
    }
}

async function removeWorkspaceMember(workspaceId, memberId) {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
        const res = await fetch(`/api/workspaces/${workspaceId}/members/${memberId}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Member removed', 'success');
            loadWorkspaceMembers(workspaceId);
        } else {
            const data = await res.json();
            showToast(data.detail || 'Error removing member', 'error');
        }
    } catch (e) {
        console.error(e);
        showToast('Network error', 'error');
    }
}
