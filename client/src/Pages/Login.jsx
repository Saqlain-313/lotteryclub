import {
  ArrowLeft,
  Eye,
  EyeOff,
  Gift,
  Lock,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearError, login } from "../redux/slices/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success, message, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    let inputValue = value;

    if (name === "mobile") {
      inputValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) {
      dispatch(clearError());
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ""))) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userData = {
      mobile: formData.mobile.trim(),
      password: formData.password,
    };

    try {
      const result = await dispatch(login(userData)).unwrap();
      console.log("Login successful:", result);
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="mt-20 bg-gray-50 text-gray-900 flex justify-center items-center p-3 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl md:rounded-3xl border border-gray-300 md:border-0 md:shadow-2xl overflow-hidden">
        {/* Desktop Layout - Two Columns */}
        <div className="flex flex-col md:flex-row">
          {/* Left Side - Branding/Info Section (Desktop Only) */}
          <div className="hidden md:flex md:w-2/5 bg-gradient-to-br from-yellow-400 to-yellow-500 p-8 flex-col justify-between">
            <div>
              <img
                src="/logo.png"
                className="w-24 h-24 object-contain mb-4 filter brightness-0 invert"
                alt="WINZOX Logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <h1 className="text-4xl font-bold text-white mb-1">WINZOX</h1>
              <p className="text-yellow-100 tracking-widest text-sm">
                PLAY • WIN • REPEAT
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      Secure Login
                    </h3>
                    <p className="text-yellow-100 text-xs">
                      Your data is encrypted and protected
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Gift size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      Exclusive Rewards
                    </h3>
                    <p className="text-yellow-100 text-xs">
                      Get bonuses and special offers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">
                      Active Community
                    </h3>
                    <p className="text-yellow-100 text-xs">
                      Join 10,000+ active players
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-yellow-100 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white font-semibold hover:underline"
                >
                  Register here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full md:w-3/5 p-4 md:p-8">
            {/* Mobile Header - UNCHANGED */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <Link to="/" className="inline-block">
                <ArrowLeft
                  size={24}
                  className="text-gray-700 hover:text-yellow-500 transition-colors"
                />
              </Link>
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-yellow-500">WINZOX</h1>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3 mb-6">
              <Link to="/">
                <ArrowLeft
                  size={24}
                  className="text-gray-700 hover:text-yellow-500 transition-colors"
                />
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Welcome Back!
                </h2>
                <p className="text-gray-500 text-sm">
                  Login to continue your winning journey
                </p>
              </div>
            </div>

            {/* Mobile Branding - UNCHANGED */}
            <div className="text-center md:hidden mb-6">
              <img
                src="/logo.png"
                className="w-20 mx-auto mb-2"
                alt="WINZOX Logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <p className="text-gray-500 tracking-widest text-[10px]">
                PLAY • WIN • REPEAT
              </p>
              <h2 className="text-xl font-bold mt-2 text-gray-900">
                Welcome Back!
              </h2>
              <p className="text-gray-500 text-xs">
                Login to continue your winning journey
              </p>
            </div>

            {/* Form - Mobile layout unchanged */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form Header - Mobile unchanged */}
              <div className="flex gap-3 items-center mb-4 md:mb-6">
                <div className="bg-gray-200 p-2 rounded-full">
                  <Lock className="text-yellow-500" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    Login to your account
                  </h3>
                  <p className="text-gray-500 text-xs">
                    Enter your details below
                  </p>
                </div>
              </div>

              {/* Error Message - UNCHANGED */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={() => dispatch(clearError())}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              )}

              {success && message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {message}
                </div>
              )}

              {/* Mobile Number - UNCHANGED */}
              <div>
                <label className="text-xs block mb-1 text-gray-600">
                  Mobile Number *
                </label>
                <div
                  className={`flex items-center border ${
                    formErrors.mobile ? "border-red-400" : "border-gray-400"
                  } rounded-lg px-3 h-10 bg-white`}
                >
                  <Phone size={16} className="text-gray-500 flex-shrink-0" />
                  <span className="mx-2 text-sm text-gray-600 flex-shrink-0">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel"
                    className="bg-transparent flex-1 outline-none px-1 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                {formErrors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.mobile}
                  </p>
                )}
              </div>

              {/* Password - UNCHANGED */}
              <div>
                <label className="text-xs block mb-1 text-gray-600">
                  Password *
                </label>
                <div
                  className={`flex items-center border ${
                    formErrors.password ? "border-red-400" : "border-gray-400"
                  } rounded-lg px-3 h-10 bg-white`}
                >
                  <Lock size={16} className="text-gray-500 flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {formErrors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password - UNCHANGED */}
              <div className="text-right">
                <Link
                  to="/forgot-password"
                  className="text-yellow-500 text-xs hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button - UNCHANGED */}
              <button
                type="submit"
                disabled={loading}
                className={`h-11 rounded-lg w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-yellow-500/30 ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:from-yellow-500 hover:to-yellow-600"
                }`}
              >
                {loading ? "LOGGING IN..." : "LOGIN"}
              </button>

              {/* Secure Login - UNCHANGED */}
              <div className="bg-gray-100 rounded-xl p-3 flex gap-3 items-center border border-gray-300">
                <ShieldCheck
                  size={32}
                  className="text-yellow-500 flex-shrink-0"
                />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">
                    100% Secure Login
                  </h4>
                  <p className="text-gray-500 text-xs">
                    Your data is encrypted and always protected with us.
                  </p>
                </div>
              </div>

              {/* Register Link - Mobile only (unchanged), Desktop has it in left panel */}
              <p className="text-center text-gray-500 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-yellow-500 font-semibold hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
