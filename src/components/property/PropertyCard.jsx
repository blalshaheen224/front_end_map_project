// src/components/property/PropertyCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart, Eye } from 'lucide-react';
import { 
  PROPERTY_TYPES_AR, 
  PROPERTY_CATEGORIES_AR, 
  CITIES_AR, 
  PROPERTY_PURPOSE_AR 
} from '../../constants/propertyConstants';

const PropertyCard = ({ property, index = 0 }) => {
  const mainImage = property.images?.[0]?.url || property.mainImage || 'https://via.placeholder.com/400x300?text=No+Image';
  
  return (
    <div 
      className="property-card animate-fade-in-up group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <Link to={`/properties/${property._id}`} className="property-card-image block">
        <img
          src={mainImage}
          alt={property.title}
          loading="lazy"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className={`badge ${
            property.purpose === 'sale' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
          } shadow-lg`}>
            {PROPERTY_PURPOSE_AR[property.purpose]}
          </div>
        </div>

        {property.isFeatured && (
          <div className="absolute top-4 left-4 badge bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg flex items-center gap-1">
            <Heart className="h-3 w-3 fill-current" />
            مميز
          </div>
        )}

        {/* Quick View Button */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button className="w-full btn btn-primary">
            <Eye className="h-4 w-4" />
            عرض سريع
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/properties/${property._id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {property.title}
          </h3>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          <MapPin className="h-4 w-4 text-primary-500 flex-shrink-0" />
          <span className="text-sm truncate">
            {CITIES_AR[property.city] || property.city}
            {property.district && ` - ${property.district}`}
          </span>
        </div>

        {/* Type & Category */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="badge badge-primary">
            {PROPERTY_TYPES_AR[property.type] || property.type}
          </span>
          <span className="badge bg-gray-100 text-gray-700">
            {PROPERTY_CATEGORIES_AR[property.category] || property.category}
          </span>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Bed className="h-4 w-4 text-primary-600" />
            </div>
            <span className="text-xs text-gray-600">{property.bedrooms} غرف</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Bath className="h-4 w-4 text-primary-600" />
            </div>
            <span className="text-xs text-gray-600">{property.bathrooms} حمام</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Maximize className="h-4 w-4 text-primary-600" />
            </div>
            <span className="text-xs text-gray-600">{property.area} م²</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gradient">
              {property.price.toLocaleString()} ج.م
            </p>
            <p className="text-xs text-gray-500">
              {property.purpose === 'rent' ? 'شهرياً' : 'إجمالي'}
            </p>
          </div>
          <Link
            to={`/properties/${property._id}`}
            className="btn btn-primary btn-sm"
          >
            التفاصيل
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;