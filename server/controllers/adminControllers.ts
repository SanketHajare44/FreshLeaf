import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";

//get admin dashboard data
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [totalOrders, totalUsers, totalProducts, outOfStock, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.user.count(),
        prisma.product.count(),
        prisma.product.count({
          where: { stock: 0 },
        }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
      ]);

    return res.status(200).json({
      totalOrders,
      totalUsers,
      totalProducts,
      outOfStock,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);

    return res.status(500).json({
      message: "Failed to fetch admin statistics",
    });
  }
};

// Get delivery partners list for admin
export const getDeliveryPartners = async (req: Request, res: Response) => {
  const partners = await prisma.deliveryPartner.findMany({
    orderBy: { createdAt: "desc" },
  });

  res.json({ partners });
};

// Create delivery partner profile
export const createDeliveryPartner = async (req: Request, res: Response) => {
  const { name, email, password, phone, vehicleType } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400).json({ message: "Please provide all required fields" });

    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const partner = await prisma.deliveryPartner.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      vehicleType,
    },
  });

  res.status(201).json({ partner });
};

// Update Delivery pasrtner profile
export const updateDeliveryPartner = async (req: Request, res: Response) => {
  const { name, phone, vehicleType, isActive } = req.body;

  const data: any = {};

  if (name) data.name = name;
  if (phone) data.phone = phone;
  if (vehicleType) data.vehicleType = vehicleType;
  data.isActive = isActive;

  try {
    const partner = await prisma.deliveryPartner.update({
      where: { id: req.params.id as string },
      data,
    });

    res.json({ partner });
  } catch (error) {
    res.status(401).json({ message: "Partner not found" });
  }
};

// Asssign delivery partner for order

export const assignDeliveryPartner = async (req: Request, res: Response) => {
  try {
    const { deliveryPartnerId } = req.body;
    const orderId = req.params.id as string;

    if (!deliveryPartnerId) {
      return res.status(400).json({
        message: "Please provide a delivery partner ID",
      });
    }

    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Find the delivery partner
    const partner = await prisma.deliveryPartner.findUnique({
      where: { id: deliveryPartnerId },
    });

    if (!partner) {
      return res.status(404).json({
        message: "Delivery partner not found",
      });
    }

    if (!partner.isActive) {
      return res.status(400).json({
        message: "Cannot assign an inactive delivery partner",
      });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    let status = order.status;

    const history: any[] = Array.isArray(order.statusHistory)
      ? [...(order.statusHistory as any[])]
      : [];

    if (order.status === "Placed" || order.status === "Confirmed") {
      status = "Assigned";

      history.push({
        status: "Assigned",
        note: `Assigned to ${partner.name}`,
        timeStamp: new Date().toISOString(),
      });
    }

    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        deliveryPartnerId: partner.id,
        deliveryOtp: OTP,
        status,
        statusHistory: history,
      },
    });

    return res.status(200).json({
      message: "Delivery partner assigned successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error assigning delivery partner:", error);

    return res.status(500).json({
      message: "Failed to assign delivery partner",
      error: error instanceof Error ? error.message : "Unknown server error",
    });
  }
};
