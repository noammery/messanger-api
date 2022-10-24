const mongoose = require(`mongoose`);

const AnswersSchema = mongoose.Schema([
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
]);

const Answer = mongoose.model(`answer`, AnswersSchema);
module.exports = Answer;
