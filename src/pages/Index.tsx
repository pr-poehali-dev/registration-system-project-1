import { useState } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm";
import PhoneVerification from "@/components/PhoneVerification";
import ProductCatalog from "@/components/ProductCatalog";
import ShoppingCart from "@/components/ShoppingCart";
import { useCart } from "@/hooks/useCart";

type AuthView = "login" | "register" | "verify";
type AppView = "products" | "cart";

const Index = () => {
  const { authState } = useAuthContext();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [appView, setAppView] = useState<AppView>("products");
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    exportToExcel,
  } = useCart(authState.user?.id);

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-4">
          {authView === "login" && (
            <LoginForm onRegisterClick={() => setAuthView("register")} />
          )}

          {authView === "register" && (
            <RegistrationForm onSuccess={() => setAuthView("verify")} />
          )}

          {authView === "verify" && (
            <PhoneVerification
              onSuccess={() => setAuthView("login")}
              onBack={() => setAuthView("register")}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setAppView("products")}
            className={`px-6 py-2 rounded-md transition-colors ${
              appView === "products"
                ? "bg-accent text-white"
                : "text-gray-600 hover:text-accent"
            }`}
          >
            Каталог товаров
          </button>
          <button
            onClick={() => setAppView("cart")}
            className={`px-6 py-2 rounded-md transition-colors ${
              appView === "cart"
                ? "bg-accent text-white"
                : "text-gray-600 hover:text-accent"
            }`}
          >
            Корзина ({cartItems.length})
          </button>
        </div>
      </div>

      {appView === "products" && <ProductCatalog onAddToCart={addToCart} />}

      {appView === "cart" && (
        <ShoppingCart
          cartItems={cartItems}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onClear={clearCart}
          onExport={exportToExcel}
        />
      )}
    </div>
  );
};

export default Index;
