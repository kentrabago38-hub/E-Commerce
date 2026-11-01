import React, { useState, useEffect } from 'react';
import { DavaoBranch } from '../types/wine';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Phone,
  Clock,
  Copy,
  Check,
  ExternalLink,
  Car,
  ShieldCheck,
  Sparkles,
  LocateFixed
} from 'lucide-react';

interface BranchDirectionsModalProps {
  branch: DavaoBranch | null;
  onClose: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const BranchDirectionsModal: React.FC<BranchDirectionsModalProps> = ({
  branch,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    // Attempt to obtain user location to calculate distance if supported
    if (branch && branch.mapCoordinates) {
      const [bLatStr, bLngStr] = branch.mapCoordinates.split(',').map((s) => s.trim());
      const bLat = parseFloat(bLatStr);
      const bLng = parseFloat(bLngStr);

      if (navigator.geolocation && !userLocation) {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const uLat = pos.coords.latitude;
            const uLng = pos.coords.longitude;
            setUserLocation({ lat: uLat, lng: uLng });

            // Calculate distance via Haversine formula
            const R = 6371; // Earth radius in km
            const dLat = ((bLat - uLat) * Math.PI) / 180;
            const dLon = ((bLng - uLng) * Math.PI) / 180;
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((uLat * Math.PI) / 180) *
                Math.cos((bLat * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            setDistanceKm(parseFloat(d.toFixed(1)));
            setLocating(false);
          },
          () => {
            setLocating(false);
          },
          { timeout: 6000 }
        );
      }
    }
  }, [branch]);

  if (!branch) return null;

  const [latStr, lngStr] = (branch.mapCoordinates || '7.1065,125.6412')
    .split(',')
    .map((s) => s.trim());
  const lat = parseFloat(latStr) || 7.1065;
  const lng = parseFloat(lngStr) || 125.6412;

  // Curated driving & arrival guidelines for each Davao location
  const branchArrivalNotes: Record<string, { route: string; parking: string; landmarkDetails: string }> = {
    'branch-lanang': {
      route: 'From Francisco Bangoy International Airport / JP Laurel Ave, drive south towards Lanang. The cellar is positioned on the right before Insular Village gate.',
      parking: 'Complimentary private VIP valet parking provided at the subterranean portico entrance.',
      landmarkDetails: 'Facing Grand Regal Hotel corridor with illuminated gold VÍNEA heraldic signage.'
    },
    'branch-abreeza': {
      route: 'Via JP Laurel Ave, enter Abreeza Mall main entrance. Head to 2nd Level Restaurant Row overlooking the Garden Walk.',
      parking: 'Park at P2 Garden Walk Basement for direct elevator connection to the cellar lounge.',
      landmarkDetails: 'Located along the open-air courtyard breezeway near high-end dining.'
    },
    'branch-matina': {
      route: 'Along Quimpo Boulevard, Ecoland. Pass SM City Davao and turn into The Matina Enclaves main gate.',
      parking: 'Dedicated visitor bays directly adjacent to Clubhouse reception portico.',
      landmarkDetails: 'Secure gated residential enclave; mention VÍNEA Private Reserve at security for priority access.'
    },
    'branch-azuela': {
      route: 'Take R. Castillo St. to Azuela Cove entrance. Follow the roundabout loop toward the seaside boardwalk.',
      parking: 'Spacious oceanfront open parking with curbside pick-up bays right outside the cellar.',
      landmarkDetails: 'Waterfront terrace with panoramic Davao Gulf and Samal Island views.'
    },
    'branch-sm-lanang': {
      route: 'Access via JP Laurel Ave. Proceed to SM Lanang Premier 2nd Level Premier Wing.',
      parking: 'Building B Multi-Level parking allows fastest arrival directly to the Premier luxury wing.',
      landmarkDetails: 'Positioned beside the Sky Garden atrium escalator for rapid chilled bottle collection.'
    }
  };

