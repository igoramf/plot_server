// url = "http://localhost:3000/" 
url = 'https://plot-server-taio.onrender.com/'
const loadData = async (id) => {
    const response = await fetch(`${url}plot/data/${id}`);
    const data = await response.json();
    return data;
}

window.onload = async function() {
    createCharts();
    await loadData(get_plot_id()).then(data => {
        const { train_acc, val_acc, loss, val_loss, max_epochs } = data;
        updateLabels(max_epochs);
        uc(train_acc, val_acc, loss, val_loss);
    });

    const socket = io(url);
      socket.on('connect', () => {
        const roomId = get_plot_id(); 
        socket.emit('join_room', roomId);
    });

    socket.on('update_chart', (data) => {
      const { train_acc, val_acc, loss, val_loss, max_epochs, id } = data;

      updateLabels(max_epochs);
      uc(train_acc, val_acc, loss, val_loss);
      sendPlotsToServer(id)
 
      const epoch = window.charts[0].data.datasets[0].data.length;
      if (epoch === max_epochs + 1) {
          console.log('Training finished');
          ClearData()
          // deleteRoom(id);
      }
    });
};