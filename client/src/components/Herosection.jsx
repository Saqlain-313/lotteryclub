import { ArrowRight, Clock, Rocket, Shield, Star, Trophy } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getBanners } from "../redux/slices/bannerSlice";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const fallbackBanners = [
  {
    _id: "1",
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "2",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80",
  },
  {
    _id: "3",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HeroSection() {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const displayBanners = banners?.length > 0 ? banners : fallbackBanners;

  const stats = [
    { value: "25,000+", label: "Players" },
    { value: "15Cr+", label: "Total Paid" },
    { value: "100+", label: "Games" },
    { value: "99.9%", label: "Uptime" },
  ];

  if (loading) {
    return (
      <div className="w-full px-4 py-2">
        <div className="bg-gray-100 rounded-2xl h-72 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-yellow-500 border-t-transparent mx-auto"></div>
            <p className="mt-3 text-gray-600 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-3 py-3 md:px-4 md:py-4">
      {/* Banner Slider with Content Overlay */}
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={false}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="w-full"
        >
          {fallbackBanners.map((banner, index) => (
            <SwiperSlide key={banner._id || index}>
              <div className="relative h-[400px] sm:h-[450px] md:h-[500px] lg:h-[600px] w-full">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                
                {/* Content Overlay - Mobile Optimized */}
                <div className="absolute inset-0 flex items-center px-5 sm:px-8 md:px-12 lg:px-20">
                  <div className="max-w-2xl w-full">
                    {/* PLAY GAMES - Mobile First */}
                    <h1 className="text-white font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
                      PLAY GAMES
                    </h1>
                    
                    {/* WIN BIG - Golden Gradient */}
                    <h1 className="text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mt-0">
                      WIN BIG
                    </h1>
                    
                    {/* Subtitle - Mobile Optimized */}
                    <div className="mt-2 sm:mt-3">
                      <p className="text-white text-xs sm:text-sm md:text-base font-medium">
                        Fast Results • 100% Secure
                      </p>
                      <p className="text-white text-xs sm:text-sm md:text-base font-medium">
                        Join Thousands of Winners
                      </p>
                    </div>
                    
                    {/* PLAY NOW Button */}
                    <button className="mt-4 sm:mt-5 md:mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-full inline-flex items-center gap-2 hover:shadow-lg hover:shadow-yellow-500/30 transition-all text-sm sm:text-base active:scale-95">
                      PLAY NOW
                      <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stats Section - Mobile Grid 2x2 */}
      <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow active:scale-95"
          >
            <p className="text-yellow-500 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              {stat.value}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium mt-0.5 sm:mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Trust Indicators - Mobile First */}
      <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
        {[
          { icon: Shield, label: "SSL Encrypted", sub: "Secure Transactions" },
          { icon: Clock, label: "Instant Withdrawals", sub: "Within Minutes" },
          { icon: Trophy, label: "24/7 Support", sub: "Live Chat Available" },
          { icon: Star, label: "4.9/5 Rating", sub: "Trusted Platform" },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-2.5 sm:p-3 md:p-4 shadow-md border border-gray-100 flex items-center gap-2.5 sm:gap-3 hover:shadow-lg transition-shadow active:scale-95"
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-gray-800 text-[10px] sm:text-xs font-bold leading-tight">
                {item.label}
              </p>
              <p className="text-gray-500 text-[8px] sm:text-[10px] leading-tight">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        /* Swiper Pagination - Mobile Optimized */
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          width: 6px !important;
          height: 6px !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #facc15 !important;
          width: 18px !important;
          border-radius: 9999px !important;
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        
        .swiper-pagination {
          bottom: 12px !important;
        }

        /* Touch Feedback */
        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        /* Better Text Rendering */
        h1 {
          text-rendering: optimizeLegibility;
        }

        /* Responsive Breakpoint Adjustments */
        @media (min-width: 640px) {
          .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
          }
          
          .swiper-pagination-bullet-active {
            width: 24px !important;
          }
          
          .swiper-pagination {
            bottom: 16px !important;
          }
        }

        @media (min-width: 768px) {
          .swiper-pagination {
            bottom: 20px !important;
          }
        }
      `}</style>
    </section>
  );
}