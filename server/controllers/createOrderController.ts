import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";
import Stripe from "stripe";

// Create Order
// POST /api/orders

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const productId = items.map((item: any) => item.product);

    const products = await prisma.product.findMany({
      where: { id: { in: productId } },
    });

    const productMap: Record<string, (typeof products)[0]> = {};

    products.forEach((product) => {
      productMap[product.id] = product;
    });

    for (const item of items) {
      const product = productMap[item.product];

      if (!product || (product.stock ?? 0) < item.quantity) {
        return res.status(400).json({
          message: "Product not found or insufficient stock",
        });
      }
    }

    const orderItems = items.map((item: any) => {
      const product = productMap[item.product];

      return {
        product: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: item.quantity,
        unit: product.unit,
      };
    });

    const subtotal = orderItems.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    );

    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    const order = await prisma.order.create({
      data: {
        userId: req.user!.id,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        subtotal,
        deliveryFee,
        tax,
        total,
        statusHistory: [
          {
            status: "placed",
            note: "Order placed successfully",
            timestamp: new Date(),
          },
        ],
      },
    });

    if (paymentMethod === "card") {
      if (!process.env.STRIPE_SECRET_KEY) {
        return res.status(500).json({
          message: "STRIPE_SECRET_KEY is missing",
        });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

      const frontendUrl = process.env.CLIENT_URL?.replace(/\/$/, "");

      if (!frontendUrl) {
        return res.status(500).json({
          message: "CLIENT_URL is missing from environment variables",
        });
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",

        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "FreshLeaf Grocery Order",
                description: `Order ID: ${order.id}`,
              },
              unit_amount: Math.round(total * 100),
            },
            quantity: 1,
          },
        ],

        success_url: `${frontendUrl}/orders?session_id={CHECKOUT_SESSION_ID}&clearCart=true`,

        cancel_url: `${frontendUrl}/checkout`,

        metadata: {
          orderId: order.id,
        },
      });

      return res.status(200).json({
        url: session.url,
      });
    }

    // Decrease stock
    for (const item of orderItems) {
      await prisma.product.update({
        where: { id: item.product },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Send stock update events
    for (const item of orderItems) {
      await inngest.send({
        name: "inventory/stock.updated",
        data: { productId: item.product },
      });
    }

    // Send order placed event
    await inngest.send({
      name: "order/placed",
      data: { orderId: order.id },
    });

    // Return response after the awaited operations
    return res.status(201).json({ order });
  } catch (err) {
    console.error("Create order error:", err);

    if (res.headersSent) {
      return;
    }

    return res.status(500).json({
      message: "Failed to create order",
    });
  }
};

// Get user'users orders
//GET /api/orders

export const getUserOrders = async (req: Request, res: Response) => {
  const { status } = req.query;

  const where: any = {
    userId: req.user?.id,
    NOT: [{ paymentMethod: "card", isPaid: false }],
  };

  if (status && status != "all") {
    where.status = status;
  }

  const orders = await prisma.order.findMany({
    where,
    include: { deliveryPartner: { select: { name: true, phone: true } } },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

// Get Single order
// GET /api/orders/:id

export const getOrder = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user?.id },
    include: {
      deliveryPartner: { select: { name: true, phone: true, avatar: true } },
    },
  });

  if (!order) {
    return res.status(401).json({ message: "Order not found" });
  }

  res.json({ order });
};

// Update order status (admin)
// PUT /api/orders/:id/status

export const updaateOrderStatus = async (req: Request, res: Response) => {
  const { status, note } = req.body;

  const order = await prisma.order.findUnique({
    where: { id: req.params.id as string },
  });

  if (!order) {
    return res.status(401).json({ message: "Order not found" });
  }

  const history = (
    Array.isArray(order.statusHistory) ? order.statusHistory : []
  ) as any[];

  history.push({
    status,
    note: note || `Order ${status.toLowerCase()}`,
    timestamp: new Date(),
  });

  const updatedOrder = await prisma.order.update({
    where: { id: req.params.id as string },
    data: { status, statusHistory: history },
  });

  res.json({ order: updatedOrder });
};

// Get all orders
// GET /api/orders/all

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await prisma.order.findMany({
    where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
    include: {
      user: { select: { name: true, email: true } },

      deliveryPartner: { select: { name: true, phone: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
};

// Get Order location
// GET /api/orders/:id/location

export const getOrderLocation = async (req: Request, res: Response) => {
  const order = await prisma.order.findFirst({
    where: { id: req.params.id as string, userId: req.user?.id },
    select: { liveLocation: true, status: true },
  });

  if (!order) {
    return res.status(401).json({ message: "Order not found" });
  }

  res.json({ liveLocation: order.liveLocation, status: order.status });
};
