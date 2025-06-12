import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function validatePhone(phone: string): boolean {
  const phoneRegex =
    /^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

export function validateINN(inn: string): boolean {
  if (!inn) return true; // не обязательное поле
  return /^(\d{10}|\d{12})$/.test(inn);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("8")) {
    return "+7" + cleaned.slice(1);
  }
  if (cleaned.startsWith("7")) {
    return "+" + cleaned;
  }
  return "+7" + cleaned;
}

export function exportToExcel(cartItems: any[], userInfo: any) {
  const data = cartItems.map((item) => ({
    Название: item.name,
    Бренд: item.brand,
    Тип: item.type,
    Пол: item.gender,
    Цена: item.price,
    Количество: item.quantity,
    Сумма: item.price * item.quantity,
  }));

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  data.push({
    Название: "",
    Бренд: "",
    Тип: "",
    Пол: "",
    Цена: "",
    Количество: "ИТОГО:",
    Сумма: total,
  });

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Заказ");

  const fileName = `заказ_${userInfo.company}_${new Date().toLocaleDateString()}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
