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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 flex items-center justify-center animate-fadeInSlideDown print:p-0 print:bg-white print:static print:inset-auto">
      {/* Background click to dismiss (disabled in print) */}
      <div className="fixed inset-0 print:hidden" onClick={handleClose} />

      {/* Main Invoice Card */}
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-[#150B0E] text-[#FDFBF7] border border-[#C6A15B]/40 rounded-xl shadow-2xl overflow-hidden z-10 print:border-none print:shadow-none print:rounded-none print:bg-white print:text-neutral-900 print:max-w-none print:max-h-none">
        
        {/* Top Gold Foil Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#C6A15B] via-[#F5EFE7] to-[#C6A15B] shrink-0 print:bg-[#861F32]" />

        {/* Modal Controls Bar (Hidden during print) */}
        <div className="px-4 py-2.5 bg-[#1F0E13] border-b border-[#48151F] flex items-center justify-between gap-2 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D5B15C] shadow-[0_0_6px_#D5B15C]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#E5D7B7]">
              Boutique Invoice & Allocation
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrint}
              className="py-1 px-2.5 rounded-md bg-[#2A1117] hover:bg-[#48151F] text-[#E5D7B7] hover:text-white border border-[#C6A15B]/40 hover:border-[#C6A15B] text-[11px] font-semibold tracking-wide transition-colors cursor-pointer flex items-center gap-1.5"
              title="Print directly or save as PDF"
            >
              <Printer className="w-3 h-3 text-[#D5B15C]" />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="py-1 px-2.5 rounded-md bg-[#861F32] hover:bg-[#a1253c] text-white text-[11px] font-semibold tracking-wide border border-[#C6A15B]/40 transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Download standalone HTML/PDF-ready receipt file"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Download File</span>
              <span className="sm:hidden">Save</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              aria-label="Close Digital Receipt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Sheet */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-7 space-y-4 sm:space-y-5 print:p-6 print:overflow-visible print:text-neutral-900">
          
          {/* Header Block: Brand, Crest & Invoice Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#48151F]/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.18em] text-white uppercase drop-shadow-sm print:text-[#861F32]">
                  V Í N E A
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-[#48151F]/70 text-[#E5D7B7] border border-[#C6A15B]/40 print:border-[#861F32] print:text-[#861F32] print:bg-neutral-100">
                  Est. 2026
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] text-[#D5B15C] uppercase font-semibold mt-0.5 print:text-[#8B6B2B]">
                Haute Sommellerie · Davao Cellar Allocation
              </p>
              <p className="text-[10px] text-[#B7AAA1] italic print:text-neutral-600">
                Climate-Controlled Subterranean Provenance & Fine Vintage Vault
              </p>
            </div>

            <div className="w-full sm:w-auto sm:text-right bg-[#210D12]/90 border border-[#C6A15B]/30 rounded-lg p-2.5 sm:px-3 sm:py-2 shadow-md print:border-neutral-300 print:bg-neutral-50 shrink-0">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Official Invoice
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-white block print:text-neutral-900">
                #INV-{order.order_id}
              </span>
              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[9px] font-semibold text-emerald-300 print:bg-emerald-50 print:text-emerald-800 print:border-emerald-300">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                <span>PAID IN FULL · {order.payment_method.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Client & Dispatch Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Left: Customer Information */}
            <div className="p-3 rounded-lg bg-[#210D12]/60 border border-[#48151F]/80 space-y-1.5 print:bg-neutral-50 print:border-neutral-200">
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Allocated Client (Delivered To)
              </span>
              <div>
                <p className="font-serif text-sm font-semibold text-white print:text-neutral-900">
                  {order.customer_name}
                </p>
                <p className="text-[#FDFBF7]/90 text-[11px] print:text-neutral-700">
                  {order.delivery_address.street}
                </p>
                <p className="text-[#B7AAA1] text-[10px] print:text-neutral-600">
                  {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.postalCode}
                </p>
              </div>
              <div className="pt-1.5 border-t border-[#48151F]/60 flex flex-wrap gap-3 text-[10px] print:border-neutral-200">
                <div>
                  <span className="text-[#B7AAA1] text-[9px] uppercase tracking-wider print:text-neutral-500">Contact: </span>
                  <span className="font-mono text-white print:text-neutral-800">{order.phone}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] text-[9px] uppercase tracking-wider print:text-neutral-500">Email: </span>
                  <span className="text-white print:text-neutral-800">{order.email}</span>
                </div>
              </div>
            </div>

            {/* Right: Dispatch Cellar & Provenance Details */}
            <div className="p-3 rounded-lg bg-[#210D12]/60 border border-[#48151F]/80 space-y-1.5 print:bg-neutral-50 print:border-neutral-200">
              <span className="text-[9px] uppercase tracking-[0.18em] text-[#D5B15C] font-bold block print:text-[#8B6B2B]">
                Cellar Of Origin & Logistics Dispatch
              </span>
              <div className="space-y-0.5">
                <p className="font-semibold text-white text-[11px] print:text-neutral-900">
                  VÍNEA Lanang Flagship & Subterranean Vault
                </p>
                <p className="text-[#B7AAA1] text-[10px] print:text-neutral-600">
                  J.P. Laurel Avenue, Bajada, Davao City, 8000
                </p>
                <p className="text-[#E5D7B7] text-[10px] font-mono print:text-neutral-800">
                  Cold-Chain Code: <strong className="text-[#D5B15C] font-semibold">{trackingCode}</strong>
                </p>
              </div>
              <div className="pt-1.5 border-t border-[#48151F]/60 flex flex-wrap gap-3 text-[10px] print:border-neutral-200">
                <div>
                  <span className="text-[#B7AAA1] text-[9px] uppercase tracking-wider print:text-neutral-500">Date: </span>
                  <span className="text-white font-medium print:text-neutral-800">{order.order_date}</span>
                </div>
                <div>
                  <span className="text-[#B7AAA1] text-[9px] uppercase tracking-wider print:text-neutral-500">Condition: </span>
                  <span className="text-emerald-400 font-medium print:text-emerald-700">12.2°C · 70% RH Inspected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Allocations Table */}
          <div className="overflow-x-auto border border-[#48151F]/60 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#1C0D11] print:bg-neutral-100">
                <tr className="border-b border-[#48151F] text-[#D5B15C] uppercase tracking-[0.14em] text-[9px] print:border-neutral-400 print:text-[#8B6B2B]">
                  <th className="py-2 px-2 w-8 text-center font-bold">#</th>
                  <th className="py-2 px-2.5 font-bold">Vintage & Selection</th>
                  <th className="py-2 px-2.5 font-bold hidden sm:table-cell">Winery</th>
                  <th className="py-2 px-1.5 w-12 text-center font-bold">Qty</th>
                  <th className="py-2 px-2 w-24 text-right font-bold">Unit Price</th>
                  <th className="py-2 px-2.5 w-24 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#48151F]/40 print:divide-neutral-200">
                {order.items.map((item, index) => (
                  <tr key={item.order_item_id || index} className="hover:bg-white/[0.02] transition-colors print:hover:bg-transparent">
                    <td className="py-2.5 px-2 text-center text-[#D5B15C] font-mono text-[10px] print:text-neutral-500">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <p className="font-serif text-xs sm:text-sm text-white font-semibold print:text-neutral-900 leading-snug">
                        {item.name}
                      </p>
                      <span className="text-[9px] uppercase tracking-wider text-[#B7AAA1] block mt-0.5 print:text-neutral-600">
                        {item.vintage} · {item.wine_type} · Sealed
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-[#E5D7B7] text-[11px] print:text-neutral-700 hidden sm:table-cell">
                      {item.winery}
                    </td>
                    <td className="py-2.5 px-1.5 text-center font-semibold text-white text-[11px] print:text-neutral-900">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono text-[#E5D7B7] text-[11px] print:text-neutral-800">
                      {formatPeso(item.price)}
                    </td>
                    <td className="py-2.5 px-2.5 text-right font-mono font-bold text-white text-[11px] print:text-neutral-900">
                      {formatPeso(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Calculation & Endorsement Section */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
            
            {/* Left: Sommelier Inspection Endorsement */}
            <div className="sm:col-span-7 p-3 rounded-lg bg-[#210D12]/60 border border-[#C6A15B]/30 flex gap-3 items-center print:bg-neutral-50 print:border-neutral-300">
              <div className="w-10 h-10 rounded-full bg-[#351116] border border-[#D5B15C] flex items-center justify-center text-[#D5B15C] shrink-0 shadow-sm print:border-[#861F32] print:text-[#861F32]">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-serif text-xs font-semibold text-[#E5D7B7] print:text-[#861F32] truncate">
                    Master Sommelier Kent Jorich Rabago
                  </h4>
                  <span className="text-[8px] uppercase tracking-widest text-[#D5B15C] px-1 py-0.5 rounded bg-black/40 border border-[#D5B15C]/40 print:bg-transparent print:border-neutral-300 print:text-neutral-600">
                    Certified
                  </span>
                </div>
                <p className="text-[9px] uppercase tracking-wider text-[#B7AAA1] print:text-neutral-600">
                  Davao Cellar Master · Provenance Inspection
                </p>
                <p className="text-[10px] text-[#FDFBF7]/85 italic print:text-neutral-700 leading-snug line-clamp-2">
                  "Verified capsule integrity, temperature-controlled transit across Davao, and cellared provenance."
                </p>
              </div>
            </div>

            {/* Right: Totals Summary */}
            <div className="sm:col-span-5 space-y-1.5 text-[11px] bg-[#1F0E13]/90 p-3 rounded-lg border border-[#48151F] flex flex-col justify-between print:bg-neutral-50 print:border-neutral-200">
              <div className="space-y-1">
                <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-mono text-white print:text-neutral-900">{formatPeso(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                  <span>Davao Cold-Chain</span>
                  <span className="text-emerald-400 font-semibold print:text-emerald-700">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#B7AAA1] print:text-neutral-600">
                  <span>12% BIR VAT (Incl.)</span>
                  <span className="font-mono text-[#E5D7B7] print:text-neutral-700">{formatPeso(vat)}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-[#C6A15B]/50 flex justify-between items-baseline print:border-neutral-400">
                <span className="font-serif text-xs uppercase tracking-wider text-[#E5D7B7] font-semibold print:text-neutral-800">
                  Grand Total
                </span>
                <span className="font-serif text-lg sm:text-xl font-bold text-[#D5B15C] tabular-nums print:text-[#861F32]">
                  {formatPeso(order.total_amount)}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="pt-3 border-t border-[#48151F]/60 text-center text-[9px] text-[#B7AAA1] space-y-0.5 print:border-neutral-300 print:text-neutral-500">
            <p className="uppercase tracking-[0.16em] text-[#D5B15C] font-semibold print:text-[#8B6B2B]">
              VÍNEA Fine Wine Marketplace · Haute Sommellerie Philippines
            </p>
            <p>
              Inquiries: concierge@vinea.ph · Direct Hotline: (082) 298-VINE
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
