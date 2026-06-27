/**
 * Maintenance Checklist — Task CRUD, completion, auto-recurrence
 */

let completingTaskId = null;

document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
    try {
        const data = await api('/api/maintenance');

        if (data.total === 0) {
            document.getElementById('tasks-container').classList.add('hidden');
            document.getElementById('no-tasks-state').classList.remove('hidden');
            return;
        }

        document.getElementById('tasks-container').classList.remove('hidden');
        document.getElementById('no-tasks-state').classList.add('hidden');

        // Hide Create button if Viewer
        const createBtn = document.getElementById('new-task-btn');
        if (createBtn) {
            if (data.role === 'viewer') {
                createBtn.style.display = 'none';
            } else {
                createBtn.style.display = 'inline-block';
            }
        }

        renderTaskGroup('overdue', data.tasks.overdue, data.role);
        renderTaskGroup('today', data.tasks.today, data.role);
        renderTaskGroup('upcoming', data.tasks.upcoming, data.role);

    } catch (err) {
        showToast('Failed to load tasks', 'error');
    }
}

function renderTaskGroup(group, tasks, role) {
    const container = document.getElementById(`${group}-tasks`);
    const countEl = document.getElementById(`${group}-count`);
    const groupEl = document.getElementById(`${group}-group`);

    countEl.textContent = tasks.length;

    if (tasks.length === 0) {
        groupEl.style.display = 'none';
        return;
    }

    groupEl.style.display = 'block';

    const canEdit = (role === 'admin' || role === 'developer');
    const canDelete = (role === 'admin');

    container.innerHTML = tasks.map(task => `
        <div class="task-item ${group === 'overdue' ? 'overdue' : ''} animate-in">
            ${canEdit ? `
            <button class="task-check" onclick="openCompleteModal('${task.id}', '${escapeAttr(task.title)}')" title="Mark complete">
                ✓
            </button>
            ` : '<div style="width:24px; height:24px;"></div>'}
            <div class="task-info">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    <span class="badge badge-${task.frequency}">${task.frequency}</span>
                    <span>Due: ${formatDate(task.due_date)}</span>
                    ${task.last_completed ? `<span>Last done: ${formatDate(task.last_completed)} by ${task.last_completed_by || '--'}</span>` : '<span>Never completed</span>'}
                </div>
            </div>
            <div class="task-actions">
                ${canEdit ? `<button class="btn btn-ghost btn-sm" onclick="openEditTaskModal('${task.id}')" title="Edit">✏️</button>` : ''}
                ${canDelete ? `<button class="btn btn-ghost btn-sm text-danger" onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>` : ''}
            </div>
        </div>
    `).join('');
}

// ─── Create/Edit Task ───────────────────────────────────────────────────

function openCreateTaskModal() {
    document.getElementById('task-edit-id').value = '';
    document.getElementById('task-title').value = '';
    document.getElementById('task-description').value = '';
    document.getElementById('task-frequency').value = 'weekly';
    document.getElementById('task-due-date').value = '';
    document.getElementById('task-modal-title').textContent = 'New Maintenance Task';
    document.getElementById('task-submit-btn').textContent = 'Create Task';
    openModal('task-modal');
}

function openEditTaskModal(taskId) {
    // We'd need to fetch task data or find it in loaded data
    // For now, just open the modal for creation with pre-filled data
    openCreateTaskModal();
    document.getElementById('task-edit-id').value = taskId;
    document.getElementById('task-modal-title').textContent = 'Edit Task';
    document.getElementById('task-submit-btn').textContent = 'Update Task';
}

async function submitTask() {
    const editId = document.getElementById('task-edit-id').value;
    const title = document.getElementById('task-title').value.trim();

    if (!title) {
        showToast('Title is required', 'warning');
        return;
    }

    const body = {
        title,
        description: document.getElementById('task-description').value,
        frequency: document.getElementById('task-frequency').value,
        due_date: document.getElementById('task-due-date').value || null,
    };

    try {
        if (editId) {
            await api(`/api/maintenance/${editId}`, { method: 'PUT', body });
            showToast('Task updated!', 'success');
        } else {
            await api('/api/maintenance', { method: 'POST', body });
            showToast('Task created!', 'success');
        }
        closeModal('task-modal');
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Complete Task ──────────────────────────────────────────────────────

function openCompleteModal(taskId, taskName) {
    completingTaskId = taskId;
    document.getElementById('complete-task-name').textContent = taskName;
    document.getElementById('complete-notes').value = '';
    openModal('complete-modal');
}

async function confirmComplete() {
    if (!completingTaskId) return;

    const notes = document.getElementById('complete-notes').value;

    try {
        await api(`/api/maintenance/${completingTaskId}/complete`, {
            method: 'POST',
            body: { notes },
        });
        showToast('Task completed! Next occurrence scheduled.', 'success');
        closeModal('complete-modal');
        completingTaskId = null;
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ─── Delete Task ────────────────────────────────────────────────────────

async function deleteTask(taskId) {
    if (!confirm('Delete this maintenance task?')) return;
    try {
        await api(`/api/maintenance/${taskId}`, { method: 'DELETE' });
        showToast('Task deleted', 'success');
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
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
