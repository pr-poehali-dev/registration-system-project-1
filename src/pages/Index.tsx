import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import LoginForm from "@/components/LoginForm";
import RegistrationForm from "@/components/RegistrationForm";
import PhoneVerification from "@/components/PhoneVerification";
import Header from "@/components/Header";
import ProductCatalog from "@/components/ProductCatalog";
import ShoppingCart from "@/components/ShoppingCart";

type AuthView = "login" | "register" | "verify";
type AppView = "products" | "cart";

const Index = () => {
  const { authState } = useAuth();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [appView, setAppView] = useState<AppView>("products");

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
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={appView} onPageChange={setAppView} />

      <main>
        {appView === "products" && <ProductCatalog />}
        {appView === "cart" && <ShoppingCart />}
      </main>
    </div>
  );
};

export default Index;
