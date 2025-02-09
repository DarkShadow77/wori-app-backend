import { Router} from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { fetchAllConversationsByUserId } from '../controllers/conversationsController';
import { fetchAllMessageByConversationId } from '../controllers/messageController';

const router = Router();

// Define your routes here
router.get("/:conversationId", verifyToken, fetchAllMessageByConversationId);

export default router;