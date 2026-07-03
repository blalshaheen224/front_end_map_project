// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, TrendingUp, Clock } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { CITIES, PROPERTY_PURPOSE, PROPERTY_TYPES } from '../constants/propertyConstants';
import { CITIES_AR, PROPERTY_PURPOSE_AR, PROPERTY_TYPES_AR } from '../constants/propertyConstants';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search form
  const [searchCity, setSearchCity] = useState('');
  const [searchPurpose, setSearchPurpose] = useState('');
  const [searchType, setSearchType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, latestRes] = await Promise.all([
        propertyService.getFeatured(),
        propertyService.getLatest(),
      ]);
      
      setFeaturedProperties(featuredRes.data || []);
      setLatestProperties(latestRes.data || []);
    } catch (err) {
      setError('حدث خطأ في تحميل البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.append('city', searchCity);
    if (searchPurpose) params.append('purpose', searchPurpose);
    if (searchType) params.append('type', searchType);
    
    navigate(`/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              اعثر على عقارك المثالي
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-primary-100">
              آلاف العقارات بانتظارك في أفضل المواقع
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* City */}
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">اختر المدينة</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>
                        {CITIES_AR[city]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Purpose */}
                <div className="relative">
                  <HomeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={searchPurpose}
                    onChange={(e) => setSearchPurpose(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">الغرض</option>
                    {PROPERTY_PURPOSE.map((purpose) => (
                      <option key={purpose} value={purpose}>
                        {PROPERTY_PURPOSE_AR[purpose]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">نوع العقار</option>
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {PROPERTY_TYPES_AR[type]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                ابحث الآن
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {featuredProperties.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  العقارات المميزة
                </h2>
                <p className="text-gray-600">أفضل العقارات المختارة لك</p>
              </div>
              <Link
                to="/search?featured=true"
                className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
              >
                عرض الكل
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Properties */}
      {latestProperties.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  أحدث العقارات
                </h2>
                <p className="text-gray-600">أحدث العقارات المضافة</p>
              </div>
              <Link
                to="/properties"
                className="px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-600 hover:text-white transition-colors"
              >
                عرض الكل
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">ما تهمنا</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">سعادتك</div>
              {/* <div className="text-primary-100"> سعادتك</div> */}
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">راحتك </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;