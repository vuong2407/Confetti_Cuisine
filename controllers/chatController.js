const message = require("../models/message");

module.exports = (io) => {
  io.on("connection", (client) => {
    console.log("new connection");
    message
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .then((messages) => client.emit("load all messages", messages.reverse()));
    client.on("disconnect", () => {
      client.broadcast.emit("user disconnected");
      console.log("user disconnect");
    });
    client.on("message", (data) => {
      const messageAttributes = {
        ...data,
      };
      const m = new message(messageAttributes);
      m.save()
        .then(() => {
          io.emit("message", messageAttributes);
        })
        .catch((error) => console.log(`error ${error.message}`));
    });
  });
};
