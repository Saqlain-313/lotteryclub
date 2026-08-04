import React from "react";
import {
  Globe, MapPin, CheckCircle
} from "lucide-react";

const countries = [
  { name: "India", flag: "https://flagcdn.com/w80/in.png", code: "IN" },
  { name: "Australia", flag: "https://flagcdn.com/w80/au.png", code: "AU" },
  { name: "Pakistan", flag: "https://flagcdn.com/w80/pk.png", code: "PK" },
  { name: "Bangladesh", flag: "https://flagcdn.com/w80/bd.png", code: "BD" },
  { name: "Nepal", flag: "https://flagcdn.com/w80/np.png", code: "NP" },
  { name: "Dubai (UAE)", flag: "https://flagcdn.com/w80/ae.png", code: "AE" },
];

const CountriesAndDailyClaim = () => {
  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <section className="bg-surface px-3 md:px-6 py-6 md:py-10">
      <div className="w-full max-w-3xl mx-auto">
        {/* Participating Countries - WINZOX Style */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 md:p-6 shadow-lg">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg">
                <Globe className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tight" style={goldenTextStyle}>
                Participating Countries
              </h3>
              <p className="text-gray-500 text-xs font-medium">Global lottery access</p>
            </div>
          </div>

          {/* Countries Row - Single Line with Scroll on Mobile - Scrollbar Hidden */}
          <div className="flex gap-4 md:gap-6 justify-center items-center overflow-x-auto pb-2 px-1 scrollbar-hide">
            {countries.map((country) => (
              <div
                key={country.code}
                className="group flex flex-col items-center gap-1.5 cursor-pointer transition-all duration-300 hover:scale-110 flex-shrink-0"
                title={country.name}
              >
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-yellow-400/0 group-hover:bg-yellow-400/20 transition-all duration-300 blur-md"></div>
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    loading="lazy"
                    className="relative w-10 h-10 md:w-16 md:h-16 rounded-full border-2 border-gray-200 group-hover:border-yellow-400 object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                    {country.code}
                  </div>
                </div>
                <span className="text-[10px] md:text-xs font-medium text-gray-600 group-hover:text-yellow-600 transition-colors duration-300 text-center whitespace-nowrap">
                  {country.name}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Stats */}
          <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200/50 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <MapPin className="text-yellow-500" size={14} />
              <span className="text-xs text-gray-500 font-medium">
                {countries.length} Countries Supported
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-200">
              <CheckCircle className="text-green-500" size={12} />
              <span className="text-[10px] font-bold text-green-600">Active</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .bg-surface {
          background-color: #f7f9fb;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default CountriesAndDailyClaim;