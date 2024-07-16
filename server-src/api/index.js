import express from "express";
import serial from "./serial";
import engine from "./engine";

const router = express.Router();

router.use(express.json());

router.use("/serial", serial);
router.use("/engine", engine);


export default router;