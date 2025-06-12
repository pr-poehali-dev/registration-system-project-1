import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import Icon from "@/components/ui/icon";

interface HeaderProps {
  currentPage: "products" | "cart";
  onPageChange: (page: "products" | "cart") => void;
}

export default function Header({ currentPage, onPageChange }: HeaderProps) {
  const { authState, logout } = useAuth();
  const { getCartCount } = useCart();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold">👓 OpticsStore</h1>

          <nav className="flex space-x-4">
            <Button
              variant={currentPage === "products" ? "default" : "ghost"}
              onClick={() => onPageChange("products")}
              className="flex items-center space-x-2"
            >
              <Icon name="glasses" size={16} />
              <span>Товары</span>
            </Button>

            <Button
              variant={currentPage === "cart" ? "default" : "ghost"}
              onClick={() => onPageChange("cart")}
              className="flex items-center space-x-2 relative"
            >
              <Icon name="shopping-cart" size={16} />
              <span>Корзина</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Button>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="font-medium">{authState.user?.fullName}</div>
            <div className="text-muted-foreground">
              {authState.user?.company}
            </div>
          </div>

          <Button variant="outline" onClick={logout}>
            <Icon name="log-out" size={16} className="mr-2" />
            Выйти
          </Button>
        </div>
      </div>
    </header>
  );
}
