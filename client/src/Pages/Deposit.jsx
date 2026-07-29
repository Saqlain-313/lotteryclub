import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDepositMethods,
  createDeposit,
  clearDepositState,
} from "../redux/slices/depositSlice";
import toast from "react-hot-toast";

const Deposit = () => {
  const dispatch = useDispatch();

  const {
    methods,
    loading,
    success,
    message,
    error,
  } = useSelector((state) => state.deposit);

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    dispatch(getDepositMethods());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message);
      dispatch(clearDepositState());
      setAmount("");
      setTransactionId("");
      setScreenshot(null);
      setPreview("");
      setSelectedMethod(null);
    }
    if (error) {
      toast.error(error);
      dispatch(clearDepositState());
    }
  }, [success, error, message, dispatch]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!selectedMethod) return toast.error("Select Deposit Method");
    if (!amount) return toast.error("Enter Amount");
    if (!transactionId) return toast.error("Enter Transaction ID");
    if (!screenshot) return toast.error("Upload Screenshot");

    const form = new FormData();
    form.append("amount", amount);
    form.append("transactionId", transactionId);
    form.append("methodType", selectedMethod.type);
    form.append("methodTitle", selectedMethod.title);
    form.append("screenshot", screenshot);

    dispatch(createDeposit(form));
  };

  const isQrKey = (key) => key.toLowerCase().includes("qr");

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-blue-50 p-3 rounded-xl shadow-sm">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Deposit Funds
          </h3>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {methods.map((item) => (
            <div
              key={item.title}
              onClick={() => setSelectedMethod(item)}
              className={`bg-white rounded-2xl shadow-md border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedMethod?.title === item.title
                  ? "border-blue-500 shadow-blue-100 shadow-lg bg-blue-50/30"
                  : "border-transparent hover:border-blue-200"
              }`}
            >
              <div className="flex justify-between items-start">
                <h5 className="text-lg font-bold text-gray-800">{item.title}</h5>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                  {item.type}
                </span>
              </div>
              <hr className="my-2 border-gray-200" />

              <div className="space-y-2 text-sm">
                {Object.entries(item.details || {}).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-2">
                    {isQrKey(key) ? (
                      <img
                        src={value}
                        alt="QR code"
                        className="w-16 h-16 object-contain rounded-lg border border-gray-100"
                      />
                    ) : (
                      <div className="bg-gray-50 p-1.5 rounded w-full">
                        <span className="font-semibold text-gray-600 capitalize">{key}:</span>
                        <span className="text-gray-800 ml-1 break-all">{value}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 bg-gray-50/80 p-2 rounded-lg">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Min: {item.minimumDeposit}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  Max: {item.maximumDeposit}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {item.processingTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Deposit Form */}
        <form onSubmit={submitHandler} className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <svg className="inline w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 1v1" />
                </svg>
                Amount
              </label>
              <input
                type="number"
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 text-gray-800 bg-gray-50/70 transition"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <svg className="inline w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Transaction ID
              </label>
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-blue-400 focus:ring focus:ring-blue-200 focus:ring-opacity-50 p-3 text-gray-800 bg-gray-50/70 transition"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. TRX-12345"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <svg className="inline w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Screenshot (Proof)
            </label>
            <div className="relative">
              <div className="rounded-xl p-4 text-center text-gray-500 bg-gray-50/50 border-2 border-dashed border-gray-300 hover:border-blue-400 transition">
                <svg className="w-8 h-8 text-blue-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="text-sm">Click to upload or drag & drop</span>
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImage}
                  accept="image/*"
                />
              </div>
            </div>
            {preview && (
              <div className="mt-3 flex items-center gap-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                />
                <span className="text-xs text-gray-400">
                  <svg className="inline w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Uploaded
                </span>
              </div>
            )}
          </div>

          {/* Selected Method Details - Fixed overflow issue */}
          {selectedMethod && (
            <div className="mt-6 bg-gray-50/70 rounded-2xl p-5 border border-gray-200/70 shadow-inner overflow-hidden">
              <h5 className="text-md font-bold text-gray-700 flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Selected Payment Method
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                <div>
                  <span className="font-semibold text-gray-600">Title</span>
                  <span className="text-gray-800 block truncate">{selectedMethod.title}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Type</span>
                  <span className="text-gray-800 block capitalize">{selectedMethod.type}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Limit</span>
                  <span className="text-gray-800 block">{selectedMethod.minimumDeposit} - {selectedMethod.maximumDeposit}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Processing</span>
                  <span className="text-gray-800 block">{selectedMethod.processingTime}</span>
                </div>
              </div>
              <div className="space-y-2">
                {Object.entries(selectedMethod.details || {}).map(([key, value]) => {
                  if (isQrKey(key)) {
                    return (
                      <div key={key} className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm">
                        <img src={value} alt="QR" className="w-16 h-16 object-contain rounded-lg" />
                        <span className="text-xs text-gray-500 capitalize">{key}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm overflow-hidden">
                      <span className="font-medium text-gray-600 capitalize whitespace-nowrap min-w-[80px] md:min-w-[100px]">
                        {key}
                      </span>
                      <input
                        type="text"
                        readOnly
                        value={value}
                        className="flex-1 bg-transparent border-0 p-1 text-gray-800 text-sm focus:ring-0 min-w-0 truncate"
                      />
                      <button
                        type="button"
                        className="bg-gray-100 hover:bg-blue-600 text-gray-600 hover:text-white px-3 py-1.5 rounded-lg text-xs transition whitespace-nowrap flex-shrink-0"
                        onClick={() => {
                          navigator.clipboard.writeText(value);
                          toast.success("Copied!");
                        }}
                      >
                        <svg className="inline w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-200/50 transition-all duration-200 hover:scale-[1.01] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Submit Deposit
              </>
            )}
          </button>
          <p className="text-xs text-gray-400 mt-3 text-center">
            By submitting you agree to our deposit terms.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Deposit;