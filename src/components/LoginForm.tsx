import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { validatePhone, formatPhone } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  phone: z.string().refine(validatePhone, "Неверный формат телефона"),
  password: z.string().min(1, "Пароль обязателен"),
});

interface LoginFormProps {
  onRegisterClick: () => void;
}

export default function LoginForm({ onRegisterClick }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const formattedPhone = formatPhone(data.phone);
      const success = await login(formattedPhone, data.password);

      if (success) {
        toast({
          title: "Добро пожаловать!",
          description: "Вы успешно вошли в систему",
        });
      } else {
        toast({
          title: "Ошибка входа",
          description: "Неверный телефон, пароль или аккаунт не подтвержден",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Вход в систему</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              {...register("phone")}
              placeholder="+7 (999) 123-45-67"
            />
            {errors.phone && (
              <p className="text-sm text-destructive mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Введите пароль"
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>

          <div className="text-center">
            <Button variant="link" onClick={onRegisterClick}>
              Нет аккаунта? Зарегистрироваться
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
