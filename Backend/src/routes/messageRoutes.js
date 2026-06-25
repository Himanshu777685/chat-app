import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, mark_seen, sendMessage } from '../controllers/messageContoller.js';


const messageRouter = express.Router();

messageRouter.get('/users' , protectRoute , getUsersForSidebar);
messageRouter.get('/:id' , protectRoute , getMessages);
messageRouter.put('/mark/:id' , protectRoute , mark_seen);
messageRouter.post('/send/:id' , protectRoute , sendMessage);

export default messageRouter;