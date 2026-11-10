import React from 'react';
import { Order } from '../types/wine';
import { useWineStore } from '../context/WineStoreContext';
import { formatPeso } from '../utils/formatCurrency';
import { downloadVineaReceipt } from '../utils/receiptGenerator';
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Wine,
  Thermometer,
  Truck,
  Sparkles,
  Award
} from 'lucide-react';

interface DigitalReceiptProps {
  order?: Order | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DigitalReceipt: React.FC<DigitalReceiptProps> = ({
  order: propOrder,
  isOpen: propIsOpen,
  onClose: propOnClose
}) => {
  const {
    viewingDigitalReceiptOrder,
    setViewingDigitalReceiptOrder
  } = useWineStore();

  const order = propOrder !== undefined ? propOrder : viewingDigitalReceiptOrder;
  const isOpen = propIsOpen !== undefined ? propIsOpen : Boolean(viewingDigitalReceiptOrder);

  const handleClose = () => {
    if (propOnClose) {
      propOnClose();
    } else {
      setViewingDigitalReceiptOrder(null);
    }
  };

  if (!isOpen || !order) return null;

  const trackingCode = order.tracking_number || `VNX-DVO-${order.order_id}`;
  const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = subtotal * 0.12;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    downloadVineaReceipt(order);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-3 sm:p-6 lg:p-10 flex items-center justify-center animate-fadeInSlideDown print:p-0 print:bg-white print:static print:inset-auto">
      {/* Background click to dismiss (disabled in print) */}
      <div className="fixed inset-0 print:hidden" onClick={handleClose} />

      {/* Main Invoice Card */}
      <div className="relative w-full max-w-4xl bg-[#170C0F] text-[#FDFBF7] border border-[#C6A15B]/50 rounded-2xl shadow-2xl overflow-hidden z-10 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-neutral-900 print:max-w-none">
        
        {/* Top Gold Foil Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#C6A15B] via-[#F5EFE7] to-[#C6A15B] print:bg-[#861F32]" />

        {/* Modal Controls Bar (Hidden during print) */}
        <div className="px-6 py-4 bg-[#1F0E13] border-b border-[#48151F] flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D5B15C] shadow-[0_0_8px_#D5B15C]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#E5D7B7]">
              Boutique Invoice & Allocation Manifest
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 rounded-lg bg-[#2A1117] hover:bg-[#48151F] text-[#E5D7B7] hover:text-white border border-[#C6A15B]/40 hover:border-[#C6A15B] text-xs font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-1.5"
              title="Print directly or save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-[#D5B15C]" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownload}
              className="py-1.5 px-3 rounded-lg bg-[#861F32] hover:bg-[#a1253c] text-white text-xs font-semibold tracking-wide border border-[#C6A15B]/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Download standalone HTML/PDF-ready receipt file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Close Digital Receipt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-10 lg:p-12 space-y-8 print:p-8 print:text-neutral-900">
          
          {/* Header Block: Brand, Crest & Invoice Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[0.18em] text-white uppercase drop-shadow-sm print:text-[#861F32]">
                  V Í N E A
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-[#48151F]/70 text-[#E5D7B7] border border-[#C6A15B]/40 print:border-[#861F32] print:text-[#861F32] print:bg-neutral-100">
                  Est. 2026
                </span>
              </div>
              <p className="text-xs tracking-[0.25em] text-[#D5B15C] uppercase font-semibold mt-1 print:text-[#8B6B2B]">
                Haute Sommellerie · Davao Cellar Allocation
              </p>
              <p className="text-[11px] text-[#B7AAA1] mt-1 italic print:text-neutral-600">
                Climate-Controlled Subterranean Provenance & Fine Vintage Vault
              </p>
            </div>

            <div className="sm:text-right bg-[#210D12]/90 border border-[#C6A15B]/40 rounded-xl p-4 sm:min-w-[240px] shadow-lg print:border-neutral-300 print:bg-neutral-50">
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Official Invoice
              </span>
              <span className="font-mono text-base sm:text-lg font-bold text-white block mt-0.5 print:text-neutral-900">
                #INV-{order.order_id}
              </span>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-semibold text-emerald-300 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>PAID IN FULL · {order.payment_method.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Thin Gold-Accented Editorial Divider */}
          <div className="relative py-1">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#48151F] to-transparent print:via-neutral-300" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-[#D5B15C]/40 border border-[#D5B15C]/70 shadow-[0_0_6px_rgba(213,177,92,0.3)] print:bg-[#8B6B2B]" />
          </div>

          {/* Client & Dispatch Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
            {/* Left: Customer Information */}
            <div className="p-5 rounded-xl bg-[#210D12]/60 border border-[#48151F]/80 space-y-2.5 print:bg-neutral-50 print:border-neutral-200">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Allocated Client (Billed & Delivered To)
              </span>
              <div>
                <p className="font-serif text-lg text-white font-medium print:text-neutral-900">
                  {order.customer_name}
                </p>
                <p className="text-[#FDFBF7]/90 mt-0.5 print:text-neutral-700">
                  {order.delivery_address.street}
                </p>
                <p className="text-[#B7AAA1] print:text-neutral-600">
                  {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postalCode}
                </p>
              </div>
              <div className="pt-2 border-t border-[#48151F]/60 flex flex-wrap gap-4 text-[11px] print:border-neutral-200">
                <div>
                  <span className="text-[#B7AAA1] block text-[9px] uppercase tracking-wider print:text-neutral-500">Contact</span>
                  <span className="font-mono text-white print:text-neutral-800">{order.phone}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] block text-[9px] uppercase tracking-wider print:text-neutral-500">Email</span>
                  <span className="text-white print:text-neutral-800">{order.email}</span>
                </div>
              </div>
            </div>

