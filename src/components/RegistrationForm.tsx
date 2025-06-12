import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { validatePhone, validateINN, formatPhone } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const registrationSchema = z
  .object({
    fullName: z.string().min(2, "ФИО должно содержать минимум 2 символа"),
    company: z.string().min(2, "Название компании обязательно"),
    position: z.string().min(2, "Должность обязательна"),
    inn: z
      .string()
      .optional()
      .refine((val) => !val || validateINN(val), "Неверный формат ИНН"),
    phone: z.string().refine(validatePhone, "Неверный формат телефона"),
    email: z
      .string()
      .email("Неверный формат email")
      .optional()
      .or(z.literal("")),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

interface RegistrationFormProps {
  onSuccess: () => void;
}

export default function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const formattedData = {
        ...data,
        phone: formatPhone(data.phone),
      };

      const success = await registerUser(formattedData);
      if (success) {
        toast({
          title: "Регистрация успешна!",
          description: "На ваш телефон отправлен код подтверждения",
        });
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Ошибка регистрации",
        description: "Попробуйте еще раз",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Регистрация</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="fullName">ФИО *</Label>
            <Input
              id="fullName"
              {...register("fullName")}
              placeholder="Иванов Иван Иванович"
            />
            {errors.fullName && (
              <p className="text-sm text-destructive mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="company">Название компании *</Label>
            <Input
              id="company"
              {...register("company")}
              placeholder="ООО Рога и Копыта"
            />
            {errors.company && (
              <p className="text-sm text-destructive mt-1">
                {errors.company.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="position">Должность *</Label>
            <Input
              id="position"
              {...register("position")}
              placeholder="Менеджер по закупкам"
            />
            {errors.position && (
              <p className="text-sm text-destructive mt-1">
                {errors.position.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="inn">ИНН</Label>
            <Input id="inn" {...register("inn")} placeholder="1234567890" />
            {errors.inn && (
              <p className="text-sm text-destructive mt-1">
                {errors.inn.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Телефон *</Label>
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="example@company.ru"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Пароль *</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Минимум 6 символов"
            />
            {errors.password && (
              <p className="text-sm text-destructive mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
