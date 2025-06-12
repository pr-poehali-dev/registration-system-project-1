import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface PhoneVerificationProps {
  onSuccess: () => void;
  onBack: () => void;
}

export default function PhoneVerification({
  onSuccess,
  onBack,
}: PhoneVerificationProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { verifyPhone } = useAuth();
  const { toast } = useToast();

  const handleVerify = async () => {
    if (code.length !== 4) {
      toast({
        title: "Ошибка",
        description: "Введите 4-значный код",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await verifyPhone(code);
      if (success) {
        toast({
          title: "Телефон подтвержден!",
          description: "Теперь вы можете войти в систему",
        });
        onSuccess();
      } else {
        toast({
          title: "Неверный код",
          description: "Проверьте код и попробуйте снова",
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
        <CardTitle className="text-2xl text-center">
          Подтверждение телефона
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          На ваш телефон отправлен 4-значный код подтверждения
        </p>
        <p className="text-xs text-muted-foreground text-center">
          Для тестирования используйте код: <strong>1234</strong>
        </p>

        <div>
          <Label htmlFor="code">Код подтверждения</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="1234"
            maxLength={4}
            className="text-center text-lg"
          />
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleVerify}
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isLoading || code.length !== 4}
          >
            {isLoading ? "Проверка..." : "Подтвердить"}
          </Button>

          <Button variant="outline" onClick={onBack} className="w-full">
            Назад к регистрации
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
