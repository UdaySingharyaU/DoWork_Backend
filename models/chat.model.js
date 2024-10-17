import mongoose from 'mongoose';

const chatSessionSchema = new mongoose.Schema({
  senderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  receiverId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

export default ChatSession;
