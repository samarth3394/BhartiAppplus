document.addEventListener('DOMContentLoaded', () => {
    const analyzeBtn = document.getElementById('analyze-btn');
    const logInput = document.getElementById('log-input');
    const loadingState = document.getElementById('loading-state');
    const resultsContainer = document.getElementById('results-container');
    const summarySection = document.getElementById('summary-section');
    const anomaliesList = document.getElementById('anomalies-list');

    analyzeBtn.addEventListener('click', async () => {
        const logs = logInput.value.trim();
        if (!logs) {
            alert('Please paste some logs to analyze.');
            return;
        }

        // Show loading state
        analyzeBtn.disabled = true;
        loadingState.classList.remove('hidden');
        resultsContainer.classList.add('hidden');

        try {
            const response = await fetch('/api/ai-logs/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ logs })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis failed');
            }

            const data = await response.json();
            
            // Render results
            summarySection.textContent = data.summary;
            
            anomaliesList.innerHTML = '';
            if (data.anomalies && data.anomalies.length > 0) {
                data.anomalies.forEach(anomaly => {
                    const color = anomaly.level.toLowerCase().includes('error') ? 'var(--danger)' : 'var(--warning)';
                    const card = document.createElement('div');
                    card.style.borderLeft = 4px solid \;
                    card.style.padding = 'var(--space-md)';
                    card.style.backgroundColor = 'var(--surface)';
                    card.style.borderRadius = 'var(--radius-md)';
                    
                    card.innerHTML = \
                        <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-sm);">
                            <span style="font-weight: bold; color: \;">\</span>
                            <span style="color: var(--text-muted); font-size: var(--font-xs);">\</span>
                        </div>
                        <p style="margin-bottom: var(--space-sm);"><strong>Issue:</strong> \</p>
                        <p style="color: var(--text-muted);"><strong>Recommendation:</strong> \</p>
                    \;
                    anomaliesList.appendChild(card);
                });
            } else {
                anomaliesList.innerHTML = '<p class="text-muted">No specific anomalies detected.</p>';
            }

            resultsContainer.classList.remove('hidden');
        } catch (error) {
            alert('Error analyzing logs: ' + error.message);
        } finally {
            analyzeBtn.disabled = false;
            loadingState.classList.add('hidden');
        }
    });
});
