import type { Category } from "../types";

interface FilterPanelProps {
  categories: Category[];
  category: string;
  minPrice: string;
  maxPrice: string;
  updateFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  hasFilters: boolean;
}

const FilterPanel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilters,
  hasFilters,
}: FilterPanelProps) => {
  const categoriesWithAll: Category[] = [
    { slug: "", name: "All Categories", image: "" },
    ...categories,
  ];

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-app-green">
          Categories
        </h3>

        <div className="space-y-1.5">
          {categoriesWithAll.map((cat) => (
            <button
              key={cat.slug || "all"}
              type="button"
              onClick={() => updateFilter("category", cat.slug)}
              className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-all ${
                category === cat.slug
                  ? "bg-app-green text-white"
                  : "text-app-text-light hover:bg-app-cream"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-app-green">
          Price Range
        </h3>

        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            aria-label="Minimum price"
            value={minPrice}
            onChange={(event) => updateFilter("minPrice", event.target.value)}
            className="w-full min-w-0 rounded-lg border border-app-border px-3 py-2 text-sm outline-none focus:border-app-green"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            aria-label="Maximum price"
            value={maxPrice}
            onChange={(event) => updateFilter("maxPrice", event.target.value)}
            className="w-full min-w-0 rounded-lg border border-app-border px-3 py-2 text-sm outline-none focus:border-app-green"
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="w-full rounded-lg border border-app-border px-4 py-2 text-sm font-medium text-app-green transition-colors hover:bg-app-cream"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;
