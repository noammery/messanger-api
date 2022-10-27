const express = require(`express`);
const router = express.Router();
const User = require(`../modals/users`);
require(`dotenv`).config();
const bcrypt = require(`bcrypt`);

router.post(`/register`, async (req, res, next) => {
  const cheack = await User.find({ email: req.body.email });
  if (cheack.length === 0) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = req.body;
    newUser.password = hashedPassword;
    req.body
      ? User.create(newUser)
          .then((data) => res.json(data))
          .catch(next)
      : res.json({ error: `Please enter an input` });
  } else {
    res.sendStatus(409);
  }
});

router.post(`/find`, (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => res.json(data))
    .catch(next);
});

router.post(`/login`, async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.json(user);
    } else {
      res.send(`Not Allowed`);
    }
  } else {
    res.sendStatus(500);
  }
});

module.exports = router;
