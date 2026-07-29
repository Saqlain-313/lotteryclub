import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Gift,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { register, clearError, clearMessage } from "../redux/slices/authSlice";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, error, success, message } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Country list
  const countries = [
    { code: "AU", name: "Australian" },
    { code: "IN", name: "India" },
    { code: "PK", name: "Pakistan" },
    { code: "BD", name: "Bangladesh" },
    { code: "NP", name: "Nepal" },
    { code: "AE", name: "Dubai" },
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
    country: "IN",
    termsAccepted: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Auto-fill referral code from URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const refCode = queryParams.get('ref');

    if (refCode) {
      setFormData((prev) => ({
        ...prev,
        referralCode: refCode.toUpperCase()
      }));
    }
  }, [location.search]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    } else if (/\s/.test(formData.name.trim())) {
      errors.name = "Space is not allowed in name";
    }

    if (!formData.mobile.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\D/g, ''))) {
      errors.mobile = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!formData.termsAccepted) {
      errors.termsAccepted = "You must accept the Terms & Conditions";
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
      name: formData.name.trim().toLowerCase(),
      mobile: formData.mobile.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      country: formData.country,
      referralCode: formData.referralCode.trim().toUpperCase() || undefined,
    };

    try {
      const result = await dispatch(register(userData)).unwrap();
      console.log("Registration successful:", result);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Registration failed:", err);
      const errorElement = document.querySelector('.error-message');
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex justify-center items-center p-3 md:p-6">
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
              <p className="text-yellow-100 tracking-widest text-sm">PLAY • WIN • REPEAT</p>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Secure Registration</h3>
                    <p className="text-yellow-100 text-xs">Your data is encrypted and protected</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Gift size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Referral Rewards</h3>
                    <p className="text-yellow-100 text-xs">Earn rewards for every friend you invite</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">Join Community</h3>
                    <p className="text-yellow-100 text-xs">Be part of 10,000+ active players</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-yellow-100 text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-white font-semibold hover:underline">
                  Login here
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full md:w-3/5 p-4 md:p-8">
            {/* Mobile Header - UNCHANGED */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <Link to="/login">
                <ArrowLeft size={24} className="text-gray-700 hover:text-yellow-500 transition-colors" />
              </Link>
              <div className="text-center flex-1">
                <h1 className="text-2xl font-bold text-yellow-500">WINZOX</h1>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3 mb-6">
              <Link to="/login">
                <ArrowLeft size={24} className="text-gray-700 hover:text-yellow-500 transition-colors" />
              </Link>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                <p className="text-gray-500 text-sm">Join now and start winning</p>
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
              <p className="text-gray-500 tracking-widest text-[10px]">PLAY • WIN • REPEAT</p>
              <h2 className="text-xl font-bold mt-2 text-gray-900">Create Account</h2>
              <p className="text-gray-500 text-xs">Join now and start winning</p>
            </div>

            {/* Form - Mobile layout unchanged, Desktop has grid */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Referral Code Applied Notification - UNCHANGED */}
              {formData.referralCode && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm flex items-center gap-2">
                  <Gift size={16} className="text-yellow-500 flex-shrink-0" />
                  <span className="flex-1">
                    <strong>Referral code applied:</strong> {formData.referralCode}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, referralCode: "" }))}
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Error Message - UNCHANGED */}
              {error && (
                <div className="error-message p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center justify-between">
                  <span><strong>Error:</strong> {error}</span>
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
                  <strong>Success!</strong> {message}
                </div>
              )}

              {/* Desktop: Two Column Layout for Name & Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name - Mobile unchanged */}
                <div>
                  <label className="text-xs block mb-1 text-gray-600">Full Name *</label>
                  <div className={`flex items-center border ${formErrors.name ? 'border-red-400' : 'border-gray-400'} rounded-lg px-3 h-10 bg-white`}>
                    <User size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name (no spaces)"
                      className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                    />
                  </div>
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Mobile Number - Mobile unchanged */}
                <div>
                  <label className="text-xs block mb-1 text-gray-600">Mobile Number *</label>
                  <div className={`flex items-center border ${formErrors.mobile ? 'border-red-400' : 'border-gray-400'} rounded-lg px-3 h-10 bg-white`}>
                    <Phone size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type="text"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                      maxLength="10"
                    />
                  </div>
                  {formErrors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                  )}
                </div>
              </div>

              {/* Email Address - UNCHANGED */}
              <div>
                <label className="text-xs block mb-1 text-gray-600">Email Address *</label>
                <div className={`flex items-center border ${formErrors.email ? 'border-red-400' : 'border-gray-400'} rounded-lg px-3 h-10 bg-white`}>
                  <Mail size={16} className="text-gray-500 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                  />
                </div>
                {formErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                )}
              </div>

              {/* Country Dropdown - UNCHANGED */}
              <div>
                <label className="text-xs block mb-1 text-gray-600">Country *</label>
                <div className="flex items-center border border-gray-400 rounded-lg px-3 h-10 bg-white relative">
                  <Globe size={16} className="text-gray-500 flex-shrink-0" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 appearance-none cursor-pointer"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none text-gray-400">
                    ▼
                  </div>
                </div>
                <p className="text-gray-400 text-[10px] mt-1">Select your country of residence</p>
              </div>

              {/* Desktop: Two Column Layout for Password & Confirm Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password - Mobile unchanged */}
                <div>
                  <label className="text-xs block mb-1 text-gray-600">Password *</label>
                  <div className={`flex items-center border ${formErrors.password ? 'border-red-400' : 'border-gray-400'} rounded-lg px-3 h-10 bg-white`}>
                    <Lock size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a password"
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
                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                  )}
                  <p className="text-gray-400 text-[10px] mt-1">Minimum 6 characters required</p>
                </div>

                {/* Confirm Password - Mobile unchanged */}
                <div>
                  <label className="text-xs block mb-1 text-gray-600">Confirm Password *</label>
                  <div className={`flex items-center border ${formErrors.confirmPassword ? 'border-red-400' : 'border-gray-400'} rounded-lg px-3 h-10 bg-white`}>
                    <Lock size={16} className="text-gray-500 flex-shrink-0" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Referral Code - UNCHANGED */}
              <div>
                <label className="text-xs block mb-1 text-gray-600">Referral Code (Optional)</label>
                <div className={`flex items-center border ${formData.referralCode ? 'border-yellow-400 bg-yellow-50' : 'border-gray-400 bg-white'} rounded-lg px-3 h-10 transition-colors`}>
                  <Gift size={16} className={formData.referralCode ? 'text-yellow-500' : 'text-gray-500'} />
                  <input
                    type="text"
                    name="referralCode"
                    value={formData.referralCode}
                    onChange={handleChange}
                    placeholder="Enter referral code (if any)"
                    className="bg-transparent flex-1 outline-none px-2 text-sm text-gray-900 placeholder-gray-400"
                    maxLength="10"
                  />
                </div>
                <p className="text-gray-400 text-[10px] mt-1">
                  {formData.referralCode
                    ? `✓ Referral code "${formData.referralCode}" applied`
                    : "If you have a referral code, enter it here"}
                </p>
              </div>

              {/* Terms & Conditions - UNCHANGED */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleChange}
                  className={`mt-0.5 w-3.5 h-3.5 ${formErrors.termsAccepted ? 'border-red-400' : 'border-gray-300'} rounded`}
                />
                <div>
                  <p className="text-xs text-gray-500">
                    I agree to the{" "}
                    <span className="text-yellow-500 cursor-pointer hover:underline">
                      Terms & Conditions
                    </span>{" "}
                    &{" "}
                    <span className="text-yellow-500 cursor-pointer hover:underline">
                      Privacy Policy
                    </span>
                  </p>
                  {formErrors.termsAccepted && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.termsAccepted}</p>
                  )}
                </div>
              </div>

              {/* Register Button - UNCHANGED */}
              <button
                type="submit"
                disabled={loading}
                className={`h-11 rounded-lg w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold text-base transition-all duration-300 shadow-lg shadow-yellow-500/30 ${loading
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:from-yellow-500 hover:to-yellow-600'
                  }`}
              >
                {loading ? 'REGISTERING...' : 'REGISTER'}
              </button>

              {/* Secure Registration - UNCHANGED */}
              <div className="bg-gray-100 rounded-xl p-3 flex gap-3 items-center border border-gray-300">
                <ShieldCheck size={32} className="text-yellow-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900">100% Secure Registration</h4>
                  <p className="text-gray-500 text-xs">
                    Your data is encrypted and always protected.
                  </p>
                </div>
              </div>

              {/* Login Link - Mobile only (unchanged), Desktop has it in left panel */}
              <p className="text-center text-gray-500 text-sm md:hidden">
                Already have an account?{" "}
                <Link to="/login" className="text-yellow-500 font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;