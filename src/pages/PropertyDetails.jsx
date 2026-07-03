// src/pages/PropertyDetails.jsx - فقط استيراد الأيقونات
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Calendar, ArrowLeft, Share2, Heart, Map as MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { propertyService } from '../services/propertyService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  PROPERTY_TYPES_AR, 
  PROPERTY_CATEGORIES_AR, 
  CITIES_AR, 
  PROPERTY_PURPOSE_AR, 
  PROPERTY_AMENITIES_AR,
  PROPERTY_STATUS_AR 
} from '../constants/propertyConstants';
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

// ... باقي الكود كما هو بدون تغيير

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await propertyService.getById(id);
      setProperty(response.data);
    } catch (err) {
      setError('حدث خطأ في تحميل تفاصيل العقار');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error || 'العقار غير موجود'} />
      </div>
    );
  }

  const images = property.images || [];
  const currentImage = images[selectedImage]?.url || property.mainImage || 'https://via.placeholder.com/800x600?text=No+Image';

  // Create map link with coordinates
  const mapLink = property.latitude && property.longitude 
    ? `/map?lat=${property.latitude}&lng=${property.longitude}&zoom=15`
    : '/map';

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        to="/properties"
        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        العودة للعقارات
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img
                src={currentImage}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                <div className={`px-4 py-2 rounded-lg font-semibold text-white ${
                  property.purpose === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {PROPERTY_PURPOSE_AR[property.purpose]}
                </div>
                {property.isFeatured && (
                  <div className="px-4 py-2 bg-yellow-500 rounded-lg font-semibold text-white flex items-center gap-1">
                    <Heart className="h-4 w-4 fill-current" />
                    مميز
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={img.public_id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-4 ring-primary-600' : ''
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {CITIES_AR[property.city] || property.city}
                    {property.district && ` - ${property.district}`}
                  </span>
                </div>
              </div>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-4xl font-bold text-primary-600">
                  {property.price.toLocaleString()} ج.م
                </p>
                <p className="text-sm text-gray-500">
                  {property.purpose === 'rent' ? 'شهرياً' : 'إجمالي'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">سعر المتر</p>
                <p className="text-xl font-semibold text-gray-900">
                  {property.area > 0 ? Math.round(property.price / property.area).toLocaleString() : 0} ج.م
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">الوصف</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">المواصفات</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Bed className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">غرف النوم</p>
                  <p className="text-xl font-bold">{property.bedrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Bath className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">الحمامات</p>
                  <p className="text-xl font-bold">{property.bathrooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Maximize className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">المساحة</p>
                  <p className="text-xl font-bold">{property.area} م²</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">سنة البناء</p>
                  <p className="text-xl font-bold">{property.yearBuilt || '-'}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">الطابق</p>
                <p className="text-lg font-semibold">{property.floor || '-'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">موقف السيارات</p>
                <p className="text-lg font-semibold">{property.parking || 0}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">الحالة</p>
                <p className="text-lg font-semibold">{PROPERTY_STATUS_AR[property.status]}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">المرافق</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <span className="text-gray-700">
                      {PROPERTY_AMENITIES_AR[amenity] || amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map */}
          {property.latitude && property.longitude && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">الموقع على الخريطة</h2>
                <Link
                  to={mapLink}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                >
                  <MapIcon className="h-5 w-5" />
                  عرض على الخريطة الكبيرة
                </Link>
              </div>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={[property.latitude, property.longitude]}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[property.latitude, property.longitude]}>
                    <Popup>
                      <strong>{property.title}</strong>
                      <br />
                      {property.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <p className="mt-4 text-gray-600">
                <MapPin className="h-4 w-4 inline" /> {property.address}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-4">معلومات العقار</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">النوع</span>
                <span className="font-semibold">{PROPERTY_TYPES_AR[property.type]}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">الفئة</span>
                <span className="font-semibold">{PROPERTY_CATEGORIES_AR[property.category]}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">المدينة</span>
                <span className="font-semibold">{CITIES_AR[property.city]}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">الغرض</span>
                <span className="font-semibold">{PROPERTY_PURPOSE_AR[property.purpose]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">تاريخ الإضافة</span>
                <span className="font-semibold">
                  {new Date(property.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>

            {/* <button className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold">
              تواصل معنا
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;