import { Gift, Sparkles, Coins, CheckCircle } from "lucide-react";

const PromoBanner = () => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      
      {/* Background Decorative Elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="relative flex items-center justify-between p-6 md:p-8">
        {/* Left Content */}
        <div className="space-y-3 flex-1">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/30 backdrop-blur-sm px-4 py-1.5 text-white text-xs font-bold uppercase tracking-wider border border-white/20">
            <Sparkles size={14} className="text-yellow-200" />
            Referral Program
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Earn Big <span className="text-yellow-200">Rewards</span>
          </h2>
          
          {/* Description */}
          <p className="text-sm md:text-base text-white/90 max-w-xs">
            Invite your friends and earn exciting rewards on every successful referral.
          </p>
          
          {/* Features */}
          <div className="flex items-center gap-4 pt-1">
            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold">
              <CheckCircle size={14} className="text-yellow-200" />
              Instant Credit
            </span>
            <span className="flex items-center gap-1 text-white/80 text-xs font-semibold">
              <CheckCircle size={14} className="text-yellow-200" />
              No Limits
            </span>
          </div>
        </div>

        {/* Right - Gift Icon with Animation */}
        <div className="relative flex-shrink-0 ml-4">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 animate-float">
            <Gift size={60} className="text-white md:w-16 md:h-16" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-200/40 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 animate-pulse">
            <Coins size={20} className="text-amber-800" />
          </div>
        </div>
      </div>

      {/* Bottom Shimmer Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer"></div>
    </div>
  );
};

export default PromoBanner;

