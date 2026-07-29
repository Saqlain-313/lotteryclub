import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, Rocket } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
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
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  // Jackpot data for ticker
  const jackpotData = [
    { label: "LIVE JACKPOT", amount: "€15,200,000" },
    { label: "POWERBALL", amount: "$85,000,000" },
    { label: "EUROMILLIONS", amount: "€42,000,000" },
    { label: "MEGA MILLIONS", amount: "$92,000,000" },
    { label: "SUPER LOTTO", amount: "€28,500,000" },
  ];

  if (loading) {
    return (
      <section className="w-full px-4 py-2">
        <div className="border border-gray-300 rounded-xl overflow-hidden shadow-lg h-60 sm:h-80 md:h-[420px] lg:h-[500px] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading banners...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    console.error("Banner fetch error:", error);
  }

  return (
    <section className="w-full px-4 py-2">


      {/* Black Ticker Strip - Moves Right to Left */}
      <div className="mt-4 bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <div className="relative overflow-hidden py-3 md:py-4">
          <div className="animate-scroll-right-to-left flex whitespace-nowrap">
            {/* Double the items for seamless looping */}
            {[...jackpotData, ...jackpotData].map((item, index) => (
              <div key={index} className="flex items-center gap-6 md:gap-10 px-4 md:px-6">
                <span className="text-yellow-400 font-bold text-xs md:text-sm uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="text-white font-extrabold text-sm md:text-lg tracking-wider">
                  {item.amount}
                </span>
                <span className="text-gray-600 text-2xl font-light">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WINZOX Branded Content - "PLAY WIN REPEAT" below the banner */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left Content - Now takes 1 column */}
        <div className="lg:col-span-1">
          <h1
            className="font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4"
            style={goldenTextStyle}
          >
            PLAY
            <br />
            WIN
            <br />
            REPEAT
          </h1>
          <p className="text-gray-600 text-sm md:text-base mb-6 max-w-sm">
            Play global lottery games with instant payouts. Secure, transparent,
            and built for winners. Join over 2 million players worldwide today.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm">
              Play Now
              <Rocket size={16} />
            </button>
            <button className="bg-white text-yellow-600 border-2 border-yellow-400 hover:bg-yellow-50 font-bold px-6 py-2.5 rounded-full transition-all duration-300 text-sm">
              Explore
            </button>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/40?img=1"
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/40?img=2"
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/40?img=3"
                  alt="user"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-[10px] font-bold text-yellow-800">
                2M+
              </div>
            </div>
            <p className="text-xs font-medium text-gray-600">
              Active players right now
            </p>
          </div>
        </div>

        {/* Right Content - Banner takes 2 columns (wider) */}
        <div className="lg:col-span-2 border border-gray-300 rounded-xl overflow-hidden shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            loop
            className="w-full rounded-xl overflow-hidden"
          >
            {displayBanners.map((banner, index) => (
              <SwiperSlide key={banner._id || index}>
                <div className="relative h-60 sm:h-80 md:h-[420px] lg:h-[500px] w-full rounded-xl overflow-hidden">
                  <img
                    src={banner.image || banner.imageUrl}
                    alt={banner.heading || banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center">
                    <div className="px-6 md:px-10 lg:px-16 max-w-xl">
                      <p className="text-white font-semibold tracking-widest text-sm md:text-lg uppercase">
                        {banner.title || "PLAY NOW"}
                      </p>
                      <h1 className="text-yellow-400 font-extrabold mt-2 text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
                        {banner.heading || "WIN BIG"}
                      </h1>
                      <p className="text-gray-200 mt-4 text-sm md:text-lg">
                        Fast Results • 100% Secure
                      </p>
                      <p className="text-gray-300 text-sm md:text-lg">
                        Join Thousands of Winners
                      </p>
                      <button className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 border-2 border-yellow-500 hover:border-yellow-600 outline-none focus:outline-none focus:ring-0">
                        PLAY NOW
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

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
          bottom: 18px !important;
        }
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #9ca3af;
          opacity: 1;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          width: 24px;
          border-radius: 9999px;
          background: #facc15;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Right to Left Scroll Animation */
        @keyframes scrollRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-right-to-left {
          animation: scrollRightToLeft 20s linear infinite;
        }
        
        .animate-scroll-right-to-left:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}