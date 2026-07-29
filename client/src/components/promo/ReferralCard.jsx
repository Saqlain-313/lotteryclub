import { Copy, Link2, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import SocialShare from "./SocialShare";

const ReferralCard = () => {
  const { user } = useSelector((state) => state.auth);

  // Construct referral link with current domain and referral code
  const baseUrl = window.location.origin;
  const referralLink = `${baseUrl}/register/?ref=${user?.referralCode || 'alex777'}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      
      // Show success feedback
      const btn = document.getElementById('copyBtn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="flex items-center gap-2"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> Copied!</span>';
      btn.classList.add('bg-green-500', 'hover:bg-green-600');
      btn.classList.remove('from-amber-400', 'to-amber-500', 'hover:from-amber-500', 'hover:to-amber-600');
      
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500', 'hover:bg-green-600');
        btn.classList.add('from-amber-400', 'to-amber-500', 'hover:from-amber-500', 'hover:to-amber-600');
      }, 2000);
      
    } catch (error) {
      console.error("Failed to copy: ", error);
      // Fallback method for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = referralLink;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert("Referral link copied!");
      } catch (err) {
        alert("Failed to copy link. Please copy manually.");
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="mt-6 rounded-3xl bg-white shadow-xl border border-gray-100/80 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Link2 size={24} className="text-amber-600" />
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-gray-800">Share Your Referral Link</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Invite your friends and earn rewards on every successful referral.
          </p>
        </div>
      </div>

      {/* Referral Link Input */}
      <div className="rounded-2xl bg-gray-50/80 border border-gray-200/60 p-3 flex items-center gap-3 transition-all focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-200">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Copy size={18} className="text-amber-600" />
        </div>
        <input
          readOnly
          value={referralLink}
          className="flex-1 bg-transparent outline-none text-sm text-gray-700 font-medium min-w-0"
        />
        <button
          id="copyBtn"
          onClick={copyLink}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 px-5 py-2.5 text-sm font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
        >
          <Copy size={16} />
          Copy
        </button>
      </div>

      {/* Social Share */}
      <div className="mt-6 pt-5 border-t border-gray-100">
        <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Share via
        </p>
        <SocialShare />
      </div>
    </div>
  );
};

export default ReferralCard;