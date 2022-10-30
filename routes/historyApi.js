const express = require(`express`);
const router = express.Router();
const History = require(`../modals/history`);
const Cryptr = require(`cryptr`);
require(`dotenv`).config();

const cryptr = new Cryptr(`${process.env.MESSAGE_TOKEN_SECRET}`);

router.post(`/room`, async (req, res, next) => {
  if (req.body) {
    const hashedMessage = cryptr.encrypt(req.body.message);
    const hashedRoom = cryptr.encrypt(req.body.room);
    const hashedAuthor = cryptr.encrypt(req.body.author);
    const hashedTime = cryptr.encrypt(req.body.time);
    const hashedObj = req.body;
    hashedObj.message = hashedMessage;
    hashedObj.room = hashedRoom;
    hashedObj.author = hashedAuthor;
    hashedObj.time = hashedTime;
    History.create(hashedObj)
      .then((data) => res.json(data))
      .catch(next);
  }
});

router.post(`/gethistory`, async (req, res, next) => {
  const room1 = req.body.room;
  const messages = await History.find();
  // console.log(messages);
  for (let i = 0; i < messages.length; i++) {
    const hashedRoom1 = cryptr.decrypt(messages[i].room);
    if (hashedRoom1 === room1) {
      const hashedMessage1 = await cryptr.decrypt(messages[i].message);
      const hashedAuthor1 = await cryptr.decrypt(messages[i].author);
      const hashedTime1 = await cryptr.decrypt(messages[i].time);
      messages[i].message = hashedMessage1;
      messages[i].author = hashedAuthor1;
      messages[i].room = hashedRoom1;
      messages[i].time = hashedTime1;
    }
    if (hashedRoom1 !== room1) {
      messages.splice(i, 1);
    }
  }
  res.send(messages);
});

module.exports = router;
