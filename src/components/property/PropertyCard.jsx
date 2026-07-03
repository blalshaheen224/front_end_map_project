// src/components/property/PropertyCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { PROPERTY_TYPES_AR, PROPERTY_CATEGORIES_AR, CITIES_AR, PROPERTY_PURPOSE_AR } from '../../constants/propertyConstants';

const PropertyCard = ({ property }) => {
  const mainImage = property.images?.[0]?.url || property.mainImage || 'https://via.placeholder.com/400x300?text=No+Image';
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <Link to={`/properties/${property._id}`} className="relative overflow-hidden">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Purpose Badge */}
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-lg font-semibold text-white ${
          property.purpose === 'sale' ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          {PROPERTY_PURPOSE_AR[property.purpose] || property.purpose}
        </div>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute top-4 left-4 px-4 py-2 bg-yellow-500 rounded-lg font-semibold text-white flex items-center gap-1">
            <Heart className="h-4 w-4 fill-current" />
            مميز
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/properties/${property._id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">
            {CITIES_AR[property.city] || property.city}
            {property.district && ` - ${property.district}`}
          </span>
        </div>

        {/* Type & Category */}
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
            {PROPERTY_TYPES_AR[property.type] || property.type}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            {PROPERTY_CATEGORIES_AR[property.category] || property.category}
          </span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-gray-600 mb-4 pb-4 border-b">
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

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {property.price.toLocaleString()} ج.م
            </p>
            <p className="text-xs text-gray-500">
              {property.purpose === 'rent' ? 'شهرياً' : 'إجمالي'}
            </p>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            عرض التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;