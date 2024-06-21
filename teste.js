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

data_1 = {
    loss: [0.6598060976421599, 0.3897589560617277, 0.33462614385639844 , 0.4325017669438327, 0.8325788147018329],
    val_loss: [0.17844409734771682 , 0.002523107737990027,0.3305703682899298, 0.07323412182695133, 0.8453848846409111]
}


async function generateChart(chartNo, max_epochs, data) {
    const width = 400;
    const height = 300; 

    const chartCallback = (ChartJS) => {
        ChartJS.defaults.font.family = 'Arial';
        ChartJS.defaults.font.size = 10;
    };

    const backgroundColour = 'white';
    const chartNode = new ChartJSNodeCanvas({ width, height, chartCallback, backgroundColour });

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
                customCanvasBackgroundColor: {
                    color: '#ffffff',
                },legend: {
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

    const base64Image = imageBuffer.toString('base64');
    return base64Image;
}

async function sendPlotsToServer(id, data) {
    
    try {
        const pngBinaryLoss = await generateChart(1, 5, data); 
         // Converter a imagem base64 para buffer
        const imageBuffer = Buffer.from(pngBinaryLoss, 'base64');

        // Salvar o buffer como arquivo PNG
        const filename = `chart_${id}.png`; // Nome do arquivo (pode ser personalizado)
        fs.writeFileSync(filename, imageBuffer);
        console.log(`Chart saved as ${filename}`);
    } catch (error) {
        console.error('Error generating chart:', error);
    }
}

// Usage example
sendPlotsToServer('some_id', data_1);
