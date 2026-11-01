import { Request, Response } from "express";
import { prisma } from "../config/prisma.js";

// GET /api/products/flash-deals
export const getFlashDeals = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    orderBy: { originalPrice: "desc" },
  });

  const productWithDiscount = products.map((p) => {
    const discount =
      p.originalPrice && p.price
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0;

    return { ...p, discount };
  });

  res.json({ products: productWithDiscount.slice(0, 8) });
};

// GET /api/products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (category && category !== "all") {
      where.category = category as string;
    }

    if (search) {
      where.name = {
        contains: search as string,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};

      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    const orderBy: any = {};

    if (sort === "price-low") {
      orderBy.price = "asc";
    } else if (sort === "price-high") {
      orderBy.price = "desc";
    } else {
      orderBy.createdAt = "desc";
    }

    // Fetch only the requested page of products
    const [products, totalProducts] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const productWithDiscount = products.map((p) => {
      const discount =
        p.originalPrice && p.price
          ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
          : 0;

      return { ...p, discount };
    });

    res.status(200).json({
      products: productWithDiscount,
      pagination: {
        currentPage: page,
        limit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        hasNextPage: page < Math.ceil(totalProducts / limit),
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET /api/products/:id
export const getProduct = async (req: Request, res: Response) => {
  const paramId = req.params.id;
  const id = Array.isArray(paramId) ? paramId[0] : paramId;

  if (!id) {
    res.status(400).json({ message: "Invalid product ID" });
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    res.status(404).json({ message: "Product not found" });
    return;
  }

  const discount =
    product.originalPrice && product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  res.json({ product: { ...product, discount } });
};

// POST /api/products
export const createProduct = async (req: Request, res: Response) => {
  const product = prisma.product.create({ data: req.body });

  res.status(201).json({ product });
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response) => {
  const product = prisma.product.update({
    where: { id: req.params.id as string },
    data: req.body,
  });

  res.json({ product });
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response) => {
  const product = prisma.product.delete({
    where: { id: req.params.id as string },
  });

  res.json({ message: "Deleted" });
};
