// Complete Ceramic Tile Inventory Dashboard Code

// Data structure for materials
const materials = [
    { name: 'Glossy White', size: '12x12', quantity: 100, price: 3.50 },
    { name: 'Matte Black', size: '12x24', quantity: 50, price: 4.00 },
    { name: 'Textured Grey', size: '24x24', quantity: 30, price: 5.00 },
    { name: 'Vibrant Blue', size: '12x12', quantity: 200, price: 4.50 },
    // Add more materials as needed
];

// Tab switching functionality
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelector('.active').classList.remove('active');
        this.classList.add('active');
        const currentTabContent = document.querySelector(`.${this.dataset.tab}`);
        document.querySelector('.tab-content.active').classList.remove('active');
        currentTabContent.classList.add('active');
    });
});

// Function to initialize charts (using Chart.js)
function initializeCharts() {
    const ctx = document.getElementById('materialChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: materials.map(mat => mat.name),
            datasets: [{
                label: 'Quantity',
                data: materials.map(mat => mat.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Function to update charts
function updateCharts() {
    // Logic to update the chart data based on the materials
    // For example, you can refresh with new data from an API or user input.
}

// Alert system
function showAlert(message) {
    alert(message);
}

// Initialize the charts when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
});

// Make sure to handle any updates as needed or new material addition functionality.