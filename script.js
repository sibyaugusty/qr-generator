
/**
 * Advanced QR Code Generator with Professional Features
 * Responsive design with mobile optimization
 */
class ProfessionalQRGenerator {
    constructor() {
        this.currentContentType = 'link';
        this.currentFrame = 'none';
        this.currentCornerStyle = 'square';
        this.currentPatternStyle = 'square';
        this.logoImage = null;
        this.logoSize = 20;
        this.debounceTimer = null;
        this.isGenerating = false;

        this.initializeElements();
        this.setupEventListeners();
        this.initializeTheme();
        this.renderContentForm();
    }

    initializeElements() {
        this.elements = {
            contentTypes: document.querySelectorAll('.content-type'),
            contentForm: document.getElementById('contentForm'),
            designTabs: document.querySelectorAll('.design-tab'),
            frameOptions: document.querySelectorAll('.frame-option'),
            qrPreview: document.getElementById('qrPreview'),
            qrPlaceholder: document.getElementById('qrPlaceholder'),
            qrCodeDisplay: document.getElementById('qrCodeDisplay'),
            downloadBtn: document.getElementById('downloadBtn'),
            clearBtn: document.getElementById('clearBtn'),
            messageContainer: document.getElementById('messageContainer'),
            themeToggle: document.getElementById('themeToggle'),
            cornerStyle: document.getElementById('cornerStyle'),
            patternStyle: document.getElementById('patternStyle'),
            logoUpload: document.getElementById('logoUpload'),
            logoSize: document.getElementById('logoSize')
        };
    }

