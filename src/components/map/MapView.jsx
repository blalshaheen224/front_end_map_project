// src/components/map/MapView.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Bed, Bath, Maximize, MapPin } from 'lucide-react';
import L from 'leaflet';

// ✅ استيراد الأيقونات محلياً من حزمة leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ✅ إعداد الأيقونات الافتراضية باستخدام الملفات المحلية
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon for properties
const propertyIcon = new L.Icon({
  iconUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to handle map bounds
const MapBounds = ({ properties }) => {
  const map = useMap();
  
  useEffect(() => {
    if (properties && properties.length > 0) {
      const validProperties = properties.filter(p => p.latitude && p.longitude);
      if (validProperties.length > 0) {
        const bounds = L.latLngBounds(
          validProperties.map(p => [p.latitude, p.longitude])
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [properties, map]);
  
  return null;
};

const MapView = ({ properties, center = [30.0444, 31.2357], zoom = 6 }) => {
  const navigate = useNavigate();

  // Filter properties with valid coordinates
  const validProperties = properties.filter(
    (p) => p.latitude && p.longitude
  );

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBounds properties={validProperties} />

        {validProperties.map((property) => (
          <Marker
            key={property._id}
            position={[property.latitude, property.longitude]}
            icon={propertyIcon}
          >
            <Popup maxWidth={350} minWidth={300} className="property-popup">
              <div className="p-0">
                {/* Image */}
                <img
                  src={property.images?.[0]?.url || property.mainImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                  alt={property.title}
                  className="w-full h-40 object-cover rounded-t-lg -mt-3 -mx-3"
                  style={{ width: 'calc(100% + 1.5rem)' }}
                />

                {/* Content */}
                <div className="pt-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {property.city}
                      {property.district && ` - ${property.district}`}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                      property.purpose === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {property.purpose === 'sale' ? 'للبيع' : 'للإيجار'}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                      {property.type}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="flex items-center gap-3 text-gray-600 mb-3 pb-3 border-b">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span className="text-sm">{property.area} م²</span>
                    </div>
                  </div>

                  {/* Price & Button */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-primary-600">
                        {property.price.toLocaleString()} ج.م
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/properties/${property._id}`)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-semibold"
                    >
                      عرض التفاصيل
                    </button>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;