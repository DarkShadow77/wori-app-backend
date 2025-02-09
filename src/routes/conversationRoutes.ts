import { Router} from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { fetchAllConversationsByUserId } from '../controllers/conversationsController';

const router = Router();

// Define your routes here
router.get("/", verifyToken, fetchAllConversationsByUserId);

export default router;