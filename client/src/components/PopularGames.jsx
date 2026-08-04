import {
  ArrowRight,
  Crown,
  Flame,
  Gift,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const games = [
  {
    title: "WORLDWIDE",
    name: "MATKA",
    number: "5",
    image: "https://i.ibb.co/jPm1b0df/card-1.png",
    link: "/matka",
    prize: "25M",
    hot: true,
  },
  {
    title: "AUSTRALIAN",
    name: "POWERBALL",
    number: "8",
    image: "https://i.ibb.co/bRHBMCM9/card-2.png",
    link: "/powerhit",
    prize: "40M",
    hot: true,
  },
  {
    title: "INDIAN",
    name: "POWERBALL",
    number: "2",
    image: "https://i.ibb.co/B2CJ9CB0/card-3.png",
    link: "/powerhit",
    prize: "15M",
    hot: false,
  },
  {
    title: "NEPALI",
    name: "POWERBALL",
    number: "7",
    image: "https://i.ibb.co/Kx2qtpjk/card-4.png",
    link: "/powerhit",
    prize: "20M",
    hot: true,
  },
  {
    title: "UNITED STATES",
    name: "POWERBALL",
    number: "5",
    image: "https://i.ibb.co/jPm1b0df/card-1.png",
    link: "/powerhit",
    prize: "35M",
    hot: false,
  },
  {
    title: "UNITED KINGDOM",
    name: "LOTTO",
    number: "8",
    image: "https://i.ibb.co/bRHBMCM9/card-2.png",
    link: "/powerhit",
    prize: "18M",
    hot: false,
  },
  {
    title: "CANADA",
    name: "LOTTO MAX",
    number: "2",
    image: "https://i.ibb.co/B2CJ9CB0/card-3.png",
    link: "/powerhit",
    prize: "22M",
    hot: false,
  },
  {
    title: "JAPAN",
    name: "LOTO 7",
    number: "7",
    image: "https://i.ibb.co/Kx2qtpjk/card-4.png",
    link: "/powerhit",
    prize: "30M",
    hot: false,
  },
];

export default function PopularGames() {
  const [showAll, setShowAll] = useState(false);

  // Show first 4 cards initially, all 8 when showAll is true
  const displayGames = showAll ? games : games.slice(0, 4);
  const totalGames = games.length;

  return (
    <section className="py-6 md:py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-8xl mx-auto px-3 md:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between mb-6 md:mb-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>
              <div>
                <h2 className="text-2xl md:text-4xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Popular Games
                  </span>
                </h2>
                <p className="text-gray-500 text-xs md:text-sm font-medium flex items-center gap-1.5 mt-0.5">
                  <Sparkles size={14} className="text-yellow-500" />
                  Hand-picked lotteries for the best odds
                </p>
              </div>
            </div>
          </div>

          <button className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 hover:-translate-y-0.5">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Cards Grid - 4 columns on all devices */}
        <div className="grid grid-cols-4 gap-2 md:gap-5">
          {displayGames.map((game, index) => (
            <a
              key={index}
              href={game.link}
              className="group relative rounded-xl md:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white aspect-[3/4] md:aspect-[4/5]"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${game.image})` }}
              />

              {/* Overlay Layers */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

              {/* Border Glow on Hover */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-yellow-400/50 rounded-xl md:rounded-2xl transition-all duration-300" />

              {/* Top Section - Badges */}
              <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-20 flex items-start justify-between">
                {/* Left Side - Country Badge */}
                <div className="flex flex-col gap-1">
                  <div className="bg-black/60 backdrop-blur-md px-1.5 py-0.5 md:px-2.5 md:py-1 flex justify-center rounded-lg border border-white/10 shadow-lg">
                    <span className="text-white text-[6px] md:text-[10px] font-bold uppercase tracking-wider">
                      {game.title.split(" ")[0]}
                    </span>
                  </div>

                  {/* HOT Badge */}
                  {game.hot && (
                    <div className="inline-flex items-center gap-0.5 md:gap-1 w-fit bg-gradient-to-r from-red-500 to-orange-500 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full shadow-lg animate-pulse">
                      <Flame className="w-2 h-2 md:w-2.5 md:h-2.5 text-white fill-white" />
                      <span className="text-white text-[5px] md:text-[8px] font-bold uppercase tracking-wider">
                        Hot
                      </span>
                    </div>
                  )}
                </div>

                {/* Right Side - Number Badge */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-sm opacity-60"></div>
                  <div className="relative w-6 h-6 md:w-11 md:h-11 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-300">
                    <span className="text-black font-black text-[8px] md:text-base">
                      {game.number}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Section - Content */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-2 md:p-5">
                {/* Prize Badge */}
                <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 md:px-3 md:py-1 rounded-full border border-white/20 mb-1 md:mb-3 mx-auto w-fit">
                  <Gift className="w-2 h-2 md:w-3 md:h-3 text-yellow-400" />
                  <span className="text-white text-[5px] md:text-[10px] font-bold">
                    ${game.prize}
                  </span>
                </div>

                {/* Game Name */}
                <div className="text-center text-white mb-1 md:mb-3">
                  <h3 className="font-extrabold text-[10px] md:text-xl lg:text-2xl leading-tight drop-shadow-lg">
                    {game.name}
                  </h3>

                  {/* Live Indicator */}
                  <div className="flex items-center justify-center gap-1 mt-0.5 md:mt-1">
                    <span className="relative flex h-1 w-1 md:h-1.5 md:w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1 w-1 md:h-1.5 md:w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[5px] md:text-[8px] text-green-400 font-semibold uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                </div>

                {/* Play Button */}
                <button className="w-full inline-flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-500 hover:via-amber-500 hover:to-yellow-600 text-black font-bold rounded-lg md:rounded-xl px-1.5 py-1 md:px-4 md:py-2.5 text-[6px] md:text-xs lg:text-sm transition-all duration-300 shadow-lg hover:shadow-xl border border-yellow-300/50 group-hover:scale-105">
                  <span>PLAY</span>
                  <ArrowRight className="w-2 h-2 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </a>
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="mt-6 md:mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`group inline-flex items-center gap-2 px-6 md:px-10 py-2.5 md:py-3.5 rounded-full font-bold text-sm md:text-base transition-all duration-300 shadow-md ${
              showAll
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg"
                : "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-0.5"
            }`}
          >
            {showAll ? (
              <>
                <span>Show Less</span>
                <ArrowRight className="w-4 h-4 rotate-90 group-hover:rotate-180 transition-transform duration-300" />
              </>
            ) : (
              <>
                <span>Show More</span>
                <span className="bg-black/10 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  +{totalGames - 4}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Bottom Trust Indicator */}
        <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 pt-4 border-t border-gray-200/50">
          {[
            { icon: Crown, text: "Premium Games" },
            { icon: Gift, text: "Big Jackpots" },
            { icon: TrendingUp, text: "High Odds" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 text-gray-500"
            >
              <item.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" />
              <span className="text-[9px] md:text-xs font-medium">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </section>
  );
}
