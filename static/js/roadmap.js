/**
 * Linear-style Roadmap JavaScript
 */

let allFeatures = [];

document.addEventListener('DOMContentLoaded', () => {
    loadFeatures();
});

async function loadFeatures() {
    try {
        const data = await api('/api/roadmap');
        allFeatures = data.features || [];
        renderRoadmap();
    } catch (err) {
        showToast('Failed to load roadmap features', 'error');
    }
}

function renderRoadmap() {
    const statuses = ['planned', 'in_progress', 'completed'];
    
    statuses.forEach(status => {
        const container = document.getElementById(`col-${status}`);
        const countEl = document.getElementById(`count-${status}`);
        
        const features = allFeatures.filter(f => f.status === status);
        countEl.textContent = features.length;
        
        if (features.length === 0) {
            container.innerHTML = `
                <div style="border:1px dashed rgba(255,255,255,0.1); border-radius:var(--radius-md); padding:var(--space-xl); text-align:center; color:var(--text-muted); font-size:var(--font-sm);">
                    No features ${status.replace('_', ' ')}
                </div>
            `;
            return;
        }

        container.innerHTML = features.map(f => {
            // Determine priority icon and color
            let pIcon = 'activity';
            let pColor = 'var(--text-muted)';
            if (f.priority === 'urgent') { pIcon = 'alert-triangle'; pColor = 'var(--danger)'; }
            else if (f.priority === 'high') { pIcon = 'arrow-up'; pColor = 'var(--warning)'; }
            else if (f.priority === 'low') { pIcon = 'arrow-down'; pColor = 'var(--text-muted)'; }
            else { pIcon = 'minus'; pColor = 'var(--text-secondary)'; }

            const dueDateHtml = f.due_date ? 
                `<span style="display:flex; align-items:center; gap:4px; color:var(--text-muted);">
                    <i data-lucide="calendar" style="width:12px; height:12px;"></i> 
                    ${new Date(f.due_date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                </span>` : '';

            return `
                <div class="feature-card" onclick="openEditFeatureModal('${f.id}')" style="
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-md);
                    padding: var(--space-md);
                    cursor: pointer;
                    transition: all 0.2s ease;
                " onmouseover="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.transform='translateY(-2px)';" 
                   onmouseout="this.style.borderColor='var(--border-light)'; this.style.transform='translateY(0)';">
                    
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:var(--space-sm);">
                        <h4 style="margin:0; font-size:var(--font-base); font-weight:500; color:var(--text-primary); line-height:1.4;">${escapeHtml(f.title)}</h4>
                    </div>
                    
                    ${f.description ? `<p style="margin:0; margin-bottom:var(--space-md); font-size:13px; color:var(--text-secondary); line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${escapeHtml(f.description)}</p>` : ''}
                    
                    <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px;">
                        <span style="display:flex; align-items:center; gap:4px; color:${pColor};" title="Priority: ${f.priority}">
                            <i data-lucide="${pIcon}" style="width:14px; height:14px;"></i>
                            <span style="text-transform:capitalize;">${f.priority}</span>
                        </span>
                        ${dueDateHtml}
                    </div>
                </div>
            `;
        }).join('');
    });
    
    // Re-initialize lucide icons for dynamically added elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

// ─── Modal Functions ───────────────────────────────────────────────────

function openCreateFeatureModal() {
    document.getElementById('feature-id').value = '';
    document.getElementById('feature-title').value = '';
    document.getElementById('feature-description').value = '';
    document.getElementById('feature-status').value = 'planned';
    document.getElementById('feature-priority').value = 'medium';
    document.getElementById('feature-start').value = '';
    document.getElementById('feature-due').value = '';
    
    document.getElementById('feature-modal-title').textContent = 'New Feature';
    document.getElementById('feature-submit-btn').textContent = 'Create Feature';
    document.getElementById('feature-delete-btn').classList.add('hidden');
    
    openModal('feature-modal');
}

function openEditFeatureModal(id) {
    const feature = allFeatures.find(f => f.id === id);
    if (!feature) return;

    document.getElementById('feature-id').value = feature.id;
    document.getElementById('feature-title').value = feature.title;
    document.getElementById('feature-description').value = feature.description || '';
    document.getElementById('feature-status').value = feature.status;
    document.getElementById('feature-priority').value = feature.priority;
    
    if (feature.start_date) document.getElementById('feature-start').value = feature.start_date.split('T')[0];
    else document.getElementById('feature-start').value = '';
    
    if (feature.due_date) document.getElementById('feature-due').value = feature.due_date.split('T')[0];
    else document.getElementById('feature-due').value = '';

    document.getElementById('feature-modal-title').textContent = 'Edit Feature';
    document.getElementById('feature-submit-btn').textContent = 'Update Feature';
    document.getElementById('feature-delete-btn').classList.remove('hidden');
    
    openModal('feature-modal');
}

async function submitFeature() {
    const id = document.getElementById('feature-id').value;
    const title = document.getElementById('feature-title').value.trim();
    if (!title) {
        showToast('Feature title is required', 'warning');
        return;
    }

    const body = {
        title,
        description: document.getElementById('feature-description').value,
        status: document.getElementById('feature-status').value,
        priority: document.getElementById('feature-priority').value,
        start_date: document.getElementById('feature-start').value || null,
        due_date: document.getElementById('feature-due').value || null,
    };

    try {
        if (id) {
            await api(`/api/roadmap/${id}`, { method: 'PUT', body });
            showToast('Feature updated', 'success');
        } else {
            await api('/api/roadmap', { method: 'POST', body });
            showToast('Feature created', 'success');
        }
        closeModal('feature-modal');
        loadFeatures();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function deleteFeature() {
    const id = document.getElementById('feature-id').value;
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this roadmap feature?')) return;
    
    try {
        await api(`/api/roadmap/${id}`, { method: 'DELETE' });
        showToast('Feature deleted', 'success');
        closeModal('feature-modal');
        loadFeatures();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
