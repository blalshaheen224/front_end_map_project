// src/pages/Search.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  CITIES, 
  PROPERTY_PURPOSE, 
  PROPERTY_TYPES, 
  PROPERTY_CATEGORIES,
  PROPERTY_AMENITIES 
} from '../constants/propertyConstants';
import { 
  CITIES_AR, 
  PROPERTY_PURPOSE_AR, 
  PROPERTY_TYPES_AR, 
  PROPERTY_CATEGORIES_AR,
  PROPERTY_AMENITIES_AR 
} from '../constants/propertyConstants';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Advanced filters
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    district: searchParams.get('district') || '',
    category: searchParams.get('category') || '',
    purpose: searchParams.get('purpose') || '',
    type: searchParams.get('type') || '',
    amenities: searchParams.get('amenities')?.split(',').filter(Boolean) || [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    bathrooms: searchParams.get('bathrooms') || '',
    minArea: searchParams.get('minArea') || '',
    maxArea: searchParams.get('maxArea') || '',
  });

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = {};
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
          params[key] = Array.isArray(value) ? value.join(',') : value;
        }
      });

      const response = await propertyService.search(params);
      setProperties(response.data?.data || []);
    } catch (err) {
      setError('حدث خطأ في البحث');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const amenities = prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity];
      return { ...prev, amenities };
    });
  };

  const handleReset = () => {
    setFilters({
      city: '',
      district: '',
      category: '',
      purpose: '',
      type: '',
      amenities: [],
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">بحث متقدم</h1>

      {/* Advanced Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              المدينة
            </label>
            <select
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">جميع المدن</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {CITIES_AR[city]}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحي
            </label>
            <input
              type="text"
              value={filters.district}
              onChange={(e) => handleFilterChange('district', e.target.value)}
              placeholder="مثال: التجمع الخامس"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الفئة
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">جميع الفئات</option>
              {PROPERTY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {PROPERTY_CATEGORIES_AR[cat]}
                </option>
              ))}
            </select>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الغرض
            </label>
            <select
              value={filters.purpose}
              onChange={(e) => handleFilterChange('purpose', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">الكل</option>
              {PROPERTY_PURPOSE.map((p) => (
                <option key={p} value={p}>
                  {PROPERTY_PURPOSE_AR[p]}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              النوع
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="">جميع الأنواع</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {PROPERTY_TYPES_AR[t]}
                </option>
              ))}
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              غرف النوم (على الأقل)
            </label>
            <input
              type="number"
              value={filters.bedrooms}
              onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحد الأدنى للسعر
            </label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحد الأقصى للسعر
            </label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="10000000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Min Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الحد الأدنى للمساحة (م²)
            </label>
            <input
              type="number"
              value={filters.minArea}
              onChange={(e) => handleFilterChange('minArea', e.target.value)}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            المرافق
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROPERTY_AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  {PROPERTY_AMENITIES_AR[amenity]}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleSearch}
            className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <SearchIcon className="h-5 w-5" />
            بحث
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
          >
            إعادة تعيين
          </button>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} />
      ) : properties.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500">لا توجد نتائج مطابقة للبحث</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6">
            عدد النتائج: <span className="font-bold">{properties.length}</span> عقار
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;