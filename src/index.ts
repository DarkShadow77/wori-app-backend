import express, { Request, Response } from "express";
import { json } from "body-parser";
import http from "http"
import { Server } from "socket.io";
import authRoute from "./routes/authRoutes";
import conversationsRoute from "./routes/conversationRoutes";
import messageRoute from "./routes/messageRoutes";
import { saveMessage } from "./controllers/messageController";

const app = express();
const server = http.createServer(app);
app.use(json());
const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

app.use("/auth", authRoute);
app.use("/conversations", conversationsRoute);
app.use("/messages", messageRoute);

app.get("/", (req: Request, res: Response) => {
    console.log("Test");
    res.send("Yes it Works");
})

io.on("connection", (socket) => {
    console.log("A User connected: ", socket.id)

    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId);
        console.log("user Joined Conversation :", conversationId);
    })

    socket.on("sendMessage", async (message) => {
        const { conversationId, senderId, content } = message;

        try {
            const savedMessage = await saveMessage(conversationId, senderId, content);
            console.log("sendMessage : ");
            console.log(savedMessage);
            io.to(conversationId).emit("newMessage", savedMessage);

            io.emit("conversationUpdated", {
                conversationId, 
                lastMessage: savedMessage.content,
                lastMessageTime: savedMessage.created_at,
            })
        } catch (err) {
            console.error("Failed to save Message: ", err);
        }
    })

    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
    })
})

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})