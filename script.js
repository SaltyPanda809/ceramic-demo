// Fixed script.js code to properly destroy and reinitialize Chart.js instances when tabs are switched

// Function to create a new Chart instance
function createChart(ctx, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// Function to destroy chart instances
function destroyChart(chart) {
    if (chart) {
        chart.destroy();
    }
}

// Initialize charts when the page is loaded
let myChart;

window.onload = function() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const data = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    myChart = createChart(ctx, data);
};

// Event listener for tab switching
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        const tabId = this.getAttribute('data-tab');
        // Destroy the existing chart instance
        destroyChart(myChart);
        // Update the chart with new data based on the selected tab
        const ctx = document.getElementById('myChart').getContext('2d');
        const newData = getDataForTab(tabId); // Function to get data for the chart based on the tab
        myChart = createChart(ctx, newData);
    });
});

// Function to get data for selected tab
function getDataForTab(tabId) {
    // Sample data retrieval based on tabId
    // Replace with actual data fetching logic
    const sampleData = {
        'tab1': [10, 15, 20, 25, 30],
        'tab2': [12, 18, 29, 5, 7],
        'tab3': [14, 11, 9, 18, 16]
    };
    return {
        labels: ['A', 'B', 'C', 'D', 'E'],
        datasets: [{
            label: 'Votes',
            data: sampleData[tabId],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
}