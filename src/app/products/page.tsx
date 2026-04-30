'use client';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProductList from '@/components/ProductList';

export default function ProductsPage() {
  return (
    <>
      <Sidebar />
      <Header />
      <main className="ml-64 pt-16 flex-1 p-8 bg-background min-h-screen">
        <ProductList />
      </main>
    </>
  );
}