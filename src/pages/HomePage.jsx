import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import dataService from '../data/dataService';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FloatingFoods, PromoTicker, ScrollReveal, AnimatedCounter, TypeWriter, GradientText, BouncingArrow } from '../components/AnimatedElements';

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <div
    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/95 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
    onClick={onClick}
  >
    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
    </svg>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/95 hover:bg-white rounded-full p-3 shadow-xl hover:shadow-2xl transition-all transform hover:scale-110"
    onClick={onClick}
  >
    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
    </svg>
  </div>
);

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingStats, setRatingStats] = useState({ average: 4.5, total: 0 });

  useEffect(() => {
    fetchMenuItems();
    fetchRatings();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const items = await dataService.getMenuItems();
      setMenuItems(items.filter(item => item.available));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu:', error);
      setLoading(false);
    }
  };

  const fetchRatings = async () => {
    try {
      const stats = await dataService.getRatingStats();
      setRatingStats(stats);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  // Category-based default images (high-quality food photos)
  const categoryImages = {
    Pizza: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=400&h=300&fit=crop',
    ],
    Burger: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    ],
    Pasta: [
      'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1516100882582-96c3a05fe590?w=400&h=300&fit=crop',
    ],
    Salad: [
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400&h=300&fit=crop',
    ],
    Dessert: [
      'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop',
    ],
    Drinks: [
      'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1481671703460-040cb8a2d909?w=400&h=300&fit=crop',
    ],
    Appetizer: [
      'https://images.unsplash.com/photo-1541014741259-de529411b96a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1608039829572-9b0088655491?w=400&h=300&fit=crop',
    ],
    'Main Course': [
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
    ],
    default: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=300&fit=crop',
    ]
  };

  // Get default image for an item based on category and index
  const getDefaultImage = (category, index = 0) => {
    const images = categoryImages[category] || categoryImages.default;
    return images[index % images.length];
  };

  // Group items by category - matches database categories
  const categories = ['Pizza', 'Burger', 'Pasta', 'Salad', 'Dessert', 'Drinks', 'Appetizer', 'Main Course'];
  
  const getItemsByCategory = (category) => {
    let items = menuItems.filter(item => item.category === category);
    // Limit some categories to 4 items
    if (['Dessert', 'Drinks', 'Appetizer'].includes(category) && items.length > 4) {
      items = items.slice(0, 4);
    }
    return items;
  };

  const carouselSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const handleExploreMenu = () => {
    if (user) {
      if (user.isAdmin) {
        navigate('/admin-dashboard');
      } else {
        navigate('/menu');
      }
    } else {
      navigate('/login');
    }
  };

  const handleItemClick = () => {
    handleExploreMenu();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading delicious food... 🍕</div>
      </div>
    );
  }

  // Hero image carousel settings
  const heroCarouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
    arrows: false,
    pauseOnHover: false,
  };

  // Hero images - beautiful food photography
  const heroImages = [
    {
      url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1600&h=700&fit=crop&q=80',
      title: 'Delicious Pizza',
      subtitle: 'Fresh from the oven, made with love'
    },
    {
      url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1600&h=700&fit=crop&q=80',
      title: 'Juicy Burgers',
      subtitle: 'Made with premium ingredients'
    },
    {
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1600&h=700&fit=crop&q=80',
      title: 'Healthy Salads',
      subtitle: 'Fresh and nutritious every day'
    },
    {
      url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=1600&h=700&fit=crop&q=80',
      title: 'Authentic Pasta',
      subtitle: 'Italian perfection in every bite'
    },
    {
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1600&h=700&fit=crop&q=80',
      title: 'Wood-Fired Pizza',
      subtitle: 'Crispy crust, amazing flavors'
    },
    {
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=700&fit=crop&q=80',
      title: 'Gourmet Burgers',
      subtitle: 'Stacked high with fresh toppings'
    },
    {
      url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1600&h=700&fit=crop&q=80',
      title: 'Fresh Pasta Dishes',
      subtitle: 'Homemade pasta, traditional sauces'
    },
    {
      url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=700&fit=crop&q=80',
      title: 'Delightful Meals',
      subtitle: 'Prepared fresh daily'
    },
    {
      url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1600&h=700&fit=crop&q=80',
      title: 'Healthy Bowls',
      subtitle: 'Nutritious and delicious options'
    },
    {
      url: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=1600&h=700&fit=crop&q=80',
      title: 'Fresh Ingredients',
      subtitle: 'Quality you can taste'
    },
    {
      url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1600&h=700&fit=crop&q=80',
      title: 'Gourmet Burgers',
      subtitle: 'Flame-grilled to perfection'
    },
    {
      url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=1600&h=700&fit=crop&q=80',
      title: 'Artisan Pizza',
      subtitle: 'Handcrafted with finest ingredients'
    },
    {
      url: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1600&h=700&fit=crop&q=80',
      title: 'Creamy Pasta',
      subtitle: 'Rich flavors, perfect texture'
    },
    {
      url: 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1600&h=700&fit=crop&q=80',
      title: 'Breakfast Delights',
      subtitle: 'Start your day right'
    },
    {
      url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1600&h=700&fit=crop&q=80',
      title: 'Vibrant Salads',
      subtitle: 'Farm to table freshness'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Floating Food Background Animation */}
      <FloatingFoods />
      
      {/* Promo Ticker at Top */}
      <PromoTicker />
      
      {/* Hero Image Carousel - Full Width */}
      <div className="relative overflow-hidden">
        <Slider {...heroCarouselSettings}>
          {heroImages.map((image, index) => (
            <div key={index} className="relative">
              <div className="relative h-[450px] md:h-[550px] lg:h-[650px]">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/1600x600/1f2937/ffffff?text=Delicious+Food';
                  }}
                />
                {/* Overlay gradient - darker for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40"></div>
                
                {/* Text overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-8">
                    <div className="max-w-3xl">
                      <p className="text-orange-400 text-lg md:text-xl font-semibold mb-3 tracking-wide uppercase">
                        Welcome to FoodHub
                      </p>
                      <h2 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                        {image.title}
                      </h2>
                      <p className="text-xl md:text-2xl text-gray-100 mb-8">
                        {image.subtitle}
                      </p>
                      <button
                        onClick={handleExploreMenu}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                      >
                        Explore Menu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Trust Badges - Floating Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <ScrollReveal delay={0}>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition group cursor-pointer">
                <div className="text-4xl animate-floating">⚡</div>
                <div>
                  <p className="font-bold text-gray-900">30-45 Min</p>
                  <p className="text-sm text-gray-600">Fast Delivery</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition group cursor-pointer">
                <div className="text-4xl animate-floating" style={{ animationDelay: '0.5s' }}>🍽️</div>
                <div>
                  <p className="font-bold text-gray-900"><AnimatedCounter end={250} suffix="+ Items" /></p>
                  <p className="text-sm text-gray-600">Fresh Daily</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition group cursor-pointer">
                <div className="text-4xl animate-floating" style={{ animationDelay: '1s' }}>⭐</div>
                <div>
                  <p className="font-bold text-gray-900">{ratingStats.average?.toFixed(1) || '4.8'} Rating</p>
                  <p className="text-sm text-gray-600">From {ratingStats.total || '2.5K+'} Reviews</p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition group cursor-pointer">
                <div className="text-4xl animate-heartbeat">🎁</div>
                <div>
                  <p className="font-bold text-gray-900"><GradientText>50% Off</GradientText></p>
                  <p className="text-sm text-gray-600">First Order</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="flex justify-center -mt-4 mb-8">
        <BouncingArrow direction="down" />
      </div>

      {/* Premium Features Section */}
      <div className="container mx-auto px-6 md:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <ScrollReveal delay={0} direction="up">
            <div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 h-full">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform animate-floating">⚡</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Lightning Fast</h3>
              <p className="text-gray-700 leading-relaxed">Get your food delivered in 30-45 minutes or less. We guarantee speed without compromising on quality.</p>
              <div className="mt-4 flex items-center text-blue-600 font-semibold cursor-pointer">
                Learn more
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Feature 2 */}
          <ScrollReveal delay={150} direction="up">
            <div className="group bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 h-full">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform animate-floating" style={{ animationDelay: '0.5s' }}>🌿</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Fresh & Quality</h3>
              <p className="text-gray-700 leading-relaxed">Every dish is prepared fresh daily with premium ingredients. Taste the difference in every bite.</p>
              <div className="mt-4 flex items-center text-green-600 font-semibold cursor-pointer">
              Learn more
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            </div>
          </ScrollReveal>

          {/* Feature 3 */}
          <ScrollReveal delay={300} direction="up">
            <div className="group bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl hover:shadow-xl transition-all transform hover:-translate-y-2 h-full">
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform animate-heartbeat">❤️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">100% Guaranteed</h3>
              <p className="text-gray-700 leading-relaxed">We stand behind our food with a satisfaction guarantee. Your happiness is our priority.</p>
              <div className="mt-4 flex items-center text-red-600 font-semibold cursor-pointer">
                Learn more
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Categories Showcase Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <ScrollReveal>
            <div className="mb-16 text-center">
              <p className="text-orange-500 text-lg font-semibold mb-2">✨ OUR SPECIALTIES</p>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                <GradientText>Explore Our Categories</GradientText>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                <TypeWriter 
                  texts={[
                    "From classic favorites to modern innovations",
                    "Fresh ingredients, bold flavors",
                    "Crafted with love, delivered fast",
                    "Find exactly what you're craving"
                  ]} 
                  speed={50}
                />
              </p>
            </div>
          </ScrollReveal>

          {/* Food Carousels - 7 Categories */}
          <div>
            {categories.map((category, index) => {
              const items = getItemsByCategory(category);
              if (items.length === 0) return null;

              const categoryEmojis = {
                'Pizza': '🍕',
                'Burger': '🍔',
                'Pasta': '🍝',
                'Salad': '🥗',
                'Dessert': '🍰',
                'Drinks': '🥤',
                'Appetizer': '🍤',
                'Main Course': '🍛'
              };

              return (
                <div key={category} className="mb-20">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-3xl md:text-4xl font-black text-gray-900">
                        <span className="text-4xl">{categoryEmojis[category]}</span>
                        {' '}{category}
                      </h3>
                      <div className="h-1 w-20 bg-orange-500 mt-3 rounded-full"></div>
                    </div>
                    <button
                      onClick={handleExploreMenu}
                      className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-lg group"
                    >
                      View All
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="relative">
                    <Slider {...carouselSettings}>
                      {items.map((item, itemIndex) => (
                        <div key={item._id} className="px-3">
                          <div
                            onClick={handleItemClick}
                            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-3 cursor-pointer overflow-hidden group"
                          >
                            {/* Image Container */}
                            <div className="relative h-56 overflow-hidden bg-gray-200">
                              <img
                                src={item.imageUrl || getDefaultImage(category, itemIndex)}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.src = getDefaultImage(category, itemIndex);
                                }}
                              />
                              {/* Price Badge */}
                              <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                                ₹{item.price.toFixed(0)}
                              </div>
                              {/* Veg Indicator */}
                              {item.isVegetarian && (
                                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                  🌱 Veg
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <h4 className="font-bold text-lg text-gray-900 mb-2 truncate group-hover:text-orange-600 transition-colors">
                                {item.name}
                              </h4>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
                                {item.description}
                              </p>
                              
                              {/* Rating and Time */}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1">
                                  {item.rating && (
                                    <>
                                      <span className="text-yellow-400">⭐</span>
                                      <span className="font-semibold text-gray-800">{item.rating}</span>
                                    </>
                                  )}
                                </div>
                                <span className="text-gray-500 text-sm">⏱️ 30-45 min</span>
                              </div>

                              {/* CTA Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick();
                                }}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105 shadow-md"
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6 md:px-8">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-lg font-semibold mb-2">💬 WHAT CUSTOMERS SAY</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Love from Our Customers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Food Lover',
                comment: 'The best food delivery service I\'ve ever used. Quality is top-notch and delivery is always on time!',
                rating: 5
              },
              {
                name: 'Mike Chen',
                role: 'Busy Professional',
                comment: 'Perfect for my busy schedule. Hot, fresh food delivered right to my office. Highly recommend!',
                rating: 5
              },
              {
                name: 'Emma Davis',
                role: 'Regular Customer',
                comment: 'Great variety of cuisines and amazing customer service. This is my go-to for all my meals.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Premium */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white py-24">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Hungry? Order Now! 🍽️
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto">
            Don't wait for hunger. Join thousands of satisfied customers enjoying delicious meals delivered to their doorstep.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleExploreMenu}
              className="bg-white text-orange-600 px-12 py-5 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              <span>🛒</span> Start Ordering
            </button>
            {!user && (
              <button
                onClick={() => navigate('/signup')}
                className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-xl font-bold text-lg hover:bg-white/10 transform hover:scale-105 transition-all"
              >
                Join Us Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-gray-300">Have questions? We're here to help!</p>
            </div>
            <div className="flex gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                📞 Contact Us
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition">
                ❓ Help Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Promotional Offers Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-white">
            {[
              { icon: '🎁', title: '50% Off', desc: 'First time users' },
              { icon: '🚀', title: 'Free Delivery', desc: 'Orders above ₹500' },
              { icon: '⚡', title: 'Express Delivery', desc: '20-30 min guaranteed' }
            ].map((offer, i) => (
              <div key={i} className="text-center group hover:scale-110 transition-transform">
                <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{offer.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                <p className="opacity-90">{offer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Deep Dive */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-lg font-semibold mb-2">✨ WHY CHOOSE US</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              We're Different
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Combining innovation with tradition to bring you the best food delivery experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Feature 1 */}
            <div className="flex gap-6">
              <div className="text-5xl flex-shrink-0">🎯</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Handpicked Selection</h3>
                <p className="text-gray-700 leading-relaxed">Every restaurant and dish is carefully curated to ensure you get the best quality. Our strict standards guarantee excellence.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Premium ingredients only
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Regular quality checks
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-6">
              <div className="text-5xl flex-shrink-0">🌍</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Real-time Tracking</h3>
                <p className="text-gray-700 leading-relaxed">Know exactly where your order is at every moment. Our advanced GPS tracking keeps you informed from preparation to delivery.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Live order updates
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Driver location tracking
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-6">
              <div className="text-5xl flex-shrink-0">💳</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Secure Payments</h3>
                <p className="text-gray-700 leading-relaxed">Your security is our priority. We use industry-leading encryption and support multiple payment methods for your convenience.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Bank-grade security
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Multiple payment options
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex gap-6">
              <div className="text-5xl flex-shrink-0">🏆</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Award-Winning Service</h3>
                <p className="text-gray-700 leading-relaxed">Recognized for excellence in customer service and food quality. We consistently maintain the highest standards in the industry.</p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> 24/7 customer support
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span> Money-back guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-6">Start Your Journey Today</h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers experiencing delicious food delivered right to your doorstep
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={handleExploreMenu}
              className="bg-white text-orange-600 px-12 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Order Now
            </button>
            {!user && (
              <button
                onClick={() => navigate('/signup')}
                className="border-2 border-white text-white px-12 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all transform hover:scale-105"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-orange-500 text-lg font-semibold mb-2">❓ COMMON QUESTIONS</p>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                q: 'How fast is the delivery?',
                a: 'We guarantee delivery within 30-45 minutes in most areas. Express delivery available in select locations.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit/debit cards, UPI, digital wallets, and cash on delivery for your convenience.'
              },
              {
                q: 'Is there a minimum order value?',
                a: 'Yes, minimum order is ₹300. Free delivery on orders above ₹500.'
              },
              {
                q: 'Can I cancel or modify my order?',
                a: 'Yes, you can cancel within 2 minutes of placing the order. After that, contact our support team.'
              }
            ].map((item, i) => (
              <details key={i} className="group border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-orange-500 transition">
                <summary className="flex justify-between items-center font-bold text-lg text-gray-900 group-open:text-orange-600">
                  {item.q}
                  <span className="text-2xl group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-gray-700 mt-4 pt-4 border-t border-gray-200">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

