import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AuthProvider, { useAuthContext } from "@/components/AuthProvider";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import ProductCatalog from "@/components/ProductCatalog";
import ShoppingCart from "@/components/ShoppingCart";
import { Toaster } from "sonner";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authState } = useAuthContext();

  if (authState.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Загрузка...
      </div>
    );
  }

  return authState.isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" replace />
  );
};

const AppContent = () => {
  const { authState } = useAuthContext();
  const [currentPage, setCurrentPage] = useState<"products" | "cart">(
    "products",
  );
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    exportToExcel,
  } = useCart(authState.user?.id);

  const handlePageChange = (page: "products" | "cart") => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {authState.isAuthenticated && (
        <Header currentPage={currentPage} onPageChange={handlePageChange} />
      )}
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/catalog"
            element={
              <ProtectedRoute>
                <ProductCatalog onAddToCart={addToCart} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <ShoppingCart
                  cartItems={cartItems}
                  onRemove={removeFromCart}
                  onUpdateQuantity={updateQuantity}
                  onClear={clearCart}
                  onExport={exportToExcel}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;
