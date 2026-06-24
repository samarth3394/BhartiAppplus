/**
 * Nexvora Error Tracking SDK
 * Version: 1.0.0
 * 
 * Automatically catches unhandled errors and promise rejections 
 * and securely transmits them to your Nexvora dashboard.
 */

(function(window) {
    // Prevent multiple initializations
    if (window.Nexvora) return;

    class NexvoraTracker {
        constructor() {
            this.clientKey = null;
            this.endpoint = 'http://127.0.0.1:5000/api/ingest/error';
            this.initialized = false;
        }

        init(config) {
            if (!config || !config.clientKey) {
                console.error('Nexvora: clientKey is required for initialization.');
                return;
            }
            this.clientKey = config.clientKey;
            if (config.endpoint) {
                this.endpoint = config.endpoint;
            }
            this.initialized = true;
            this._setupListeners();
            console.log('Nexvora Automated Error Tracking Initialized.');
        }

        _setupListeners() {
            // Catch synchronous errors
            window.addEventListener('error', (event) => {
                this._sendError({
                    message: event.message,
                    url: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    stack: event.error ? event.error.stack : 'No stack trace available'
                });
            });

            // Catch asynchronous unhandled promise rejections
            window.addEventListener('unhandledrejection', (event) => {
                let message = 'Unhandled Promise Rejection';
                let stack = 'No stack trace available';

                if (event.reason) {
                    message = event.reason.message || event.reason.toString();
                    stack = event.reason.stack || stack;
                }

                this._sendError({
                    message: message,
                    url: window.location.href,
                    line: 0,
                    column: 0,
                    stack: stack
                });
            });
        }

        _sendError(errorData) {
            if (!this.initialized) return;

            const payload = {
                message: errorData.message,
                url: errorData.url,
                line: errorData.line,
                column: errorData.column,
                stack: errorData.stack,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString(),
                href: window.location.href
            };

            fetch(this.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Nexvora-Key': this.clientKey
                },
                body: JSON.stringify(payload)
            }).catch(err => {
                // Silently fail if tracking server is unreachable to avoid spamming the console
                // console.error('Nexvora failed to log error:', err);
            });
        }
    }

    // Expose global variable
    window.Nexvora = new NexvoraTracker();

})(window);
