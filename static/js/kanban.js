document.addEventListener('DOMContentLoaded', () => {
    loadIssues();

    // Re-load issues when workspace/app context changes
    document.getElementById('workspaceSelect')?.addEventListener('change', loadIssues);
    document.getElementById('appSelect')?.addEventListener('change', loadIssues);
});

async function loadIssues() {
    try {
        const response = await fetch('/api/kanban/issues');
        if (!response.ok) throw new Error('Failed to fetch issues');
        
        const data = await response.json();
        renderIssues(data.issues);
    } catch (error) {
        console.error('Error loading issues:', error);
        showToast('Error', 'Could not load kanban issues', 'danger');
    }
}

function renderIssues(issues) {
    // Clear all columns
    document.querySelectorAll('.kanban-tasks').forEach(col => {
        col.innerHTML = '';
        const status = col.parentElement.dataset.status;
        document.getElementById(`count-${status}`).innerText = '0';
    });

    const statusCounts = {
        todo: 0,
        in_progress: 0,
        review: 0,
        done: 0
    };

    issues.forEach(issue => {
        const col = document.getElementById(`tasks-${issue.status}`);
        if (col) {
            col.appendChild(createIssueCard(issue));
            statusCounts[issue.status]++;
        }
    });

    // Update counts
    Object.keys(statusCounts).forEach(status => {
        const countBadge = document.getElementById(`count-${status}`);
        if(countBadge) countBadge.innerText = statusCounts[status];
    });
}

function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.id = `issue-${issue.id}`;
    card.dataset.id = issue.id;
    
    // Drag events
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    // Priority Icon
    let priorityIcon = '';
    switch(issue.priority) {
        case 'low': priorityIcon = '<i class="bi bi-arrow-down priority-icon priority-low"></i>'; break;
        case 'medium': priorityIcon = '<i class="bi bi-dash priority-icon priority-medium"></i>'; break;
        case 'high': priorityIcon = '<i class="bi bi-arrow-up priority-icon priority-high"></i>'; break;
        case 'critical': priorityIcon = '<i class="bi bi-exclamation-triangle-fill priority-icon priority-critical"></i>'; break;
    }

    // Type Badge
    let typeClass = `type-${issue.type}`;

    card.innerHTML = `
        <div class="kanban-card-title">${escapeHtml(issue.title)}</div>
        <div class="kanban-card-meta">
            <div>
                <span class="type-badge ${typeClass}">${issue.type}</span>
            </div>
            <div>
                ${priorityIcon}
            </div>
        </div>
    `;

    return card;
}

// Drag and Drop Logic
let draggedCard = null;

function handleDragStart(e) {
    draggedCard = this;
    setTimeout(() => this.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedCard = null;
    
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    });
}

function allowDrop(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const column = e.target.closest('.kanban-column');
    if(column) {
        column.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }
}

function drop(e) {
    e.preventDefault();
    const column = e.target.closest('.kanban-column');
    if (!column || !draggedCard) return;
    
    const tasksContainer = column.querySelector('.kanban-tasks');
    const newStatus = column.dataset.status;
    const issueId = draggedCard.dataset.id;

    // Append to UI immediately for responsiveness
    tasksContainer.appendChild(draggedCard);
    
    // Reset borders
    document.querySelectorAll('.kanban-column').forEach(col => {
        col.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    });

    // API call to update status
    updateIssueStatus(issueId, newStatus);
}

async function updateIssueStatus(issueId, newStatus) {
    try {
        const response = await fetch(`/api/kanban/issues/${issueId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }
        
        // Reload issues to ensure sync and update counts
        loadIssues();
    } catch (error) {
        console.error('Error updating issue:', error);
        showToast('Error', 'Failed to update issue status', 'danger');
        // Revert UI on failure by reloading from server
        loadIssues(); 
    }
}

// Modal handling
function openCreateIssueModal() {
    document.getElementById('createIssueForm').reset();
    openModal('createIssueModal');
}

async function submitCreateIssue() {
    const title = document.getElementById('issueTitle').value;
    const description = document.getElementById('issueDescription').value;
    const type = document.getElementById('issueType').value;
    const priority = document.getElementById('issuePriority').value;

    if (!title) {
        showToast('Warning', 'Title is required', 'warning');
        return;
    }

    try {
        const response = await fetch('/api/kanban/issues', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, type, priority })
        });

        const result = await response.json();
        if (response.ok) {
            closeModal('createIssueModal');
            showToast('Success', 'Issue created successfully', 'success');
            loadIssues();
        } else {
            showToast('Error', result.detail || 'Failed to create issue', 'danger');
        }
    } catch (error) {
        console.error('Error creating issue:', error);
        showToast('Error', 'Could not create issue', 'danger');
    }
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
