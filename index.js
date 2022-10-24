const express = require(`express`);
const { default: mongoose } = require("mongoose");
const app = express();
const http = require("http");
const { Server } = require(`socket.io`);
const cors = require(`cors`);
const bodyParser = require(`body-parser`);
const usersRouter = require(`./routes/usersApi`);
const answerRouter = require(`./routes/answerApi`);
mongoose.Promise = global.Promise;
mongoose
  .connect(
    "mongodb+srv://noammery55:ekoMeuvSpIn6Ig3U@cluster0.hv4fomr.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log(`Connected to Data-base`))
  .catch((err) => console.log(err));

app.use(cors());

app.use(bodyParser.json());

const server = http.createServer(app);

app.use(`/user`, usersRouter);

app.use(`/ai`, answerRouter);

const io = new Server(server, {
  cors: {
    origin: `http://localhost:3000`,
    methods: ["GET", "POST"],
  },
});

const respone1 = (socket, message) => {
  socket.to(message.room).emit("receive_message", {
    author: message.author,
    message: message.message,
    time:
      new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
  });
};

const respone = (socket, message, respone) => {
  socket.to(message.room).emit("receive_message", {
    author: "Auto-respone",
    message: respone,
    time:
      new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
  });
};

io.on(`connection`, (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on(`join_room`, (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on(`submit_question`, (data) => {
    socket.to("admin").emit(`asked_question`, data);
  });

  socket.on(`send_message`, (message) => {
    if (message.room === "404") {
      const theMessage = message.message.toLowerCase();
      respone1(socket, message);
      switch (true) {
        case theMessage.includes("hey"):
          respone(socket, message, "Hey, how are you");
          break;
        case theMessage.includes("your name"):
          respone(socket, message, "Im noam, your online pal");
          break;
        case theMessage.includes("weather"):
          respone(socket, message, "Go outside and cheak");
          break;
        case theMessage.includes("love"):
          respone(socket, message, "I love you so much!");
          break;
        case theMessage.includes("another", "joke"):
          respone(socket, message, "Shot, i ran out of jokes...");
          break;
        case theMessage.includes("joke"):
          respone(socket, message, "Your mama");
          break;
        case theMessage.includes("how are you"):
          respone(socket, message, "Im great! thanks");
          break;
        case theMessage.includes("time"):
          respone(
            socket,
            message,
            `the time now is : ${
              new Date(Date.now()).getHours() +
              ":" +
              new Date(Date.now()).getMinutes()
            }`
          );
          break;
        case theMessage.includes("age"):
          respone(socket, message, "You shouldnt ask that");
          break;
        case theMessage.includes("how are you"):
          respone(socket, message, "Im great! thanks");
          break;

        default:
          break;
      }
    } else {
      socket.to(message.room).emit("receive_message", message);
    }
  });

  socket.on(`leave`, (room) => {
    socket.leave(room);
    console.log(`user ${socket.id} left room ${room}`);
    socket.emit(`reset_chat`);
  });

  socket.on(`disconnect`, () => {
    console.log(`User  ${socket.id} disconnect`);
  });
});

server.listen(3001, () => {
  console.log("server is running on port 3001");
});
