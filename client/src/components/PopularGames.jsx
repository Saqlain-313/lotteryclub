import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

const games = [
  {
    title: "WORLDWIDE",
    name: "MATKA",
    number: "5",
    image: "https://i.ibb.co/jPm1b0df/card-1.png",
  },
  {
    title: "AUSTRALIAN",
    name: "POWERBALL",
    number: "8",
    image: "https://i.ibb.co/bRHBMCM9/card-2.png",
  },
  {
    title: "INDIAN",
    name: "POWERBALL",
    number: "2",
    image: "https://i.ibb.co/B2CJ9CB0/card-3.png",
  },
  {
    title: "NEPALI",
    name: "POWERBALL",
    number: "7",
    image: "https://i.ibb.co/Kx2qtpjk/card-4.png",
  },
  {
    title: "UNITED STATES",
    name: "POWERBALL",
    number: "5",
    image: "https://i.ibb.co/jPm1b0df/card-1.png",
  },
  {
    title: "UNITED KINGDOM",
    name: "LOTTO",
    number: "8",
    image: "https://i.ibb.co/bRHBMCM9/card-2.png",
  },
  {
    title: "CANADA",
    name: "LOTTO MAX",
    number: "2",
    image: "https://i.ibb.co/B2CJ9CB0/card-3.png",
  },
  {
    title: "JAPAN",
    name: "LOTO 7",
    number: "7",
    image: "https://i.ibb.co/Kx2qtpjk/card-4.png",
  },
];

export default function PopularGames() {
  const [showAll, setShowAll] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getDisplayCount = () => {
    if (isDesktop) {
      return showAll ? games.length : 8;
    } else {
      return showAll ? games.length : 4;
    }
  };

  const displayGames = games.slice(0, getDisplayCount());
  const totalGames = games.length;
  const shouldShowButton = (isDesktop && totalGames > 8) || (!isDesktop && totalGames > 6);

  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <section className="bg-surface py-6 md:py-12">
      <div className="max-w-8xl mx-auto px-3">
        {/* Header - WINZOX Style */}
        <div className="flex flex-wrap items-center justify-between mb-4 md:mb-8">
          <div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tight" style={goldenTextStyle}>
              Popular Games
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium mt-0.5 flex items-center gap-1">
              <Sparkles size={14} className="text-yellow-500" />
              Hand-picked lotteries for the best odds
            </p>
          </div>
          <button className="text-yellow-600 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm md:text-base group border-2 border-yellow-400 px-4 py-2 rounded-full hover:bg-yellow-500 hover:text-white hover:border-yellow-500">
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cards - WINZOX Glass Style */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-4">
          {displayGames.map((game, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden border border-white/40 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2 bg-white/60 backdrop-blur-sm"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${game.image})` }}
              />

              {/* Dark overlay for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />

              {/* Number Badge - Golden Style */}
              <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 w-5 h-5 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-base shadow-lg border-2 border-yellow-300">
                  {game.number}
                </div>
              </div>

              {/* Country Badge */}
              <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20">
                <div className="bg-white/90 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-lg flex items-center gap-1 md:gap-2 shadow-lg">
                  <span className="text-[8px] md:text-xs font-bold text-gray-700 uppercase">
                    {game.title.split(" ")[0]}
                  </span>
                </div>
              </div>

              {/* HOT Badge for specific games */}
              {[0, 1, 3].includes(index) && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 md:hidden">
                  <span className="bg-red-500 text-white text-[6px] md:text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                    HOT
                  </span>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-end p-3 md:p-6 min-h-[140px] md:min-h-[280px]">
                {/* Text at bottom */}
                <div className="text-center text-white mb-2 md:mb-4">
                  <p className="text-[6px] md:text-[10px] uppercase tracking-[0.15em] text-white/70 font-semibold">
                    {game.title}
                  </p>
                  <h3 className="font-extrabold text-sm md:text-2xl leading-4 md:leading-8 drop-shadow-lg">
                    {game.name}
                  </h3>
                  <p className="text-[8px] md:text-sm font-bold text-yellow-300 mt-0.5 md:mt-1">
                    Jackpot: ${(Math.random() * 50 + 10).toFixed(0)}M+
                  </p>
                </div>

                {/* Button - Golden Gradient */}
                <button className="inline-flex items-center gap-1 md:gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-lg px-2 py-1 md:px-6 md:py-2.5 text-[7px] md:text-sm transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-300 hover:border-yellow-400 whitespace-nowrap">
                  PLAY NOW
                  <ArrowRight className="w-2 h-2 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button - WINZOX Style */}
        {shouldShowButton && (
          <div className="mt-4 md:mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className={`inline-flex items-center gap-2 px-4 md:px-8 py-2 md:py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-md ${
                showAll 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl'
              }`}
            >
              {showAll ? (
                <>
                  Show Less
                  <ArrowRight className="w-4 h-4 rotate-90" />
                </>
              ) : (
                <>
                  Show More ({totalGames - getDisplayCount()} more)
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style>{`
        .bg-surface {
          background-color: #f7f9fb;
        }
        button:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}