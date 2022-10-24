const express = require(`express`);
const router = express.Router();
const User = require(`../modals/users`);

router.post(`/register`, (req, res, next) => {
  req.body
    ? User.create(req.body)
        .then((data) => res.json(data))
        .catch(next)
    : res.json({ error: `Please enter an input` });
});

router.post(`/find`, (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((data) => res.json(data))
    .catch(next);
});

router.post(`/login`, async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user.password === req.body.password) {
    res.json(user);
  } else {
    res.status(401);
  }
});

module.exports = router;
