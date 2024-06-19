window.onload = function() {
    createCharts();
    loadDataFromLocalStorage();

    const socket = io('https://plot-server-taio.onrender.com/');
    // const socket = io('http://localhost:3000');
      socket.on('connect', () => {
        const roomId = get_plot_id(); 
        socket.emit('join_room', roomId);
    });

    socket.on('update_chart', (data) => {
      const { train_acc, val_acc, loss, val_loss, max_epochs, id } = data;

      updateLabels(max_epochs);

      uc(train_acc, val_acc, loss, val_loss);
 
      const epoch = window.charts[0].data.datasets[0].data.length;
      if (epoch === max_epochs + 1) {
          console.log('Training finished');
          emitPlots(socket);
          ClearData()
          deleteRoom(id);
      }
    });
};