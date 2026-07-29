import {
  Wallet,
  Users,
  Trophy,
  Coins,
  Info,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

const CommissionCard = ({ title, subtitle, percent, color, icon }) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Gradient Accent Line */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${color}`} />

      <div className="flex items-center justify-between p-4 sm:p-5">
        {/* Left Section */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div
            className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-gradient-to-br ${color} text-white flex items-center justify-center shadow-md shrink-0`}
          >
            <div className="scale-90 sm:scale-100">{icon}</div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <span className="inline-block text-[10px] sm:text-xs font-semibold bg-gray-100 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 text-gray-500 whitespace-nowrap">
              {title}
            </span>

            <h3 className="mt-1 text-sm sm:text-base font-bold text-gray-900 truncate">
              {subtitle}
            </h3>

            <p className="text-xs text-gray-400 truncate hidden sm:block">
              Earn commission every successful referral.
            </p>
          </div>
        </div>

        {/* Right Section - Percentage */}
        <div className="text-center ml-3 sm:ml-4 shrink-0">
          <h1
            className={`text-3xl sm:text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent leading-none`}
          >
            {percent}
          </h1>

          <p className="text-[10px] sm:text-xs text-gray-400 font-medium mt-0.5">
            Commission
          </p>
        </div>
      </div>
    </div>
  );
};

const HowToEarn = () => {
  return (
    <div className="mt-6 sm:mt-8">
      {/* Heading */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          How to Earn
        </h2>

        <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-500">
          Invite your friends and earn exciting commissions whenever they
          recharge or place bets.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
        <CommissionCard
          title="Level 1"
          subtitle="Direct Referral Recharge"
          percent="20%"
          color="from-yellow-400 to-orange-500"
          icon={<Wallet size={20} />}
        />

        <CommissionCard
          title="Level 2"
          subtitle="Second Level Recharge"
          percent="3%"
          color="from-sky-400 to-cyan-500"
          icon={<Users size={20} />}
        />

        <CommissionCard
          title="Level 3"
          subtitle="Third Level Recharge"
          percent="2%"
          color="from-violet-500 to-fuchsia-500"
          icon={<Coins size={20} />}
        />

        <CommissionCard
          title="Bet Bonus"
          subtitle="Commission on Betting"
          percent="1%"
          color="from-emerald-400 to-green-500"
          icon={<Trophy size={20} />}
        />
      </div>

      {/* Notes Section */}
      <div className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl border border-amber-200/70 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <Info size={18} className="text-amber-600 sm:size-[22]" />
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-bold text-amber-700">
              Important Notes
            </h3>
            <p className="text-xs sm:text-sm text-amber-600">
              Read the referral policy carefully.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
          {[
            "Only valid users are counted.",
            "Bonus is credited automatically.",
            "Commission updates in real-time.",
            "No limit on referrals.",
            "Invite more friends to earn more.",
            "Fraudulent accounts are not eligible.",
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 rounded-xl border border-gray-200/80 bg-white/80 p-3 sm:p-4 hover:border-amber-200 transition-colors"
            >
              <CheckCircle
                size={16}
                className="text-green-500 mt-0.5 flex-shrink-0 sm:size-[18]"
              />

              <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowToEarn;