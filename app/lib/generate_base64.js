const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

const chartLabels = [
    ["train acc", "eval acc"],
    ["train loss", "eval loss"],
];

const chartOptions = [
    { ticksStep: 0.2, yMax: 1.0 },
    { ticksStep: 1, yMax: 6.0 },
];


async function generateChart(chartNo, max_epochs, data) {
    const width = 400;
    const height = 300; 

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.font.family = 'Arial';
        ChartJS.defaults.font.size = 10;
    };

    const chartNode = new ChartJSNodeCanvas({ width, height, chartCallback, backgroundColor: '#ffffff' });

    const configuration = {
        type: 'line',
        data: {
            labels: Array.from({ length: max_epochs }, (_, i) => i + 1),
            datasets: [
                {
                    label: chartLabels[chartNo][0],
                    data: chartNo == 0 ? data["acc"] : data["loss"],
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    borderWidth: 1,
                    pointStyle: false,
                },
                {
                    label: chartLabels[chartNo][1],
                    data: chartNo == 0 ? data["val_acc"] : data["val_loss"],
                    borderColor: 'blue',
                    backgroundColor: 'rgba(0, 0, 255, 0.1)',
                    borderWidth: 1,
                    pointStyle: false,
                },
            ],
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: chartOptions[chartNo]["yMax"],
                    ticks: {
                        stepSize: chartOptions[chartNo]["ticksStep"],
                    },
                },
            },
            plugins: {
                // Configuração para definir o fundo branco
                legend: {
                    labels: {
                        fontColor: 'black',
                    },
                },
                tooltip: {
                    bodyFontColor: 'black',
                },
                filler: {
                    propagate: false,
                },
                title: {
                    fontColor: 'black',
                },
            },
            elements: {
                point: {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                },
                line: {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                },
                arc: {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                },
            },
        },
    };

    const imageBuffer = await chartNode.renderToBuffer(configuration);

    // Export as base64 PNG
    const base64Image = imageBuffer.toString('base64');
    return base64Image;
}

async function generate_base64(chartNo, max_epochs, data) {
    try {
        const pngBinary = await generateChart(chartNo, max_epochs, data);  
        return pngBinary
    } catch (error) {
        console.error('Error generating chart:', error);
    }
}

module.exports = generate_base64
