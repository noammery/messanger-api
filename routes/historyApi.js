const express = require(`express`);
const router = express.Router();
const History = require(`../modals/history`);

router.post(`/room`, (req, res, next) => {
  if (req.body) {
    History.create(req.body)
      .then((data) => res.json(data))
      .catch(next);
  }
});

router.post(`/gethistory`, (req, res, next) => {
  const room = req.body.room;
  History.find({ room: room })
    .then((data) => res.json(data))
    .catch(next);
});

router.delete(`/room`, (req, res, next) => {
  const message = req.body;
  History.findOneAndDelete({
    message: message.message,
    author: message.author,
    room: message.room,
  })
    .then(console.log(`message deleted`))
    .catch(next);
});

module.exports = router;
