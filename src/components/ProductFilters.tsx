import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filters } from "@/types/product";

interface ProductFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: ProductFiltersProps) {
  const brands = [
    "Все",
    "Ray-Ban",
    "Oakley",
    "Versace",
    "Tom Ford",
    "Gucci",
    "TechVision",
    "Prada",
    "Police",
  ];
  const types = ["Все", "солнцезащитные", "оптические", "компьютерные"];
  const genders = ["Все", "мужские", "женские", "унисекс"];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Фильтры</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Тип</Label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Пол</Label>
          <Select
            value={filters.gender}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, gender: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {genders.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">Бренд</Label>
          <Select
            value={filters.brand}
            onValueChange={(value) =>
              onFiltersChange({ ...filters, brand: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium">
            Цена: {filters.minPrice}₽ - {filters.maxPrice}₽
          </Label>
          <div className="mt-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) =>
                onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
              }
              max={25000}
              min={0}
              step={500}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
