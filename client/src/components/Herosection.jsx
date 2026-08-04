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
      <div className="w-full px-3 py-2">
        <div className="bg-gray-100 rounded-xl h-52 flex items-center justify-center">
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
      {/* Banner Slider - Rectangle Shape */}
      <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-xl aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6]">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation={false}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className="w-full h-full"
        >
          {fallbackBanners.map((banner, index) => (
            <SwiperSlide key={banner._id || index}>
              <div className="relative w-full h-full">
                <img
                  src={banner.image}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                
                {/* Content Overlay - Centered Vertically */}
                <div className="absolute inset-0 flex items-center px-5 sm:px-8 md:px-12 lg:px-20">
                  <div className="max-w-2xl w-full">
                    {/* PLAY GAMES - Mobile First */}
                    <h1 className="text-white font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1]">
                      PLAY GAMES
                    </h1>
                    
                    {/* WIN BIG - Golden Gradient */}
                    <h1 className="text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text font-black text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] mt-0">
                      WIN BIG
                    </h1>
                    
                    {/* Subtitle */}
                    <div className="mt-1.5 sm:mt-2 md:mt-3">
                      <p className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-medium">
                        Fast Results • 100% Secure
                      </p>
                      <p className="text-white text-[10px] sm:text-xs md:text-sm lg:text-base font-medium">
                        Join Thousands of Winners
                      </p>
                    </div>
                    
                    {/* PLAY NOW Button */}
                    <button className="mt-3 sm:mt-4 md:mt-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-4 sm:px-6 md:px-8 py-1.5 sm:py-2 md:py-3 rounded-full inline-flex items-center gap-1.5 sm:gap-2 hover:shadow-lg hover:shadow-yellow-500/30 transition-all text-[10px] sm:text-sm md:text-base active:scale-95">
                      PLAY NOW
                      <ArrowRight size={12} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Stats Section - Inline/Flex Layout */}
      <div className="mt-3 sm:mt-4 md:mt-5 flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 shadow-md border border-gray-100 text-center hover:shadow-lg transition-shadow flex-1 min-w-[80px] sm:min-w-[100px] md:min-w-[120px] max-w-[120px] sm:max-w-[150px] md:max-w-[180px] active:scale-95"
          >
            <p className="text-yellow-500 font-bold text-sm sm:text-base md:text-2xl lg:text-3xl">
              {stat.value}
            </p>
            <p className="text-gray-600 text-[8px] sm:text-xs md:text-sm font-medium mt-0.5 sm:mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Trust Indicators - Inline/Flex Layout */}


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
          bottom: 8px !important;
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
            bottom: 12px !important;
          }
        }

        @media (min-width: 768px) {
          .swiper-pagination {
            bottom: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}