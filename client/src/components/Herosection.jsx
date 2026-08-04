import {
  ArrowRight,
  Clock,
  DollarSign,
  Gamepad2,
  Rocket,
  Shield,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
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
    {
      value: "25,000+",
      label: "Players",
      icon: Users,
      color: "text-blue-500",
    },
    {
      value: "15Cr+",
      label: "Total Paid",
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      value: "100+",
      label: "Games",
      icon: Gamepad2,
      color: "text-purple-500",
    },
    {
      value: "99.9%",
      label: "Uptime",
      icon: Zap,
      color: "text-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="w-full px-3 py-2">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl h-52 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading awesome games...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full px-3 py-3 md:px-4 md:py-4 bg-gradient-to-b from-gray-50 to-white">
      {/* Banner Slider */}
      <div className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7] lg:aspect-[16/6]">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />

                {/* Animated Glow Effect */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-yellow-500/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center px-5 sm:px-8 md:px-12 lg:px-20">
                  <div className="max-w-3xl w-full space-y-3 sm:space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                      <span className="text-white text-[10px] sm:text-xs font-medium">
                        Live Now • 2,341 Online
                      </span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-white font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1]">
                      PLAY GAMES
                    </h1>

                    {/* Golden Gradient Heading */}
                    <h1 className="text-transparent bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1.1] animate-gradient">
                      WIN BIG
                    </h1>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        { icon: Shield, text: "100% Secure" },
                        { icon: Clock, text: "Instant Results" },
                        { icon: Trophy, text: "Real Money" },
                      ].map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
                        >
                          <feature.icon size={14} className="text-yellow-400" />
                          <span className="text-white text-[10px] sm:text-xs font-medium">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className="group mt-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-black font-bold px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 rounded-full inline-flex items-center gap-2 hover:shadow-2xl hover:shadow-yellow-500/40 transition-all duration-300 text-xs sm:text-sm md:text-base active:scale-95">
                      <span className="flex items-center gap-2">
                        PLAY NOW
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Enhanced Stats Section - Compact Single Line */}
      <div className="mt-4 md:mt-6 flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="group bg-white rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 flex items-center gap-2 sm:gap-2.5 md:gap-3 flex-1 min-w-[70px] sm:min-w-[90px] md:min-w-[100px] max-w-[100px] sm:max-w-[130px] md:max-w-[160px] hover:-translate-y-0.5"
            >
              {/* Icon with Circle Background */}
              <div
                className={`p-1.5 sm:p-2 rounded-lg bg-gray-50 group-hover:bg-opacity-20 transition-colors duration-300 ${stat.color}`}
              >
                <Icon size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </div>

              {/* Content */}
              <div className="flex flex-col leading-tight">
                <span
                  className={`font-extrabold text-sm sm:text-base md:text-lg lg:text-xl ${stat.color}`}
                >
                  {stat.value}
                </span>
                <span className="text-gray-500 text-[8px] sm:text-[10px] md:text-xs font-medium">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Indicators - Compact */}
      <div className="mt-4 md:mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
        {[
          { icon: Shield, text: "SSL Secured", color: "text-emerald-500" },
          { icon: Star, text: "4.9/5 Rating", color: "text-yellow-500" },
          {
            icon: Rocket,
            text: "Instant Withdrawals",
            color: "text-purple-500",
          },
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <item.icon size={14} className={`${item.color} sm:w-4 sm:h-4`} />
            <span className="text-gray-600 text-[9px] sm:text-xs font-medium">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        /* Swiper Pagination */
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4) !important;
          width: 8px !important;
          height: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .swiper-pagination-bullet-active {
          background: #facc15 !important;
          width: 24px !important;
          border-radius: 9999px !important;
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.5);
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        
        .swiper-pagination {
          bottom: 12px !important;
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }

        @media (min-width: 640px) {
          .swiper-pagination-bullet {
            width: 10px !important;
            height: 10px !important;
          }
          
          .swiper-pagination-bullet-active {
            width: 28px !important;
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
