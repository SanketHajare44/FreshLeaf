import { useEffect, useState } from "react";
import type { Product } from "../../types";
import { dummyProducts } from "../../data/assets";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(dummyProducts.slice(0, 10));
  }, []);

  return (
    <section className="pb-12 sm:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
          <div>
            <h2 className="text-xl font-semibold text-app-text sm:text-2xl">
              Popular Products
            </h2>

            <p className="mt-1 text-xs text-app-text-light sm:text-sm">
              Top rated products this season
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-app-orange transition-colors hover:text-app-orange-dark sm:text-sm"
          >
            View All
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
