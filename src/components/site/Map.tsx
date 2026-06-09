"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";

interface LocationItem {
  title: string;
  address: string;
  lat: number;
  lng: number;
}

const locations: LocationItem[] = [
  {
    title: "Nhà máy sản xuất",
    address: "324 Phan Văn Hớn, Phường Đông Hưng Thuận, Hồ Chí Minh, Việt Nam",
    lat: 10.8333592,
    lng: 106.6089034,
  },
  {
    title: "Trụ sở chính",
    address: "114C Hoàng Hoa Thám, Bảy Hiền, Hồ Chí Minh, Việt Nam",
    lat: 10.8000162,
    lng: 106.6474435,
  },
];

export default function LocationMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = await import("leaflet");

      if (!mounted || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const normalLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { maxZoom: 19 }
      );

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19 }
      );

      normalLayer.addTo(map);

      let isSatellite = false;

      const MapTypeControl = L.Control.extend({
        options: {
          position: "bottomleft",
        },

        onAdd: function () {
          const div = L.DomUtil.create("div", "map-type-btn");
          
          // Thêm font-family vào nút chuyển đổi bản đồ/vệ tinh
          div.style.fontFamily = "var(--floens-font5)";

          div.innerHTML = `
            <div class="map-type-thumb map-type-thumb-satellite"></div>
            <div class="map-type-label">Vệ tinh</div>
          `;

          L.DomEvent.disableClickPropagation(div);
          L.DomEvent.disableScrollPropagation(div);

          div.onclick = () => {
            const label = div.querySelector(".map-type-label");
            const thumb = div.querySelector(
              ".map-type-thumb"
            ) as HTMLElement | null;

            if (isSatellite) {
              map.removeLayer(satelliteLayer);
              normalLayer.addTo(map);

              if (label) label.innerHTML = "Vệ tinh";
              if (thumb)
                thumb.className = "map-type-thumb map-type-thumb-satellite";
            } else {
              map.removeLayer(normalLayer);
              satelliteLayer.addTo(map);

              if (label) label.innerHTML = "Bản đồ";
              if (thumb)
                thumb.className = "map-type-thumb map-type-thumb-normal";
            }

            isSatellite = !isSatellite;
          };

          return div;
        },
      });

      map.addControl(new MapTypeControl());

      const pinIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="width:38px;height:48px;position:relative;filter:drop-shadow(0 5px 8px rgba(0,0,0,.22))">
            <div style="width:34px;height:34px;background:var(--floens-base, #c7844f);border-radius:50% 50% 50% 0;transform:rotate(-45deg);position:absolute;left:2px;top:0;box-shadow:0 0 0 3px #fff">
              <div style="width:9px;height:9px;background:#fff;border-radius:50%;position:absolute;left:12.5px;top:12.5px;"></div>
            </div>
          </div>
        `,
        iconSize: [38, 48],
        iconAnchor: [19, 45],
      });

      locations.forEach((item, index) => {
        // Đã sửa lại lỗi hiển thị chuỗi template lồng nhau ở đoạn này `2{item.lat}` gốc của bạn
        const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;

        L.marker([item.lat, item.lng], {
          icon: pinIcon,
          zIndexOffset: 500,
        }).addTo(map);

        L.marker([item.lat, item.lng], {
          zIndexOffset: 300,
          icon: L.divIcon({
            className: "custom-card-marker",
            // Thêm font-family: var(--floens-font5) vào thẻ bao bọc ngoài cùng của Card thông tin
            html: `
              <div style="width:255px;min-height:82px;background:#fff;border-radius:4px;box-shadow:0 8px 24px rgba(0,0,0,.16),0 1px 3px rgba(0,0,0,.10);display:flex;align-items:stretch;position:relative;font-family:var(--floens-font5);">
                <div style="position:absolute;left:17px;bottom:-8px;width:16px;height:16px;background:#fff;transform:rotate(45deg);box-shadow:4px 4px 8px rgba(0,0,0,.05);z-index:0;"></div>

                <div style="flex:1;padding:13px 13px 12px;position:relative;z-index:1;">
                  <h3 style="margin:0 0 7px;font-size:14px;line-height:1.2;font-weight:800;color:#111;white-space:nowrap;font-family:var(--floens-font5);">${item.title}</h3>
                  <p style="margin:0;font-size:10.5px;line-height:1.65;color:#202020;font-family:var(--floens-font5);">${item.address}</p>
                </div>

                <a href="${dirUrl}" target="_blank" rel="noopener noreferrer"
                  style="width:72px;flex:0 0 72px;border-left:1px solid #eee;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;color:#0074bd;font-size:10.5px;font-weight:700;text-decoration:none;background:#fff;position:relative;z-index:1;font-family:var(--floens-font5);">
                  <span>Chỉ đường</span>
                  <span style="width:34px;height:34px;border-radius:50%;background:var(--floens-base, #c7844f);display:flex;align-items:center;justify-content:center;color:#fff;box-shadow:0 4px 12px rgba(239,51,64,.32);">➤</span>
                </a>
              </div>
            `,
            iconSize: [255, 86],
            iconAnchor: index === 0 ? [-18, 165] : [-22, 150],
          }),
        }).addTo(map);
      });

      const bounds = L.latLngBounds(
        locations.map((item) => [item.lat, item.lng] as [number, number])
      );

      map.fitBounds(bounds, {
        padding: [260, 120],
        maxZoom: 12,
      });

      setTimeout(() => {
        map.invalidateSize();
      }, 500);

      const handleWheel = (e: WheelEvent) => {
        if (!mapInstanceRef.current) return;

        if (e.ctrlKey) {
          e.preventDefault();
          mapInstanceRef.current.setZoom(
            mapInstanceRef.current.getZoom() + (e.deltaY < 0 ? 1 : -1)
          );
        } else {
          if (hintTimerRef.current) clearTimeout(hintTimerRef.current);

          setShowHint(true);

          hintTimerRef.current = setTimeout(() => {
            setShowHint(false);
          }, 1800);
        }
      };

      mapRef.current.addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    initMap();

    return () => {
      mounted = false;

      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="position-relative w-100 overflow-hidden"
      style={{
        height: "430px",
        background: "#f7f4ed",
      }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Thêm font-family vào thanh thông báo đen nhỏ dưới bản đồ */}
      <div
        className={`position-absolute start-50 translate-middle-x text-white small fw-semibold rounded-pill ${
          showHint ? "opacity-100" : "opacity-0"
        }`}
        style={{
          bottom: 18,
          background: "rgba(0,0,0,.75)",
          padding: "9px 18px",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          transition: "opacity .3s",
          zIndex: 9999,
          fontFamily: "var(--floens-font5)", 
        }}
      >
        Giữ <kbd style={{ fontFamily: "var(--floens-font5)" }}>Ctrl</kbd> để phóng to bản đồ
      </div>
    </div>
  );
}