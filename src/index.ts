import express, { Request, Response } from "express";
import {json} from "body-parser";
import authRoute from "./routes/authRoutes";

const app = express();
app.use(json());

app.use("/auth", authRoute);

app.get("/", (req: Request, res: Response)=> {
    console.log("Test");
    res.send("Yes it Works");
})

const PORT = process.env.PORT || 6000;

app.listen(PORT, ()=> {
    console.log(`Server is running in port ${PORT}`)
})