import React from 'react';
import { WineStoreProvider, useWineStore } from './context/WineStoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { WineGuideSection } from './components/WineGuideSection';
import { DavaoBranchesSection } from './components/DavaoBranchesSection';
import { AboutSection } from './components/AboutSection';
import { EditorialStorySection } from './components/EditorialStorySection';
import { UserDashboard } from './components/UserDashboard';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AccountModal } from './components/AccountModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { FindYourWineQuiz } from './components/FindYourWineQuiz';
import { ToastContainer } from './components/Toast';
import { Sparkles, ArrowRight, Award, Wine } from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedProduct,
    setSelectedProduct,
    products,
    setIsQuizOpen
  } = useWineStore();

  // If a product is selected for full detail view
  if (selectedProduct) {
    return (
      <main className="min-h-[80vh]">
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
        />
      </main>
    );
  }

  // Route based on activeTab
  if (activeTab === 'shop') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog />
      </main>
    );
  }

  if (activeTab === 'red') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog initialTypeFilter="Red" />
      </main>
    );
  }

  if (activeTab === 'white') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog initialTypeFilter="White" />
      </main>
    );
  }

  if (activeTab === 'rose') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog initialTypeFilter="Rosé" />
      </main>
    );
  }

  if (activeTab === 'sparkling') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog initialTypeFilter="Sparkling" />
      </main>
    );
  }

  if (activeTab === 'collections') {
    return (
      <main className="min-h-[80vh]">
        <ProductCatalog initialTypeFilter="Collections" />
      </main>
    );
  }

  if (activeTab === 'guide') {
    return (
      <main className="min-h-[80vh]">
        <WineGuideSection />
      </main>
    );
  }

  if (activeTab === 'branches') {
    return (
      <main className="min-h-[80vh]">
        <DavaoBranchesSection />
      </main>
    );
  }

  if (activeTab === 'about') {
    return (
      <main className="min-h-[80vh]">
        <AboutSection />
      </main>
    );
  }

  if (activeTab === 'account') {
    return (
      <main className="min-h-[80vh]">
        <UserDashboard />
      </main>
    );
  }

  // Home Tab
  const featuredWines = products.filter((p) => p.featured).slice(0, 4);

  return (
    <main>
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Featured Collections Showcase (Asymmetrical Editorial Grid) */}
      <CategoryShowcase />

      {/* 3. Featured Cellar Allocations / Best Sellers */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Cellar Spotlight</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
              Featured Vintages
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedProduct(null);
              setActiveTab('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs uppercase tracking-wider text-[#C6A15B] hover:text-[#F5EFE7] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer mt-4 md:mt-0"
          >
            <span>View All Wines</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredWines.map((wine) => (
            <ProductCard key={wine.product_id} product={wine} />
          ))}
        </div>
      </section>

      {/* 4. Interactive Personalized Discovery ("Find Your Wine" Sommelier Quiz Banner) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#210D12] via-[#48151F]/40 to-[#130B0D] border border-[#48151F] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 text-[#C6A15B] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sommelier Recommendation Engine</span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3">
              Unsure Which Vintage to Select?
            </h3>
            <p className="text-sm text-[#B7AAA1] font-light leading-relaxed mb-6">
              Take our 60-second interactive questionnaire to discover bottles matched precisely to your flavor preferences, occasion, and gastronomy.
            </p>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="py-3.5 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all cursor-pointer shadow-lg flex items-center gap-2"
            >
              <span>Take The Sommelier Quiz</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </div>

          <div className="w-32 h-32 rounded-xl bg-[#130B0D] border border-[#48151F] flex items-center justify-center text-[#C6A15B] shrink-0 shadow-inner">
            <Wine className="w-14 h-14" />
          </div>
        </div>
      </section>

      {/* 5. Editorial Brand Story */}
      <EditorialStorySection />

      {/* 6. 5 Davao Branches Showcase */}
      <DavaoBranchesSection />

      {/* 7. Sommelier Wine Guide */}
      <WineGuideSection />
    </main>
  );
};

const AppLayout: React.FC = () => {
  const { isVisitingAdmin } = useWineStore();

  // Dedicated, completely separated Admin Portal (Login or Dashboard)
  if (isVisitingAdmin) {
    return (
      <div className="min-h-screen bg-[#130B0D] text-[#F5EFE7]">
        <AdminPortal />
        <ToastContainer />
      </div>
    );
  }

  // User Storefront Interface
  return (
    <div className="min-h-screen bg-[#210D12] text-[#F5EFE7] flex flex-col justify-between selection:bg-[#861F32] selection:text-white">
      <Navbar />
      <MainStoreContent />
      <Footer />

      {/* Global Modals & Overlays for Customer Storefront */}
      <AgeVerificationModal />
      <ProductQuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AccountModal />
      <CustomerAuthModal />
      <FindYourWineQuiz />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <WineStoreProvider>
      <AppLayout />
    </WineStoreProvider>
  );
}

export default App;
