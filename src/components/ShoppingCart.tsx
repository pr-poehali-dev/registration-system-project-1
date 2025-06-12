import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { exportToExcel } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

export default function ShoppingCart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { authState } = useAuth();
  const { toast } = useToast();

  const handleExportToExcel = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте товары для экспорта",
        variant: "destructive",
      });
      return;
    }

    exportToExcel(cartItems, authState.user!);
    toast({
      title: "Заказ экспортирован!",
      description: "Excel файл сохранен на ваш компьютер",
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-12">
          <Icon
            name="shopping-cart"
            size={64}
            className="mx-auto text-muted-foreground mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
          <p className="text-muted-foreground">Добавьте товары из каталога</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Корзина</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={clearCart}>
            <Icon name="trash-2" size={16} className="mr-2" />
            Очистить корзину
          </Button>
          <Button
            onClick={handleExportToExcel}
            className="bg-accent hover:bg-accent/90"
          >
            <Icon name="download" size={16} className="mr-2" />
            Экспорт в Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Товары к заказу</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Бренд</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Пол</TableHead>
                <TableHead>Цена</TableHead>
                <TableHead>Количество</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.brand}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.gender}</TableCell>
                  <TableCell>{item.price.toLocaleString()}₽</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.id,
                            Math.max(1, parseInt(e.target.value) || 1),
                          )
                        }
                        className="w-16 text-center"
                        min="1"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {(item.price * item.quantity).toLocaleString()}₽
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Icon name="trash-2" size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <div className="text-right">
              <div className="text-lg">
                Всего товаров:{" "}
                <strong>
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </strong>
              </div>
              <div className="text-2xl font-bold text-accent">
                Итого: {getCartTotal().toLocaleString()}₽
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
