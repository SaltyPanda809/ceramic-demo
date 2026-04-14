// Updated script.js with fixed tab switching and chart reinitialization logic

function switchTab(tabId) {
    // Logic to switch tabs
    const tabs = document.querySelectorAll('.tab');
    const charts = document.querySelectorAll('.chart');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    charts.forEach(chart => {
        chart.style.display = 'none';
    });

    document.getElementById(tabId).classList.add('active');
    const activeChart = document.querySelector(`.chart[data-tab="${tabId}"]`);
    if (activeChart) {
        activeChart.style.display = 'block';
        reinitializeChart(activeChart);
    }
}

function reinitializeChart(chart) {
    // Logic to reinitialize the chart
    // Assuming the chart rendering function is named renderChart
    renderChart(chart.dataset.chartType, chart.dataset.data);
}

// Event listeners for tab clicks
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(button => {
    button.addEventListener('click', () => switchTab(button.getAttribute('data-tab')));
});