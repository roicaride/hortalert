// Simulación de datos en tiempo real
class SensorSimulator {
    constructor() {
        this.humedad = 65;
        this.ph = 6.8;
        this.salinidad = 1.2;
        this.salud = 95;
        this.proximoRiego = 2; // horas
        this.temperatura = 24;
        this.humedadAmbiente = 45;
        this.viento = 12;
        this.historial = {
            humedad: [],
            ph: [],
            salinidad: []
        };
        this.graficas = {};
        this.inicializarHistorial();
        this.inicializarGraficas();
        this.configurarFiltrosTiempo();
    }

    inicializarHistorial() {
        // Generar datos históricos para los últimos 30 días
        const ahora = new Date();
        for (let i = 30; i >= 0; i--) {
            const tiempo = new Date(ahora - i * 24 * 3600000); // Cada día
            this.historial.humedad.push({
                tiempo: tiempo,
                valor: 65 + (Math.random() - 0.5) * 10,
                optimo: 60
            });
            this.historial.ph.push({
                tiempo: tiempo,
                valor: 6.8 + (Math.random() - 0.5) * 0.5,
                optimo: 6.5
            });
            this.historial.salinidad.push({
                tiempo: tiempo,
                valor: 1.2 + (Math.random() - 0.5) * 0.3,
                optimo: 1.0
            });
        }
    }

