import { TrendingUp } from "lucide-react";

const MemberStatCard = ({
  title,
  value,
  color = "bg-yellow-400",
}) => {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-100 p-4">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs text-gray-500">
            {title}
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-1">
            {value}
          </h2>
        </div>

        <div
          className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}
        >
          <TrendingUp className="text-white" size={20} />
        </div>

      </div>

    </div>
  );
};

export default MemberStatCard;