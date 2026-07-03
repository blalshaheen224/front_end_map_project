// src/pages/MapView.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Map as MapIcon, ChevronDown } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import MapView from '../components/map/MapView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { 
  CITIES, 
  PROPERTY_PURPOSE, 
  PROPERTY_TYPES, 
  PROPERTY_CATEGORIES 
} from '../constants/propertyConstants';
import { 
  CITIES_AR, 
  PROPERTY_PURPOSE_AR, 
  PROPERTY_TYPES_AR, 
  PROPERTY_CATEGORIES_AR 
} from '../constants/propertyConstants';

const MapPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    purpose: searchParams.get('purpose') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
  });

  useEffect(() => {
    fetchProperties();
  }, [filters.city, filters.purpose, filters.type, filters.category]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filters.city) params.city = filters.city;
      if (filters.purpose) params.purpose = filters.purpose;
      if (filters.type) params.type = filters.type;
      if (filters.category) params.category = filters.category;

      const response = await propertyService.getAll(params);
      setProperties(response.data?.data || []);
    } catch (err) {
      setError('حدث خطأ في تحميل العقارات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }));
  };

  const handleReset = () => {
    setFilters({
      city: '',
      purpose: '',
      type: '',
      category: '',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  if (loading && properties.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Filters Bar - شريط الفلاتر العلوي */}
      <div className="bg-white shadow-md z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Title & Toggle */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <MapIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900 hidden md:block">
                خريطة العقارات
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>

            {/* Filters - Desktop: Always visible, Mobile: Toggle */}
            <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-3 flex-1`}>
              {/* City */}
              <div className="relative">
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">جميع المدن</option>
                  {CITIES.map((city) => (
                    <option key={city} value={city}>
                      {CITIES_AR[city]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose */}
              <div className="relative">
                <select
                  value={filters.purpose}
                  onChange={(e) => handleFilterChange('purpose', e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
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
              <div className="relative">
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">جميع الأنواع</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {PROPERTY_TYPES_AR[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="">جميع الفئات</option>
                  {PROPERTY_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {PROPERTY_CATEGORIES_AR[c]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleReset}
                  className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  إعادة تعيين
                </button>
              )}
            </div>

            {/* Stats Badge */}
            <div className="flex-shrink-0 px-3 py-2 bg-primary-50 rounded-lg">
              <p className="text-xs text-gray-600">
                العقارات: <span className="font-bold text-primary-600">{properties.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container - Takes remaining space */}
      <div className="flex-1 relative">
        {error ? (
          <div className="h-full flex items-center justify-center p-8">
            <ErrorMessage message={error} onRetry={fetchProperties} />
          </div>
        ) : (
          <MapView properties={properties} />
        )}
      </div>
    </div>
  );
};

export default MapPage;