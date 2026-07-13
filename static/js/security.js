document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scan-btn');
    const depsInput = document.getElementById('deps-input');
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    const summarySection = document.getElementById('summary-section');
    const vulnerabilitiesList = document.getElementById('vulnerabilities-list');

    scanBtn.addEventListener('click', async () => {
        const dependencies = depsInput.value.trim();
        if (!dependencies) {
            alert('Please paste some dependencies to scan.');
            return;
        }

        // Show loading state
        scanBtn.disabled = true;
        loadingState.classList.remove('hidden');
        resultsContainer.classList.add('hidden');

        try {
            const response = await fetch('/api/security/scan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dependencies })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Scan failed');
            }

            const data = await response.json();
            
            // Render results
            summarySection.textContent = data.summary;
            
            vulnerabilitiesList.innerHTML = '';
            if (data.vulnerabilities && data.vulnerabilities.length > 0) {
                data.vulnerabilities.forEach(vuln => {
                    let color = 'var(--warning)';
                    if (vuln.severity.toLowerCase() === 'high' || vuln.severity.toLowerCase() === 'critical') {
                        color = 'var(--danger)';
                    } else if (vuln.severity.toLowerCase() === 'low') {
                        color = 'var(--info)';
                    }

                    const card = document.createElement('div');
                    card.style.borderLeft = 4px solid \;
                    card.style.padding = 'var(--space-md)';
                    card.style.backgroundColor = 'var(--surface)';
                    card.style.borderRadius = 'var(--radius-md)';
                    
                    card.innerHTML = \
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                            <span style="font-weight: bold; font-size: var(--font-lg);">\</span>
                            <span style="font-weight: bold; color: \; padding: 2px 8px; border-radius: 12px; background: \22;">\</span>
                        </div>
                        <p style="margin-bottom: var(--space-sm);"><strong>Issue:</strong> \</p>
                        <p style="color: var(--text-muted);"><strong>Recommendation:</strong> \</p>
                    \;
                    vulnerabilitiesList.appendChild(card);
                });
            } else {
                vulnerabilitiesList.innerHTML = '<p class="text-success" style="font-weight: bold;"><i data-lucide="check-circle"></i> No known vulnerabilities found!</p>';
                if (window.lucide) {
                    lucide.createIcons();
                }
            }

            resultsContainer.classList.remove('hidden');
        } catch (error) {
            alert('Error scanning dependencies: ' + error.message);
        } finally {
            scanBtn.disabled = false;
            loadingState.classList.add('hidden');
        }
    });
});
