import React, { useState } from 'react';
import { GUIDE_ARTICLES } from '../data/mockData';
import { GuideArticle } from '../types/wine';
import { BookOpen, Clock, ArrowRight, X, Quote, CheckCircle2 } from 'lucide-react';

export const WineGuideSection: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(null);

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-[#F5EFE7]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#48151F]">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C6A15B] font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sommelier Academy & Insights</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#F5EFE7] font-normal">
            The VÍNEA Wine Guide
          </h2>
        </div>
        <p className="text-sm text-[#B7AAA1] max-w-md mt-3 md:mt-0 font-light leading-relaxed">
          Master the art of cellar appreciation, appellations, and sensory evaluation through our comprehensive sommelier handbook.
        </p>
      </div>

      {/* Featured Editorial Article (Hero layout) */}
      <div
        onClick={() => setSelectedArticle(GUIDE_ARTICLES[0])}
        className="group relative rounded-3xl overflow-hidden bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all duration-300 mb-12 cursor-pointer shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 h-80 lg:h-96 relative overflow-hidden bg-[#210D12]">
            <img
              src={GUIDE_ARTICLES[0].image}
              alt={GUIDE_ARTICLES[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#130B0D] via-transparent to-transparent" />
          </div>
          <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 text-xs text-[#C6A15B] uppercase tracking-wider font-semibold mb-3">
                <span>{GUIDE_ARTICLES[0].category}</span>
                <span className="text-[#48151F]">·</span>
                <span className="flex items-center gap-1 text-[#B7AAA1] font-normal">
                  <Clock className="w-3.5 h-3.5 text-[#C6A15B]" />
                  {GUIDE_ARTICLES[0].readTime}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5EFE7] font-normal mb-3 group-hover:text-[#C6A15B] transition-colors leading-tight">
                {GUIDE_ARTICLES[0].title}
              </h3>
              <p className="text-[#B7AAA1] text-sm leading-relaxed mb-6 font-light">
                {GUIDE_ARTICLES[0].excerpt}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#C6A15B]">
              <span>Read Full Sommelier Article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Other Editorial Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {GUIDE_ARTICLES.slice(1).map((article) => (
          <div
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group rounded-2xl overflow-hidden bg-[#130B0D] border border-[#48151F] hover:border-[#C6A15B]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-md hover:shadow-xl"
          >
            <div className="h-52 relative overflow-hidden bg-[#210D12]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#130B0D] via-transparent to-black/20" />
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 rounded bg-[#130B0D]/85 backdrop-blur-md text-[#C6A15B] text-[11px] font-semibold uppercase tracking-wider border border-[#48151F]">
                  {article.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#B7AAA1] mb-2">
                  <Clock className="w-3 h-3 text-[#C6A15B]" />
                  <span>{article.readTime}</span>
                </div>
                <h4 className="font-serif text-xl text-[#F5EFE7] font-normal mb-2.5 group-hover:text-[#C6A15B] transition-colors leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-[#B7AAA1] line-clamp-3 leading-relaxed mb-5 font-light">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#48151F]/40 flex items-center justify-between text-xs text-[#C6A15B] font-medium uppercase tracking-wider">
                <span>Explore Article</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl bg-[#130B0D] border border-[#48151F] shadow-2xl p-6 sm:p-10 text-[#F5EFE7]">
            {/* Close */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#B7AAA1] hover:text-[#F5EFE7] transition-colors cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Time */}
            <div className="flex items-center gap-3 text-xs text-[#C6A15B] uppercase tracking-widest font-semibold mb-3">
              <span>{selectedArticle.category}</span>
              <span className="text-[#48151F]">·</span>
              <span className="text-[#B7AAA1] font-normal">{selectedArticle.readTime}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-[#F5EFE7] font-normal mb-3 leading-tight">
              {selectedArticle.title}
            </h2>
            <p className="text-sm sm:text-base text-[#B7AAA1] mb-8 italic">
              {selectedArticle.subtitle}
            </p>

            {/* Sommelier Quote */}
            <div className="p-6 rounded-2xl bg-[#210D12] border-l-4 border-[#C6A15B] mb-8">
              <Quote className="w-6 h-6 text-[#C6A15B]/40 mb-2" />
              <p className="font-serif text-lg text-[#F5EFE7] italic leading-relaxed">
                {selectedArticle.sommelierQuote}
              </p>
            </div>

            {/* Article Content Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-[#B7AAA1] leading-relaxed font-light mb-8">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="p-6 rounded-2xl bg-[#210D12] border border-[#48151F] mb-8">
              <h4 className="text-xs uppercase tracking-wider text-[#C6A15B] font-semibold mb-3">
                Key Sommelier Takeaways
              </h4>
              <ul className="space-y-2.5">
                {selectedArticle.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#B7AAA1]">
                    <CheckCircle2 className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center">
              <button
                onClick={() => setSelectedArticle(null)}
                className="py-2.5 px-6 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-[#F5EFE7] text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer border border-[#C6A15B]/40"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
