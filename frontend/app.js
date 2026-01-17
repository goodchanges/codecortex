// --- SIMULATED DATA (Replace this with a fetch() call to a real data API/JSON file) ---

const MOCK_DATA = {
    ticker: "TSLA",
    time_series: [
        // This array represents OHLC data points over time (e.g., 1-minute intervals)
        // Format: [timestamp (ms), price, volume]
        [1715788800000, 175.00, 100000],
        [1715788860000, 175.50, 85000],
        [1715788920000, 175.30, 95000],
        // ... many normal data points ...
        
        // ANOMALY POINT 1 (High volume and price change) - Corresponds to the report below
        [1715801100000, 185.20, 1200000], // Example Timestamp: May 15, 2024 14:45:00
        
        // ... normal data points ...
        
        // ANOMALY POINT 2 (Sudden Drop with low news coverage)
        [1715810000000, 170.00, 500000],
        
        // ... more data ...
        [1715830000000, 172.50, 110000],
    ],
    reports: [
        {
            ticker: "TSLA",
            timestamp: "2024-05-15 14:45:00",
            type: "Major Price Spike (+5.80%)",
            verdict: "Justified",
            reasoning: "The agent found multiple highly relevant, positive news items (surprise profit, Q1 beat) released just before the anomaly timestamp, directly correlating with the significant volume and price activity.",
            dataPointTime: 1715801100000 // Match the timestamp in the time_series
        },
        {
            ticker: "TSLA",
            timestamp: "2024-05-15 17:13:20",
            type: "Major Price Drop (-3.50%)",
            verdict: "Suspicious",
            reasoning: "No highly relevant news or market events were found in the surrounding 3-day window. The drop is unexplained and may be linked to short-term manipulation or internal events.",
            dataPointTime: 1715810000000 // Match the timestamp in the time_series
        }
    ]
};

// --- END SIMULATED DATA ---

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ticker-display').textContent = MOCK_DATA.ticker;
    
    // Process data for Chart.js
    const priceData = MOCK_DATA.time_series.map(([time, price, volume]) => ({
        x: new Date(time),
        y: price
    }));
    
    const volumeData = MOCK_DATA.time_series.map(([time, price, volume]) => ({
        x: new Date(time),
        y: volume
    }));

    // Identify anomaly points for visual marking
    // Performance optimization: Use Map for O(1) lookups instead of O(n²) find operation
    // For datasets under ~100 points, the overhead is minimal. For 1000+ points, this is critical.
    const priceMap = new Map(priceData.map(d => [d.x.getTime(), d.y]));
    const anomalyMarkers = MOCK_DATA.reports
        .map(report => ({
            x: new Date(report.dataPointTime),
            y: priceMap.get(report.dataPointTime)
        }))
        .filter(marker => marker.y !== undefined);
    
    // 1. Initialize the Chart
    const ctx = document.getElementById('stockChart').getContext('2d');
    const stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                // Price Data
                {
                    label: 'Price',
                    data: priceData,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    backgroundColor: 'rgba(0, 123, 255, 0.2)',
                    yAxisID: 'yPrice',
                    tension: 0.1,
                    pointRadius: 0
                },
                // Anomaly Markers (Scatter points)
                {
                    type: 'scatter',
                    label: 'Anomaly',
                    data: anomalyMarkers,
                    backgroundColor: 'red',
                    borderColor: 'red',
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    yAxisID: 'yPrice'
                },
                // Volume Data (Bar chart on secondary axis)
                {
                    type: 'bar',
                    label: 'Volume',
                    data: volumeData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    yAxisID: 'yVolume',
                    categoryPercentage: 1.0,
                    barPercentage: 1.0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'hour'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                yPrice: {
                    type: 'linear',
                    display: 'auto',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Stock Price ($)'
                    }
                },
                yVolume: {
                    type: 'linear',
                    display: 'auto',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Volume'
                    },
                    grid: {
                        drawOnChartArea: false, // Only draw the grid for the price axis
                    }
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                },
                legend: {
                    display: true
                }
            }
        }
    });

    // 2. Render Anomaly Reports
    const reportsContainer = document.getElementById('anomalyReports');
    reportsContainer.innerHTML = ''; // Clear the placeholder
    
    MOCK_DATA.reports.forEach(report => {
        const card = document.createElement('div');
        card.className = `report-card ${report.verdict}`;

        const verdictTag = `<span class="verdict-tag ${report.verdict}">${report.verdict}</span>`;
        
        card.innerHTML = `
            <h3>
                <span>Anomaly at ${report.timestamp}</span>
                ${verdictTag}
            </h3>
            <p><strong>Type:</strong> ${report.type}</p>
            <p><strong>Reasoning:</strong> ${report.reasoning}</p>
        `;
        reportsContainer.appendChild(card);
    });
});
