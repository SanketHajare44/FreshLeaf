import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../config/prisma.js";
import { inngest } from "../inngest/index.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is missing");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const stripeWebhook = async (request: Request, response: Response) => {
  const signature = request.headers["stripe-signature"];

  let event: Stripe.Event;

  // Verify Stripe webhook signature
  try {
    if (!signature) {
      return response.status(400).send("Missing Stripe signature");
    }

    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      endpointSecret,
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);

    return response.status(400).send("Webhook signature verification failed");
  }

  try {
    switch (event.type) {
      // Payment successful
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const orderId = session.metadata?.orderId;

        if (!orderId || session.payment_status !== "paid") {
          break;
        }

        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (!order) {
          console.error("Order not found:", orderId);
          break;
        }

        // Prevent duplicate processing
        if (order.isPaid) {
          break;
        }

        const orderItems = order.items as any[];

        // Update order and stock inside a transaction
        await prisma.$transaction(async (tx) => {
          for (const item of orderItems) {
            const updatedProduct = await tx.product.updateMany({
              where: {
                id: item.product,
                stock: { gte: item.quantity },
              },
              data: {
                stock: {
                  decrement: item.quantity,
                },
              },
            });

            if (updatedProduct.count !== 1) {
              throw new Error(`Insufficient stock for product ${item.product}`);
            }
          }

          await tx.order.update({
            where: { id: orderId },
            data: {
              isPaid: true,
              status: "placed",
              statusHistory: [
                {
                  status: "placed",
                  note: "Payment completed successfully",
                  timestamp: new Date(),
                },
              ],
            },
          });
        });

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
          data: { orderId },
        });

        console.log("Order payment successful:", orderId);

        break;
      }

      // Checkout expired
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("Checkout session expired:", session.id);

        // Keep the order record.
        // You can update its payment status or mark it cancelled.

        break;
      }

      // Payment failed
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        console.log("Payment failed:", paymentIntent.id);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return response.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    return response.status(500).json({
      message: "Webhook processing failed",
    });
  }
};
