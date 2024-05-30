import express from "express";
import serial from "./serial";

const router = express.Router();


router.use("/serial", serial);


export default router;