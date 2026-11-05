import React from 'react';
import { WineStoreProvider, useWineStore } from './context/WineStoreContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryShowcase } from './components/CategoryShowcase';
import { ProductCard } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailPage } from './components/ProductDetailPage';
import { WineGuideSection } from './components/WineGuideSection';
import { NewsletterSubscriptionSection } from './components/NewsletterSubscriptionSection';
import { DavaoBranchesSection } from './components/DavaoBranchesSection';
import { AboutSection } from './components/AboutSection';
import { EditorialStorySection } from './components/EditorialStorySection';
import { WineRegionsSection } from './components/WineRegionsSection';
import { SommeliersSelectionSection } from './components/SommeliersSelectionSection';
import { FoodPairingSection } from './components/FoodPairingSection';
import { UserDashboard } from './components/UserDashboard';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';
import { TheArtOfWineSection } from './components/TheArtOfWineSection';
import { CollectorsRoomSection } from './components/CollectorsRoomSection';
import { MomentWorthRememberingSection } from './components/MomentWorthRememberingSection';
import { FadeInUp } from './components/FadeInUp';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AccountModal } from './components/AccountModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { FindYourWineQuiz } from './components/FindYourWineQuiz';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
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
      {/* 1. Cinematic Asymmetrical Hero Campaign with Brand Trust Indicators */}
      <HeroSection />

      {/* 2. The Art of Wine Editorial Feature (Crystal Glass Pour & Heritage) */}
      <FadeInUp>
        <TheArtOfWineSection />
      </FadeInUp>

      {/* 3. Featured Wine Collections Showcase (Warm Ivory Editorial Background) */}
      <FadeInUp>
        <CategoryShowcase />
      </FadeInUp>

      {/* 4. The Collector's Room (Exclusive Vault Allocations & Style C Cards) */}
      <FadeInUp>
        <CollectorsRoomSection />
      </FadeInUp>

      {/* 5. Featured Cellar Allocations & Bestselling Wines (Boutique Style Grid) */}
      <FadeInUp>
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#48151F] pb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Cellar Spotlight</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F5EFE7] font-normal tracking-tight">
                Featured Vintages & Bestsellers
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('shop');
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className="text-xs uppercase tracking-wider text-[#C6A15B] hover:text-[#F5EFE7] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer mt-4 md:mt-0"
            >
              <span>View All Wines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWines.map((wine, idx) => (
              <FadeInUp key={wine.product_id} delay={idx * 100} distance={18}>
                <ProductCard product={wine} styleVariant="boutique" />
              </FadeInUp>
            ))}
          </div>
        </section>
      </FadeInUp>

      {/* 6. Sommelier's Reserve Selection (Magazine-Style Editorial Feature) */}
      <FadeInUp>
        <SommeliersSelectionSection />
      </FadeInUp>

      {/* 7. Explore the World of Wine / Terroir Discovery */}
      <FadeInUp>
        <WineRegionsSection />
      </FadeInUp>

      {/* 8. Perfect Pairings (Gastronomy & Food Matching) */}
      <FadeInUp>
        <FoodPairingSection />
      </FadeInUp>

      {/* 9. A Moment Worth Remembering (Atmospheric Lifestyle & Celebrations) */}
      <FadeInUp>
        <MomentWorthRememberingSection />
      </FadeInUp>

      {/* 10. Interactive Sommelier Quiz Banner */}
      <FadeInUp>
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
      </FadeInUp>

      {/* 11. Editorial Brand Story & Terroir Manifesto */}
      <FadeInUp>
        <EditorialStorySection />
      </FadeInUp>

      {/* 12. 5 Davao Physical Boutique Branches */}
      <FadeInUp>
        <DavaoBranchesSection />
      </FadeInUp>

      {/* 13. Sommelier Wine Guide Articles */}
      <FadeInUp>
        <WineGuideSection />
      </FadeInUp>

      {/* 14. Elegant Newsletter Subscription Section */}
      <FadeInUp>
        <NewsletterSubscriptionSection />
      </FadeInUp>
    </main>
  );
};

const AppLayout: React.FC = () => {
  const { isVisitingAdmin, isSupabaseConfigOpen, setIsSupabaseConfigOpen } = useWineStore();

  // Dedicated, completely separated Admin Portal (Login or Dashboard)
  if (isVisitingAdmin) {
    return (
      <div className="min-h-screen bg-[#130B0D] text-[#F5EFE7]">
        <AdminPortal />
        <SupabaseConfigModal
          isOpen={isSupabaseConfigOpen}
          onClose={() => setIsSupabaseConfigOpen(false)}
        />
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
