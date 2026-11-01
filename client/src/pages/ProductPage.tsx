import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import Loading from "../components/Loading";
import api from "../../config/api";

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  HomeIcon,
  LeafIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  StarIcon,
} from "lucide-react";

import DummyReviewSection from "../components/DummyReviewSection";
import ProductCard from "../components/ProductCard";

const ProductPage = () => {
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { items, addToCart, updateQuantity, removeFromCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  // Fetch products from the backend and find the selected product.

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      if (!id) {
        setProduct(null);
        setRelatedProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setLocalQuantity(1);
      setProduct(null);
      setRelatedProducts([]);

      window.scrollTo(0, 0);

      try {
        // Fetch the selected product directly using its ID.
        const { data } = await api.get(`/products/${id}`);

        const foundProduct: Product | undefined = data?.product;

        if (!isMounted) return;

        if (!foundProduct) {
          setProduct(null);
          return;
        }

        setProduct(foundProduct);

        // Fetch products for the Related Products section.
        const { data: productsData } = await api.get("/products", {
          params: {
            limit: 50,
            page: 1,
          },
        });

        if (!isMounted) return;

        const allProducts: Product[] = Array.isArray(productsData?.products)
          ? productsData.products
          : [];

        setRelatedProducts(
          allProducts.filter(
            (item) =>
              item.category === foundProduct.category &&
              item.id !== foundProduct.id,
          ),
        );
      } catch (error) {
        console.error("Failed to fetch product details:", error);

        if (isMounted) {
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-2xl font-semibold text-app-green">
          Product Not Found
        </h2>

        <p className="mb-6 text-sm text-app-text-light">
          This product could not be found. It may have been removed or may no
          longer be available.
        </p>

        <Link to="/products" className="text-app-green hover:underline">
          Back to Products
        </Link>
      </div>
    );
  }

  // Use the product ID returned by the backend.
  const cartItem = items.find((item) => item.product.id === product.id);

  const inCart = Boolean(cartItem);

  const displayQuantity = cartItem ? cartItem.quantity : localQuantity;

  const categoryLabel = product.category.replace(/-/g, " ");

  // Decrease quantity.
  const handleMinus = () => {
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(product.id, cartItem.quantity - 1);
      } else {
        removeFromCart(product.id);
      }
    } else {
      setLocalQuantity((quantity) => Math.max(1, quantity - 1));
    }
  };

  // Increase quantity.
  const handlePlus = () => {
    if (displayQuantity >= product.stock) return;

    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      setLocalQuantity((quantity) => quantity + 1);
    }
  };

  // Add the selected product to the cart.
  const handleAddToCart = () => {
    if (product.stock <= 0 || inCart) return;

    addToCart(product, localQuantity);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-app-text-light">
          <Link
            to="/"
            className="transition-colors hover:text-app-green"
            aria-label="Home"
          >
            <HomeIcon className="size-4" />
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="transition-colors hover:text-app-green"
          >
            Products
          </Link>

          <span>/</span>

          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="truncate capitalize transition-colors hover:text-app-green"
          >
            {categoryLabel}
          </Link>

          <span>/</span>

          <span className="max-w-[200px] truncate font-medium text-app-green">
            {product.name}
          </span>
        </nav>

        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-app-text-light transition-colors hover:text-app-green"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </button>

        {/* Product Details */}
        <div className="overflow-hidden rounded-2xl bg-white/50">
          <div className="grid gap-0 md:grid-cols-2">
            {/* Product Image */}
            <div className="relative flex min-h-[320px] items-center justify-center p-8 md:min-h-[480px] md:p-12">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[360px] w-auto object-contain"
              />

              {/* Product Badges */}
              <div className="absolute left-5 top-5 flex flex-wrap gap-1.5">
                {product.isOrganic && (
                  <span className="flex items-center gap-1 rounded-full bg-app-green-light px-2.5 py-1 text-xs font-semibold text-white">
                    <LeafIcon className="size-3" />
                    Organic
                  </span>
                )}

                {product.discount > 0 && (
                  <span className="rounded-full bg-app-orange px-2.5 py-1 text-xs font-semibold text-white">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col justify-center p-6 md:p-10">
              <span className="mb-2 text-xs font-medium capitalize tracking-wider text-app-text-light">
                {categoryLabel}
              </span>

              <h1 className="mb-3 text-2xl font-semibold text-app-green md:text-3xl">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="mb-5 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`size-4 ${
                          star <= Math.round(product.rating)
                            ? "fill-app-warning text-app-warning"
                            : "text-app-border"
                        }`}
                      />
                    ))}
                  </div>

                  <span className="text-sm font-medium">{product.rating}</span>

                  <span className="text-sm text-app-text-light">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-3xl font-semibold text-app-green md:text-4xl">
                  {currency}
                  {product.price.toFixed(2)}
                </span>

                {product.originalPrice > product.price && (
                  <span className="text-lg text-app-text-light line-through">
                    {currency}
                    {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mb-6 text-sm leading-relaxed text-app-text-light">
                {product.description}
              </p>

              {/* Stock Information */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-sm font-medium text-app-success">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-sm font-medium text-app-error">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity and Add to Cart */}
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex overflow-hidden rounded-xl border border-app-border">
                  <button
                    type="button"
                    onClick={handleMinus}
                    disabled={!cartItem && localQuantity <= 1}
                    aria-label="Decrease quantity"
                    className="p-3 hover:bg-app-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MinusIcon className="size-4" />
                  </button>

                  <span className="min-w-[40px] px-5 text-center text-sm font-semibold">
                    {displayQuantity}
                  </span>

                  <button
                    type="button"
                    onClick={handlePlus}
                    disabled={
                      product.stock === 0 || displayQuantity >= product.stock
                    }
                    aria-label="Increase quantity"
                    className="p-3 hover:bg-app-cream disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <PlusIcon className="size-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || inCart}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                    inCart
                      ? "border border-app-border-dark bg-app-cream text-app-green"
                      : "bg-app-orange text-white hover:bg-app-orange-dark"
                  }`}
                >
                  <ShoppingCartIcon className="size-4" />
                  {inCart ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="my-8 border-t border-gray-200/70">
          {product.reviewCount > 0 && <DummyReviewSection />}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mb-44 mt-12">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-app-green">
                  Related Products
                </h2>

                <p className="mt-1 text-sm text-app-text-light">
                  More from {categoryLabel}
                </p>
              </div>

              <Link
                className="flex items-center gap-1 text-sm font-semibold text-app-orange transition-colors hover:text-app-orange-dark"
                to={`/products?category=${encodeURIComponent(product.category)}`}
              >
                View All
                <ArrowRightIcon className="size-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:gap-8">
              {relatedProducts.slice(0, 5).map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
