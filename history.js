class HistoryManager {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.setDefaultDateRange();
        this.loadHistoricalData();
    }

    initializeElements() {
        // Filtros
        this.startDateInput = document.getElementById('startDate');
        this.endDateInput = document.getElementById('endDate');
        this.periodButtons = document.querySelectorAll('.btn-tiempo');
        
        // Elementos de resumen
        this.moistureValue = document.querySelector('.summary-item:nth-child(1) .summary-value');
        this.moistureTrend = document.querySelector('.summary-item:nth-child(1) .summary-trend');
        this.pHValue = document.querySelector('.summary-item:nth-child(2) .summary-value');
        this.pHTrend = document.querySelector('.summary-item:nth-child(2) .summary-trend');
        this.salinityValue = document.querySelector('.summary-item:nth-child(3) .summary-value');
        this.salinityTrend = document.querySelector('.summary-item:nth-child(3) .summary-trend');
        
        // Gráficos
        this.moistureChart = document.querySelector('.chart-container:nth-child(1) .bar-chart');
        this.pHChart = document.querySelector('.chart-container:nth-child(2) .bar-chart');
    }

    initializeEventListeners() {
        // Filtros de fecha
        this.startDateInput.addEventListener('change', () => this.loadHistoricalData());
        this.endDateInput.addEventListener('change', () => this.loadHistoricalData());
        
        // Botones de período
        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.periodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setDateRange(btn.dataset.tiempo);
                this.loadHistoricalData();
            });
        });

        // Botones de exportación
        document.querySelectorAll('.export-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleExport(btn));
        });
    }

    setDefaultDateRange() {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        
        this.startDateInput.value = startDate.toISOString().split('T')[0];
        this.endDateInput.value = endDate.toISOString().split('T')[0];
    }

    setDateRange(period) {
        const endDate = new Date();
        let startDate = new Date();
        
        switch(period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '14d':
                startDate.setDate(startDate.getDate() - 14);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
        }
        
        this.startDateInput.value = startDate.toISOString().split('T')[0];
        this.endDateInput.value = endDate.toISOString().split('T')[0];
    }

    loadHistoricalData() {
        // Simulación de datos históricos
        const startDate = new Date(this.startDateInput.value);
        const endDate = new Date(this.endDateInput.value);
        
        // Generar datos de ejemplo
        const data = this.generateHistoricalData(startDate, endDate);
        
        // Actualizar resumen
        this.updateSummary(data);
        
        // Actualizar gráficos
        this.updateCharts(data);
        
        // Actualizar línea de tiempo
        this.updateTimeline(data);
    }

    generateHistoricalData(startDate, endDate) {
        const data = [];
        let currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
            data.push({
                date: new Date(currentDate),
                moisture: Math.random() * 20 + 60, // 60-80%
                pH: Math.random() * 0.5 + 6.5, // 6.5-7.0
                salinity: Math.random() * 0.5 + 1.5, // 1.5-2.0
                events: this.generateEvents(currentDate)
            });
            
            currentDate.setDate(currentDate.getDate() + 1);
        }
        
        return data;
    }

    generateEvents(date) {
        const events = [];
        const eventTypes = ['irrigation', 'alert', 'maintenance'];
        
        // Generar 1-3 eventos aleatorios por día
        const numEvents = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numEvents; i++) {
            const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const hour = Math.floor(Math.random() * 24);
            const eventDate = new Date(date);
            eventDate.setHours(hour);
            
            events.push({
                type,
                date: eventDate,
                description: this.getEventDescription(type)
            });
        }
        
        return events;
    }

    getEventDescription(type) {
        const descriptions = {
            irrigation: 'Irrigation cycle completed',
            alert: 'High temperature alert',
            maintenance: 'Sensor calibration performed'
        };
        return descriptions[type];
    }

    updateSummary(data) {
        // Calcular promedios
        const avgMoisture = data.reduce((sum, d) => sum + d.moisture, 0) / data.length;
        const avgPH = data.reduce((sum, d) => sum + d.pH, 0) / data.length;
        const avgSalinity = data.reduce((sum, d) => sum + d.salinity, 0) / data.length;
        
        // Calcular tendencias
        const moistureTrend = this.calculateTrend(data.map(d => d.moisture));
        const pHTrend = this.calculateTrend(data.map(d => d.pH));
        const salinityTrend = this.calculateTrend(data.map(d => d.salinity));
        
        // Actualizar valores
        this.moistureValue.textContent = `${avgMoisture.toFixed(1)}%`;
        this.pHValue.textContent = avgPH.toFixed(1);
        this.salinityValue.textContent = `${avgSalinity.toFixed(1)} mS/cm`;
        
        // Actualizar tendencias
        this.updateTrendElement(this.moistureTrend, moistureTrend);
        this.updateTrendElement(this.pHTrend, pHTrend);
        this.updateTrendElement(this.salinityTrend, salinityTrend);
    }

    calculateTrend(values) {
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
        
        const diff = secondAvg - firstAvg;
        if (Math.abs(diff) < 0.1) return 'neutral';
        return diff > 0 ? 'positive' : 'negative';
    }

    updateTrendElement(element, trend) {
        element.className = `summary-trend ${trend}`;
        element.innerHTML = `
            <i class="fas fa-${trend === 'positive' ? 'arrow-up' : trend === 'negative' ? 'arrow-down' : 'minus'}"></i>
            ${trend === 'positive' ? 'Increasing' : trend === 'negative' ? 'Decreasing' : 'Stable'}
        `;
    }

    updateCharts(data) {
        // Actualizar gráfico de humedad
        this.updateBarChart(this.moistureChart, data.map(d => ({
            value: d.moisture,
            label: d.date.toLocaleDateString()
        })));
        
        // Actualizar gráfico de pH
        this.updateBarChart(this.pHChart, data.map(d => ({
            value: d.pH,
            label: d.date.toLocaleDateString()
        })));
    }

    updateBarChart(container, data) {
        const maxValue = Math.max(...data.map(d => d.value));
        const minValue = Math.min(...data.map(d => d.value));
        const range = maxValue - minValue;
        
        // Ajustar el número de barras para que quepan correctamente
        const maxBars = 5; // Máximo número de barras
        const step = Math.ceil(data.length / maxBars);
        const adjustedData = data.filter((_, index) => index % step === 0);
        
        container.innerHTML = adjustedData.map(d => `
            <div class="bar" style="height: ${((d.value - minValue) / range) * 100}%">
                <span class="bar-value">${d.value.toFixed(1)}</span>
            </div>
        `).join('');
    }

    updateTimeline(data) {
        const timeline = document.querySelector('.events-timeline');
        const allEvents = data.flatMap(d => d.events);
        const cutoffDate = new Date('2025-03-24T20:00:00');
        
        timeline.innerHTML = allEvents
            .filter(event => event.date <= cutoffDate)
            .sort((a, b) => b.date - a.date)
            .map(event => `
                <div class="event-item">
                    <div class="event-date">${event.date.toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}</div>
                    <div class="event-content">
                        <div class="event-icon ${event.type}">
                            <i class="fas fa-${this.getEventIcon(event.type)}"></i>
                        </div>
                        <div class="event-details">
                            <div class="event-title">${this.getEventTitle(event.type)}</div>
                            <div class="event-description">${event.description}</div>
                        </div>
                    </div>
                </div>
            `).join('');
    }

    getEventIcon(type) {
        const icons = {
            irrigation: 'tint',
            alert: 'exclamation-triangle',
            maintenance: 'wrench'
        };
        return icons[type];
    }

    getEventTitle(type) {
        const titles = {
            irrigation: 'Irrigation Event',
            alert: 'Alert',
            maintenance: 'Maintenance'
        };
        return titles[type];
    }

    handleExport(button) {
        const format = button.textContent.trim().split(' ')[1].toLowerCase();
        const startDate = this.startDateInput.value;
        const endDate = this.endDateInput.value;
        
        // Simular exportación
        console.log(`Exporting data in ${format} format from ${startDate} to ${endDate}`);
        
        // Mostrar notificación
        this.showNotification(`Data exported in ${format.toUpperCase()} format`);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new HistoryManager();
}); 