// Material Data Structure
const materialsData = {
    clay: {
        name: 'Clay',
        currentInventory: 2450,
        maxCapacity: 5000,
        safetyThreshold: 800,
        storageAge: 18,
        storageCostPerTon: 4.20,
        consumption: { normal: 45, high: 75, maintenance: 15 },
        orders: [
            { quantity: 1500, deliveryDate: 5, status: 'on-time' },
            { quantity: 800, deliveryDate: 12, status: 'on-time' }
        ]
    },
    feldspar: {
        name: 'Feldspar',
        currentInventory: 1850,
        maxCapacity: 4000,
        safetyThreshold: 600,
        storageAge: 22,
        storageCostPerTon: 5.80,
        consumption: { normal: 35, high: 60, maintenance: 10 },
        orders: [
            { quantity: 1000, deliveryDate: 8, status: 'on-time' },
            { quantity: 600, deliveryDate: 18, status: 'delayed' }
        ]
    },
    silica: {
        name: 'Silica Sand',
        currentInventory: 890,
        maxCapacity: 3500,
        safetyThreshold: 700,
        storageAge: 31,
        storageCostPerTon: 6.50,
        consumption: { normal: 50, high: 85, maintenance: 20 },
        orders: [
            { quantity: 1200, deliveryDate: 6, status: 'delayed' }
        ]
    },
    kaolin: {
        name: 'Kaolin',
        currentInventory: 3200,
        maxCapacity: 5500,
        safetyThreshold: 900,
        storageAge: 12,
        storageCostPerTon: 3.90,
        consumption: { normal: 40, high: 70, maintenance: 12 },
        orders: [
            { quantity: 1100, deliveryDate: 10, status: 'on-time' },
            { quantity: 900, deliveryDate: 20, status: 'on-time' }
        ]
    },
    talc: {
        name: 'Talc',
        currentInventory: 450,
        maxCapacity: 2000,
        safetyThreshold: 500,
        storageAge: 28,
        storageCostPerTon: 8.10,
        consumption: { normal: 25, high: 45, maintenance: 8 },
        orders: [
            { quantity: 700, deliveryDate: 4, status: 'on-time' },
            { quantity: 500, deliveryDate: 14, status: 'delayed' }
        ]
    }
};

let currentSchedule = 'normal';
let charts = {};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    updateAllDashboards();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.material-card').forEach(c => c.classList.remove('active'));
            
            e.target.classList.add('active');
            const material = e.target.dataset.material;
            document.querySelector(`[data-material="${material}"]`).classList.add('active');
        });
    });

    // Schedule change
    document.getElementById('schedule').addEventListener('change', (e) => {
        currentSchedule = e.target.value;
        updateAllDashboards();
    });

    // Alert bell toggle
    document.getElementById('alertBtn').addEventListener('click', () => {
        const panel = document.getElementById('alertPanel');
        panel.classList.toggle('hidden');
    });

    // Close alert panel when clicking outside
    document.addEventListener('click', (e) => {
        const panel = document.getElementById('alertPanel');
        const btn = document.getElementById('alertBtn');
        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            panel.classList.add('hidden');
        }
    });
}

// Initialize Charts
function initializeCharts() {
    Object.keys(materialsData).forEach(material => {
        const ctx = document.getElementById(`${material}-chart`).getContext('2d');
        charts[material] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y.toFixed(0) + ' tons';
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(0) + ' tons';
                            }
                        }
                    }
                }
            }
        });
    });
}

// Update All Dashboards
function updateAllDashboards() {
    Object.keys(materialsData).forEach(material => {
        updateMaterialDashboard(material);
    });
    updateAlerts();
}

// Update Individual Material Dashboard
function updateMaterialDashboard(material) {
    const data = materialsData[material];
    const consumption = data.consumption[currentSchedule];

    // Update metrics
    document.getElementById(`${material}-current`).textContent = data.currentInventory.toLocaleString();
    document.getElementById(`${material}-threshold`).textContent = data.safetyThreshold.toLocaleString();
    document.getElementById(`${material}-age`).textContent = data.storageAge;
    document.getElementById(`${material}-cost`).textContent = `$${data.storageCostPerTon.toFixed(2)}`;

    // Update status indicator
    const projectedDay30 = calculateProjectedInventory(data, consumption, 30);
    const statusIndicator = document.getElementById(`${material}-status`);
    statusIndicator.className = 'status-indicator';
    
    if (projectedDay30 < data.safetyThreshold) {
        statusIndicator.classList.add('critical');
    } else if (data.currentInventory < data.safetyThreshold * 1.2) {
        statusIndicator.classList.add('warning');
    }

    // Update chart
    updateChart(material, data, consumption);

    // Update orders
    updateOrdersList(material, data);
}

