import { LaptopRaw } from '@/components/ComparisonTable'; // atau define sendiri

export interface LaptopItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  priceStr: string;
  imageUrl?: string | null;
  specValues: {
    processing: { value: string; detail: string; score: number };
    memory: { value: string; detail: string; score: number };
    disp: { value: string; detail: string; score: number };
    batt: { value: string; detail: string; score: number };
  };
}