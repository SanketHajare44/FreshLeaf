import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";

interface Props {
  product: Product;
}

const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();

  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  const { addToCart } = useCart();

  return (
    <article
      onClick={handleProductClick}
      className="group flex h-full min-w-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-white">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-105 sm:p-4"
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-app-orange px-2 py-0.5 text-[9px] font-bold leading-tight text-white sm:left-2.5 sm:top-2.5 sm:text-[10px]">
            {product.discount}% OFF
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-1 sm:px-3 sm:pb-3">
        {/* Product Name */}
        <h3 className="line-clamp-1 text-[11px] font-medium leading-5 text-gray-700 transition-colors group-hover:text-app-orange sm:text-xs">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-0.5 flex min-h-[17px] items-center gap-1">
          {product.rating > 0 && (
            <>
              <Star className="size-3 shrink-0 fill-app-warning text-app-warning" />

              <span className="text-[10px] font-semibold text-gray-800 sm:text-[11px]">
                {product.rating}
              </span>

              <span className="text-[9px] text-gray-400 sm:text-[10px]">
                ({product.reviewCount})
              </span>
            </>
          )}
        </div>

        {/* Price and Add Button */}
        <div className="mt-1.5 flex items-center justify-between gap-1">
          {/* Product Price */}
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
            <span className="text-xs font-bold leading-tight text-gray-800 sm:text-sm">
              {currency}
              {discountedPrice.toFixed(2)}
            </span>

            <span className="text-[11px] leading-tight text-gray-400  sm:text-[10px]">
              /{product.unit}
            </span>

            {product.discount > 0 && (
              <span className="text-[9px] leading-tight text-gray-400 line-through sm:text-[10px]">
                {currency}
                {product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Single Plus Button */}
          <button
            type="button"
            aria-label={`View ${product.name}`}
            onClick={(event) => {
              event.stopPropagation();
              addToCart(product);
            }}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-app-orange text-white transition-all duration-200 hover:bg-app-orange-dark hover:shadow-sm active:scale-90 sm:size-8"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
