/**
 * Reusable UI Components for World Quiz Championships
 * Contains common UI components used across the application
 */

/**
 * Modal component for confirmations and alerts
 */
class Modal {
    constructor(options = {}) {
        this.options = {
            title: options.title || '',
            content: options.content || '',
            buttons: options.buttons || [],
            closable: options.closable !== false,
            size: options.size || 'medium', // small, medium, large
            ...options
        };

        this.element = null;
        this.isOpen = false;
        this.create();
    }

    create() {
        // Create modal container
        this.element = DOM.create('div', { class: 'modal', style: 'display: none;' });

        // Create modal content
        const content = DOM.create('div', { class: `modal-content modal-${this.options.size}` });

        if (this.options.closable) {
            content.innerHTML = `
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            `;
        }

        // Add title if provided
        if (this.options.title) {
            const titleEl = DOM.create('h3', { text: this.options.title });
            content.appendChild(titleEl);
        }

        // Add content
        if (this.options.content) {
            const contentEl = DOM.create('div');
            if (typeof this.options.content === 'string') {
                contentEl.innerHTML = this.options.content;
            } else if (this.options.content instanceof HTMLElement) {
                contentEl.appendChild(this.options.content);
            }
            content.appendChild(contentEl);
        }

        // Add buttons
        if (this.options.buttons.length > 0) {
            const actions = DOM.create('div', { class: 'modal-actions' });
            this.options.buttons.forEach(btn => {
                const button = DOM.create('button', {
                    class: btn.class || 'btn btn-secondary',
                    text: btn.text || 'Button',
                    onclick: btn.onClick || (() => this.close())
                });
                actions.appendChild(button);
            });
            content.appendChild(actions);
        }

        this.element.appendChild(content);
        document.body.appendChild(this.element);
    }

    open() {
        this.isOpen = true;
        this.element.style.display = 'flex';
        return this;
    }

    close() {
        this.isOpen = false;
        this.element.style.display = 'none';
        return this;
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

/**
 * Button component helper
 */
const Button = {
    // Create a standard button
    create(text, options = {}) {
        const config = {
            text: text,
            class: 'btn',
            ...options
        };

        // Determine button variant
        if (options.primary) {
            config.class += ' btn-primary';
        } else if (options.secondary) {
            config.class += ' btn-secondary';
        } else if (options.danger) {
            config.class += ' btn-danger';
        } else if (options.success) {
            config.class += ' btn-success';
        } else if (options.warning) {
            config.class += ' btn-warning';
        } else if (!options.class || !options.class.includes('btn-')) {
            config.class += ' btn-secondary';
        }

        // Add size
        if (options.large) {
            config.class += ' btn-large';
        } else if (options.small) {
            config.class += ' btn-small';
        }

        // Add state
        if (options.disabled) {
            config.disabled = 'disabled';
        }

        const button = DOM.create('button', config);

        // Add click handler
        if (options.onClick) {
            button.addEventListener('click', options.onClick);
        }

        return button;
    },

    // Create button group
    createGroup(buttons, options = {}) {
        const container = DOM.create('div', {
            class: `button-group${options.vertical ? ' button-group-vertical' : ''}`
        });

        buttons.forEach(btnConfig => {
            const button = this.create(btnConfig.text, btnConfig);
            container.appendChild(button);
        });

        return container;
    }
};

/**
 * Loading indicator component
 */
class LoadingIndicator {
    constructor(options = {}) {
        this.options = {
            text: options.text || 'Loading...',
            size: options.size || 'medium', // small, medium, large
            type: options.type || 'spinner', // spinner, dots, bar
            ...options
        };

        this.element = this.create();
    }

    create() {
        const container = DOM.create('div', { class: `loading-indicator loading-${this.options.size}` });

        if (this.options.type === 'spinner') {
            container.innerHTML = `
                <div class="loading-spinner" role="status" aria-label="${this.options.text}">
                    <span class="sr-only">${this.options.text}</span>
                </div>
                ${this.options.text ? `<span class="loading-text">${this.options.text}</span>` : ''}
            `;
        } else if (this.options.type === 'dots') {
            container.innerHTML = `
                <div class="loading-dots">
                    <span></span><span></span><span></span>
                </div>
                ${this.options.text ? `<span class="loading-text">${this.options.text}</span>` : ''}
            `;
        } else if (this.options.type === 'bar') {
            container.innerHTML = `
                <div class="loading-bar">
                    <div class="loading-bar-fill"></div>
                </div>
                ${this.options.text ? `<span class="loading-text">${this.options.text}</span>` : ''}
            `;
        }

        return container;
    }

    show(container) {
        container.appendChild(this.element);
        this.element.style.display = '';
        return this;
    }

    hide() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        return this;
    }

    setText(text) {
        const textEl = this.element.querySelector('.loading-text');
        if (textEl) {
            textEl.textContent = text;
        }
        return this;
    }
}

/**
 * Toast/notification component (simple implementation)
 */
class Toast {
    constructor(message, options = {}) {
        this.message = message;
        this.options = {
            type: options.type || 'info', // info, success, warning, error
            duration: options.duration || 3000, // auto-hide after ms (0 = no auto-hide)
            position: options.position || 'top-right', // top-right, top-left, bottom-right, bottom-left
            ...options
        };

        this.element = null;
        this.timeout = null;
        this.create();
    }

