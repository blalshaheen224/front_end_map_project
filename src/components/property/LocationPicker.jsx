// src/components/property/LocationPicker.jsx
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Navigation, X } from 'lucide-react';
import L from 'leaflet';

// ✅ استيراد الأيقونات محلياً
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// ✅ إعداد الأيقونات
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapEvents = ({ onLocationChange }) => {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const LocationPicker = ({ latitude, longitude, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLat, setTempLat] = useState(latitude || 30.0444);
  const [tempLng, setTempLng] = useState(longitude || 31.2357);

  useEffect(() => {
    if (latitude && longitude) {
      setTempLat(latitude);
      setTempLng(longitude);
    }
  }, [latitude, longitude]);

  const handleLocationChange = (lat, lng) => {
    setTempLat(lat);
    setTempLng(lng);
  };

  const handleConfirm = () => {
    onChange(tempLat, tempLng);
    setIsOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTempLat(position.coords.latitude);
          setTempLng(position.coords.longitude);
        },
        (error) => {
          alert('تعذر الحصول على الموقع الحالي');
        }
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Manual Input */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            خط العرض (Latitude)
          </label>
          <input
            type="number"
            step="any"
            value={latitude || ''}
            onChange={(e) => onChange(parseFloat(e.target.value) || null, longitude)}
            placeholder="30.0444"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            خط الطول (Longitude)
          </label>
          <input
            type="number"
            step="any"
            value={longitude || ''}
            onChange={(e) => onChange(latitude, parseFloat(e.target.value) || null)}
            placeholder="31.2357"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Map Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed border-primary-300 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 font-semibold"
      >
        <MapPin className="h-5 w-5" />
        {latitude && longitude ? 'تغيير الموقع من الخريطة' : 'اختيار الموقع من الخريطة'}
      </button>

      {/* Map Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">اختر الموقع على الخريطة</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              <MapContainer
                center={[tempLat, tempLng]}
                zoom={13}
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap'
                />
                <MapEvents onLocationChange={handleLocationChange} />
                <Marker position={[tempLat, tempLng]} />
              </MapContainer>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Navigation className="h-4 w-4" />
                استخدام موقعي الحالي
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  تأكيد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;