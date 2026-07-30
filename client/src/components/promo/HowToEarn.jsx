import {
  ChevronRight,
  Coins,
  Sparkles,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

const icons = {
  wallet: Wallet,
  users: Users,
  coins: Coins,
  trophy: Trophy,
};

const CommissionCard = ({ title, subtitle, percent, color, icon }) => {
  const Icon = icons[icon] || Wallet;

  return (
    <div
      className="
      group
      relative
      overflow-hidden
      rounded-[30px]
      border
      border-gray-200/70
      bg-white
      shadow-lg
      transition-all
      duration-500
      hover:-translate-y-1.5
      hover:shadow-2xl
      "
    >
      {/* Glow */}

      <div
        className={`absolute -right-14 -top-14 h-40 w-40 rounded-full bg-gradient-to-br ${color} opacity-10 blur-3xl`}
      />

      {/* Shine */}

      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-1000 group-hover:translate-x-full" />

      {/* Top Banner */}

      <div
        className={`relative bg-gradient-to-r ${color} px-5 py-5 text-white`}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
              {title}
            </span>

            <h3 className="mt-3 text-lg font-bold leading-snug">{subtitle}</h3>
          </div>

          <div className="text-right">
            <h2 className="text-5xl font-black leading-none tracking-tight">
              {percent}
            </h2>

            <p className="mt-1 text-[10px] uppercase tracking-[3px] text-white/80">
              Commission
            </p>
          </div>
        </div>
      </div>

      {/* Body */}

      <div className="relative p-5">
        <div className="flex items-center gap-4">
          <div
            className={`
            relative
            flex
            h-16
            w-16
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-gradient-to-br
            ${color}
            text-white
            shadow-xl
            ring-4
            ring-white
            transition-all
            duration-300
            group-hover:rotate-6
            group-hover:scale-105
            `}
          >
            <Sparkles size={14} className="absolute right-1 top-1 opacity-40" />

            <Icon size={30} strokeWidth={2.3} />
          </div>

          <div className="flex-1">
            <p className="text-sm leading-6 text-gray-500">
              Invite friends and earn commission instantly whenever they
              recharge or participate in eligible games.
            </p>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>Reward Progress</span>

            <span>100%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color}`}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {/* Footer */}

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div
                className={`h-3 w-3 rounded-full bg-gradient-to-r ${color}`}
              />

              <div
                className={`absolute inset-0 animate-ping rounded-full bg-gradient-to-r ${color}`}
              />
            </div>

            <span className="text-sm font-semibold text-gray-600">
              Active Reward
            </span>
          </div>

          <button
            className={`
            flex
            items-center
            gap-2
            rounded-full
            bg-gray-900
            px-4
            py-2
            text-xs
            font-bold
            text-white
            transition-all
            duration-300
            hover:gap-3
            `}
          >
            Details
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle2, Info } from "lucide-react";

const notes = [
  "Only valid users are counted.",
  "Bonus is credited automatically.",
  "Commission updates in real-time.",
  "No limit on referrals.",
  "Invite more friends to earn more.",
  "Fraudulent accounts are not eligible.",
];

const cards = [
  {
    title: "Level 1",
    subtitle: "Direct Referral Recharge",
    percent: "20%",
    color: "from-yellow-400 to-orange-500",
    icon: "wallet",
  },
  {
    title: "Level 2",
    subtitle: "Second Level Recharge",
    percent: "3%",
    color: "from-sky-400 to-cyan-500",
    icon: "users",
  },
  {
    title: "Level 3",
    subtitle: "Third Level Recharge",
    percent: "2%",
    color: "from-violet-500 to-fuchsia-500",
    icon: "coins",
  },
  {
    title: "Bet Bonus",
    subtitle: "Commission on Betting",
    percent: "1%",
    color: "from-emerald-400 to-green-500",
    icon: "trophy",
  },
];

const HowToEarn = () => {
  return (
    <section className="space-y-6">
      {/* Header */}

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 p-6 text-white shadow-xl">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">
            Referral Program
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            How To Earn
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/90">
            Invite your friends, let them recharge or play games and earn
            commission automatically. The more active your network becomes, the
            higher your earnings.
          </p>
        </div>
      </div>

      {/* Cards */}

      <div className="space-y-4">
        {cards.map((card) => (
          <CommissionCard key={card.title} {...card} />
        ))}
      </div>

      {/* Stats */}

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-center">
          <h3 className="text-2xl font-black text-yellow-600">∞</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-yellow-700">
            Unlimited
          </p>
          <span className="text-xs text-gray-500">Referrals Allowed</span>
        </div>

        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-center">
          <h3 className="text-2xl font-black text-green-600">24×7</h3>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-green-700">
            Instant
          </p>
          <span className="text-xs text-gray-500">Auto Commission</span>
        </div>
      </div>

      {/* Notes */}

      <div className="overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
        <div className="border-b border-amber-200 p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
              <Info size={22} className="text-amber-600" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Important Notes
              </h3>

              <p className="text-sm text-gray-500">
                Please read before inviting your friends.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {notes.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-3 rounded-2xl border border-white bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mt-0.5">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>

              <span className="text-sm leading-6 text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowToEarn; // Only keep this one export
