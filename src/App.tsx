import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeatureCards } from './components/FeatureCards';
import { PromoBanner } from './components/PromoBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { Footer } from './components/Footer';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AuthModal } from './components/AuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

const MainLayout: React.FC = () => {
  const { isAdminView, user } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0A0B0D] text-slate-900 dark:text-slate-100 transition-colors selection:bg-[#00FF66] selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAdminView && user?.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />
            <FeatureCards />
            <PromoBanner />
            <ProductCatalog />
          </>
        )}
      </main>

      {/* Footer */}
      {!isAdminView && <Footer />}

      {/* Modals & Overlays */}
      <ProductModal />
      <CartDrawer />
      <OrderSuccessModal />
      <AuthModal />
      <FloatingWhatsApp />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