// Calculate Projected Inventory
function calculateProjectedInventory(data, consumption, days) {
    let inventory = data.currentInventory;
    
    for (let day = 1; day <= days; day++) {
        inventory -= consumption;
        
        // Add purchase orders
        data.orders.forEach(order => {
            if (order.deliveryDate === day) {
                inventory += order.quantity;
            }
        });
    }
    
    return Math.max(0, inventory);
}

// Update Chart Data
function updateChart(material, data, consumption) {
    const days = [];
    const projectionWithoutOrders = [];
    const projectionWithOrders = [];
    const currentOnly = [];

    // Generate 30-day projection
    for (let day = 0; day <= 30; day++) {
        days.push(`Day ${day}`);
        
        if (day === 0) {
            currentOnly.push(data.currentInventory);
            projectionWithoutOrders.push(data.currentInventory);
            projectionWithOrders.push(data.currentInventory);
        } else {
            currentOnly.push(null);
            
            // Without orders
            let invWithoutOrders = data.currentInventory - (consumption * day);
            projectionWithoutOrders.push(Math.max(0, invWithoutOrders));
            
            // With orders
            let invWithOrders = data.currentInventory - (consumption * day);
            data.orders.forEach(order => {
                if (order.deliveryDate <= day) {
                    invWithOrders += order.quantity;
                }
            });
            projectionWithOrders.push(Math.max(0, invWithOrders));
        }
    }

    // Update chart
    const chart = charts[material];
    chart.data.labels = days;
    chart.data.datasets = [
        {
            label: 'Current Inventory',
            data: currentOnly,
            borderColor: '#0066cc',
            backgroundColor: 'rgba(0, 102, 204, 0.05)',
            borderWidth: 3,
            pointRadius: 5,
            pointBackgroundColor: '#0066cc',
            tension: 0.3,
            fill: false
        },
        {
            label: 'Projected (No New Orders)',
            data: projectionWithoutOrders,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 3,
            pointBackgroundColor: '#f59e0b',
            tension: 0.3,
            fill: false
        },
        {
            label: 'Projected (With Orders)',
            data: projectionWithOrders,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderWidth: 2,
            pointRadius: 3,
            pointBackgroundColor: '#10b981',
            tension: 0.3,
            fill: false
        }
    ];
    chart.update();
}

// Update Orders List
function updateOrdersList(material, data) {
    const container = document.getElementById(`${material}-orders`);
    container.innerHTML = '';

    if (data.orders.length === 0) {
        container.innerHTML = '<p style="color: #999; font-size: 14px;">No pending orders</p>';
        return;
    }

    data.orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div class="order-item-info">
                <div class="order-item-quantity">${order.quantity.toLocaleString()} tons</div>
                <div class="order-item-date">Delivery: Day ${order.deliveryDate}</div>
            </div>
            <div class="order-item-status ${order.status}">${order.status === 'on-time' ? '✓ On Time' : '⚠ Delayed'}</div>
        `;
        container.appendChild(orderDiv);
    });
}

// Calculate and Display Alerts
function updateAlerts() {
    const alerts = [];
    
    Object.keys(materialsData).forEach(material => {
        const data = materialsData[material];
        const consumption = data.consumption[currentSchedule];
        const totalStorageCost = data.currentInventory * data.storageCostPerTon;
        const projectedDay30 = calculateProjectedInventory(data, consumption, 30);

        // Alert 1: Low Stock + High Cost (combined trigger)
        if (data.currentInventory < data.safetyThreshold * 1.3 && totalStorageCost > 5000) {
            alerts.push({
                type: 'critical',
                message: `${data.name}: Low stock (${data.currentInventory} tons) + High storage cost ($${totalStorageCost.toFixed(0)})`
            });
        }

        // Alert 2: Projected Stock Critical
        if (projectedDay30 < data.safetyThreshold) {
            alerts.push({
                type: 'critical',
                message: `${data.name}: Projected to drop below safety threshold by Day 30 (${projectedDay30.toFixed(0)} tons)`
            });
        }

        // Alert 3: Aging Inventory + High Cost
        if (data.storageAge > 25 && data.storageCostPerTon > 5) {
            alerts.push({
                type: 'warning',
                message: `${data.name}: Aging inventory (${data.storageAge} days) + High cost ($${data.storageCostPerTon}/ton)`
            });
        }

        // Alert 4: Delayed Orders
        const delayedOrders = data.orders.filter(o => o.status === 'delayed');
        if (delayedOrders.length > 0) {
            alerts.push({
                type: 'warning',
                message: `${data.name}: ${delayedOrders.length} purchase order(s) delayed - consider expedited delivery`
            });
        }
    });

    // Update Alert UI
    const alertCount = document.getElementById('alertCount');
    const alertList = document.getElementById('alertList');
    
    alertCount.textContent = alerts.length;
    alertList.innerHTML = '';

    alerts.forEach(alert => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert-item ${alert.type}`;
        alertDiv.textContent = alert.message;
        alertList.appendChild(alertDiv);
    });
}