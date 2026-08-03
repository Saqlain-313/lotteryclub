import {
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  FileText,
  Image,
  Landmark,
  Loader2,
  QrCode,
  Shield,
  Sparkles,
  Tag,
  Upload,
  Wallet,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  clearDepositState,
  createDeposit,
  getDepositMethods,
} from "../redux/slices/depositSlice";

const Deposit = () => {
  const dispatch = useDispatch();

  const { methods, loading, success, message, error } = useSelector(
    (state) => state.deposit,
  );

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState("");
  const [touched, setTouched] = useState({
    amount: false,
    transactionId: false,
    screenshot: false,
  });
  const [errors, setErrors] = useState({
    amount: "",
    transactionId: "",
    screenshot: "",
  });

  useEffect(() => {
    dispatch(getDepositMethods());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message || "Deposit request submitted successfully!");
      dispatch(clearDepositState());
      setAmount("");
      setTransactionId("");
      setScreenshot(null);
      setPreview("");
      setSelectedMethod(null);
      setTouched({
        amount: false,
        transactionId: false,
        screenshot: false,
      });
      setErrors({
        amount: "",
        transactionId: "",
        screenshot: "",
      });
    }
    if (error) {
      toast.error(error || "Something went wrong");
      dispatch(clearDepositState());
    }
  }, [success, error, message, dispatch]);

  const validateAmount = (value) => {
    const num = parseFloat(value);
    if (!value || value === "") return "Please enter an amount";
    if (isNaN(num) || num <= 0) return "Please enter a valid amount";
    if (selectedMethod) {
      const min = parseFloat(selectedMethod.minimumDeposit);
      const max = parseFloat(selectedMethod.maximumDeposit);
      if (num < min)
        return `Minimum amount is ${selectedMethod.minimumDeposit}`;
      if (num > max)
        return `Maximum amount is ${selectedMethod.maximumDeposit}`;
    }
    return "";
  };

  const validateTransactionId = (value) => {
    if (!value || value.trim() === "") return "Please enter transaction ID";
    if (value.trim().length < 3)
      return "Transaction ID must be at least 3 characters";
    return "";
  };

  const validateScreenshot = (file) => {
    if (!file) return "Please upload a screenshot";
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image (PNG, JPG, JPEG, WEBP)";
    }
    if (file.size > 5 * 1024 * 1024) {
      return "Image size must be less than 5MB";
    }
    return "";
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "amount") {
      setErrors((prev) => ({ ...prev, amount: validateAmount(amount) }));
    }
    if (field === "transactionId") {
      setErrors((prev) => ({
        ...prev,
        transactionId: validateTransactionId(transactionId),
      }));
    }
    if (field === "screenshot") {
      setErrors((prev) => ({
        ...prev,
        screenshot: validateScreenshot(screenshot),
      }));
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    if (touched.amount) {
      setErrors((prev) => ({ ...prev, amount: validateAmount(value) }));
    }
  };

  const handleTransactionIdChange = (e) => {
    const value = e.target.value;
    setTransactionId(value);
    if (touched.transactionId) {
      setErrors((prev) => ({
        ...prev,
        transactionId: validateTransactionId(value),
      }));
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
    setTouched((prev) => ({ ...prev, screenshot: true }));
    setErrors((prev) => ({ ...prev, screenshot: validateScreenshot(file) }));
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    if (touched.amount) {
      setErrors((prev) => ({ ...prev, amount: validateAmount(amount) }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Validate all fields
    const amountError = validateAmount(amount);
    const transactionError = validateTransactionId(transactionId);
    const screenshotError = validateScreenshot(screenshot);

    setTouched({
      amount: true,
      transactionId: true,
      screenshot: true,
    });
    setErrors({
      amount: amountError,
      transactionId: transactionError,
      screenshot: screenshotError,
    });

    if (!selectedMethod) {
      toast.error("Please select a payment method first");
      return;
    }

    if (amountError || transactionError || screenshotError) {
      toast.error("Please fix all errors before submitting");
      return;
    }

    const form = new FormData();
    form.append("amount", amount);
    form.append("transactionId", transactionId);
    form.append("methodType", selectedMethod.type);
    form.append("methodTitle", selectedMethod.title);
    form.append("screenshot", screenshot);

    dispatch(createDeposit(form));
  };

  const isQrKey = (key) => key.toLowerCase().includes("qr");

  const getMethodIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "bank":
        return <Landmark className="w-5 h-5" />;
      case "upi":
        return <QrCode className="w-5 h-5" />;
      case "card":
        return <CreditCard className="w-5 h-5" />;
      default:
        return <Wallet className="w-5 h-5" />;
    }
  };

  const getMethodColor = (type) => {
    switch (type?.toLowerCase()) {
      case "bank":
        return "from-blue-500 to-blue-600";
      case "upi":
        return "from-purple-500 to-purple-600";
      case "card":
        return "from-emerald-500 to-emerald-600";
      default:
        return "from-amber-500 to-amber-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-start">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-md opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-amber-500 to-yellow-500 p-4 rounded-2xl shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 tracking-tight">
            Deposit Funds
          </h1>
          <p className="text-amber-600/80 mt-1 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Choose your payment method and complete the deposit
          </p>
        </div>

        {/* Payment Methods Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-gray-800">
              Select Payment Method
            </h3>
            {!selectedMethod && (
              <span className="ml-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                Required *
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {methods.map((item) => (
              <div
                key={item.title}
                onClick={() => handleMethodSelect(item)}
                className={`bg-white rounded-2xl shadow-lg border-2 p-5 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedMethod?.title === item.title
                    ? "border-amber-400 shadow-amber-100 shadow-lg bg-amber-50/50 scale-[1.02]"
                    : "border-gray-100 hover:border-amber-200 hover:bg-amber-50/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl bg-gradient-to-br ${getMethodColor(item.type)} text-white shadow-lg`}
                    >
                      {getMethodIcon(item.type)}
                    </div>
                    <div>
                      <h5 className="text-base font-bold text-gray-800">
                        {item.title}
                      </h5>
                      <span
                        className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          item.type === "bank"
                            ? "bg-blue-100 text-blue-700"
                            : item.type === "upi"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                  {selectedMethod?.title === item.title && (
                    <CheckCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500 bg-gray-50/80 p-2.5 rounded-xl">
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" />
                    Min: {item.minimumDeposit}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" />
                    Max: {item.maximumDeposit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {item.processingTime}
                  </span>
                </div>

                {/* Preview of details - only show first 2 details */}
                <div className="mt-3 space-y-1.5">
                  {Object.entries(item.details || {})
                    .slice(0, 2)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center gap-2 text-xs text-gray-600 bg-white/50 p-1.5 rounded-lg"
                      >
                        <Tag className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        <span className="font-semibold capitalize">{key}:</span>
                        <span className="truncate flex-1">
                          {typeof value === "string" && value.length > 20
                            ? value.substring(0, 20) + "..."
                            : value}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-amber-200/40"
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-gray-800">Deposit Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <DollarSign className="inline w-4 h-4 mr-1.5 text-amber-500" />
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 font-bold">₹</span>
                </div>
                <input
                  type="number"
                  className={`w-full rounded-xl border-2 p-3 pl-8 text-gray-800 bg-gray-50/70 transition focus:outline-none ${
                    touched.amount && errors.amount
                      ? "border-red-400 focus:border-red-400 bg-red-50/50"
                      : touched.amount && !errors.amount && amount
                        ? "border-green-400 focus:border-green-400 bg-green-50/50"
                        : "border-gray-200 focus:border-amber-400"
                  }`}
                  value={amount}
                  onChange={handleAmountChange}
                  onBlur={() => handleBlur("amount")}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
                {touched.amount && !errors.amount && amount && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {touched.amount && errors.amount && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {touched.amount && errors.amount && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.amount}
                </p>
              )}
              {selectedMethod && !errors.amount && (
                <p className="mt-1 text-xs text-gray-400">
                  Limit: {selectedMethod.minimumDeposit} -{" "}
                  {selectedMethod.maximumDeposit}
                </p>
              )}
            </div>

            {/* Transaction ID Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <FileText className="inline w-4 h-4 mr-1.5 text-amber-500" />
                Transaction ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full rounded-xl border-2 p-3 text-gray-800 bg-gray-50/70 transition focus:outline-none ${
                    touched.transactionId && errors.transactionId
                      ? "border-red-400 focus:border-red-400 bg-red-50/50"
                      : touched.transactionId &&
                          !errors.transactionId &&
                          transactionId
                        ? "border-green-400 focus:border-green-400 bg-green-50/50"
                        : "border-gray-200 focus:border-amber-400"
                  }`}
                  value={transactionId}
                  onChange={handleTransactionIdChange}
                  onBlur={() => handleBlur("transactionId")}
                  placeholder="e.g. TRX-12345"
                />
                {touched.transactionId &&
                  !errors.transactionId &&
                  transactionId && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                {touched.transactionId && errors.transactionId && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
              </div>
              {touched.transactionId && errors.transactionId && (
                <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <Image className="inline w-4 h-4 mr-1.5 text-amber-500" />
              Upload Screenshot <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div
                className={`rounded-xl p-6 text-center border-2 border-dashed transition ${
                  touched.screenshot && errors.screenshot
                    ? "border-red-400 bg-red-50/30"
                    : touched.screenshot && preview
                      ? "border-green-400 bg-green-50/30"
                      : "border-gray-300 hover:border-amber-400 bg-gray-50/30 hover:bg-amber-50/20"
                }`}
              >
                {preview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-amber-200 shadow-lg"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 font-medium">
                        Uploaded successfully
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-amber-600 hover:text-amber-700 font-medium underline"
                      onClick={() => {
                        setScreenshot(null);
                        setPreview("");
                        setTouched((prev) => ({ ...prev, screenshot: false }));
                        setErrors((prev) => ({ ...prev, screenshot: "" }));
                      }}
                    >
                      Remove & Re-upload
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, JPEG, WEBP (Max 5MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleImage}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                />
              </div>
            </div>
            {touched.screenshot && errors.screenshot && (
              <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.screenshot}
              </p>
            )}
          </div>

          {/* Selected Method Details */}
          {selectedMethod && (
            <div className="mt-6 bg-gradient-to-br from-amber-50/70 via-yellow-50/50 to-amber-50/70 rounded-2xl p-5 border-2 border-amber-200/60 shadow-inner overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className={`p-2 rounded-xl bg-gradient-to-br ${getMethodColor(selectedMethod.type)} text-white shadow-lg`}
                >
                  {getMethodIcon(selectedMethod.type)}
                </div>
                <div>
                  <h5 className="text-md font-bold text-gray-800">
                    {selectedMethod.title}
                  </h5>
                  <span className="text-xs text-gray-500 capitalize">
                    {selectedMethod.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/80 rounded-xl p-2.5 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Min
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {selectedMethod.minimumDeposit}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Max
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {selectedMethod.maximumDeposit}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Processing
                  </span>
                  <span className="text-sm font-bold text-gray-800">
                    {selectedMethod.processingTime}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 text-center shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                    Type
                  </span>
                  <span className="text-sm font-bold text-gray-800 capitalize">
                    {selectedMethod.type}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {Object.entries(selectedMethod.details || {}).map(
                  ([key, value]) => {
                    if (isQrKey(key)) {
                      return (
                        <div
                          key={key}
                          className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-amber-100"
                        >
                          <img
                            src={value}
                            alt="QR Code"
                            className="w-20 h-20 object-contain rounded-lg border border-gray-200"
                          />
                          <div>
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              QR Code
                            </span>
                            <p className="text-sm text-gray-600">Scan to pay</p>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={key}
                        className="bg-white p-3 rounded-xl shadow-sm border border-amber-100 flex items-center gap-3 overflow-hidden"
                      >
                        <span className="font-semibold text-gray-600 capitalize whitespace-nowrap min-w-[80px] md:min-w-[100px] text-sm">
                          {key}
                        </span>
                        <div className="flex-1 flex items-center gap-2 overflow-hidden">
                          <span className="text-sm text-gray-800 truncate">
                            {value}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-md hover:shadow-lg"
                          onClick={() => {
                            navigator.clipboard.writeText(value);
                            toast.success("Copied to clipboard!");
                          }}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </button>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          )}

          {!selectedMethod && (
            <div className="mt-4 p-4 bg-yellow-50/80 border-2 border-yellow-200 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-sm text-yellow-700 font-medium">
                Please select a payment method above to proceed
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-7 w-full font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-300 text-lg flex items-center justify-center gap-2 ${
              loading || !selectedMethod
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 hover:from-amber-600 hover:via-yellow-600 hover:to-amber-600 text-white hover:shadow-xl hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Submit Deposit
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-4 text-center flex items-center justify-center gap-1">
            <Shield className="w-3 h-3" />
            By submitting you agree to our deposit terms and conditions
          </p>
        </form>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default Deposit;
