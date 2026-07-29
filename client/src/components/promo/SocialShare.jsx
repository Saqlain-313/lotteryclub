import {
  MessageCircle,
  Send,
  Share2,
  Ellipsis,
} from "lucide-react";

const items = [
  {
    name: "WhatsApp",
    icon: MessageCircle,
    bg: "bg-green-500",
  },
  {
    name: "Telegram",
    icon: Send,
    bg: "bg-sky-500",
  },
  {
    name: "Share",
    icon: Share2,
    bg: "bg-indigo-500",
  },
  {
    name: "More",
    icon: Ellipsis,
    bg: "bg-gray-500",
  },
];

const SocialShare = () => {
  return (
    <div className="mt-6 grid grid-cols-4 gap-4">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            key={item.name}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center shadow-lg text-white`}
            >
              <Icon size={22} />
            </div>

            <span className="text-xs font-medium text-gray-600">
              {item.name}
            </span>
          </button>
        );
      })}

    </div>
  );
};

export default SocialShare;