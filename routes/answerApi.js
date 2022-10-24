const express = require(`express`);
const router = express.Router();
const Answer = require(`../modals/answers`);

router.post(`/answers`, async (req, res, next) => {
  if (req.body) {
    const found = await Answer.findOne({ question: req.body.question });
    if (found) {
      res.sendStatus(409);
    } else {
      Answer.create(req.body)
        .then((data) => res.json(data))
        .catch(next);
    }
  }
});

router.post(`/question`, (req, res, next) => {
  const question = req.body.question;
  Answer.findOne({ question: { $regex: question } }).then((data) =>
    res.json(data)
  );
});

module.exports = router;
