class TimeTracker {
    constructor() {
        this.templates = this.loadTemplates();
        this.entries = this.loadEntries();
        this.currentTimezone = 'local';
        this.editingEntryId = null;
        
        this.init();
    }

    init() {
        console.log('TimeTracker initializing...');
        this.bindEvents();
        this.renderTemplates();
        this.renderEntries();
        this.setCurrentTime();
        
        // Set current time as default
        this.updateCurrentTime();
        
        // Update time every second
        setInterval(() => this.updateCurrentTime(), 1000);
        
        console.log('TimeTracker initialized successfully');
    }

    bindEvents() {
        // Timezone selector
        const timezoneSelect = document.getElementById('timezone');
        if (timezoneSelect) {
            timezoneSelect.addEventListener('change', (e) => {
                this.currentTimezone = e.target.value;
                this.renderEntries();
            });
        }

        // Template management
        const addTemplateBtn = document.getElementById('add-template');
        const templateNameInput = document.getElementById('template-name');
        
        if (addTemplateBtn) {
            addTemplateBtn.addEventListener('click', () => this.addTemplate());
        }
        
        if (templateNameInput) {
            templateNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.addTemplate();
            });
        }

        // Templates modal
        const showTemplatesBtn = document.getElementById('show-templates');
        const closeTemplatesBtn = document.getElementById('close-templates');
        const templatesModal = document.getElementById('templates-modal');
        
        if (showTemplatesBtn) {
            showTemplatesBtn.addEventListener('click', () => this.showTemplatesModal());
        }
        
        if (closeTemplatesBtn) {
            closeTemplatesBtn.addEventListener('click', () => this.hideTemplatesModal());
        }
        
        if (templatesModal) {
            templatesModal.addEventListener('click', (e) => {
                if (e.target.id === 'templates-modal') this.hideTemplatesModal();
            });
        }

        // Entry management
        const addEntryBtn = document.getElementById('add-entry');
        const updateEntryBtn = document.getElementById('update-entry');
        const cancelEntryBtn = document.getElementById('cancel-entry');
        const entryDescriptionInput = document.getElementById('entry-description');
        const useCurrentTimeBtn = document.getElementById('use-current-time');
        const entryDatetimeInput = document.getElementById('entry-datetime');
        
        if (addEntryBtn) {
            addEntryBtn.addEventListener('click', () => this.addEntry());
        }
        
        if (updateEntryBtn) {
            updateEntryBtn.addEventListener('click', () => this.updateEntry());
        }
        
        if (cancelEntryBtn) {
            cancelEntryBtn.addEventListener('click', () => this.cancelEdit());
        }
        
        if (entryDescriptionInput) {
            entryDescriptionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (this.editingEntryId) {
                        this.updateEntry();
                    } else {
                        this.addEntry();
                    }
                }
            });
        }
        
        if (useCurrentTimeBtn) {
            useCurrentTimeBtn.addEventListener('click', () => this.addEntryWithCurrentTime());
        }
        
        if (entryDatetimeInput) {
            entryDatetimeInput.addEventListener('change', () => this.addEntryWithSelectedTime());
        }

        // Data management
        const clearAllBtn = document.getElementById('clear-all');
        const downloadCsvBtn = document.getElementById('download-csv');
        
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAll());
        }
        
        if (downloadCsvBtn) {
            downloadCsvBtn.addEventListener('click', () => this.downloadCSV());
        }
    }

    addTemplate() {
        const nameInput = document.getElementById('template-name');
        
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Please enter template name');
            return;
        }

        const template = {
            id: Date.now().toString(),
            name
        };

        this.templates.push(template);
        this.saveTemplates();
        this.renderTemplates();
        
        nameInput.value = '';
        nameInput.focus();
    }

    deleteTemplate(id) {
        this.templates = this.templates.filter(template => template.id !== id);
        this.saveTemplates();
        this.renderTemplates();
    }

    useTemplate(template) {
        const entryDescription = document.getElementById('entry-description');
        
        if (entryDescription) {
            entryDescription.value = template.name;
            entryDescription.focus();
        }
        
        this.hideTemplatesModal();
    }

    showTemplatesModal() {
        const templatesModal = document.getElementById('templates-modal');
        const templateNameInput = document.getElementById('template-name');
        
        if (templatesModal) {
            templatesModal.style.display = 'flex';
        }
        
        if (templateNameInput) {
            templateNameInput.focus();
        }
    }

    hideTemplatesModal() {
        const templatesModal = document.getElementById('templates-modal');
        
        if (templatesModal) {
            templatesModal.style.display = 'none';
        }
    }

    addEntry() {
        const datetimeInput = document.getElementById('entry-datetime');
        const descriptionInput = document.getElementById('entry-description');
        const notesInput = document.getElementById('entry-notes');
        
        const datetime = datetimeInput.value;
        const description = descriptionInput.value.trim();
        const notes = notesInput.value.trim();
        
        if (!datetime || !description) {
            alert('Please enter both date/time and description');
            return;
        }

        const entry = {
            id: Date.now().toString(),
            timestamp: new Date(datetime).toISOString(),
            description,
            notes: notes || null
        };

        this.entries.unshift(entry); // Add to beginning for reverse chronological order
        this.saveEntries();
        this.renderEntries();
        
        // Reset form
        descriptionInput.value = '';
        notesInput.value = '';
        document.getElementById('entry-details').style.display = 'none';
        this.setCurrentTime();
    }

    editEntry(id) {
        const entry = this.entries.find(e => e.id === id);
        if (!entry) return;

        this.editingEntryId = id;
        
        // Populate form with entry data
        const entryDate = new Date(entry.timestamp);
        const datetime = new Date(entryDate.getTime() - entryDate.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 19);
        
        document.getElementById('entry-datetime').value = datetime;
        document.getElementById('entry-description').value = entry.description === "(Click to add description)" ? "" : entry.description;
        document.getElementById('entry-notes').value = entry.notes || '';
        
        // Show form and update UI
        document.getElementById('entry-details').style.display = 'block';
        document.getElementById('add-entry').style.display = 'none';
        document.getElementById('update-entry').style.display = 'inline-block';
        document.getElementById('cancel-entry').style.display = 'inline-block';
        
        document.getElementById('entry-description').focus();
        
        // Scroll to form
        document.querySelector('.entry-section').scrollIntoView({ behavior: 'smooth' });
    }

    updateEntry() {
        if (!this.editingEntryId) return;

        const datetimeInput = document.getElementById('entry-datetime');
        const descriptionInput = document.getElementById('entry-description');
        const notesInput = document.getElementById('entry-notes');
        
        const datetime = datetimeInput.value;
        const description = descriptionInput.value.trim();
        const notes = notesInput.value.trim();
        
        if (!datetime || !description) {
            alert('Please enter both date/time and description');
            return;
        }

        const entryIndex = this.entries.findIndex(e => e.id === this.editingEntryId);
        if (entryIndex === -1) return;

        this.entries[entryIndex] = {
            ...this.entries[entryIndex],
            timestamp: new Date(datetime).toISOString(),
            description,
            notes: notes || null
        };

        this.saveEntries();
        this.renderEntries();
        this.cancelEdit();
    }

    cancelEdit() {
        this.editingEntryId = null;
        
        // Reset form UI
        document.getElementById('add-entry').style.display = 'inline-block';
        document.getElementById('update-entry').style.display = 'none';
        document.getElementById('cancel-entry').style.display = 'none';
        document.getElementById('entry-details').style.display = 'none';
        
        // Clear form
        document.getElementById('entry-description').value = '';
        document.getElementById('entry-notes').value = '';
        this.setCurrentTime();
    }

    deleteEntry(id) {
        this.entries = this.entries.filter(entry => entry.id !== id);
        this.saveEntries();
        this.renderEntries();
    }

    setCurrentTime() {
        const datetimeInput = document.getElementById('entry-datetime');
        
        if (datetimeInput) {
            const now = new Date();
            const datetime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 19);
            datetimeInput.value = datetime;
        }
    }

    addEntryWithCurrentTime() {
        this.setCurrentTime();
        const datetimeInput = document.getElementById('entry-datetime');
        
        if (datetimeInput && datetimeInput.value) {
            this.createQuickEntry(datetimeInput.value);
        }
    }

    addEntryWithSelectedTime() {
        const datetimeInput = document.getElementById('entry-datetime');
        
        if (datetimeInput && datetimeInput.value) {
            this.createQuickEntry(datetimeInput.value);
        }
    }

    createQuickEntry(datetime) {
        const entry = {
            id: Date.now().toString(),
            timestamp: new Date(datetime).toISOString(),
            description: "(Click to add description)",
            notes: null
        };

        this.entries.unshift(entry);
        this.saveEntries();
        this.renderEntries();
        
        // Clear the datetime input for next entry
        this.setCurrentTime();
        
        // Auto-edit the newly created entry
        setTimeout(() => {
            this.editEntry(entry.id);
        }, 100);
    }

    updateCurrentTime() {
        // This could be used to show a live clock if needed
    }

    formatDateTime(isoString, timezone) {
        const date = new Date(isoString);
        
        if (timezone === 'utc') {
            return date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
        } else {
            // Format with seconds: MM/DD/YYYY, HH:MM:SS AM/PM
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            };
            return date.toLocaleString('en-US', options) + ' (Local)';
        }
    }

    renderTemplates() {
        const container = document.getElementById('templates-list');
        
        if (!container) {
            console.error('Templates list container not found');
            return;
        }
        
        if (this.templates.length === 0) {
            container.innerHTML = '<div class="empty-state">No templates created yet. Add a template to get started!</div>';
            return;
        }

        container.innerHTML = this.templates.map(template => `
            <div class="template-item" onclick="timeTracker.useTemplate(${JSON.stringify(template).replace(/"/g, '&quot;')})">
                <span>${template.name}</span>
                <button class="template-delete" onclick="event.stopPropagation(); timeTracker.deleteTemplate('${template.id}')" title="Delete template">×</button>
            </div>
        `).join('');
        
        console.log('Templates rendered:', this.templates.length);
    }

    renderEntries() {
        const container = document.getElementById('entries-list');
        
        if (!container) {
            console.error('Entries list container not found');
            return;
        }
        
        if (this.entries.length === 0) {
            container.innerHTML = '<div class="empty-state">No entries yet. Add your first time entry above!</div>';
            return;
        }

        container.innerHTML = this.entries.map(entry => `
            <div class="entry-item ${entry.description === "(Click to add description)" ? 'entry-incomplete' : ''}">
                <div class="entry-timestamp">${this.formatDateTime(entry.timestamp, this.currentTimezone)}</div>
                <div class="entry-content">
                    <div class="entry-description">${this.escapeHtml(entry.description)}</div>
                    ${entry.notes ? `<div class="entry-notes">${this.escapeHtml(entry.notes)}</div>` : ''}
                </div>
                <div class="entry-actions">
                    <button class="entry-edit" onclick="timeTracker.editEntry('${entry.id}')" title="Edit entry">✏️</button>
                    <button class="entry-delete" onclick="timeTracker.deleteEntry('${entry.id}')" title="Delete entry">×</button>
                </div>
            </div>
        `).join('');
        
        console.log('Entries rendered:', this.entries.length);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all entries? This cannot be undone.')) {
            this.entries = [];
            this.saveEntries();
            this.renderEntries();
        }
    }

    downloadCSV() {
        if (this.entries.length === 0) {
            alert('No entries to download');
            return;
        }

        const headers = ['Timestamp (ISO)', 'Timestamp (Local)', 'Timestamp (UTC)', 'Description', 'Notes'];
        const csvContent = [
            headers.join(','),
            ...this.entries.map(entry => {
                const date = new Date(entry.timestamp);
                const isoTimestamp = entry.timestamp;
                const localTimestamp = date.toLocaleString();
                const utcTimestamp = date.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
                
                return [
                    this.csvEscape(isoTimestamp),
                    this.csvEscape(localTimestamp),
                    this.csvEscape(utcTimestamp),
                    this.csvEscape(entry.description),
                    this.csvEscape(entry.notes || '')
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `time_tracker_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    csvEscape(field) {
        if (field === null || field === undefined) return '';
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
        }
        return stringField;
    }

    // Local Storage Methods
    loadTemplates() {
        try {
            const stored = localStorage.getItem('timetracker_templates');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading templates:', e);
            return [];
        }
    }

    saveTemplates() {
        try {
            localStorage.setItem('timetracker_templates', JSON.stringify(this.templates));
        } catch (e) {
            console.error('Error saving templates:', e);
        }
    }

    loadEntries() {
        try {
            const stored = localStorage.getItem('timetracker_entries');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error loading entries:', e);
            return [];
        }
    }

    saveEntries() {
        try {
            localStorage.setItem('timetracker_entries', JSON.stringify(this.entries));
        } catch (e) {
            console.error('Error saving entries:', e);
        }
    }
}

// Initialize the app when the page loads
let timeTracker;
document.addEventListener('DOMContentLoaded', () => {
    timeTracker = new TimeTracker();
});
