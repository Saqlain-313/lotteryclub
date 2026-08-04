import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPublicBidResults,
  setPage,
  selectPublicBidResults,
} from "../redux/slices/publicBidSlice";
import { format } from "date-fns";
import {
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const PublicBidResults = () => {
  const dispatch = useDispatch();

  const {
    results,
    pagination,
    loading,
    filters,
  } = useSelector(selectPublicBidResults);

  useEffect(() => {
    dispatch(fetchPublicBidResults(filters));
  }, [dispatch, filters]); // Removed pagination.page from dependencies

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      dispatch(setPage(page));
    }
  };

  const gameTypeColor = {
    single: "bg-blue-100 text-blue-700",
    jodi: "bg-green-100 text-green-700",
    panna: "bg-purple-100 text-purple-700",
    "half-sangam": "bg-yellow-100 text-yellow-700",
    "full-sangam": "bg-red-100 text-red-700",
    "last-digit": "bg-indigo-100 text-indigo-700",
    "first-digit": "bg-pink-100 text-pink-700",
  };

  const statusColor = {
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  const gameLabel = {
    single: "Single",
    jodi: "Jodi",
    panna: "Panna",
    "half-sangam": "Half Sangam",
    "full-sangam": "Full Sangam",
    "last-digit": "Last Digit",
    "first-digit": "First Digit",
  };

  if (loading && results.length === 0) {
    return (
      <div className="min-h-[300px] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-yellow-400 rounded-full blur-md opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 w-11 h-11 rounded-xl flex items-center justify-center shadow-lg">
              <FaTrophy className="text-white text-lg" />
            </div>
          </div>
          <div>
            <h2
              className="text-xl md:text-3xl font-black"
              style={{
                background: "linear-gradient(135deg,#7b5800 0%,#fdba12 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              MATKA RESULTS
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              Latest Public Winning Results
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-green-600">LIVE</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b sticky top-0">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Number
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Game
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Bid
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Win
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Status
                </th>
                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {results.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <FaTrophy className="text-5xl text-gray-300" />
                      <h3 className="text-lg font-semibold">No Results Found</h3>
                      <p className="text-sm">
                        Results will appear here once declared.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((bid) => (
                  <tr
                    key={bid._id}
                    className="hover:bg-yellow-50 transition duration-300"
                  >
                    <td className="px-5 py-4">
                      <div className="text-xl font-extrabold text-gray-900">
                        {bid.number}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          gameTypeColor[bid.gameType]
                        }`}
                      >
                        {gameLabel[bid.gameType]}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      ₹{bid.bidAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-green-600 font-bold">
                        ₹{bid.winAmount?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          statusColor[bid.status]
                        }`}
                      >
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium">
                        {format(new Date(bid.createdAt), "dd MMM yyyy")}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(bid.createdAt), "hh:mm a")}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden p-3 space-y-3">
          {results.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <FaTrophy className="mx-auto text-4xl text-gray-300 mb-3" />
              <h3 className="font-semibold">No Results Found</h3>
              <p className="text-sm text-gray-500">Results will appear here.</p>
            </div>
          ) : (
            results.map((bid) => (
              <div
                key={bid._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-black text-gray-900">
                      {bid.number}
                    </div>
                    <span
                      className={`inline-block mt-2 px-2 py-1 rounded-full text-[11px] font-semibold ${
                        gameTypeColor[bid.gameType]
                      }`}
                    >
                      {gameLabel[bid.gameType]}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      statusColor[bid.status]
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div>
                    <p className="text-gray-500">Bid Amount</p>
                    <p className="font-bold">₹{bid.bidAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Win Amount</p>
                    <p className="font-bold text-green-600">
                      ₹{bid.winAmount || 0}
                    </p>
                  </div>
                  <div className="col-span-2 border-t pt-3">
                    <p className="text-gray-500 text-xs">
                      {format(new Date(bid.createdAt), "dd MMM yyyy • hh:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(
                  pagination.page * pagination.limit,
                  pagination.totalCount
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold">{pagination.totalCount}</span>{" "}
              Results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-yellow-50 hover:border-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaChevronLeft />
              </button>
              <div className="px-5 h-10 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold flex items-center shadow">
                {pagination.page} / {pagination.totalPages}
              </div>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-yellow-50 hover:border-yellow-400 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBidResults;