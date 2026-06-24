/**
 * Bug Tracker — CRUD, pipeline drag-and-drop, filters, detail view
 */

let allBugs = [];
let currentView = 'pipeline';

document.addEventListener('DOMContentLoaded', () => {
    loadBugs();
    loadTeamMembers();
});

async function loadBugs() {
    try {
        const params = new URLSearchParams();
        const severity = document.getElementById('filter-severity')?.value;
        const status = document.getElementById('filter-status')?.value;
        const search = document.getElementById('bug-search')?.value;

        if (severity) params.set('severity', severity);
        if (status) params.set('status', status);
        if (search) params.set('search', search);

        const data = await api(`/api/bugs?${params.toString()}`);
        allBugs = data.bugs || [];
        renderBugs();
    } catch (err) {
        showToast('Failed to load bugs', 'error');
    }
}

function renderBugs() {
    if (currentView === 'pipeline') {
        renderPipeline();
    } else {
        renderList();
    }
}

function renderPipeline() {
    const statuses = ['open', 'in_progress', 'testing', 'resolved'];
    statuses.forEach(status => {
        const container = document.getElementById(`pipeline-${status}`);
        const countEl = document.getElementById(`count-${status}`);
        const bugs = allBugs.filter(b => b.status === status);

        countEl.textContent = bugs.length;

        if (bugs.length === 0) {
            container.innerHTML = '<div class="text-center text-muted text-sm" style="padding:var(--space-xl);">No bugs</div>';
            return;
        }

        container.innerHTML = bugs.map(bug => `
            <div class="bug-card" draggable="true" ondragstart="dragBug(event, '${bug.id}')"
                 onclick="showBugDetail('${bug.id}')">
                <div class="bug-card-title">${escapeHtml(bug.title)}</div>
                <div class="bug-card-meta">
                    <span class="badge badge-${bug.severity}">${bug.severity}</span>
                    ${bug.assignee ?
                        `<div class="bug-card-assignee" title="${bug.assignee.full_name}">${getInitials(bug.assignee.full_name)}</div>` :
                        ''}
                </div>
            </div>
        `).join('');
    });
}

