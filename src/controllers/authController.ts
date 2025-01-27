import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../models/db';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "worisecretKey";

export const register = async (req: Request, res: Response) => {
    
    const { username, email, password } = req.body;

    try {
        const hashedPassword =await bcrypt.hash(password, SALT_ROUNDS);
        const result = await pool.query(
            "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        const user = result.rows[0];

        res.status(201).json({
            message: "User registered sucessfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to register User",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
   
    // Login logic here
  
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '10h' });

        res.status(200).json({
            message: "User logged in successfully",
            token,
        });
    } catch (error) {
        res.status(500).json({
            error: "Failed to login User",
        });
    }
};