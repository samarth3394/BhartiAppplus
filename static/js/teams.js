/**
 * Team Management — Members, invites, roles, activity log
 */

document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    loadActivity();
});

async function loadMembers() {
    try {
        const data = await api('/api/teams/members');
        const grid = document.getElementById('members-grid');

        if (!data.members || data.members.length === 0) {
            grid.innerHTML = '<div class="empty-state"><p class="text-muted">No team members yet</p></div>';
            return;
        }

        grid.innerHTML = data.members.map(member => `
            <div class="member-card animate-in">
                <div class="member-avatar">
                    ${member.user ? getInitials(member.user.full_name) : '?'}
                </div>
                <div class="member-info">
                    <div class="member-name">
                        ${member.user ? member.user.full_name : member.invite_email || 'Unknown'}
                        ${member.is_owner ? '<span class="badge badge-admin" style="margin-left:6px;">Owner</span>' : ''}
                        ${member.is_pending ? '<span class="badge badge-viewer" style="margin-left:6px;">Pending</span>' : ''}
                    </div>
                    <div class="member-email">${member.user ? member.user.email : ''}</div>
                    <div class="mt-sm">
                        <span class="badge badge-${member.role}">${member.role}</span>
                        ${member.joined_at ? `<span class="text-muted text-sm" style="margin-left:8px;">Joined ${formatDate(member.joined_at)}</span>` : ''}
                    </div>
                </div>
                ${!member.is_owner ? `
                    <div class="member-actions">
                        <select class="filter-select" onchange="changeRole('${member.id}', this.value)" ${member.is_owner ? 'disabled' : ''}>
                            <option value="developer" ${member.role === 'developer' ? 'selected' : ''}>Developer</option>
                            <option value="viewer" ${member.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                            <option value="admin" ${member.role === 'admin' ? 'selected' : ''}>Admin</option>
                        </select>
                        <button class="btn btn-ghost btn-sm text-danger" onclick="removeMember('${member.id}')" title="Remove">✕</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    } catch (err) {
        showToast('Failed to load team', 'error');
    }
}

async function loadActivity() {
    try {
        const entityType = document.getElementById('activity-type-filter')?.value || '';
        const params = entityType ? `?entity_type=${entityType}` : '';
        const data = await api(`/api/teams/activity${params}`);
        const feed = document.getElementById('team-activity-feed');

        if (!data.activities || data.activities.length === 0) {
            feed.innerHTML = '<div class="empty-state" style="padding:var(--space-xl);"><p class="text-muted">No activity recorded yet</p></div>';
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

// ─── Invite ─────────────────────────────────────────────────────────────

function openInviteModal() {
    document.getElementById('invite-email').value = '';
    document.getElementById('invite-role').value = 'developer';
    openModal('invite-modal');
}

async function sendInvite() {
    const email = document.getElementById('invite-email').value.trim();
    const role = document.getElementById('invite-role').value;

    if (!email) {
        showToast('Email is required', 'warning');
        return;
    }

    try {
        await api('/api/teams/invite', {
            method: 'POST',
            body: { email, role },
        });
        showToast(`Invitation sent to ${email}!`, 'success');
        closeModal('invite-modal');
        loadMembers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Role Management ────────────────────────────────────────────────────

async function changeRole(memberId, newRole) {
    try {
        await api(`/api/teams/members/${memberId}`, {
            method: 'PUT',
            body: { role: newRole },
        });
        showToast('Role updated!', 'success');
        loadMembers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function removeMember(memberId) {
    if (!confirm('Remove this team member?')) return;
    try {
        await api(`/api/teams/members/${memberId}`, { method: 'DELETE' });
        showToast('Member removed', 'success');
        loadMembers();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
