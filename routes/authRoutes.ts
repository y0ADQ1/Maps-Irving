import express from "express";
import { login, logout, register } from "../controllers/authControllers";
import { register_personal_data, register_delivery_men } from "../controllers/personController";
import { authenticate } from "../Middlewares/authenticate";
import { showMenu, addToCart, removeFromCart, getCart, clearCart } from '../controllers/menuController';
import { saveDeliveryAddress, getDeliveryAddresses } from '../controllers/mapsController';
import { confirmOrder } from '../controllers/orderController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/register_pd', authenticate, register_personal_data);
router.post('/register_dm', authenticate, register_delivery_men);

router.get('/ver_menu', showMenu);
router.post('/addToCart', authenticate, addToCart);
router.delete('/removeFromCart/:productId', authenticate, removeFromCart);
router.get('/getCart', authenticate, getCart);
router.delete('/clearCart', authenticate, clearCart);

router.post('/saveDeliveryAddress', authenticate, saveDeliveryAddress);
router.get('/getDeliveryAddresses', authenticate, getDeliveryAddresses);

router.post('/confirmOrder', authenticate, confirmOrder);

export default router;