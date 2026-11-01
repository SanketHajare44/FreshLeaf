import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/addresses
export const getAddresses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      message: "Failed to fetch addresses",
    });
  }
};

// POST /api/addresses
export const addAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;

    if (!label || !address || !city || !state || !zip) {
      return res.status(400).json({
        message: "Please provide all required address fields.",
      });
    }

    if (
      lat == null ||
      lng == null ||
      !Number.isFinite(Number(lat)) ||
      !Number.isFinite(Number(lng))
    ) {
      return res.status(400).json({
        message: "Valid location coordinates are required.",
      });
    }

    const currentAddresses = await prisma.address.findMany({
      where: { userId },
    });

    const makeDefault = currentAddresses.length === 0 || Boolean(isDefault);

    if (makeDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId,
        label,
        address,
        city,
        state,
        zip,
        isDefault: makeDefault,
        lat: Number(lat),
        lng: Number(lng),
      },
    });

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(201).json({ addresses });
  } catch (error) {
    console.error("Add address error:", error);

    return res.status(500).json({
      message: "Failed to add address",
    });
  }
};

// PUT /api/addresses/:id
export const updateAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const { label, address, city, state, zip, isDefault, lat, lng } = req.body;

    const addressId = req.params.id;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const data: {
      label?: string;
      address?: string;
      city?: string;
      state?: string;
      zip?: string;
      isDefault?: boolean;
      lat?: number;
      lng?: number;
    } = {};

    if (label !== undefined) data.label = label;
    if (address !== undefined) data.address = address;
    if (city !== undefined) data.city = city;
    if (state !== undefined) data.state = state;
    if (zip !== undefined) data.zip = zip;
    if (isDefault !== undefined) data.isDefault = isDefault;

    if (lat !== undefined || lng !== undefined) {
      const newLat = lat ?? existingAddress.lat;
      const newLng = lng ?? existingAddress.lng;

      if (
        !Number.isFinite(Number(newLat)) ||
        !Number.isFinite(Number(newLng))
      ) {
        return res.status(400).json({
          message: "Valid location coordinates are required.",
        });
      }

      if (lat !== undefined) data.lat = Number(lat);
      if (lng !== undefined) data.lng = Number(lng);
    }

    if (isDefault === true) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id: addressId },
      data,
    });

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error("Update address error:", error);

    return res.status(500).json({
      message: "Failed to update address",
    });
  }
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized. Please log in.",
      });
    }

    const addressId = req.params.id;

    if (typeof addressId !== "string") {
      return res.status(400).json({
        message: "Invalid address ID",
      });
    }

    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({ addresses });
  } catch (error) {
    console.error("Delete address error:", error);

    return res.status(500).json({
      message: "Failed to delete address",
    });
  }
};
