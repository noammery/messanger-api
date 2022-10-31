const express = require(`express`);
const router = express.Router();
const History = require(`../modals/history`);
const Cryptr = require(`cryptr`);
require(`dotenv`).config();

const cryptr = new Cryptr(`${process.env.MESSAGE_TOKEN_SECRET}`);

router.post(`/room`, async (req, res, next) => {
  if (req.body) {
    const hashedMessage = cryptr.encrypt(req.body.message);
    // const hashedRoom = cryptr.encrypt(req.body.room);
    const hashedAuthor = cryptr.encrypt(req.body.author);
    const hashedTime = cryptr.encrypt(req.body.time);
    const hashedObj = req.body;
    hashedObj.message = hashedMessage;
    hashedObj.room = req.body.room;
    hashedObj.author = hashedAuthor;
    hashedObj.time = hashedTime;
    History.create(hashedObj)
      .then((data) => res.json(data))
      .catch(next);
  }
});

router.post(`/gethistory`, async (req, res, next) => {
  const messageList = [];
  const room1 = req.body.room;
  const messages = await History.find({ room: room1 });
  // console.log(messages);
  for (let i = 0; i < messages.length; i++) {
    const newMessage = { message: "", author: "", room: "", time: "" };
    const hashedMessage1 = await cryptr.decrypt(messages[i].message);
    const hashedAuthor1 = await cryptr.decrypt(messages[i].author);
    const hashedTime1 = await cryptr.decrypt(messages[i].time);
    newMessage.message = hashedMessage1;
    newMessage.author = hashedAuthor1;
    newMessage.room = room1;
    newMessage.time = hashedTime1;
    messageList.push(newMessage);
  }
  res.send(messageList);
});

router.post(`/getrooms`, async (req, res, next) => {
  const roomList = [];
  const user = req.body.author;
  const messages = await History.find();
  for (let i = 0; i < messages.length; i++) {
    const unHashedUser = await cryptr.decrypt(messages[i].author);
    if (user == unHashedUser) {
      roomList.push(messages[i].room);
    }
  }
  const filterredRoomList = await roomList.filter(
    (item, index) => roomList.indexOf(item) === index
  );
  if (filterredRoomList.length !== 0) {
    res.send(filterredRoomList);
  } else {
    res.send(["nodata"]);
  }
});

module.exports = router;
