import socketio

class PlotData:
    
    SERVER_URL = "http://localhost:3000"
    
    def __init__(self):
        self.sio = socketio.Client()
        
        @self.sio.event
        def connect():
            print('Conectado ao servidor')
            
        @self.sio.event
        def disconnect():
            print('Desconectado do servidor')
            
    def call(self, train_acc, val_acc, loss, val_loss, max_epochs):
        self.__connect()
        self.__send_data(train_acc, val_acc, loss, val_loss, max_epochs)
        
    def __connect(self):
        if not self.sio.connected:
            self.sio.connect(self.SERVER_URL)
        
    def __send_data(self, train_acc, val_acc, loss, val_loss, max_epochs):
        data = {
            'train_acc': train_acc,
            'val_acc': val_acc,
            'loss': loss,
            'val_loss': val_loss,
            'max_epochs': max_epochs
        }
        self.sio.emit('training_data', data)
        print(f'Dados enviados: train_acc={train_acc}, val_acc={val_acc}, loss={loss}, val_loss={val_loss}, max_epochs={max_epochs}')