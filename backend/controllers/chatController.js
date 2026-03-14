const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { consultationId } = req.params;

  const messages = await Message.find({ consultationId }).sort({
    createdAt: 1,
  });

  res.json(messages);
};