    inicializarGraficas() {
        const configComun = {
            type: 'line',
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day'
                        },
                        title: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true
                        }
                    },
                    y: {
                        beginAtZero: false,
                        title: {
                            display: false
                        },
                        ticks: {
                            maxTicksLimit: 5
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        };

        // Gráfica de Humedad
        this.graficas.humedad = new Chart(document.getElementById('humedadChart'), {
            ...configComun,
            data: {
                datasets: [
                    {
                        label: 'Humedad Actual',
                        data: this.historial.humedad.map(d => ({ x: d.tiempo, y: d.valor })),
                        borderColor: '#2ecc71',
                        tension: 0.4
                    },
                    {
                        label: 'Rango Óptimo',
                        data: this.historial.humedad.map(d => ({ x: d.tiempo, y: d.optimo })),
                        borderColor: '#27ae60',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            }
        });

        // Gráfica de pH
        this.graficas.ph = new Chart(document.getElementById('phChart'), {
            ...configComun,
            data: {
                datasets: [
                    {
                        label: 'pH Actual',
                        data: this.historial.ph.map(d => ({ x: d.tiempo, y: d.valor })),
                        borderColor: '#3498db',
                        tension: 0.4
                    },
                    {
                        label: 'Rango Óptimo',
                        data: this.historial.ph.map(d => ({ x: d.tiempo, y: d.optimo })),
                        borderColor: '#2980b9',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            }
        });

        // Gráfica de Salinidad
        this.graficas.salinidad = new Chart(document.getElementById('salinidadChart'), {
            ...configComun,
            data: {
                datasets: [
                    {
                        label: 'Salinidad Actual',
                        data: this.historial.salinidad.map(d => ({ x: d.tiempo, y: d.valor })),
                        borderColor: '#e74c3c',
                        tension: 0.4
                    },
                    {
                        label: 'Rango Óptimo',
                        data: this.historial.salinidad.map(d => ({ x: d.tiempo, y: d.optimo })),
                        borderColor: '#c0392b',
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            }
        });
    }

    configurarFiltrosTiempo() {
        const botones = document.querySelectorAll('.btn-tiempo');
        botones.forEach(boton => {
            boton.addEventListener('click', () => {
                botones.forEach(b => b.classList.remove('active'));
                boton.classList.add('active');
                this.actualizarRangoGraficas(boton.dataset.tiempo);
            });
        });
    }

    actualizarRangoGraficas(tiempo) {
        const ahora = new Date();
        let inicio;
        switch(tiempo) {
            case '24h':
                inicio = new Date(ahora - 24 * 3600000);
                break;
            case '7d':
                inicio = new Date(ahora - 7 * 24 * 3600000);
                break;
            case '30d':
                inicio = new Date(ahora - 30 * 24 * 3600000);
                break;
        }

        Object.values(this.graficas).forEach(grafica => {
            grafica.options.scales.x.min = inicio;
            grafica.options.scales.x.max = ahora;
            grafica.update();
        });
    }

    actualizarDatos() {
        // Simular cambios en los datos
        this.humedad += (Math.random() - 0.5) * 2;
        this.ph += (Math.random() - 0.5) * 0.1;
        this.salinidad += (Math.random() - 0.5) * 0.1;
        this.salud = Math.max(0, Math.min(100, this.salud + (Math.random() - 0.5) * 0.5));
        this.proximoRiego = Math.max(0, this.proximoRiego - 0.1);
        this.temperatura += (Math.random() - 0.5) * 0.5;
        this.humedadAmbiente += (Math.random() - 0.5) * 1;
        this.viento += (Math.random() - 0.5) * 0.5;

        // Actualizar historial
        const ahora = new Date();
        this.historial.humedad.push({
            tiempo: ahora,
            valor: this.humedad,
            optimo: 60
        });
        this.historial.ph.push({
            tiempo: ahora,
            valor: this.ph,
            optimo: 6.5
        });
        this.historial.salinidad.push({
            tiempo: ahora,
            valor: this.salinidad,
            optimo: 1.0
        });

        // Mantener solo los últimos 30 días
        this.historial.humedad = this.historial.humedad.slice(-31);
        this.historial.ph = this.historial.ph.slice(-31);
        this.historial.salinidad = this.historial.salinidad.slice(-31);

        // Actualizar la interfaz
        this.actualizarInterfaz();
        this.actualizarGraficas();
    }

    actualizarInterfaz() {
        // Actualizar valores de los sensores
        document.querySelector('.sensor-card:nth-child(1) .valor').textContent = `${this.humedad.toFixed(1)}%`;
        document.querySelector('.sensor-card:nth-child(2) .valor').textContent = this.ph.toFixed(1);
        document.querySelector('.sensor-card:nth-child(3) .valor').textContent = `${this.salinidad.toFixed(1)} mS/cm`;
        
        // Actualizar salud y próximo riego
        document.querySelector('.salud-indicator .value').textContent = `${this.salud.toFixed(1)}%`;
        document.querySelector('.proxima-accion .value').textContent = 
            this.proximoRiego <= 0 ? '¡Riego necesario!' : `En ${this.proximoRiego.toFixed(1)} horas`;

        // Actualizar clima
        document.querySelector('.clima-item:nth-child(1) .valor').textContent = `${this.temperatura.toFixed(1)}°C`;
        document.querySelector('.clima-item:nth-child(2) .valor').textContent = `${this.humedadAmbiente.toFixed(1)}%`;
        document.querySelector('.clima-item:nth-child(3) .valor').textContent = `${this.viento.toFixed(1)} km/h`;

        // Actualizar barras de progreso
        this.actualizarBarrasProgreso();

        // Actualizar tendencias
        this.actualizarTendencias();
    }

    actualizarBarrasProgreso() {
        // Humedad
        const humedadProgreso = ((this.humedad - 40) / (80 - 40)) * 100;
        document.querySelector('.sensor-card:nth-child(1) .progreso').style.width = `${humedadProgreso}%`;

        // pH
        const phProgreso = ((this.ph - 6.0) / (7.5 - 6.0)) * 100;
        document.querySelector('.sensor-card:nth-child(2) .progreso').style.width = `${phProgreso}%`;

        // Salinidad
        const salinidadProgreso = ((this.salinidad - 0.8) / (2.0 - 0.8)) * 100;
        document.querySelector('.sensor-card:nth-child(3) .progreso').style.width = `${salinidadProgreso}%`;
    }

    actualizarGraficas() {
        Object.values(this.graficas).forEach(grafica => {
            grafica.update('none');
        });
    }

    actualizarTendencias() {
        const tendencias = document.querySelectorAll('.tendencia');
        tendencias.forEach(tendencia => {
            const valor = parseFloat(tendencia.querySelector('span').textContent);
            const icon = tendencia.querySelector('i');
            
            if (valor > 0) {
                tendencia.className = 'tendencia positiva';
                icon.className = 'fas fa-arrow-up';
            } else if (valor < 0) {
                tendencia.className = 'tendencia negativa';
                icon.className = 'fas fa-arrow-down';
            } else {
                tendencia.className = 'tendencia neutral';
                icon.className = 'fas fa-minus';
            }
        });
    }
}

// Configuración del sistema
class ConfiguracionSistema {
    constructor() {
        this.form = document.getElementById('configForm');
        this.configurarEventos();
    }

    configurarEventos() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.guardarConfiguracion();
        });
    }

    guardarConfiguracion() {
        const config = {
            humedadMin: document.getElementById('humedadMin').value,
            humedadMax: document.getElementById('humedadMax').value,
            phMin: document.getElementById('phMin').value,
            phMax: document.getElementById('phMax').value
        };

        // Simular guardado de configuración
        localStorage.setItem('hortalertConfig', JSON.stringify(config));
        this.mostrarNotificacion('Configuración guardada correctamente');
    }

    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);

        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    const sensorSimulator = new SensorSimulator();
    const configuracion = new ConfiguracionSistema();

    // Actualizar datos cada 5 segundos
    setInterval(() => {
        sensorSimulator.actualizarDatos();
    }, 5000);

    // Cargar configuración guardada
    const configGuardada = localStorage.getItem('hortalertConfig');
    if (configGuardada) {
        const config = JSON.parse(configGuardada);
        document.getElementById('humedadMin').value = config.humedadMin;
        document.getElementById('humedadMax').value = config.humedadMax;
        document.getElementById('phMin').value = config.phMin;
        document.getElementById('phMax').value = config.phMax;
    }
}); 