function renderList() {
    const tbody = document.getElementById('bugs-table-body');
    if (!allBugs.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted" style="padding:var(--space-2xl);">No bugs found</td></tr>';
        return;
    }

    tbody.innerHTML = allBugs.map(bug => `
        <tr onclick="showBugDetail('${bug.id}')" style="cursor:pointer;">
            <td><strong>${escapeHtml(bug.title)}</strong></td>
            <td><span class="badge badge-${bug.severity}">${bug.severity}</span></td>
            <td><span class="badge badge-${bug.status}">${bug.status.replace('_', ' ')}</span></td>
            <td>${bug.assignee ? bug.assignee.full_name : '<span class="text-muted">Unassigned</span>'}</td>
            <td class="text-muted">${formatDate(bug.created_at)}</td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();openEditBugModal('${bug.id}')">Edit</button>
                <button class="btn btn-ghost btn-sm text-danger" onclick="event.stopPropagation();deleteBug('${bug.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// ─── Views ──────────────────────────────────────────────────────────────

function setView(view) {
    currentView = view;
    document.getElementById('pipeline-view').classList.toggle('hidden', view !== 'pipeline');
    document.getElementById('list-view').classList.toggle('hidden', view !== 'list');

    document.getElementById('view-pipeline').className = view === 'pipeline' ? 'btn btn-ghost btn-sm' : 'btn btn-secondary btn-sm';
    document.getElementById('view-list').className = view === 'list' ? 'btn btn-ghost btn-sm' : 'btn btn-secondary btn-sm';

    renderBugs();
}

// ─── Drag and Drop ──────────────────────────────────────────────────────

let draggedBugId = null;

function dragBug(event, bugId) {
    draggedBugId = bugId;
    event.dataTransfer.effectAllowed = 'move';
    event.target.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function leaveDrag(event) {
    event.currentTarget.classList.remove('drag-over');
}

async function dropBug(event, newStatus) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    if (!draggedBugId) return;

    try {
        await api(`/api/bugs/${draggedBugId}`, {
            method: 'PUT',
            body: { status: newStatus },
        });
        showToast(`Bug moved to ${newStatus.replace('_', ' ')}`, 'success');
        loadBugs();
    } catch (err) {
        showToast(err.message, 'error');
    }

    draggedBugId = null;
}

// ─── Filters ────────────────────────────────────────────────────────────

function filterBugs() {
    loadBugs();
}

// ─── CRUD ───────────────────────────────────────────────────────────────

function openCreateBugModal() {
    document.getElementById('bug-edit-id').value = '';
    document.getElementById('bug-title').value = '';
    document.getElementById('bug-description').value = '';
    document.getElementById('bug-severity').value = 'medium';
    document.getElementById('bug-assignee').value = '';
    document.getElementById('bug-modal-title').textContent = 'Report Bug';
    document.getElementById('bug-submit-btn').textContent = 'Create Bug';
    document.getElementById('bug-status-group').style.display = 'none';
    openModal('bug-modal');
}

function openEditBugModal(bugId) {
    const bug = allBugs.find(b => b.id === bugId);
    if (!bug) return;

    document.getElementById('bug-edit-id').value = bug.id;
    document.getElementById('bug-title').value = bug.title;
    document.getElementById('bug-description').value = bug.description || '';
    document.getElementById('bug-severity').value = bug.severity;
    document.getElementById('bug-assignee').value = bug.assigned_to || '';
    document.getElementById('bug-status').value = bug.status;
    document.getElementById('bug-modal-title').textContent = 'Edit Bug';
    document.getElementById('bug-submit-btn').textContent = 'Update Bug';
    document.getElementById('bug-status-group').style.display = 'block';
    openModal('bug-modal');
}

async function submitBug() {
    const editId = document.getElementById('bug-edit-id').value;
    const title = document.getElementById('bug-title').value.trim();
    if (!title) {
        showToast('Title is required', 'warning');
        return;
    }

    const body = {
        title,
        description: document.getElementById('bug-description').value,
        severity: document.getElementById('bug-severity').value,
        assigned_to: document.getElementById('bug-assignee').value || null,
    };

    if (editId) {
        body.status = document.getElementById('bug-status').value;
    }

    try {
        if (editId) {
            await api(`/api/bugs/${editId}`, { method: 'PUT', body });
            showToast('Bug updated!', 'success');
        } else {
            await api('/api/bugs', { method: 'POST', body });
            showToast('Bug created!', 'success');
        }
        closeModal('bug-modal');
        loadBugs();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteBug(bugId) {
    if (!confirm('Are you sure you want to delete this bug?')) return;
    try {
        await api(`/api/bugs/${bugId}`, { method: 'DELETE' });
        showToast('Bug deleted', 'success');
        loadBugs();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Bug Detail ─────────────────────────────────────────────────────────

async function showBugDetail(bugId) {
    const bug = allBugs.find(b => b.id === bugId);
    if (!bug) return;

    document.getElementById('bug-detail-title').textContent = bug.title;

    // Load history
    let historyHtml = '';
    try {
        const histData = await api(`/api/bugs/${bugId}/history`);
        if (histData.history && histData.history.length > 0) {
            historyHtml = `
                <h4 style="margin-top:var(--space-xl);margin-bottom:var(--space-base);">Audit Trail</h4>
                ${histData.history.map(h => `
                    <div class="activity-item">
                        <div class="activity-avatar">${h.changer ? getInitials(h.changer.full_name) : '?'}</div>
                        <div class="activity-content">
                            <div class="activity-text">
                                <strong>${h.changer ? h.changer.full_name : 'Unknown'}</strong>
                                changed <em>${h.field_changed}</em>
                                ${h.old_value ? `from "${h.old_value}"` : ''}
                                to "${h.new_value}"
                            </div>
                            <div class="activity-time">${timeAgo(h.changed_at)}</div>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    } catch (e) {}

    document.getElementById('bug-detail-body').innerHTML = `
        <div class="flex gap-md mb-lg">
            <span class="badge badge-${bug.severity}">${bug.severity}</span>
            <span class="badge badge-${bug.status}">${bug.status.replace('_', ' ')}</span>
        </div>
        <p style="color:var(--text-secondary);line-height:1.7;">${escapeHtml(bug.description || 'No description provided.')}</p>
        <div style="margin-top:var(--space-xl);display:grid;grid-template-columns:1fr 1fr;gap:var(--space-base);font-size:var(--font-sm);">
            <div><span class="text-muted">Reported by:</span> ${bug.reporter ? bug.reporter.full_name : '--'}</div>
            <div><span class="text-muted">Assigned to:</span> ${bug.assignee ? bug.assignee.full_name : 'Unassigned'}</div>
            <div><span class="text-muted">Created:</span> ${formatDateTime(bug.created_at)}</div>
            <div><span class="text-muted">Updated:</span> ${formatDateTime(bug.updated_at)}</div>
            <div><span class="text-muted">Attachments:</span> ${bug.attachment_count || 0}</div>
            ${bug.resolved_at ? `<div><span class="text-muted">Resolved:</span> ${formatDateTime(bug.resolved_at)}</div>` : ''}
        </div>
        ${historyHtml}
        <div style="margin-top:var(--space-xl);display:flex;gap:var(--space-sm);">
            <button class="btn btn-secondary btn-sm" onclick="closeModal('bug-detail-modal');openEditBugModal('${bug.id}')">Edit</button>
        </div>
    `;

    openModal('bug-detail-modal');
}

// ─── Team Members for Assignee Dropdown ─────────────────────────────────

async function loadTeamMembers() {
    try {
        const data = await api('/api/teams/members');
        const select = document.getElementById('bug-assignee');
        if (!select || !data.members) return;

        select.innerHTML = '<option value="">Unassigned</option>';
        data.members.forEach(m => {
            if (m.user) {
                const option = document.createElement('option');
                option.value = m.user.id;
                option.textContent = m.user.full_name;
                select.appendChild(option);
            }
        });
    } catch (e) {}
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
