import Message from "../models/message.model.js";
import ChatSession from "../models/chat.model.js";
import User from "../models/user.model.js";

const messageController = {
    _sendMessageFromuUser: async (req, res) => {
        try {
            const { text } = req.body;
            const receiverUserId = req.params.receiverId;

            if (!text || !receiverUserId) {
                return res.status(400).json({
                    status: false,
                    message: "Text and Receiver ID are required",
                });
            }

            const newMessage = new Message({
                sender: req.currentUser.id,
                receiverId: receiverUserId,
                text,
            });
            await newMessage.save();

            await ChatSession.findOneAndUpdate(
                {
                    senderId: req.currentUser.id,
                    receiverId: receiverUserId,
                },
                { $push: { messages: newMessage._id } },
                { new: true, upsert: true }
            );

            return res.status(200).json({
                status: true,
                message: "Message sent successfully",
                data: newMessage,
            });
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message,
            });
        }
    },

    _chatHistoryBetweenTwoUser: async (req, res) => {
        try {
            const { frontUserId } = req.params;
    
            const chatSession = await ChatSession.find({
                $or: [
                    { senderId: req.currentUser.id, receiverId: frontUserId },
                    { senderId: frontUserId, receiverId: req.currentUser.id },
                ],
            })
            .populate({
                path: 'messages',
                populate: [
                    { path: 'sender', select: 'role' },  
                    { path: 'receiverId', select: 'role' } 
                ],
            });
            if (!chatSession) {
                return res.status(404).json({
                    status: false,
                    message: 'Chat not found',
                });
            }
    
            // Map messages with role names
            const allMessages = chatSession.flatMap((session) =>
                session.messages.map((message) => ({
                    text: message.text,
                    createdAt: message.createdAt,
                    sender: message.sender?.role || 'Unknown',
                    receiver: message.receiverId?.role || 'Unknown' ,
                }))
            );
    
            return res.status(200).json({
                status: true,
                message: 'Chat History',
                data: allMessages,
            });
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message,
            });
        }
    },
    
    

    _messageFromUserToAdmin: async (req, res) => {
        try {
            const { text, receiverId } = req.body;
            console.log(text)
            let receiverUserId = receiverId;
            if (!receiverUserId) {
                const user = await User.findOne({ role: 'ADMIN' });
                receiverUserId = user._id;
            }
            const newMessage = new Message({
                sender: req.currentUser.id,
                receiverId: receiverUserId,
                text
            })
            await newMessage.save();
console.log(newMessage)
            await ChatSession.findOneAndUpdate(
                {
                    senderId: req.currentUser.id,
                    receiverId: receiverUserId,
                },
                { $push: { messages: newMessage._id } },
                { new: true, upsert: true }
            );
            return res.status(200).json({
                status: true,
                message: "Message sent successfully",
                data: newMessage
            })
        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message
            })
        }
    },

    _chatFromAdminToUser: async (req, res) => {
        try {
            const { text} = req.body;
            if (!req.params.receiverId) {
                return res.status(404).json({
                    status: false,
                    message: "receiverId Id IS required",
                });
            }

            // Create a new message and save it
            const newMessage = await new Message({
                sender: req.currentUser.id,
                receiverId:req.params.receiverId,
                text,
            }).save();

            await ChatSession.findOneAndUpdate(
                {
                    senderId: req.currentUser.id,
                    receiverId:req.params.receiverId,
                },
                { $push: { messages: newMessage._id } },
                { new: true, upsert: true }
            );

            return res.status(200).json({
                status: true,
                message: "Message sent successfully",
                data: newMessage,
            });

        } catch (err) {
            return res.status(err.statusCode || 500).json({
                status: false,
                error: err.message,
            });
        }
    },


    _chatHistoryFromUserToAdmin: async (req, res) => {
        const { receiverId } = req.body;
        let receiverUserId = receiverId;
        if (!receiverUserId) {
            const user = await User.findOne({ role: 'ADMIN' });
            receiverUserId = user._id.toString();
        }
        const chatSession = await ChatSession.find({
            $or: [
                { senderId: req.currentUser.id, receiverId: receiverUserId },
                { senderId: receiverUserId, receiverId: req.currentUser.id },
            ],
        })
        .populate({
            path: 'messages',
            populate: [
                { path: 'sender', select: 'role' },  
                { path: 'receiverId', select: 'role' } 
            ],
        });

        // If no chat session is found, throw an error
        if (!chatSession) {
            return res.status(404).json({
                status: false,
                message: 'Chat not found',
            });
        }

        const allMessages = chatSession.flatMap((session) =>
            session.messages.map((message) => ({
                text: message.text,
                createdAt: message.createdAt,
                sender: message.sender?.role || 'Unknown',
                receiver: message.receiverId?.role || 'Unknown' ,
            }))
        );
        return res.status(200).json({
            status: true,
            message: 'Chat History',
            data: allMessages,
        });
    },
}



export default messageController;