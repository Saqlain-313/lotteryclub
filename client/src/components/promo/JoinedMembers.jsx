import MemberStatCard from "./MemberStatCard";
import MemberListCard from "./MemberListCard";

const JoinedMembers = () => {
  return (
    <div className="mt-6 space-y-5">

      {/* Top Stats */}

      <div className="grid grid-cols-2 gap-4">

        <MemberStatCard
          title="Total Members"
          value="1,258"
          color="bg-blue-500"
        />

        <MemberStatCard
          title="First Deposit"
          value="642"
          color="bg-green-500"
        />

        <MemberStatCard
          title="Today's Earnings"
          value="₹2,480"
          color="bg-yellow-500"
        />

        <MemberStatCard
          title="Total Earnings"
          value="₹58,900"
          color="bg-purple-500"
        />

      </div>

      {/* Level Stats */}

      <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">

        <h3 className="text-lg font-bold mb-5">
          Referral Levels
        </h3>

        <div className="space-y-4">

          <div className="flex justify-between items-center">
            <span>Level 1 Members</span>

            <span className="font-bold text-yellow-500">
              620
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Level 2 Members</span>

            <span className="font-bold text-blue-500">
              380
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Level 3 Members</span>

            <span className="font-bold text-purple-500">
              258
            </span>
          </div>

        </div>

      </div>

      <MemberListCard />

    </div>
  );
};

export default JoinedMembers;