    create() {
        const container = DOM.create('div', {
            class: `toast toast-${this.options.type}`,
            role: 'alert',
            'aria-live': 'assertive'
        });

        container.innerHTML = `
            <span class="toast-message">${this.message}</span>
            <button class="toast-close" aria-label="Close">&times;</button>
        `;

        // Add close handler
        const closeBtn = container.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => this.hide());

        // Position
        container.classList.add(`toast-${this.options.position}`);

        this.element = container;
        document.body.appendChild(container);

        // Auto-hide
        if (this.options.duration > 0) {
            this.timeout = setTimeout(() => this.hide(), this.options.duration);
        }

        return this;
    }

    show() {
        // Trigger reflow for animation
        this.element.offsetHeight;
        this.element.classList.add('toast-show');
        return this;
    }

    hide() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }

        this.element.classList.add('toast-hide');

        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            this.element = null;
        }, 300); // Match CSS transition

        return this;
    }
}

// Toast queue management
const ToastManager = {
    queue: [],
    maxVisible: 3,

    show(message, options = {}) {
        const toast = new Toast(message, options);
        toast.show();

        // Auto-cleanup for toast
        setTimeout(() => {
            if (toast.element) {
                toast.hide();
            }
        }, (options.duration || 3000) + 1000);

        return toast;
    },

    success(message, options = {}) {
        return this.show(message, { ...options, type: 'success' });
    },

    error(message, options = {}) {
        return this.show(message, { ...options, type: 'error' });
    },

    warning(message, options = {}) {
        return this.show(message, { ...options, type: 'warning' });
    },

    info(message, options = {}) {
        return this.show(message, { ...options, type: 'info' });
    }
};

/**
 * Progress bar component
 */
class ProgressBar {
    constructor(options = {}) {
        this.options = {
            min: options.min || 0,
            max: options.max || 100,
            value: options.value || 0,
            showLabel: options.showLabel !== false,
            labelText: options.labelText || '',
            ...options
        };

        this.element = this.create();
        this.update(this.options.value);
    }

    create() {
        const container = DOM.create('div', { class: 'progress-bar-container' });

        const progress = DOM.create('div', { class: 'progress-bar' });
        const fill = DOM.create('div', { class: 'progress-bar-fill' });

        progress.appendChild(fill);
        container.appendChild(progress);

        if (this.options.showLabel) {
            const label = DOM.create('div', {
                class: 'progress-bar-label',
                text: this.options.labelText || `${this.options.value}/${this.options.max}`
            });
            container.appendChild(label);
        }

        return container;
    }

    update(value) {
        this.options.value = Math.max(this.options.min, Math.min(this.options.max, value));
        const percentage = ((this.options.value - this.options.min) / (this.options.max - this.options.min)) * 100;

        const fill = this.element.querySelector('.progress-bar-fill');
        if (fill) {
            fill.style.width = `${percentage}%`;
        }

        // Update label if exists
        const label = this.element.querySelector('.progress-bar-label');
        if (label) {
            const labelText = this.options.getLabelText ?
                this.options.getLabelText(this.options.value, this.options.max) :
                this.options.labelText || `${this.options.value}/${this.options.max}`;
            label.textContent = labelText;
        }

        return this;
    }

    getValue() {
        return this.options.value;
    }

    setMax(max) {
        this.options.max = max;
        this.update(this.options.value);
        return this;
    }
}

// Export components globally
window.Modal = Modal;
window.Button = Button;
window.LoadingIndicator = LoadingIndicator;
window.Toast = Toast;
window.ToastManager = ToastManager;
window.ProgressBar = ProgressBar;
