import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyDeposits } from "../redux/slices/depositSlice";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  Calendar,
  DollarSign,
  CreditCard,
  MapPin,
  Activity,
} from "lucide-react";

const DepositHistory = () => {
  const dispatch = useDispatch();

  const { deposits, loading } = useSelector((state) => state.deposit);

  useEffect(() => {
    dispatch(getMyDeposits());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const configs = {
      approved: {
        icon: CheckCircle,
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        label: "Approved",
      },
      rejected: {
        icon: XCircle,
        className: "bg-red-50 text-red-700 border-red-200",
        label: "Rejected",
      },
      pending: {
        icon: Clock,
        className: "bg-amber-50 text-amber-700 border-amber-200",
        label: "Pending",
      },
    };

    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.className}`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const copyTransactionId = (transactionId) => {
    navigator.clipboard.writeText(transactionId);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading deposits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-3 rounded-xl shadow-sm">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Deposit History
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Track all your deposit transactions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="text-sm font-bold text-gray-900">
                {deposits.length}
              </span>
            </span>
          </div>
        </div>

        {deposits.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <h5 className="text-xl font-semibold text-gray-700 mb-2">
              No Deposits Found
            </h5>
            <p className="text-gray-500 text-sm">
              You haven't made any deposits yet. Start your first deposit today!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {deposits.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <h5 className="text-xl font-bold text-gray-900">
                          ₹ {parseFloat(item.amount).toLocaleString('en-IN')}
                        </h5>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CreditCard className="w-4 h-4" />
                        <span className="truncate">{item.methodTitle}</span>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">
                  {/* Transaction ID */}
                  <div className="flex items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                        Transaction ID
                      </p>
                      <p className="text-sm font-mono text-gray-800 truncate">
                        {item.transactionId}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="flex-shrink-0 p-2 bg-white hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 hover:border-blue-300"
                      onClick={() => copyTransactionId(item.transactionId)}
                      title="Copy Transaction ID"
                    >
                      <Copy className="w-4 h-4 text-gray-600 hover:text-blue-600" />
                    </button>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Country
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {item.country || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Currency
                        </p>
                        <p className="text-sm font-medium text-gray-800">
                          {item.currency || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </p>
                      <p className="text-sm text-gray-700">
                        {new Date(item.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Remark */}
                  {item.remark && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                      <p className="text-xs font-medium text-blue-700 uppercase tracking-wider mb-0.5">
                        Remark
                      </p>
                      <p className="text-sm text-blue-800">{item.remark}</p>
                    </div>
                  )}

                  {/* Screenshot */}
                  {item.screenshot && (
                    <div className="pt-2">
                      <div className="relative group">
                        <img
                          src={item.screenshot}
                          alt="Deposit Screenshot"
                          className="w-full max-h-[200px] object-cover rounded-xl border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => window.open(item.screenshot, "_blank")}
                        />
                        <button
                          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg text-white transition-colors opacity-0 group-hover:opacity-100"
                          onClick={() => window.open(item.screenshot, "_blank")}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5 text-center">
                        Click image to view full size
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepositHistory;