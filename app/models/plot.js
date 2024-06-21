// models/Plot.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const plotSchema = new Schema({
  plotId: {
    type: String,
    required: true,
    unique: true
  },
  plotAcc: {
    type: String,
  },
  plotLoss: {
    type: String,
  },
  train_acc: {
    type: [Number],
    default: [],
  },
  val_acc: {
    type: [Number],
    default: [],
  },
  loss: {
    type: [Number],
    default: [],
  },
  val_loss: {
    type: [Number],
    default: [],
  },
  max_epochs: {
    type: Number,
  },
});

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
