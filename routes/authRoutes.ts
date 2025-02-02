import express from "express";
import { login, logout, register } from "../controllers/authControllers";
import { register_personal_data, register_delivery_men } from "../controllers/personController";
import { authenticate } from "../Middlewares/authenticate"; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/register_pd', authenticate, register_personal_data); 
router.post('/register_dm', authenticate, register_delivery_men); 

export default router;