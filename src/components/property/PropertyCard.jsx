// src/components/property/PropertyCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { 
  PROPERTY_TYPES_AR, 
  PROPERTY_CATEGORIES_AR, 
  CITIES_AR, 
  PROPERTY_PURPOSE_AR 
} from '../../constants/propertyConstants';
import TiltCard from '../common/TiltCard';
import ScrollReveal from '../common/ScrollReveal';
import MagneticButton from '../common/MagneticButton';

const PropertyCard = ({ property, index = 0 }) => {
  const mainImage = property.images?.[0]?.url || property.mainImage || 'https://via.placeholder.com/400x300';
  
  return (
    <ScrollReveal delay={index * 100} direction="up">
      <TiltCard intensity={8} className="h-full">
        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group h-full flex flex-col">
          {/* Image Section */}
          <Link to={`/properties/${property._id}`} className="relative overflow-hidden h-64 block">
            <img 
              src={mainImage} 
              alt={property.title} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Badges */}
            <div className="absolute top-4 right-4 flex gap-2">
              <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                property.purpose === 'sale' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              } shadow-lg`}>
                {PROPERTY_PURPOSE_AR[property.purpose]}
              </div>
            </div>

            {property.isFeatured && (
              <div className="absolute top-4 left-4">
                <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                  <Heart className="h-3 w-3 fill-current" />
                  مميز
                </div>
              </div>
            )}
          </Link>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <Link to={`/properties/${property._id}`} className="block mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
                {property.title}
              </h3>
            </Link>

            {/* Location */}
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <div className="p-1.5 bg-primary-50 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-primary-600" />
              </div>
              <span className="text-sm truncate">
                {CITIES_AR[property.city]}
                {property.district && ` - ${property.district}`}
              </span>
            </div>

            {/* Type & Category */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-semibold">
                {PROPERTY_TYPES_AR[property.type]}
              </span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                {PROPERTY_CATEGORIES_AR[property.category]}
              </span>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Bed className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-xs text-gray-600">{property.bedrooms} غرف</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Bath className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-xs text-gray-600">{property.bathrooms} حمام</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="p-2 bg-gray-50 rounded-xl">
                  <Maximize className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-xs text-gray-600">{property.area} م²</span>
              </div>
            </div>

            {/* Price & CTA Button */}
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                  {property.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  ج.م {property.purpose === 'rent' ? '/ شهرياً' : 'إجمالي'}
                </p>
              </div>
              
              {/* ✅ زر التفاصيل - يعمل الآن! */}
              <MagneticButton
                to={`/properties/${property._id}`}
                strength={0.4}
                className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                التفاصيل
              </MagneticButton>
            </div>
          </div>
        </div>
      </TiltCard>
    </ScrollReveal>
  );
};

export default PropertyCard;