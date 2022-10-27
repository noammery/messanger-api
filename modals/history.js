const mongoose = require(`mongoose`);

const HistoeySchema = mongoose.Schema([
  {
    message: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    room: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
]);

const History = mongoose.model(`history`, HistoeySchema);
module.exports = History;
