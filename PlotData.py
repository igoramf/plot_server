import socketio
import requests

class PlotData:
    
    # SERVER_URL = "https://plot-server-vyls.onrender.com"
    SERVER_URL = "http://localhost:3000/"
    
    def __init__(self):
        self.sio = socketio.Client()
        self.id = None
        
        @self.sio.event
        def connect():
            print('Conectado ao servidor')
            self.__get_id_from_server()
            
        @self.sio.event
        def disconnect():
            print('Desconectado do servidor')
        
        @self.sio.on('image_data')
        def on_image_data(data):
            print('Imagens recebidas e salvas')
            self.save_images(data)
            
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
            'max_epochs': max_epochs,
            'id': self.id
        }
        self.sio.emit('training_data', data)
        # print(f'Dados enviados: train_acc={train_acc}, val_acc={val_acc}, loss={loss}, val_loss={val_loss}, max_epochs={max_epochs}')
    
    def __get_id_from_server(self):
        try:
            response = requests.get(self.SERVER_URL + 'get-id')
            if response.status_code == 200:
                self.id = response.json()['id']
                print(f"ID recebido do servidor: {self.id}")
            else:
                print(f"Falha ao obter ID: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Erro ao fazer requisição para obter ID: {e}")
    
    def save_images(self, image_data):
        acc_plot = image_data['accPlot']
        loss_plot = image_data['lossPlot']
        print("RECEBI TUDO")
        print(acc_plot)