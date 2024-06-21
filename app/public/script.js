
// update chart
function uc(acc, val_acc, loss, val_loss) {
    window.charts[0].data.datasets[0].data = acc
    window.charts[0].data.datasets[1].data = val_acc
    window.charts[0].update();
    window.charts[1].data.datasets[0].data = loss
    window.charts[1].data.datasets[1].data = val_loss
    window.charts[1].update();

    sendPlotsToServer(get_plot_id())
}


function get_plot_id(){
    loc = window.location.href
    id = loc.split("/").pop()
    return id
}

function dataURLToBinary(dataURL) {
    const binaryString = atob(dataURL.split(",")[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        {
            bytes[i] = binaryString.charCodeAt(i);
        }
    }
    return bytes.buffer;
}

function canvasIdToPngBin(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        {
            throw new Error(
                `Canvas element with ID '${{ canvasId }}' not found.`
            );
        }
    }
    return canvas.toDataURL("image/png");
}

async function sendPlotsToServer(id) {
    try {
        const pngBinaryAcc = await canvasIdToPngBin("chart0");
        const pngBinaryLoss = await canvasIdToPngBin("chart1");
        
        const response = await fetch(`/update-plot/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ plot_acc: pngBinaryAcc, plot_loss: pngBinaryLoss })
        });

        if (!response.ok) {
            throw new Error('Failed to update plot');
        }

        const updatedPlot = await response.json();
        console.log('Plot updated:', updatedPlot);
    } catch (error) {
        console.error('Error updating plot:', error);
    }
}

const chartLabels = [
    ["train acc", "eval acc"],
    ["train loss", "eval loss"],
];


const chartOptions = [
    { ticksStep: 0.2, yMax: 1.0 },
    { ticksStep: 1, yMax: 6.0 },
];

window.charts = [];
function createCharts(max_epochs=100) {
    for (let chartNo = 0; chartNo < 2; chartNo++) {
        {
            const ctx = document
                .getElementById("chart" + chartNo)
                .getContext("2d");
            const chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: Array.from({ length: max_epochs }, (_, i) => i + 1),
                    datasets: [
                        {
                            label: chartLabels[chartNo][0],
                            data: [],
                            borderColor: "red",
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                            borderWidth: 1,
                            pointStyle: false,
                        },
                        {
                            label: chartLabels[chartNo][1],
                            data: [],
                            borderColor: "blue",
                            backgroundColor: "rgba(0, 0, 255, 0.1)",
                            borderWidth: 1,
                            pointStyle: false,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    animation: false,
                    scales: {
                        y: {
                            min: 0,
                            max: chartOptions[chartNo]["yMax"],
                            ticks: {
                                stepSize: chartOptions[chartNo]["ticksStep"],
                            },
                            grid: {
                                color: "aaaaaa",
                                lineWidth: 1,
                                drawBorder: true,
                                drawOnChartArea: true,
                            },
                        },
                        x: {
                            ticks: {
                                maxTicksLimit: 10,
                            },
                            grid: {
                                color: "eeeeee",
                                lineWidth: 1,
                                drawBorder: true,
                                drawOnChartArea: true,
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: "black",
                            },
                        },
                    },
                    layout: {
                        backgroundColor: "black",
                    },
                },
            });
            window.charts.push(chart);
        }
    }
}

function updateLabels(max_epochs){
    window.charts[0].data.labels = Array.from({ length: max_epochs }, (_, i) => i + 1)
    window.charts[1].data.labels = Array.from({ length: max_epochs }, (_, i) => i + 1)
}

function ClearData() {
    localStorage.clear();
    window.charts[0].data.datasets[0].data = [];
    window.charts[0].data.datasets[1].data = [];
    window.charts[1].data.datasets[0].data = [];
    window.charts[1].data.datasets[1].data = [];

    window.charts[0].update();
    window.charts[1].update();
    updateLabels(0)
}

const deleteRoom = async (id) => {
    try {
        const response = await fetch(`/delete-room/${id}`, { method: 'DELETE' });
        if (response.ok) {
            const data = await response.json();
        } else {
            const errorData = await response.json();
            console.error(errorData.error);
        }
    } catch (error) {
        console.error('Error deleting room:', error);
    }
};