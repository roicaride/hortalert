class PredictionsManager {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.loadPredictions('today');
    }

    initializeElements() {
        // Botones de período
        this.periodButtons = document.querySelectorAll('.btn-tiempo');
        
        // Elementos de pronóstico del tiempo
        this.weatherItems = document.querySelectorAll('.weather-item');
        
        // Elementos de riego
        this.irrigationItems = document.querySelectorAll('.irrigation-item');
        
        // Elementos de salud
        this.healthMetrics = document.querySelectorAll('.metric');
        
        // Elementos de alertas
        this.alertItems = document.querySelectorAll('.alert-item');
    }

    initializeEventListeners() {
        // Botones de período
        this.periodButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.periodButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadPredictions(btn.dataset.tiempo);
            });
        });
    }

    loadPredictions(period) {
        // Simular datos de predicción
        const predictions = this.generatePredictions(period);
        
        // Actualizar pronóstico del tiempo
        this.updateWeatherForecast(predictions.weather);
        
        // Actualizar programación de riego
        this.updateIrrigationSchedule(predictions.irrigation);
        
        // Actualizar pronóstico de salud
        this.updateHealthForecast(predictions.health);
        
        // Actualizar alertas
        this.updateAlerts(predictions.alerts);
    }

    generatePredictions(period) {
        const predictions = {
            weather: [],
            irrigation: [],
            health: {
                status: '',
                moisture: 0,
                ph: 0
            },
            alerts: []
        };

        switch(period) {
            case 'today':
                predictions.weather = [
                    { date: 'Today', temp: 25, desc: 'Sunny', icon: 'sun' },
                    { date: 'Tomorrow', temp: 22, desc: 'Partly Cloudy', icon: 'cloud' }
                ];
                predictions.irrigation = [
                    { time: '09:00 AM', title: 'Morning Irrigation', duration: '30 minutes', volume: '2.5L' },
                    { time: '03:00 PM', title: 'Afternoon Irrigation', duration: '25 minutes', volume: '2.0L' }
                ];
                predictions.health = {
                    status: 'Optimal Health',
                    moisture: 75,
                    ph: 6.7
                };
                predictions.alerts = [
                    { type: 'warning', title: 'High Temperature Warning', desc: 'Temperature expected to reach 28°C tomorrow' },
                    { type: 'info', title: 'Maintenance Reminder', desc: 'Sensor calibration due in 2 days' }
                ];
                break;

            case 'tomorrow':
                predictions.weather = [
                    { date: 'Tomorrow', temp: 22, desc: 'Partly Cloudy', icon: 'cloud' },
                    { date: 'Day After', temp: 20, desc: 'Cloudy', icon: 'cloud' }
                ];
                predictions.irrigation = [
                    { time: '10:00 AM', title: 'Morning Irrigation', duration: '35 minutes', volume: '2.8L' },
                    { time: '04:00 PM', title: 'Afternoon Irrigation', duration: '30 minutes', volume: '2.3L' }
                ];
                predictions.health = {
                    status: 'Good Health',
                    moisture: 70,
                    ph: 6.6
                };
                predictions.alerts = [
                    { type: 'warning', title: 'Rain Warning', desc: 'Light rain expected in the afternoon' },
                    { type: 'info', title: 'Irrigation Adjustment', desc: 'Increased irrigation duration due to forecast' }
                ];
                break;

            case 'week':
                predictions.weather = [
                    { date: 'Today', temp: 25, desc: 'Sunny', icon: 'sun' },
                    { date: 'Tomorrow', temp: 22, desc: 'Partly Cloudy', icon: 'cloud' },
                    { date: 'Day 3', temp: 20, desc: 'Cloudy', icon: 'cloud' },
                    { date: 'Day 4', temp: 18, desc: 'Rain', icon: 'cloud-rain' },
                    { date: 'Day 5', temp: 21, desc: 'Partly Cloudy', icon: 'cloud' }
                ];
                predictions.irrigation = [
                    { time: '09:00 AM', title: 'Morning Irrigation', duration: '30 minutes', volume: '2.5L' },
                    { time: '03:00 PM', title: 'Afternoon Irrigation', duration: '25 minutes', volume: '2.0L' },
                    { time: '10:00 AM', title: 'Morning Irrigation', duration: '35 minutes', volume: '2.8L' },
                    { time: '04:00 PM', title: 'Afternoon Irrigation', duration: '30 minutes', volume: '2.3L' }
                ];
                predictions.health = {
                    status: 'Stable Health',
                    moisture: 72,
                    ph: 6.8
                };
                predictions.alerts = [
                    { type: 'warning', title: 'Weather Pattern Change', desc: 'Rain expected in 3 days' },
                    { type: 'info', title: 'Long-term Forecast', desc: 'Temperature will gradually decrease' }
                ];
                break;
        }

        return predictions;
    }

    updateWeatherForecast(weather) {
        const weatherGrid = document.querySelector('.weather-grid');
        weatherGrid.innerHTML = weather.map(day => `
            <div class="weather-item">
                <div class="weather-icon">
                    <i class="fas fa-${day.icon}"></i>
                </div>
                <div class="weather-info">
                    <div class="weather-date">${day.date}</div>
                    <div class="weather-temp">${day.temp}°C</div>
                    <div class="weather-desc">${day.desc}</div>
                </div>
            </div>
        `).join('');
    }

    updateIrrigationSchedule(irrigation) {
        const irrigationTimeline = document.querySelector('.irrigation-timeline');
        irrigationTimeline.innerHTML = irrigation.map(schedule => `
            <div class="irrigation-item">
                <div class="irrigation-time">${schedule.time}</div>
                <div class="irrigation-content">
                    <div class="irrigation-icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="irrigation-details">
                        <div class="irrigation-title">${schedule.title}</div>
                        <div class="irrigation-desc">Duration: ${schedule.duration}, Volume: ${schedule.volume}</div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateHealthForecast(health) {
        const healthIndicator = document.querySelector('.health-indicator');
        healthIndicator.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${health.status}</span>
        `;

        const metrics = document.querySelectorAll('.metric');
        metrics[0].querySelector('.metric-fill').style.width = `${health.moisture}%`;
        metrics[0].querySelector('.metric-value').textContent = `${health.moisture}%`;
        metrics[1].querySelector('.metric-fill').style.width = `${(health.ph - 6) * 20}%`;
        metrics[1].querySelector('.metric-value').textContent = health.ph;
    }

    updateAlerts(alerts) {
        const alertsList = document.querySelector('.alerts-list');
        alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                <i class="fas fa-${alert.type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-desc">${alert.desc}</div>
                </div>
            </div>
        `).join('');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new PredictionsManager();
}); 