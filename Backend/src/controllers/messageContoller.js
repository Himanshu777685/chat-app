import Message from "../models/messages.js";
import User from "../models/User.js";
import cloudinary from "../cloudinary.js";
import { io , userSocketMap } from "../../server.js";


export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    //no. of messages not seen

    const unseenmessages = {}
    const lastMessages = {}


    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({ senderId: user._id, receiverId: loggedInUserId, seen: false });

      if (messages.length > 0) {
        unseenmessages[user._id] = messages.length;
      }


      const lastMessage = await Message.findOne({
        $or: [
          {
            senderid: loggedInUserId,
            receiverId: user._id
          }, {
            senderId: user._id,
            receiverId: loggedInUserId,
          }
        ]
      }).sort({ createdAt: -1 });

      if (lastMessage) {
        lastMessages[user._id] = {
          text: lastMessage.text,
          image: lastMessage.image,
          time: lastMessage.createdAt,
        };
      }


    });

    await Promise.all(promises);

    res.status(200).json({ success: true, users: filteredUsers, unseenmessages, lastMessages });

  } catch (error) {

    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        {
          senderId: loggedInUserId,
          receiverId: selectedUserId,
        },
        {
          senderId: selectedUserId,
          receiverId: loggedInUserId,
        },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany({ senderId: selectedUserId, receiverId: loggedInUserId, seen: false }, { seen: true })

    res.status(200).json({
      success: true,
      messages,
    });

  } catch (error) {
    console.log("Error in getMessages:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const mark_seen = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const loggedInUserId = req.user._id;

    await Message.updateMany(
      {
        senderId: selectedUserId,
        receiverId: loggedInUserId,
        seen: false,
      },
      {
        $set: {
          seen: true,
        },
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const sendMessage = async (req, res) => {
  try {

    const { text, image } = req.body;

    const receiverId = req.params.id;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    let imageUrl;
    if (image) {

      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
      console.log(imageUrl);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,

    })


    const receiverSocketId = userSocketMap[receiverId];
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    

    res.status(200).json({
      success: true,
      newMessage
    })



  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};