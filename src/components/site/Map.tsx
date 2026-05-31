"use client";
 
import { useEffect, useRef, useState } from "react";
 
interface Location {
  title: string;
  address: string;
  lat: number;
  lng: number;
  anchorX: number;
  extraTop: number;
}
 
const locations: Location[] = [
  {
    title: "Nhà máy sản xuất",
    address: "324 Phan Văn Hớn, Phường Đông Hưng Thuận, Hồ Chí Minh, Việt Nam",
    lat: 10.8333592,
    lng: 106.6089034,
    anchorX: -18,
    extraTop: 10,
  },
  {
    title: "Trụ sở chính",
    address: "114C Hoàng Hoa Thám, Bảy Hiền, Hồ Chí Minh, Việt Nam",
    lat: 10.8000162,
    lng: 106.6474435,
    anchorX: -22,
    extraTop: 0,
  },
];
 
const CARD_W = 255;
const CARD_H = 86;
const PIN_TOP_OFFSET = 45;
const GAP_FROM_PIN_TOP = 22;
 
export default function LocationMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
  useEffect(() => {
    // Dynamically import Leaflet (client-side only)
    let mapInstance: import("leaflet").Map | null = null;
 
    const initMap = async () => {
      const L = (await import("leaflet")).default;
 
      // Leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
 
      if (!mapRef.current) return;
 
      mapInstance = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      }).setView([10.816, 106.628], 13);
 
    L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    maxZoom: 20,
    subdomains: "abcd",
    attribution: '&copy; OpenStreetMap &copy; CARTO',
  }
).addTo(mapInstance);

      const pinIcon = L.divIcon({
        className: "",
        html: `<div style="width:38px;height:48px;position:relative;filter:drop-shadow(0 5px 8px rgba(0,0,0,.22))">
<div style="width:34px;height:34px;background:#ef3340;border-radius:50% 50% 50% 0;transform:rotate(-45deg);position:absolute;left:2px;top:0;box-shadow:0 0 0 3px #fff">
<div style="width:9px;height:9px;background:#fff;border-radius:50%;position:absolute;left:12.5px;top:12.5px;"></div>
</div>
</div>`,
        iconSize: [38, 48],
        iconAnchor: [19, 45],
      });
 
      const arrowSVG = `<svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden="true">
<path d="M12 2 4.5 20.2l.7.8L12 18l6.8 3 .7-.8L12 2zm0 4.7 3.9 9.5-3.9-1.7-3.9 1.7L12 6.7z"/>
</svg>`;
 
      locations.forEach((item) => {
        const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
 
        const cardHtml = `
<div style="width:255px;min-height:82px;background:#fff;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.16),0 1px 3px rgba(0,0,0,.10);display:flex;align-items:stretch;overflow:visible;position:relative;">
<div style="position:absolute;left:17px;bottom:-8px;width:16px;height:16px;background:#fff;transform:rotate(45deg);box-shadow:4px 4px 8px rgba(0,0,0,.05);z-index:0;"></div>
<div style="flex:1;padding:13px 13px 12px;position:relative;z-index:1;">
<h3 style="margin:0 0 7px;font-size:14px;line-height:1.2;font-weight:800;color:#111;white-space:nowrap;">${item.title}</h3>
<p style="margin:0;font-size:10.5px;line-height:1.65;color:#202020;">${item.address}</p>
</div>
<a href="${dirUrl}" target="_blank" rel="noopener"
              style="width:72px;flex:0 0 72px;border-left:1px solid #eee;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;color:#0074bd;font-size:10.5px;font-weight:700;text-decoration:none;background:#fff;position:relative;z-index:1;">
<span>Chỉ đường</span>
<span style="width:34px;height:34px;border-radius:50%;background:#ef3340;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(239,51,64,.32);">${arrowSVG}</span>
</a>
</div>`;
 
        L.marker([item.lat, item.lng], {
          icon: pinIcon,
          zIndexOffset: 500,
        }).addTo(mapInstance!);
 
        L.marker([item.lat, item.lng], {
          zIndexOffset: 300,
          icon: L.divIcon({
            className: "",
            html: cardHtml,
            iconSize: [CARD_W, CARD_H],
            iconAnchor: [
              item.anchorX,
              CARD_H + PIN_TOP_OFFSET + GAP_FROM_PIN_TOP + item.extraTop,
            ],
          }),
        }).addTo(mapInstance!);
      });
 const bounds = L.latLngBounds(
  locations.map((item) => [item.lat, item.lng])
);

mapInstance.fitBounds(bounds, {
  padding: [260, 120],
  maxZoom: 12,
});
      // Scroll hint
      const container = mapRef.current;
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          mapInstance!.setZoom(mapInstance!.getZoom() + (e.deltaY < 0 ? 1 : -1));
        } else {
          if (hintTimerRef.current) clearTimeout(hintTimerRef.current);
          setShowHint(true);
          hintTimerRef.current = setTimeout(() => setShowHint(false), 1800);
        }
      };
      container?.addEventListener("wheel", handleWheel, { passive: false });
 
      return () => {
        container?.removeEventListener("wheel", handleWheel);
      };
    };
 
    const cleanup = initMap();
 
    return () => {
      cleanup.then((fn) => fn?.());
      mapInstance?.remove();
    };
  }, []);
 
  return (
<div className="relative w-full h-[800px] overflow-hidden rounded-2xl bg-[#f7f4ed] sm:h-[430px]">
      {/* Suppress default Leaflet attribution */}
<style>{`
        .leaflet-control-attribution { display: none !important; }
        .leaflet-marker-icon { background: transparent !important; border: none !important; }
      `}</style>
 
      <div ref={mapRef} className="w-full h-full" />
 
      {/* Scroll hint */}
<div
        className={`
          absolute left-1/2 bottom-[18px] -translate-x-1/2
          bg-black/75 text-white text-xs font-semibold
          px-[18px] py-[9px] rounded-full pointer-events-none whitespace-nowrap
          transition-opacity duration-300 z-[9999]
          ${showHint ? "opacity-100" : "opacity-0"}
        `}
>
        Giữ{" "}
<kbd className="bg-white/25 px-[5px] py-[1px] rounded">Ctrl</kbd>{" "}
        để phóng to bản đồ
</div>
</div>
  );
}