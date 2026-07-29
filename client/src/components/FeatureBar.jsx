import {
  Zap,
  ShieldCheck,
  Wallet,
  Headphones,
  Scale,
  Sparkles,
} from "lucide-react";

const features = [
  {
    title: "Fast Results",
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    description: "Real-time updates",
  },
  {
    title: "Secure & Safe",
    icon: ShieldCheck,
    color: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Military-grade encryption",
  },
  {
    title: "Instant Payouts",
    icon: Wallet,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "No delays, no fees",
  },
  {
    title: "24x7 Support",
    icon: Headphones,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Always here to help",
  },
  {
    title: "Fair Play",
    icon: Scale,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Transparent & trusted",
  },
];

export default function FeatureBar() {
  const goldenTextStyle = {
    background: "linear-gradient(135deg, #7b5800 0%, #fdba12 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <section className="bg-surface px-3 md:px-6 py-6 md:py-8">
      {/* Heading - WINZOX Style */}
      <div className="flex flex-wrap items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-2 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={20} />
            </div>
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight" style={goldenTextStyle}>
              Why Choose WINZOX
            </h2>
            <p className="text-gray-500 text-xs font-medium">Built for winners, trusted by millions</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Features Cards - WINZOX Glass Style */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {features.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`group relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${item.bgColor}/50 to-transparent pointer-events-none`}></div>
              
              {/* Icon with gradient background */}
              <div className={`relative z-10 w-12 h-12 md:w-14 md:h-14 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`${item.color} w-6 h-6 md:w-7 md:h-7`} strokeWidth={2.4} />
              </div>

              {/* Title */}
              <div className="relative z-10">
                <h3 className={`text-sm md:text-base font-extrabold tracking-tight text-gray-900 group-hover:${item.color} transition-colors duration-300`}>
                  {item.title}
                </h3>
                <p className="text-gray-400 text-[10px] md:text-xs font-medium mt-0.5">
                  {item.description}
                </p>
              </div>

              {/* Decorative progress bar */}
              <div className="relative z-10 mt-3 md:mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color.replace('text', 'bg')} opacity-50 group-hover:opacity-100`}
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                ></div>
              </div>

              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-16 h-16 rounded-full ${item.bgColor}/20 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500 pointer-events-none`}></div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats - Additional Info */}


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