import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ChevronDown, HomeIcon, SlidersHorizontal } from "lucide-react";

import type { Product } from "../types";
import { dummyProducts, categoriesData } from "../data/assets";

import ProductCard from "../components/ProductCard";
import FilterPanel from "../components/FilterPanel";
import Loading from "../components/Loading";

const PRODUCTS_PER_PAGE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // UI state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Product state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Read filters from URL search parameters
  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // Fetch and filter products whenever filters change
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Simulate an asynchronous request.
        // Replace this with your API call when the backend is ready.
        const response = await Promise.resolve(dummyProducts);

        if (cancelled) return;

        // Apply filters
        let filteredProducts = response.filter((product: Product) => {
          // Category filter
          if (category && product.category !== category) {
            return false;
          }

          // Organic filter
          if (organic && String(product.isOrganic) !== organic) {
            return false;
          }

          // Minimum price filter
          if (minPrice !== "" && product.price < Number(minPrice)) {
            return false;
          }

          // Maximum price filter
          if (maxPrice !== "" && product.price > Number(maxPrice)) {
            return false;
          }

          // Show only products in stock
          if (product.stock <= 0) {
            return false;
          }

          return true;
        });

        // Sort products
        filteredProducts = [...filteredProducts].sort((a, b) => {
          switch (sort) {
            case "price_asc":
              return a.price - b.price;

            case "price_desc":
              return b.price - a.price;

            case "rating":
              return b.rating - a.rating;

            case "name":
              return a.name.localeCompare(b.name);

            default:
              // Keep the original order for Newest.
              // Replace this with createdAt sorting if needed.
              return 0;
          }
        });

        // Calculate total products before pagination
        setTotalProducts(filteredProducts.length);

        // Apply pagination
        const startIndex = (page - 1) * PRODUCTS_PER_PAGE;

        const paginatedProducts = filteredProducts.slice(
          startIndex,
          startIndex + PRODUCTS_PER_PAGE,
        );

        setProducts(paginatedProducts);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch products.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    // Prevent stale updates if filters change during fetching
    return () => {
      cancelled = true;
    };
  }, [category, organic, sort, page, minPrice, maxPrice]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(totalProducts / PRODUCTS_PER_PAGE));

  // Get the currently selected category
  const activeCategory = categoriesData.find((item) => item.slug === category);

  // Check whether any filters are active
  const hasActiveFilters = Boolean(category || organic || minPrice || maxPrice);

  // Update URL filters
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    // Reset pagination when a filter changes
    if (key !== "page") {
      newParams.delete("page");
    }

    setSearchParams(newParams);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
    setMobileFilterOpen(false);
  };

  // Update the current page
  const changePage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      updateFilter("page", String(newPage));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-app-cream">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-app-text-light"
        >
          <Link
            to="/"
            className="transition-colors hover:text-app-green"
            aria-label="Go to homepage"
          >
            <HomeIcon className="size-4" />
          </Link>

          <span aria-hidden="true">/</span>

          <span className="font-medium text-app-text">
            {activeCategory?.name || "All Products"}
          </span>
        </nav>

        <div className="flex gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-lg font-semibold text-app-text">Filters</p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-sm text-app-green hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Reusable Category and Price Filters */}
              <div className="border-t border-gray-100 pt-4">
                <FilterPanel
                  categories={categoriesData}
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                  hasFilters={hasActiveFilters}
                />
              </div>

              {/* Organic Filter */}
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="mb-3 text-sm font-medium text-app-text">
                  Product Type
                </p>

                <label className="flex cursor-pointer items-center gap-2 text-sm text-app-text-light">
                  <input
                    type="checkbox"
                    checked={organic === "true"}
                    onChange={(event) =>
                      updateFilter(
                        "organic",
                        event.target.checked ? "true" : "",
                      )
                    }
                    className="size-4 accent-app-green"
                  />
                  Organic products
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-1">
                <h1 className="text-2xl font-semibold text-app-green sm:text-3xl">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>

                <p className="text-sm text-app-text-light">
                  {totalProducts} Products Found
                </p>
              </div>

              {/* Sort Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={sort}
                  onChange={(event) => updateFilter("sort", event.target.value)}
                  aria-label="Sort products"
                  className="w-full cursor-pointer appearance-none rounded-xl border border-app-border bg-white py-2.5 pl-4 pr-10 text-sm text-app-text outline-none transition-colors focus:border-app-green sm:w-48"
                >
                  <option value="">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Name: A to Z</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-app-text-light" />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              aria-expanded={mobileFilterOpen}
              className="mb-5 flex items-center gap-2 rounded-xl border border-app-border bg-white px-3 py-2 text-sm transition-colors hover:bg-app-cream lg:hidden"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>

            {/* Mobile Filters */}
            {mobileFilterOpen && (
              <div className="mb-6 rounded-2xl border border-app-border bg-white p-4 lg:hidden">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-app-text">
                    Filter Products
                  </h2>

                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-sm text-app-text-light hover:text-app-green"
                  >
                    Close
                  </button>
                </div>

                {/* Reusable Category and Price Filters */}
                <FilterPanel
                  categories={categoriesData}
                  category={category}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  updateFilter={updateFilter}
                  clearFilters={clearFilters}
                  hasFilters={hasActiveFilters}
                />

                {/* Organic Filter */}
                <div className="mt-5 border-t border-app-border pt-4">
                  <label className="flex items-center gap-2 text-sm text-app-text-light">
                    <input
                      type="checkbox"
                      checked={organic === "true"}
                      onChange={(event) =>
                        updateFilter(
                          "organic",
                          event.target.checked ? "true" : "",
                        )
                      }
                      className="size-4 accent-app-green"
                    />
                    Organic products
                  </label>
                </div>
              </div>
            )}

            {/* Loading, Error, Empty and Product States */}
            {loading ? (
              <Loading />
            ) : error ? (
              /* Error State */
              <div className="py-16 text-center">
                <p className="mb-2 text-lg font-semibold text-red-600">
                  Unable to Load Products
                </p>

                <p className="mb-4 text-sm text-app-text-light">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-xl bg-app-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="py-16 text-center">
                <p className="mb-2 text-lg font-semibold text-app-green">
                  No Products Found
                </p>

                <p className="mb-4 text-sm text-app-text-light">
                  Try adjusting your filters or search terms.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl bg-app-green px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-app-green-light"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:mt-16">
                    <button
                      type="button"
                      onClick={() => changePage(page - 1)}
                      disabled={page <= 1}
                      className="h-9 rounded-lg border border-app-border bg-white px-3 text-sm text-app-text transition-colors hover:bg-app-cream disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => changePage(pageNumber)}
                        aria-current={page === pageNumber ? "page" : undefined}
                        className={`size-9 shrink-0 rounded-lg text-sm font-medium transition-colors ${
                          page === pageNumber
                            ? "bg-app-green text-white"
                            : "bg-white text-app-text-light hover:bg-app-cream"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => changePage(page + 1)}
                      disabled={page >= totalPages}
                      className="h-9 rounded-lg border border-app-border bg-white px-3 text-sm text-app-text transition-colors hover:bg-app-cream disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
