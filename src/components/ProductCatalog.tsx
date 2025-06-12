import { useState, useMemo } from "react";
import { products } from "@/data/products";
import { Filters } from "@/types/product";
import ProductFilters from "./ProductFilters";
import ProductCard from "./ProductCard";
import { useCart } from "@/hooks/useCart";

export default function ProductCatalog() {
  const { getCartCount, cartItems } = useCart();
  const [filters, setFilters] = useState<Filters>({
    type: "Все",
    gender: "Все",
    brand: "Все",
    minPrice: 0,
    maxPrice: 25000,
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.type !== "Все" && product.type !== filters.type) return false;
      if (filters.gender !== "Все" && product.gender !== filters.gender)
        return false;
      if (filters.brand !== "Все" && product.brand !== filters.brand)
        return false;
      if (product.price < filters.minPrice || product.price > filters.maxPrice)
        return false;
      return true;
    });
  }, [filters]);

  const cartSummary = useMemo(() => {
    const summary = cartItems.reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = 0;
        }
        acc[item.name] += item.quantity;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(summary)
      .map(([name, quantity]) => `${name} (${quantity})`)
      .join(", ");
  }, [cartItems]);

  return (
    <div className="container mx-auto px-4 py-6">
      {getCartCount() > 0 && (
        <div className="mb-6 p-4 bg-accent/5 border border-accent/20 rounded-lg">
          <h3 className="font-medium text-accent mb-2">
            В корзине: {getCartCount()} товаров
          </h3>
          <p className="text-sm text-muted-foreground">{cartSummary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ProductFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Каталог очков</h2>
            <span className="text-muted-foreground">
              Найдено: {filteredProducts.length} товаров
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                Товары не найдены. Попробуйте изменить фильтры.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
