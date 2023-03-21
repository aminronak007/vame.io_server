const express = require("express");
const app = express();
app.use(express.json());
const dbConnect = require("./config/db");
const server = require("./config/socket");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { Server } = require("socket.io");
// const path = require("path");

dbConnect();
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use("/public", express.static(__dirname + "/public"));

// app.use("/", express.static(__dirname + "/frontEnd"));

const auth = require("./routes/auth");
const projectMasterRoutes = require("./routes/projectMasterRoutes");
const freelancerRoutes = require("./routes/freelancerRoutes");
const employerRoutes = require("./routes/employerRoutes");
const courseCategoryRoutes = require("./routes/courseCategoryRoutes");
const conversationRoutes = require("./routes/conversations");
const messageRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");
const coursesRoutes = require("./routes/coursesRoutes");
const quizzesRoutes = require("./routes/quizRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const groupsRoutes = require("./routes/groupsRoutes");
const jobOfferRoutes = require("./routes/offerRoutes");

app.use("/", auth);
app.use("/", projectMasterRoutes);
app.use("/", freelancerRoutes);
app.use("/", employerRoutes);
app.use("/", courseCategoryRoutes);
app.use("/", conversationRoutes);
app.use("/", messageRoutes);
app.use("/", usersRoutes);
app.use("/", coursesRoutes);
app.use("/", quizzesRoutes);
app.use("/", paymentRoutes);
app.use("/", groupsRoutes);
app.use("/", jobOfferRoutes);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontEnd/index.html"));
// });

const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONT_URL}`,
  },
});
let users = [];

const addUser = (userId, socketId) => {
  if (userId) {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = async (userId) => {
  // console.log("getUser", userId);
  return await users.find((user) => {
    user.userId === userId;
  });
};

io.on("connection", (socket) => {
  // When Connect
  console.log("A user is connected.");
  // Take user id and socket id from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  // Send and Get Message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    // console.log("dd", receiverId);
    const user = getUser(receiverId);
    // console.log("user", user);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // When Disconnect
  socket.on("disconnect", () => {
    console.log("a user is disconnected.");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server Started on port ${process.env.SERVER_PORT}`);
});
