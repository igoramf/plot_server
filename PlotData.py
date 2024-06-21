import socketio
import requests

class PlotData:
    
    # SERVER_URL = "https://plot-server-taio.onrender.com/"
    SERVER_URL = "http://localhost:3000/"
    
    def __init__(self):
        self.sio = socketio.Client()
        self.id = None
        self.url = None
        self.train_acc = []
        self.val_acc = []
        self.loss = []
        self.val_loss = []
        
        @self.sio.event
        def connect():
            print('Conectado ao servidor')
            self.__get_id_from_server()
            
        @self.sio.event
        def disconnect():
            print('Desconectado do servidor')
            
    def call(self, train_acc, val_acc, loss, val_loss, max_epochs):
        self.__send_data(train_acc, val_acc, loss, val_loss, max_epochs)
        
    def connect(self):
        if not self.sio.connected:
            self.sio.connect(self.SERVER_URL)
    
    def __send_data(self, train_acc_value, val_acc_value, loss_value, val_loss_value, max_epochs):
        self.train_acc.append(train_acc_value)
        self.val_acc.append(val_acc_value)
        self.loss.append(loss_value)
        self.val_loss.append(val_loss_value)
        
        data = {
            'train_acc': self.train_acc,
            'val_acc': self.val_acc,
            'loss': self.loss,
            'val_loss': self.val_loss,
            'max_epochs': max_epochs,
            'id': self.id
        }
        self.sio.emit('training_data', data)
        # print(f'Dados enviados: train_acc={train_acc}, val_acc={val_acc}, loss={loss}, val_loss={val_loss}, max_epochs={max_epochs}')
    
    def __get_id_from_server(self):
        try:
            response = requests.post(self.SERVER_URL + 'create-plot')
            if response.status_code == 201:
                self.id = response.json()['id']
                self.url = response.json()['url']
                print(f"ID recebido do servidor: {self.id}")
                self.sio.emit('join_room', self.id)
            else:
                print(f"Falha ao obter ID: {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"Erro ao fazer requisição para obter ID: {e}")