    setupEventListeners() {
        // Content type selection
        this.elements.contentTypes.forEach(type => {
            type.addEventListener('click', () => this.selectContentType(type));
        });

        // Design tabs
        this.elements.designTabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchDesignTab(tab));
        });

        // Frame selection
        this.elements.frameOptions.forEach(frame => {
            frame.addEventListener('click', () => this.selectFrame(frame));
        });

        // Design options
        this.elements.cornerStyle?.addEventListener('change', () => this.regenerateQR());
        this.elements.patternStyle?.addEventListener('change', () => this.regenerateQR());
        this.elements.logoUpload?.addEventListener('change', (e) => this.handleLogoUpload(e));
        this.elements.logoSize?.addEventListener('input', () => this.regenerateQR());

        // Action buttons
        this.elements.downloadBtn.addEventListener('click', () => this.downloadQR());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Responsive handling
        window.addEventListener('resize', () => this.handleResize());
    }

    selectContentType(selectedType) {
        // Update active state
        this.elements.contentTypes.forEach(type => type.classList.remove('active'));
        selectedType.classList.add('active');

        this.currentContentType = selectedType.dataset.type;
        this.renderContentForm();
        this.clearQR();
    }

    renderContentForm() {
        const formConfigs = {
            link: {
                title: 'Enter your Website',
                fields: [
                    { type: 'url', name: 'url', placeholder: 'https://', label: 'Website URL' }
                ]
            },
            text: {
                title: 'Enter your Text',
                fields: [
                    { type: 'textarea', name: 'text', placeholder: 'Type your text here...', label: 'Text Content' }
                ]
            },
            email: {
                title: 'Enter Email Details',
                fields: [
                    { type: 'email', name: 'email', placeholder: 'example@email.com', label: 'Email Address' },
                    { type: 'text', name: 'subject', placeholder: 'Subject (optional)', label: 'Subject' },
                    { type: 'textarea', name: 'body', placeholder: 'Message (optional)', label: 'Message' }
                ]
            },
            call: {
                title: 'Enter Phone Number',
                fields: [
                    { type: 'tel', name: 'phone', placeholder: '+1234567890', label: 'Phone Number' }
                ]
            },
            sms: {
                title: 'Enter SMS Details',
                fields: [
                    { type: 'tel', name: 'phone', placeholder: '+1234567890', label: 'Phone Number' },
                    { type: 'text', name: 'message', placeholder: 'Message (optional)', label: 'SMS Message' }
                ]
            },
            vcard: {
                title: 'Enter Contact Details',
                fields: [
                    { type: 'text', name: 'firstName', placeholder: 'First Name', label: 'First Name' },
                    { type: 'text', name: 'lastName', placeholder: 'Last Name', label: 'Last Name' },
                    { type: 'tel', name: 'phone', placeholder: '+1234567890', label: 'Phone' },
                    { type: 'email', name: 'email', placeholder: 'email@example.com', label: 'Email' },
                    { type: 'text', name: 'organization', placeholder: 'Company (optional)', label: 'Organization' }
                ]
            },
            whatsapp: {
                title: 'Enter WhatsApp Details',
                fields: [
                    { type: 'tel', name: 'phone', placeholder: '+1234567890', label: 'WhatsApp Number' },
                    { type: 'text', name: 'message', placeholder: 'Pre-filled message (optional)', label: 'Message' }
                ]
            },
            wifi: {
                title: 'Enter Wi-Fi Details',
                fields: [
                    { type: 'text', name: 'ssid', placeholder: 'Network Name', label: 'SSID' },
                    { type: 'password', name: 'password', placeholder: 'Password', label: 'Password' },
                    { type: 'select', name: 'security', label: 'Security Type', options: ['WPA', 'WEP', 'Open'] }
                ]
            },
            event: {
                title: 'Enter Event Details',
                fields: [
                    { type: 'text', name: 'title', placeholder: 'Event Title', label: 'Title' },
                    { type: 'datetime-local', name: 'start', label: 'Start Date & Time' },
                    { type: 'datetime-local', name: 'end', label: 'End Date & Time' },
                    { type: 'text', name: 'location', placeholder: 'Location (optional)', label: 'Location' }
                ]
            }
        };

        const config = formConfigs[this.currentContentType] || formConfigs.text;
        let formHTML = `<label class="input-label">${config.title}</label>`;

        config.fields.forEach(field => {
            if (field.type === 'textarea') {
                formHTML += `
                            <div class="input-group">
                                <textarea 
                                    class="input-field" 
                                    name="${field.name}" 
                                    placeholder="${field.placeholder}"
                                    rows="4"
                                ></textarea>
                            </div>
                        `;
            } else if (field.type === 'select') {
                formHTML += `
                            <div class="input-group">
                                <label class="input-label">${field.label}</label>
                                <select class="input-field" name="${field.name}">
                                    ${field.options.map(option => `<option value="${option}">${option}</option>`).join('')}
                                </select>
                            </div>
                        `;
            } else {
                formHTML += `
                            <div class="input-group">
                                ${field.label ? `<label class="input-label">${field.label}</label>` : ''}
                                <input 
                                    type="${field.type}" 
                                    class="input-field" 
                                    name="${field.name}" 
                                    placeholder="${field.placeholder || ''}"
                                />
                            </div>
                        `;
            }
        });

        this.elements.contentForm.innerHTML = formHTML;

        // Add event listeners to form fields
        const formFields = this.elements.contentForm.querySelectorAll('.input-field');
        formFields.forEach(field => {
            field.addEventListener('input', () => this.handleFormInput());
        });
    }

    handleFormInput() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.generateQRFromForm();
        }, 500);
    }

    generateQRFromForm() {
        const formData = new FormData();
        const inputs = this.elements.contentForm.querySelectorAll('.input-field');

        inputs.forEach(input => {
            formData.append(input.name, input.value);
        });

        const qrText = this.buildQRText(formData);
        if (qrText) {
            this.generateQR(qrText);
        } else {
            this.clearQR();
        }
    }

    buildQRText(formData) {
        const data = Object.fromEntries(formData.entries());

        switch (this.currentContentType) {
            case 'link':
                return data.url ? (data.url.startsWith('http') ? data.url : `https://${data.url}`) : '';

            case 'text':
                return data.text || '';

            case 'email':
                if (!data.email) return '';
                let emailText = `mailto:${data.email}`;
                const params = [];
                if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
                if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);
                return params.length ? `${emailText}?${params.join('&')}` : emailText;

            case 'call':
                return data.phone ? `tel:${data.phone}` : '';

            case 'sms':
                if (!data.phone) return '';
                return data.message ? `sms:${data.phone}?body=${encodeURIComponent(data.message)}` : `sms:${data.phone}`;

            case 'vcard':
                if (!data.firstName && !data.lastName) return '';
                return `BEGIN:VCARD
VERSION:3.0
FN:${data.firstName} ${data.lastName}
N:${data.lastName};${data.firstName};;;
${data.phone ? `TEL:${data.phone}` : ''}
${data.email ? `EMAIL:${data.email}` : ''}
${data.organization ? `ORG:${data.organization}` : ''}
END:VCARD`;

            case 'whatsapp':
                if (!data.phone) return '';
                const cleanPhone = data.phone.replace(/\D/g, '');
                return data.message ?
                    `https://wa.me/${cleanPhone}?text=${encodeURIComponent(data.message)}` :
                    `https://wa.me/${cleanPhone}`;

            case 'wifi':
                if (!data.ssid) return '';
                return `WIFI:T:${data.security || 'WPA'};S:${data.ssid};P:${data.password || ''};;`;

            case 'event':
                if (!data.title) return '';
                const startDate = data.start ? new Date(data.start).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
                const endDate = data.end ? new Date(data.end).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z' : '';
                return `BEGIN:VEVENT
SUMMARY:${data.title}
${startDate ? `DTSTART:${startDate}` : ''}
${endDate ? `DTEND:${endDate}` : ''}
${data.location ? `LOCATION:${data.location}` : ''}
END:VEVENT`;

            default:
                return '';
        }
    }

    async generateQR(text) {
        if (this.isGenerating || !text.trim()) return;

        this.isGenerating = true;
        this.showLoading();

        try {
            await this.delay(300); // Smooth UX

            const qr = qrcode(0, 'M');
            qr.addData(text);
            qr.make();

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const modules = qr.getModuleCount();
            const cellSize = 8;
            const margin = 4;

            canvas.width = canvas.height = (modules * cellSize) + (margin * 2 * cellSize);

            // Apply styling based on current theme and options
            this.renderQRCode(ctx, qr, canvas.width, canvas.height, cellSize, margin);

            // Apply frame if selected
            const finalCanvas = await this.applyFrame(canvas);

            // Show result
            this.elements.qrCodeDisplay.innerHTML = '';
            this.elements.qrCodeDisplay.appendChild(finalCanvas);
            this.showQRCode();

            this.showMessage('QR Code generated successfully!', 'success');

        } catch (error) {
            console.error('QR generation failed:', error);
            this.showMessage('Failed to generate QR code', 'error');
            this.clearQR();
        } finally {
            this.isGenerating = false;
        }
    }

    renderQRCode(ctx, qr, width, height, cellSize, margin) {
        const modules = qr.getModuleCount();
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

        // Colors
        const darkColor = isDark ? '#f1f5f9' : '#000000';
        const lightColor = isDark ? '#1f2937' : '#ffffff';

        // Background
        ctx.fillStyle = lightColor;
        ctx.fillRect(0, 0, width, height);

        // QR modules
        ctx.fillStyle = darkColor;

        for (let row = 0; row < modules; row++) {
            for (let col = 0; col < modules; col++) {
                if (qr.isDark(row, col)) {
                    const x = (col * cellSize) + (margin * cellSize);
                    const y = (row * cellSize) + (margin * cellSize);

                    // Apply pattern style
                    switch (this.currentPatternStyle) {
                        case 'circle':
                            ctx.beginPath();
                            ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, 2 * Math.PI);
                            ctx.fill();
                            break;
                        case 'rounded':
                            this.roundedRect(ctx, x, y, cellSize, cellSize, cellSize * 0.2);
                            ctx.fill();
                            break;
                        default:
                            ctx.fillRect(x, y, cellSize, cellSize);
                    }
                }
            }
        }

        // Add logo if present
        if (this.logoImage) {
            this.addLogoToCanvas(ctx, width, height);
        }
    }

    roundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }

    addLogoToCanvas(ctx, width, height) {
        const logoSizePixels = (width * this.logoSize) / 100;
        const x = (width - logoSizePixels) / 2;
        const y = (height - logoSizePixels) / 2;

        // White background for logo
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 5, y - 5, logoSizePixels + 10, logoSizePixels + 10);

        ctx.drawImage(this.logoImage, x, y, logoSizePixels, logoSizePixels);
    }

    async applyFrame(canvas) {
        if (this.currentFrame === 'none') return canvas;

        const framedCanvas = document.createElement('canvas');
        const ctx = framedCanvas.getContext('2d');
        const frameSize = 40;

        framedCanvas.width = canvas.width + (frameSize * 2);
        framedCanvas.height = canvas.height + (frameSize * 2);

        // Frame background
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        ctx.fillStyle = isDark ? '#374151' : '#e5e7eb';
        ctx.fillRect(0, 0, framedCanvas.width, framedCanvas.height);

        // Draw QR code in center
        ctx.drawImage(canvas, frameSize, frameSize);

        return framedCanvas;
    }

    selectFrame(selectedFrame) {
        this.elements.frameOptions.forEach(frame => frame.classList.remove('active'));
        selectedFrame.classList.add('active');
        this.currentFrame = selectedFrame.dataset.frame;
        this.regenerateQR();
    }

    switchDesignTab(activeTab) {
        // Update tab states
        this.elements.designTabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');

        // Show/hide content
        const tabName = activeTab.dataset.tab;
        document.querySelectorAll('.design-content').forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(`${tabName}Tab`).style.display = 'block';
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.logoImage = img;
                this.regenerateQR();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    regenerateQR() {
        if (this.elements.qrCodeDisplay.querySelector('canvas')) {
            this.generateQRFromForm();
        }
    }

    showLoading() {
        this.elements.qrPlaceholder.style.display = 'none';
        this.elements.qrCodeDisplay.style.display = 'flex';
        this.elements.qrCodeDisplay.innerHTML = `
                    <div style="text-align: center; color: var(--primary-color);">
                        <div class="loading-spinner"></div>
                        <p>Generating QR Code...</p>
                    </div>
                `;
        this.elements.downloadBtn.disabled = true;
    }

    showQRCode() {
        this.elements.qrPlaceholder.style.display = 'none';
        this.elements.qrCodeDisplay.style.display = 'flex';
        this.elements.downloadBtn.disabled = false;

        // Add animation
        this.elements.qrCodeDisplay.classList.add('fade-in');
        setTimeout(() => {
            this.elements.qrCodeDisplay.classList.remove('fade-in');
        }, 500);
    }

    clearQR() {
        this.elements.qrPlaceholder.style.display = 'block';
        this.elements.qrCodeDisplay.style.display = 'none';
        this.elements.qrCodeDisplay.innerHTML = '';
        this.elements.downloadBtn.disabled = true;
    }

    downloadQR() {
        const canvas = this.elements.qrCodeDisplay.querySelector('canvas');
        if (!canvas) {
            this.showMessage('No QR code to download', 'error');
            return;
        }

        try {
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            link.download = `qrcode-${this.currentContentType}-${timestamp}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            this.showMessage('QR code downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showMessage('Failed to download QR code', 'error');
        }
    }

    clearAll() {
        // Reset form
        const inputs = this.elements.contentForm.querySelectorAll('.input-field');
        inputs.forEach(input => {
            input.value = '';
        });

        // Reset design options
        this.currentFrame = 'none';
        this.currentCornerStyle = 'square';
        this.currentPatternStyle = 'square';
        this.logoImage = null;

        // Update UI
        this.elements.frameOptions.forEach(frame => frame.classList.remove('active'));
        this.elements.frameOptions[0].classList.add('active');

        this.clearQR();
        this.clearMessages();
        this.showMessage('Reset complete', 'success');
    }

    showMessage(message, type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            loading: 'fas fa-spinner fa-spin'
        };

        this.elements.messageContainer.innerHTML = `
                    <div class="message ${type} fade-in">
                        <i class="${icons[type]}"></i>
                        <span>${message}</span>
                    </div>
                `;

        if (type === 'success') {
            setTimeout(() => this.clearMessages(), 3000);
        }
    }

    clearMessages() {
        this.elements.messageContainer.innerHTML = '';
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('qr-theme') || 'light';
        this.setTheme(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('qr-theme', theme);

        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';

        // Regenerate QR if exists
        this.regenerateQR();
    }

    handleResize() {
        // Handle responsive behavior
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Mobile optimizations
            this.elements.qrPreview.style.minHeight = '200px';
        } else {
            this.elements.qrPreview.style.minHeight = '300px';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ProfessionalQRGenerator();
    } catch (error) {
        console.error('Failed to initialize QR Generator:', error);
    }
});

// Handle viewport changes for better mobile experience
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});
