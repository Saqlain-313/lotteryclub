import { Link2, Users, Gift, Trophy } from "lucide-react";

const tabs = [
  {
    id: "link",
    title: "My Link",
    icon: Link2,
  },
  {
    id: "members",
    title: "Joined Members",
    icon: Users,
  },
  {
    id: "recharge",
    title: "Recharge Bonus",
    icon: Gift,
  },
  {
    id: "bet",
    title: "Bet Bonus",
    icon: Trophy,
  },
];

const PromoTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white rounded-2xl shadow p-2">
      <div className="grid grid-cols-4 gap-2">

        {tabs.map((tab) => {
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl py-3 flex flex-col items-center gap-2 transition ${
                activeTab === tab.id
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-50 text-gray-600 hover:bg-yellow-50"
              }`}
            >
              <Icon size={20} />

              <span className="text-[11px] font-semibold text-center leading-tight">
                {tab.title}
              </span>
            </button>
          );
        })}

      </div>
    </div>
  );
};

export default PromoTabs;