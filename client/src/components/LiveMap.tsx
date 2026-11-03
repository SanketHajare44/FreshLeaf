import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { MapPinIcon } from "lucide-react";
import { iconsForLeafpad } from "../assets/assets";
import L from "leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface Location {
  lat: number;
  lng: number;
}

interface LiveMapProps {
  order: any;
  liveLocation: Location | null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function LiveMap({ order, liveLocation }: LiveMapProps) {
  const truckIcon = new L.Icon({
    iconUrl: iconsForLeafpad.truck,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });

  const destinationIcon = new L.Icon({
    iconUrl: iconsForLeafpad.destination,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  if (order.status === "Delivered" || order.status === "Cancelled") {
    return null;
  }

  const address = order.shippingAddress;

  const hasDeliveryLocation =
    liveLocation !== null &&
    Number.isFinite(liveLocation.lat) &&
    Number.isFinite(liveLocation.lng) &&
    liveLocation.lat >= -90 &&
    liveLocation.lat <= 90 &&
    liveLocation.lng >= -180 &&
    liveLocation.lng <= 180 &&
    (liveLocation.lat !== 0 || liveLocation.lng !== 0);

  const hasDestination =
    address?.lat != null &&
    address?.lng != null &&
    Number.isFinite(Number(address.lat)) &&
    Number.isFinite(Number(address.lng)) &&
    Number(address.lat) >= -90 &&
    Number(address.lat) <= 90 &&
    Number(address.lng) >= -180 &&
    Number(address.lng) <= 180 &&
    (Number(address.lat) !== 0 || Number(address.lng) !== 0);

  const destination: Location | null = hasDestination
    ? {
        lat: Number(address.lat),
        lng: Number(address.lng),
      }
    : null;

  const center: [number, number] = hasDeliveryLocation
    ? [liveLocation!.lat, liveLocation!.lng]
    : destination
      ? [destination.lat, destination.lng]
      : [18.5204, 73.8567];

  return (
    <div
      className="rounded-2xl overflow-hidden border border-app-border relative"
      style={{ height: 280 }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasDeliveryLocation && (
          <Marker
            position={[liveLocation!.lat, liveLocation!.lng]}
            icon={truckIcon}
          >
            <Popup>Delivery Partner</Popup>
          </Marker>
        )}

        {destination && (
          <Marker
            position={[destination.lat, destination.lng]}
            icon={destinationIcon}
          >
            <Popup>Delivery Address</Popup>
          </Marker>
        )}

        <MapUpdater center={center} />
      </MapContainer>

      {!hasDeliveryLocation && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] bg-white/95 rounded-lg px-3 py-2 shadow-sm flex items-center gap-2">
          <MapPinIcon className="size-4 text-app-green shrink-0" />

          <p className="text-xs text-app-green font-medium">
            {destination
              ? "Delivery partner location is not available yet."
              : "Showing Pune. Delivery address coordinates are not available."}
          </p>
        </div>
      )}
    </div>
  );
}
