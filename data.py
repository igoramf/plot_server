import random
import time
import sys
import os

from PlotData import *

plot_data_client = PlotData()

while True:
    train_acc = random.random()
    val_acc = random.random()
    loss = random.random()
    train_loss = random.random()

    
    plot_data_client.call(train_acc, val_acc, loss, train_loss, 100) 
    print(f'Dados enviados: train_acc={train_acc}, val_acc={val_acc}, loss={loss}, val_loss={train_loss}, max_epochs=10')

    time.sleep(1)