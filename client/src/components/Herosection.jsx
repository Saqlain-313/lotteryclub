import {
  ArrowRight,
  Award,
  Clock,
  Coins,
  Crown,
  Gem,
  Rocket,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
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
    image:
      "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1600&q=80",
    title: "PLAY GAMES",
    heading: "WIN BIG",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80",
    title: "LOTTERY",
    heading: "PLAY NOW",
  },
  {
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=80",
    title: "GET READY",
    heading: "JACKPOT",
  },
];

export default function HeroSection() {
  const dispatch = useDispatch();
  const { banners, loading, error } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const displayBanners = banners?.length > 0 ? banners : fallbackBanners;

  const goldenTextStyle = {
    background:
      "linear-gradient(135deg, #7b5800 0%, #fdba12 50%, #f59e0b 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  // Jackpot data for ticker
  const jackpotData = [
    { label: "LIVE JACKPOT", amount: "€15,200,000", icon: Zap },
    { label: "POWERBALL", amount: "$85,000,000", icon: Award },
    { label: "EUROMILLIONS", amount: "€42,000,000", icon: Crown },
    { label: "MEGA MILLIONS", amount: "$92,000,000", icon: Sparkles },
    { label: "SUPER LOTTO", amount: "€28,500,000", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <section className="w-full px-4 py-2">
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xl shadow-gray-100/50 h-60 sm:h-80 md:h-[420px] lg:h-[500px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading premium banners...
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Banner fetch error:", error);
  }

  return (
    <section className="w-full px-4 py-2 space-y-5">
      {/* Premium Jackpot Ticker - Enhanced */}
      <div className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-black/10 border border-gray-800 -mx-2">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]"></div>
        <div className="relative overflow-hidden py-3 md:py-4">
          <div className="animate-scroll-right-to-left flex whitespace-nowrap">
            {[...jackpotData, ...jackpotData].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 md:gap-6 px-4 md:px-8"
              >
                <item.icon className="text-yellow-400 w-4 h-4 md:w-5 md:h-5" />
                <span className="text-yellow-400 font-bold text-[11px] md:text-sm uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-white font-extrabold text-sm md:text-lg tracking-wider bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  {item.amount}
                </span>
                <span className="text-gray-700 text-2xl font-light">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Hero - Simple 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* Left Content */}
        <div className="bg-gradient-to-br from-white to-gray-50/80 rounded-2xl p-6 md:p-8 shadow-2xl shadow-gray-100/50 border border-gray-100/80 backdrop-blur-sm flex flex-col justify-center relative overflow-hidden w-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/5 rounded-full blur-2xl"></div>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-amber-50 px-3 py-1.5 rounded-full w-fit mb-4 border border-yellow-200/50 shadow-sm">
            <Sparkles className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700 uppercase tracking-wider">
              🌟 Premium Platform
            </span>
          </div>

          {/* Heading - Desktop 2 lines */}
          <h1
            className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 lg:mb-6"
            style={goldenTextStyle}
          >
            <span className="block lg:inline">DREAM BIG,</span>{" "}
            <br className="hidden md:block" />
            <span className="block lg:inline lg:ml-3">WIN BIGGER</span>
          </h1>

          <p className="text-gray-600 text-sm md:text-base lg:text-lg mb-6 max-w-lg leading-relaxed">
            Experience the thrill of global lotteries with{" "}
            <span className="text-yellow-600 font-semibold">
              instant payouts
            </span>
            . Secure, transparent, and built for champions.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <button className="relative group bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:shadow-2xl hover:shadow-yellow-500/30 text-white font-bold px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 text-sm shadow-lg shadow-yellow-400/20">
              <span>Play Now</span>
              <Rocket
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <button className="relative bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-400 hover:text-yellow-600 font-bold px-6 lg:px-8 py-2.5 lg:py-3.5 rounded-full transition-all duration-300 text-sm hover:shadow-lg hover:-translate-y-0.5">
              Explore
            </button>
          </div>

          {/* Live Stats */}
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-white bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden shadow-md"
                >
                  <img
                    src={`https://i.pravatar.cc/40?img=${i}`}
                    alt="user"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-2 border-white flex items-center justify-center text-[8px] lg:text-[10px] font-bold text-white shadow-md">
                2M+
              </div>
            </div>
            <div>
              <p className="text-[10px] lg:text-xs font-semibold text-gray-700">
                Live Players
              </p>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2 lg:h-2.5 lg:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 lg:h-2.5 lg:w-2.5 bg-green-500"></span>
                </span>
                <span className="text-[10px] lg:text-xs font-medium text-green-600">
                  12.4K online
                </span>
              </div>
            </div>
            <div className="h-6 lg:h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-[10px] lg:text-xs font-semibold text-gray-700">
                Today's Winners
              </p>
              <p className="text-xs lg:text-sm font-bold text-yellow-600">
                847
              </p>
            </div>
          </div>
        </div>

        {/* Right Content - Banner Slider */}
        <div className="rounded-2xl max-w-full overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100/50 bg-white relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            loop
            className="w-full h-full"
          >
            {displayBanners.map((banner, index) => (
              <SwiperSlide key={banner._id || index}>
                <div className="relative h-60 sm:h-80 md:h-[420px] lg:h-[500px] w-full">
                  <img
                    src={banner.image || banner.imageUrl}
                    alt={banner.heading || banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 md:px-8 lg:px-10 max-w-xl">
                      {/* Premium Chip */}
                      <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-yellow-400/30 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                        <span className="text-yellow-400 font-bold tracking-widest text-[10px] md:text-xs uppercase">
                          {banner.title || "LIVE NOW"}
                        </span>
                      </div>

                      <h1 className="text-white font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                        {banner.heading || "WIN BIG"}
                      </h1>

                      {/* Subtitle with Gradient */}
                      <p className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text font-bold text-base sm:text-lg md:text-xl mt-1">
                        {banner.subtitle || "Jackpot"}
                      </p>

                      {/* Quick Info Chips */}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5">
                          <Trophy className="w-3 h-3 md:w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 text-[10px] md:text-xs">
                            Fast Results
                          </span>
                        </div>
                        <div className="w-px h-3 bg-gray-600"></div>
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3 h-3 md:w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 text-[10px] md:text-xs">
                            100% Secure
                          </span>
                        </div>
                        <div className="w-px h-3 bg-gray-600 hidden sm:block"></div>
                        <div className="hidden sm:flex items-center gap-1.5">
                          <Users className="w-3 h-3 md:w-4 h-4 text-yellow-400" />
                          <span className="text-gray-300 text-[10px] md:text-xs">
                            2M+ Players
                          </span>
                        </div>
                      </div>

                      <button className="mt-3 md:mt-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:shadow-2xl hover:shadow-yellow-500/30 text-black font-bold px-5 md:px-6 py-2 md:py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-0.5 text-xs md:text-sm shadow-lg shadow-yellow-400/20">
                        PLAY NOW
                        <ArrowRight
                          size={14}
                          className="md:w-[16px] md:h-[16px] group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 md:p-4">
                    <div className="flex items-center justify-between flex-wrap gap-1 md:gap-3">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400" />
                          <span className="text-[8px] md:text-[10px] text-gray-300">
                            Min: €10
                          </span>
                        </div>
                        <div className="w-px h-3 bg-gray-600"></div>
                        <div className="flex items-center gap-1">
                          <Gem className="w-2.5 h-2.5 md:w-3 md:h-3 text-yellow-400" />
                          <span className="text-[8px] md:text-[10px] text-gray-300">
                            €15M+
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-400/10 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border border-yellow-400/20">
                        <Star className="w-2 h-2 md:w-3 md:h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[7px] md:text-[9px] text-yellow-400 font-bold">
                          Trusted
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-2">
        {[
          { icon: Shield, label: "SSL Encrypted", sub: "Secure Transactions" },
          { icon: Clock, label: "Instant Withdrawals", sub: "Within Minutes" },
          { icon: Trophy, label: "24/7 Support", sub: "Live Chat Available" },
          { icon: Star, label: "4.9/5 Rating", sub: "Trusted Platform" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl p-3 md:p-4 shadow-lg shadow-gray-100/50 border border-gray-100/80 flex items-center gap-2 md:gap-3 hover:shadow-xl transition-shadow duration-300"
          >
            <item.icon className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 flex-shrink-0" />
            <div>
              <p className="text-[10px] md:text-xs font-bold text-gray-800">
                {item.label}
              </p>
              <p className="text-[8px] md:text-[10px] text-gray-500">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        button,
        button:focus,
        button:focus-visible,
        button:active {
          outline: none !important;
          box-shadow: none !important;
        }
        
        .swiper-button-prev,
        .swiper-button-next {
          display: none !important;
        }
        
        .swiper-pagination {
          bottom: 65px !important;
        }
        
        .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(4px);
        }
        
        .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 9999px;
          background: linear-gradient(135deg, #facc15, #f59e0b);
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.4);
        }
        
        .swiper-pagination-bullet:hover {
          transform: scale(1.2);
        }
        
        @keyframes scrollRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-right-to-left {
          animation: scrollRightToLeft 25s linear infinite;
        }
        
        .animate-scroll-right-to-left:hover {
          animation-play-state: paused;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Mobile Responsive */
        @media (max-width: 640px) {
          .swiper-pagination {
            bottom: 55px !important;
          }
          .swiper-pagination-bullet {
            width: 5px;
            height: 5px;
          }
          .swiper-pagination-bullet-active {
            width: 16px;
          }
        }

        @media (min-width: 1024px) {
          .swiper-pagination {
            bottom: 65px !important;
          }
        }
      `}</style>
    </section>
  );
}
