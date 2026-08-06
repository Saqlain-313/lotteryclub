import { useState } from "react";

import PromoTabs from "../../components/promo/PromoTabs";

import HowToEarn from "../../components/promo/HowToEarn";
import JoinedMembers from "../../components/promo/JoinedMembers";
import PromoBanner from "../../components/promo/PromoBanner";
import ReferralCard from "../../components/promo/ReferralCard";

import BetBonus from "../../components/promo/BetBonus";
import RechargeBonus from "../../components/promo/RechargeBonus";
import ReferralRules from "../../components/promo/ReferralRules";

const PromoPage = () => {
  const [activeTab, setActiveTab] = useState("link");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* <PromoHeader /> */}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 md:py-6 pb-24">
        <PromoTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* My Link */}
        {activeTab === "link" && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PromoBanner />
              <ReferralCard />
            </div>

            <div className="space-y-6">
              <HowToEarn />
            </div>
          </div>
        )}

        {/* Joined Members */}
        {activeTab === "members" && (
          <div className="mt-6">
            <JoinedMembers />
          </div>
        )}

        {/* Recharge Bonus */}
        {activeTab === "recharge" && (
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <RechargeBonus />
            </div>

            <div>
              <ReferralRules />
            </div>
          </div>
        )}

        {/* Bet Bonus */}
        {activeTab === "bet" && (
          <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <BetBonus />
            </div>

            <div>
              <ReferralRules />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromoPage;
