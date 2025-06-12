import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { useCart } from "@/hooks/useCart";
import Icon from "@/components/ui/icon";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cartItems } = useCart();

  const cartItem = cartItems.find((item) => item.id === product.id);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 hover-scale">
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary">{product.type}</Badge>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-lg mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>

          <div className="flex justify-between items-center mb-3">
            <Badge variant="outline">{product.gender}</Badge>
            <span className="text-lg font-bold">
              {product.price.toLocaleString()}₽
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-accent hover:bg-accent/90"
          disabled={!!cartItem}
        >
          <Icon name="shopping-cart" size={16} className="mr-2" />
          {cartItem ? `В корзине (${cartItem.quantity})` : "Добавить в корзину"}
        </Button>
      </CardFooter>
    </Card>
  );
}
