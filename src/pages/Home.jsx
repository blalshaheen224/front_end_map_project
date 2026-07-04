// src/pages/Home.jsx (محدث مع تأثيرات احترافية)
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Home as HomeIcon, TrendingUp, ArrowRight, Sparkles, Star, Users, Building } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import PropertyCard from '../components/property/PropertyCard';
import { PropertySkeleton } from '../components/common/SkeletonLoader';
import AnimatedCounter from '../components/common/AnimatedCounter';
import ScrollReveal from '../components/common/ScrollReveal';
import MagneticButton from '../components/common/MagneticButton';
import { CITIES, PROPERTY_PURPOSE, PROPERTY_TYPES } from '../constants/propertyConstants';
import { CITIES_AR, PROPERTY_PURPOSE_AR, PROPERTY_TYPES_AR } from '../constants/propertyConstants';

const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div>
      {/* ═══ Hero Section مع تأثيرات مذهلة ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-purple-900 text-white">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-200"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-400"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-5xl mx-auto text-center">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-6 animate-scale-in">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-medium">#1 منصة عقارية في مصر</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                اعثر على{' '}
                <span className="relative inline-block">
                  <span className="text-shimmer">عقارك المثالي</span>
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-purple-500 to-pink-500 rounded-full"></span>
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <p className="text-xl md:text-2xl mb-12 text-white/80 max-w-3xl mx-auto">
                آلاف العقارات الفاخرة بانتظارك في جميع أنحاء مصر، مع تجربة بحث ذكية وتفاعلية
              </p>
            </ScrollReveal>

            {/* Animated Search Form */}
            <ScrollReveal delay={600}>
              <form onSubmit={handleSearch} className="glass-card rounded-3xl p-6 md:p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: MapPin, value: searchCity, setValue: setSearchCity, options: CITIES, labels: CITIES_AR, placeholder: 'اختر المدينة' },
                    { icon: HomeIcon, value: searchPurpose, setValue: setSearchPurpose, options: PROPERTY_PURPOSE, labels: PROPERTY_PURPOSE_AR, placeholder: 'الغرض' },
                    { icon: TrendingUp, value: searchType, setValue: setSearchType, options: PROPERTY_TYPES, labels: PROPERTY_TYPES_AR, placeholder: 'نوع العقار' },
                  ].map((field, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none z-10">
                        <field.icon className="h-5 w-5 text-primary-600" />
                      </div>
                      <select
                        value={field.value}
                        onChange={(e) => field.setValue(e.target.value)}
                        className="w-full pr-11 pl-4 py-4 text-gray-900 bg-white rounded-xl focus:ring-4 focus:ring-primary-200 border-2 border-transparent focus:border-primary-400 transition-all duration-300 cursor-pointer font-medium"
                      >
                        <option value="">{field.placeholder}</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>{field.labels[opt]}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <MagneticButton
                  type="submit"
                  strength={0.4}
                  className="w-full md:w-auto mx-auto px-12 py-4 bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-2xl hover-glow transition-all duration-500"
                >
                  <Search className="h-5 w-5" />
                  ابحث الآن عن عقارك
                  <ArrowRight className="h-5 w-5" />
                </MagneticButton>
              </form>
            </ScrollReveal>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto">
              {[
                { icon: Building, value: 1000, suffix: '+', label: 'عقار متاح' },
                { icon: Users, value: 500, suffix: '+', label: 'عميل سعيد' },
                { icon: MapPin, value: 27, label: 'محافظة' },
              ].map((stat, idx) => (
                <ScrollReveal key={idx} delay={800 + idx * 200} direction="up">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl hover:bg-white/10 transition-colors">
                    <stat.icon className="h-6 w-6 text-primary-300" />
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                    </div>
                    <div className="text-sm text-white/70">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* ═══ Featured Properties ═══ */}
      {featuredProperties.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative">
            <ScrollReveal>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full mb-4">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-semibold">مختار بعناية</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <span className="animated-gradient-text">العقارات المميزة</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  اكتشف أفضل العقارات المختارة بعناية لتناسب ذوقك الرفيع
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? [...Array(3)].map((_, i) => <PropertySkeleton key={i} />)
                : featuredProperties.map((property, index) => (
                    <PropertyCard key={property._id} property={property} index={index} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Latest Properties ═══ */}
      {latestProperties.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold mb-2">أحدث العقارات</h2>
                  <p className="text-gray-600 text-lg">اكتشف آخر الإضافات في منصتنا</p>
                </div>
                <MagneticButton
                  to="/properties"
                  strength={0.4}
                  className="btn btn-outline"
                >
                  عرض الكل
                  <ArrowRight className="h-5 w-5" />
                </MagneticButton>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? [...Array(6)].map((_, i) => <PropertySkeleton key={i} />)
                : latestProperties.map((property, index) => (
                    <PropertyCard key={property._id} property={property} index={index} />
                  ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ Stats Section ═══ */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        
        <div className="container mx-auto px-4 relative">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">أرقام تتحدث عنا</h2>
              <p className="text-white/80 text-lg">ثقة آلاف العملاء هي شهادتنا الحقيقية</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 1000, suffix: '+', label: 'عقار', icon: Building },
              { value: 500, suffix: '+', label: 'عميل', icon: Users },
              { value: 27, label: 'محافظة', icon: MapPin },
              { value: 98, suffix: '%', label: 'رضا العملاء', icon: Star },
            ].map((stat, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover-lift">
                  <stat.icon className="h-10 w-10 mx-auto mb-4" />
                  <div className="text-5xl font-bold mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix || ''} />
                  </div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA Section ═══ */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-primary-50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto glass-card rounded-3xl p-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary-600 animate-float" />
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                جاهز للبدء؟
              </h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                ابدأ رحلتك في البحث عن العقار المثالي اليوم واستمتع بتجربة لا مثيل لها
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {/* ✅ زر استكشف العقارات */}
                <MagneticButton
                  to="/properties"
                  strength={0.4}
                  className="btn btn-primary text-lg px-8 py-4"
                >
                  استكشف العقارات
                </MagneticButton>
                
                {/* ✅ زر استكشف الخريطة */}
                <MagneticButton
                  to="/map"
                  strength={0.4}
                  className="btn btn-outline text-lg px-8 py-4"
                >
                  <MapPin className="h-5 w-5" />
                  استكشف الخريطة
                </MagneticButton>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;