            {/* Right: Dispatch Cellar & Provenance Details */}
            <div className="p-5 rounded-xl bg-[#210D12]/60 border border-[#48151F]/80 space-y-2.5 print:bg-neutral-50 print:border-neutral-200">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Cellar Of Origin & Logistics Dispatch
              </span>
              <div className="space-y-1">
                <p className="font-semibold text-white print:text-neutral-900">
                  VÍNEA Lanang Flagship & Subterranean Vault
                </p>
                <p className="text-[#B7AAA1] print:text-neutral-600">
                  J.P. Laurel Avenue, Bajada, Davao City, 8000
                </p>
                <p className="text-[#E5D7B7] text-[11px] font-mono print:text-neutral-800">
                  Cold-Chain Code: <strong className="text-[#D5B15C] font-semibold">{trackingCode}</strong>
                </p>
              </div>
              <div className="pt-2 border-t border-[#48151F]/60 flex flex-wrap gap-4 text-[11px] print:border-neutral-200">
                <div>
                  <span className="text-[#B7AAA1] block text-[9px] uppercase tracking-wider print:text-neutral-500">Order Date</span>
                  <span className="text-white font-medium print:text-neutral-800">{order.order_date}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] block text-[9px] uppercase tracking-wider print:text-neutral-500">Vault Condition</span>
                  <span className="text-emerald-400 font-medium print:text-emerald-700">12.2°C · 70% RH Inspected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Allocations Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#48151F] text-[#D5B15C] uppercase tracking-[0.16em] text-[10px] print:border-neutral-400 print:text-[#8B6B2B]">
                  <th className="py-3 px-2 w-10 text-center font-bold">#</th>
                  <th className="py-3 px-3 font-bold">Vintage & Selection</th>
                  <th className="py-3 px-3 font-bold">Winery / Terroir</th>
                  <th className="py-3 px-2 w-16 text-center font-bold">Qty</th>
                  <th className="py-3 px-3 w-28 text-right font-bold">Unit Price</th>
                  <th className="py-3 px-3 w-32 text-right font-bold">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#48151F]/50 print:divide-neutral-200">
                {order.items.map((item, index) => (
                  <tr key={item.order_item_id || index} className="hover:bg-white/[0.02] transition-colors print:hover:bg-transparent">
                    <td className="py-4 px-2 text-center text-[#D5B15C] font-mono font-medium print:text-neutral-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-4 px-3">
                      <p className="font-serif text-base text-white font-semibold print:text-neutral-900">
                        {item.name}
                      </p>
                      <span className="text-[10px] uppercase tracking-wider text-[#B7AAA1] block mt-0.5 print:text-neutral-600">
                        Vintage {item.vintage} · {item.wine_type} Wine · Vault Sealed
                      </span>
                    </td>
                    <td className="py-4 px-3 text-[#E5D7B7] print:text-neutral-700 font-medium">
                      {item.winery}
                    </td>
                    <td className="py-4 px-2 text-center font-semibold text-white print:text-neutral-900">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-3 text-right font-mono text-[#E5D7B7] print:text-neutral-800">
                      {formatPeso(item.price)}
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-bold text-white print:text-neutral-900">
                      {formatPeso(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Endorsement Section */}
          <div className="pt-4 border-t border-[#48151F] grid grid-cols-1 md:grid-cols-12 gap-8 items-start print:border-neutral-300">
            
            {/* Left 7 cols: Sommelier Inspection Endorsement */}
            <div className="md:col-span-7 p-5 rounded-xl bg-[#210D12]/70 border border-[#C6A15B]/30 flex gap-4 items-center print:bg-neutral-50 print:border-neutral-300">
              <div className="w-14 h-14 rounded-full bg-[#351116] border-2 border-[#D5B15C] flex items-center justify-center text-[#D5B15C] shrink-0 shadow-lg print:border-[#861F32] print:text-[#861F32]">
                <Award className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-base font-semibold text-[#E5D7B7] print:text-[#861F32]">
                    Master Sommelier Kent Jorich Rabago
                  </h4>
                  <span className="text-[9px] uppercase tracking-widest text-[#D5B15C] px-1.5 py-0.5 rounded bg-black/40 border border-[#D5B15C]/40 print:bg-transparent print:border-neutral-300 print:text-neutral-600">
                    Certified
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#B7AAA1] print:text-neutral-600">
                  Davao Cellar Master · Provenance & Ullage Inspection
                </p>
                <p className="text-[11px] text-[#FDFBF7]/85 italic print:text-neutral-700 leading-relaxed">
                  "I hereby certify that each allocation above has verified capsule integrity, temperature-controlled transit across Davao, and cellared provenance."
                </p>
              </div>
            </div>

            {/* Right 5 cols: Totals Summary */}
            <div className="md:col-span-5 space-y-2 text-xs bg-[#1F0E13]/80 p-5 rounded-xl border border-[#48151F] print:bg-neutral-50 print:border-neutral-200">
              <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                <span>Allocation Subtotal</span>
                <span className="font-mono text-white print:text-neutral-900">{formatPeso(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                <span>Davao Cold-Chain Courier</span>
                <span className="text-emerald-400 font-semibold print:text-emerald-700">Complimentary</span>
              </div>
              <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                <span>Estimated 12% BIR VAT (Included)</span>
                <span className="font-mono text-[#E5D7B7] print:text-neutral-700">{formatPeso(vat)}</span>
              </div>
              
              <div className="pt-3 mt-2 border-t-2 border-[#C6A15B] flex justify-between items-baseline print:border-neutral-400">
                <span className="font-serif text-sm uppercase tracking-wider text-[#E5D7B7] font-semibold print:text-neutral-800">
                  Grand Total Paid
                </span>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#D5B15C] tabular-nums print:text-[#861F32]">
                  {formatPeso(order.total_amount)}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-[#48151F]/70 text-center text-[10px] text-[#B7AAA1] space-y-1 print:border-neutral-300 print:text-neutral-500">
            <p className="uppercase tracking-[0.2em] text-[#D5B15C] font-semibold print:text-[#8B6B2B]">
              VÍNEA Fine Wine Marketplace · Haute Sommellerie Philippines
            </p>
            <p>
              Official Inquiries: concierge@vinea.ph · Direct Davao Hotline: (082) 298-VINE
            </p>
            <p className="italic">
              Keep this document for your personal cellar allocation records and warranty provenance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