  const currentNotes = branchArrivalNotes[branch.id] || {
    route: `Navigate along main Davao thoroughfares toward ${branch.district}.`,
    parking: 'Dedicated parking available on site for VÍNEA patrons.',
    landmarkDetails: `Located in the heart of ${branch.district}.`
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${branch.name}, ${branch.address}`);
      setCopied(true);
      onShowToast('Branch address copied to clipboard.', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${branch.name}, ${branch.address}`
  )}&destination_place_id=&travelmode=driving`;

  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#1E0B10] via-[#130B0D] to-[#130B0D] border border-[#48151F] rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#351116] bg-[#130B0D]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#351116] flex items-center justify-center text-[#C6A15B] border border-[#C6A15B]/30">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C6A15B] font-semibold block">
                Davao Cellar Route & Directions
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-[#F5EFE7] font-normal leading-tight">
                {branch.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#B7AAA1] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Address & Distance Badge */}
          <div className="p-4 rounded-xl bg-[#18090C] border border-[#48151F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-[#C6A15B] font-medium uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>{branch.district}</span>
              </div>
              <p className="text-sm text-[#F5EFE7] font-light leading-relaxed">
                {branch.address}
              </p>
              <p className="text-xs text-[#B7AAA1] italic">
                Landmark: {branch.landmark}
              </p>
            </div>

            {/* Live Distance from User (if available) */}
            {distanceKm !== null && (
              <div className="shrink-0 px-3.5 py-2 rounded-lg bg-[#351116] border border-[#C6A15B]/40 text-center">
                <span className="text-[10px] text-[#B7AAA1] uppercase tracking-wider block">
                  Est. Distance
                </span>
                <span className="font-serif text-xl text-[#C6A15B] font-semibold">
                  {distanceKm} km
                </span>
                <span className="text-[10px] text-emerald-400 block">
                  ~{Math.round(distanceKm * 2.8 + 5)} mins drive
                </span>
              </div>
            )}
          </div>

          {/* Interactive Navigation Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Action 1: Google Maps Direct Route */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#861F32] hover:bg-[#a1253c] text-white text-xs uppercase tracking-wider font-semibold border border-[#C6A15B]/40 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Navigation className="w-4 h-4 text-[#C6A15B]" />
              <span>Start Google Maps Route</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/70" />
            </a>

            {/* Action 2: Waze Route */}
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-[#130B0D] hover:bg-[#351116] text-[#F5EFE7] text-xs uppercase tracking-wider font-medium border border-[#48151F] hover:border-[#C6A15B]/50 transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-[#C6A15B]" />
              <span>Open in Waze Navigation</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          </div>

          {/* Secondary Quick Utilities: Copy Address & Call Phone */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyAddress}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#18090C] hover:bg-[#251016] text-xs text-[#B7AAA1] hover:text-[#F5EFE7] border border-[#351116] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Address Copied!' : 'Copy Full Address'}</span>
            </button>

            <a
              href={`tel:${branch.phone.split('/')[0].replace(/[^0-9+]/g, '')}`}
              className="flex-1 py-2.5 px-4 rounded-lg bg-[#18090C] hover:bg-[#251016] text-xs text-[#C6A15B] border border-[#351116] hover:border-[#C6A15B]/40 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call Concierge: {branch.phone.split('/')[0].trim()}</span>
            </a>
          </div>

          {/* Interactive Map Visual Pin Card */}
          <div className="relative rounded-xl overflow-hidden border border-[#48151F] bg-[#12070A] h-48 sm:h-56">
            <iframe
              title={`Map for ${branch.name}`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'contrast(1.1) brightness(0.85) saturate(1.2)' }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />

            {/* Overlaid Cellar Badge */}
            <div className="absolute bottom-3 left-3 bg-[#130B0D]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#48151F] text-xs text-[#F5EFE7] flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-pulse" />
              <span className="font-serif italic">{branch.name}</span>
            </div>
          </div>

          {/* Step-by-Step Arrival & Parking Guidelines */}
          <div className="p-5 rounded-xl bg-[#18090C] border border-[#351116] space-y-3.5 text-xs">
            <div className="flex items-center gap-2 text-[#C6A15B] uppercase tracking-wider font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Davao Sommelier Concierge Arrival Guide</span>
            </div>

            <div className="space-y-2 text-[#B7AAA1] font-light leading-relaxed">
              <p>
                <strong className="text-[#F5EFE7] font-medium">Driving Route:</strong> {currentNotes.route}
              </p>
              <p>
                <strong className="text-[#F5EFE7] font-medium">Parking & Valet:</strong> {currentNotes.parking}
              </p>
              <p>
                <strong className="text-[#F5EFE7] font-medium">Landmark Cue:</strong> {currentNotes.landmarkDetails}
              </p>
              <p className="flex items-center gap-2 text-[#C6A15B] pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Operating Hours: {branch.operatingHours}</span>
              </p>
            </div>
          </div>

          {/* Curbside Pick-up Guarantee */}
          <div className="p-3.5 rounded-lg bg-[#130B0D] border border-[#48151F]/60 flex items-center gap-3 text-xs text-[#B7AAA1]">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              Pre-ordered online allocations are kept in 13°C climate chillers and can be loaded into your vehicle upon arrival without leaving your seat.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
