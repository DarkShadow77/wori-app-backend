import pool from "../models/db";
import { Request, Response } from "express";

export const fetchAllMessageByConversationId = async (req: Request, res: Response) => {
    let {conversationId} = req.params;

    try {
        const result = await pool.query(`
            SELECT m.id, m.content, m.sender_id, m.conversation_id, m.created_at
            FROM messages m
            WHERE m.conversation_id = $1
            ORDER BY m.created_at ASC
            `, [conversationId]

        );

        res.json(result.rows);

    } catch (e) {
        res.status(500).json({error: "Failed to fetch messages"})

    }

}

export const saveMessage = async (conversationId: string, senderId: string , content: string) =>{


    try {
        const result = await pool.query(`
            INSERT into messages {conversation_id, sender_id, content}
            Values {$1, $2, $3}
            Returning *
            `, [conversationId, senderId, content]

        );

        return result.rows[0];

    } catch (e) {
        console.error("Error saving message : ", e);
        throw new Error("Failed to save message");

    }
}