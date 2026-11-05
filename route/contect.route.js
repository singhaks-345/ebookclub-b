import express from "express";
import {contectControler} from '../controller/contect.controller.js';
const router=express.Router();
router.post("/contect", contectControler );


export default router;
