function saveDataToLocalStorage() {
    const accData = window.charts[0].data.datasets[0].data;
    const valAccData = window.charts[0].data.datasets[1].data;
    const lossData = window.charts[1].data.datasets[0].data;
    const valLossData = window.charts[1].data.datasets[1].data;

    localStorage.setItem('accData', accData);
    localStorage.setItem('valAccData', valAccData);
    localStorage.setItem('lossData', lossData);
    localStorage.setItem('valLossData', valLossData);
}

// update chart
function uc(acc, val_acc, loss, val_loss) {
    window.charts[0].data.datasets[0].data.push(acc);
    window.charts[0].data.datasets[1].data.push(val_acc);
    window.charts[0].update();
    window.charts[1].data.datasets[0].data.push(loss);
    window.charts[1].data.datasets[1].data.push(val_loss);
    window.charts[1].update();

    saveDataToLocalStorage();
}

function save_metadata(max_epochs, id) {
    localStorage.setItem('max_epochs', max_epochs);
    localStorage.setItem('id', id);
}

function get_plot_id(){
    return localStorage.getItem("id");
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

function loadDataFromLocalStorage() {

    const accData = localStorage.getItem('accData')?.split(",") || [];
    const valAccData = localStorage.getItem('valAccData')?.split(",") || [];
    const lossData = localStorage.getItem('lossData')?.split(",") || [];
    const valLossData = localStorage.getItem('valLossData')?.split(",") || [];
    const max_epochs = localStorage.getItem('max_epochs') || 100;


    window.charts[0].data.datasets[0].data = accData;
    window.charts[0].data.datasets[1].data = valAccData;
    window.charts[1].data.datasets[0].data = lossData;
    window.charts[1].data.datasets[1].data = valLossData;
    updateLabels(max_epochs);

    window.charts[0].update();
    window.charts[1].update();
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