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
  trainAcc: {
    type: [Number],
    default: [],
  },
  valAcc: {
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
  maxEpochs: {
    type: Number,
  },
});

const Plot = mongoose.model('Plot', plotSchema);

module.exports = Plot;
