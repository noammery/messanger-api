const express = require(`express`);
const router = express.Router();
const History = require(`../modals/history`);
const Cryptr = require(`cryptr`);
require(`dotenv`).config();

const cryptr = new Cryptr(`${process.env.MESSAGE_TOKEN_SECRET}`);

router.post(`/room`, async (req, res, next) => {
  if (req.body) {
    const hashedMessage = cryptr.encrypt(req.body.message);
    const hashedObj = req.body;
    hashedObj.message = hashedMessage;
    History.create(hashedObj)
      .then((data) => res.json(data))
      .catch(next);
  }
});

router.post(`/gethistory`, async (req, res, next) => {
  const room = req.body.room;
  const messages = await History.find({ room: room });
  for (let i = 0; i < messages.length; i++) {
    const hashedMessage = cryptr.decrypt(messages[i].message);
    messages[i].message = hashedMessage;
  }
  res.send(messages);
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
