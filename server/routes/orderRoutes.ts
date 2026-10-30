import express from "express";
import auth from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrder,
  getOrderLocation,
  getUserOrders,
  updaateOrderStatus,
} from "../controllers/createOrderController.js";
import admin from "../middleware/admin.js";

const orderRouter = express.Router();

orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/all", auth, admin, getAllOrders);
orderRouter.get("/:id", auth, getOrder);
orderRouter.put("/:id/status", auth, admin, updaateOrderStatus);
orderRouter.get("/:id/location", auth, getOrderLocation);

export default orderRouter;
