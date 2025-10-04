// src/pages/SubscriptionPage.jsx (FINAL FIX: Check status on load and redirect)

import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
    createPaymentIntent, 
    createSubscription, 
    checkSubscription // ✅ IMPORTED: To check status on load
} from "../services/subscriptionService"; 
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

const SubscriptionPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { title, price } = location.state || { title: "Unknown", price: "N/A" };

  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [payment, setPayment] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // 'paid', 'pending', 'failed'
  // 🌟 NEW STATE: To hide form while checking status
  const [isCheckingStatus, setIsCheckingStatus] = useState(true); 

  // Escape key handling (same as before)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (showSuccessModal) setShowSuccessModal(false);
        else navigate(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate, showSuccessModal]);

  // ---------------- ✅ CRITICAL FIX: Check Subscription Status on Load ----------------
  useEffect(() => {
    const checkStatusAndRedirect = async () => {
        // Set loading state to hide the form initially
        setIsCheckingStatus(true);
        try {
            // id is the testId
            const response = await checkSubscription(id); 
            
            if (response && response.isSubscribed) {
                toast.success("You are already subscribed to this test. Redirecting!");
                // 🚀 DIRECT REDIRECT to MCQ page if already paid
                navigate(`/mcqs/${id}`, { replace: true }); 
                // Important: Return here to stop further execution
                return;
            }
        } catch (error) {
            console.error("Error checking initial subscription status:", error);
        } finally {
            // Once check is complete (and no redirect happened), show the form
            setIsCheckingStatus(false);
        }
    };
    
    if (id) {
        checkStatusAndRedirect();
    }
  }, [id, navigate]); 
  // ---------------- END CRITICAL FIX ----------------

  // ---------------- Validation ---------------- (Same as before)
  const validateField = (field, value) => {
    let error = "";
    switch (field) {
      case "name":
        if (!value.trim()) error = "Name is required";
        else if (value.trim().length < 2) error = "Name must be at least 2 characters";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email";
        break;
      case "payment":
        if (!value) error = "Please select a payment method";
        break;
      case "extraInfo":
        if ((payment === "Easypaisa" || payment === "JazzCash")) {
          if (!value.trim()) error = "Mobile number is required";
          else if (!/^03\d{9}$/.test(value)) error = "Enter valid 11-digit number starting with 03";
        } else if (payment === "Bank Transfer") {
          if (!value.trim()) error = "Transaction ID is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (field, value) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  };

  const handleFieldChange = (field, value) => {
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "payment") {
      setPayment(value);
      setExtraInfo("");
    }
    if (field === "extraInfo") setExtraInfo(value);

    if (touched[field]) {
      setErrors((e) => ({ ...e, [field]: validateField(field, value) }));
    }
  };

  // ---------------- Handle Subscribe (Main Logic) ----------------
  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateField("name", name),
      email: validateField("email", email),
      payment: validateField("payment", payment),
      extraInfo: validateField("extraInfo", extraInfo),
    };
    setErrors(newErrors);
    setTouched({ name: true, email: true, payment: true, extraInfo: true });
    if (Object.values(newErrors).some((err) => err && err.length > 0)) return;

    try {
      setIsLoading(true);

      let paymentIntentIdLocal = "";
      let cardLast4 = "";
      let cardBrand = "";

      // Handle Card Payment (Stripe) (SAME)
      if (payment === "Credit/Debit Card") {
        if (!stripe || !elements) {
          toast.error("Stripe has not loaded yet. Please wait.");
          setIsLoading(false);
          return;
        }

        // Step 1: Create PaymentIntent on backend
        const intentRes = await createPaymentIntent({ price, title, name, email });

        if (!intentRes || !intentRes.client_secret) {
          toast.error("Failed to start card payment. Please check network.");
          setIsLoading(false);
          return;
        }

        const cardElement = elements.getElement(CardElement);

        // Step 2: Confirm payment with Stripe Elements
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          intentRes.client_secret,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name, email },
            },
          }
        );

        if (error) {
          toast.error(error.message || "Card payment failed due to an error.");
          setIsLoading(false);
          return;
        }

        if (paymentIntent.status !== "succeeded" && paymentIntent.status !== "requires_action") {
          toast.error(`Payment failed with status: ${paymentIntent.status}`);
          setIsLoading(false);
          return;
        }

        paymentIntentIdLocal = paymentIntent.id;

        // Safely fetch card details
        const charge = paymentIntent.charges?.data?.[0];
        if (charge?.payment_method_details?.card) {
          cardLast4 = charge.payment_method_details.card.last4;
          cardBrand = charge.payment_method_details.card.brand;
        }
      }
      
      // Step 3: Create subscription in DB (For both Card and Local Payments)
      const subscriptionRes = await createSubscription({
        testId: id,
        title,
        price,
        name,
        email,
        payment,
        paymentIntentId: paymentIntentIdLocal,
        cardLast4,
        cardBrand,
        extraInfo,
      });
      
      setSubscriptionStatus(subscriptionRes.status);
      
      if (subscriptionRes.status === 'paid') {
          toast.success("Payment successful! You can now start the test.");
      } else if (subscriptionRes.status === 'pending') {
          toast('Subscription created, waiting for verification. Check email for details.', { icon: '⏳' });
      } else {
          toast.error("Subscription recorded but payment status is failed/unknown.");
      }

      setShowSuccessModal(true);
    } catch (err) {
      console.error("Failed to create subscription:", err);
      
      // 🌟 FIX 2: Handle 409 Conflict (Already Subscribed) on form submission
      if (err.response && err.response.status === 409) {
        // If already subscribed, treat it as a success for redirection
        toast.success("You are already subscribed to this test! Redirecting now.");
        setSubscriptionStatus('paid'); // Set status to paid to trigger Start Test button
        setShowSuccessModal(true); 
      } else {
        // Handle all other errors
        toast.error(err.response?.data?.error || err.message || "Could not process your subscription. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------
  const handleClose = () => navigate(-1);
  // Modal content based on status (SAME)
  const getModalContent = () => {
    let icon, titleText, bodyText, buttonText, buttonAction;

    if (subscriptionStatus === 'paid') {
      icon = '✅';
      titleText = "Payment Successful!";
      bodyText = `Thank you ${name}, your subscription to ${title} has been processed. You can now start the test.`;
      buttonText = "🚀 Start Test";
      // 🌟 FIX: Navigate to the correct MCQ route
      buttonAction = () => navigate(`/mcqs/${id}`); 
    } else if (subscriptionStatus === 'pending') {
      icon = '⏳';
      titleText = "Subscription Received!";
      bodyText = `Thank you ${name}, we have received your payment information for ${title}. Your access will be activated once the payment is verified by our admin. Check your email for more details.`;
      buttonText = "Close";
      buttonAction = () => setShowSuccessModal(false);
    } else {
      icon = '⚠️';
      titleText = "Transaction Status Unknown";
      bodyText = `An issue occurred while confirming the subscription for ${title}. Please contact support with your email (${email}) for verification.`;
      buttonText = "Close";
      buttonAction = () => setShowSuccessModal(false);
    }

    return { icon, titleText, bodyText, buttonText, buttonAction };
  }
  
  // ---------------- UI/Render ----------------
  return (
    <>
      {/* Fixed Background container z-index z-20 (below Navbar) */}
      <div className="fixed inset-0 z-20"> 
        {/* Fixed Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-teal-500 to-purple-600 opacity-85"></div>
        {/* Fixed Blur Backdrop */}
        <div className="absolute inset-0 backdrop-blur-sm"></div>
      </div>

      {/* Scrollable Form Container */}
      <div className="relative z-30 flex justify-center px-2 sm:px-4 min-h-screen overflow-y-auto pt-24">
        
        {/* 🌟 NEW: Show Loading Spinner if checking status 
            This prevents a flicker before redirecting/showing the form.
        */}
        {isCheckingStatus ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-white">
                 <span className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                 <p className="mt-4 text-lg">Checking subscription status...</p>
            </div>
        ) : (
            // Main Form Container - Show form only if not subscribed and status check is complete
            <div className="relative w-full max-w-3xl py-6 p-4 sm:p-6 md:p-10 rounded-3xl bg-white/10 border border-white/20 shadow-2xl my-auto"> 
              <button
                onClick={handleClose}
                aria-label="close"
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:rotate-90 transition-transform"
              >
                &times;
              </button>
              <div className="text-center mb-6">
                <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight mb-1">
                  {`Subscribe to ${title}`}
                </h2>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-teal-300 font-semibold text-xl md:text-2xl">
                  Rs {price}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubscribe} className="space-y-4 text-left">
                {/* ... rest of your form inputs (name, email, payment method, etc.) ... */}
                {/* I have removed the massive form block here to keep the answer clean. 
                    Your existing form JSX should go here. It is lengthy but correct.
                */}
                
                {/* Name + Email fields and validation messages (Start) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-white/80 mb-1 block">Full name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => handleFieldChange("name", e.target.value)}
                            onBlur={() => handleBlur("name", name)}
                            className={`w-full px-4 py-3 rounded-xl bg-white/6 border ${
                                touched.name && errors.name
                                    ? "border-red-400"
                                    : touched.name && !errors.name
                                    ? "border-green-400"
                                    : "border-white/20"
                            } text-white outline-none transition placeholder-white/50`}
                        />
                        {touched.name && errors.name && (
                            <p className="text-red-300 text-sm mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm text-white/80 mb-1 block">Email address</label>
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => handleFieldChange("email", e.target.value)}
                            onBlur={() => handleBlur("email", email)}
                            className={`w-full px-4 py-3 rounded-xl bg-white/6 border ${
                                touched.email && errors.email
                                    ? "border-red-400"
                                    : touched.email && !errors.email
                                    ? "border-green-400"
                                    : "border-white/20"
                            } text-white outline-none transition placeholder-white/50`}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>
                </div>
                {/* Name + Email fields and validation messages (End) */}

                {/* Payment Method field and validation messages (Start) */}
                <div>
                    <label className="text-sm text-white/80 mb-1 block">Payment method</label>
                    <select
                        value={payment}
                        onChange={(e) => handleFieldChange("payment", e.target.value)}
                        onBlur={() => handleBlur("payment", payment)}
                        className={`w-full px-4 py-3 rounded-xl bg-white/6 border ${
                            touched.payment && errors.payment
                                ? "border-red-400"
                                : touched.payment && !errors.payment
                                ? "border-green-400"
                                : "border-white/20"
                        } text-black outline-none transition`}
                    >
                        <option value="">Select payment method</option>
                        <option value="Credit/Debit Card">💳 Credit/Debit Card</option>
                        <option value="Easypaisa">📱 Easypaisa</option>
                        <option value="JazzCash">📱 JazzCash</option>
                        <option value="Bank Transfer">🏦 Bank Transfer</option>
                    </select>
                    {touched.payment && errors.payment && (
                        <p className="text-red-300 text-sm mt-1">{errors.payment}</p>
                    )}
                </div>
                {/* Payment Method field and validation messages (End) */}

                {/* Card Element (Start) */}
                {payment === "Credit/Debit Card" && (
                    <div>
                        <label className="text-sm text-white/80 mb-1 block">Card Details</label>
                        <div className="p-3 border rounded-xl bg-white/6">
                            <CardElement options={{ hidePostalCode: true, style: { base: { color: 'white' } } }} />
                        </div>
                    </div>
                )}
                {/* Card Element (End) */}

                {/* Local Payment Instructions Section (Easypaisa / JazzCash) (Start) */}
                {(payment === "Easypaisa" || payment === "JazzCash") && (
                    <div className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-white/90">
                            <p className="font-bold mb-2 text-teal-300">📱 Easypaisa / JazzCash Instructions:</p>
                            <ol className="list-decimal list-inside ml-2 space-y-1 text-sm">
                                <li>Apne mobile app se is account par **Rs {price}** transfer karein.</li>
                                <li>**Account Number:** <b className="text-white">03XXXXXXXXX</b> (Is number ko apne account number se change karein).</li>
                                <li>**Account Title:** <b className="text-white">[Your Name]</b>.</li>
                                <li>Payment transfer karne ke baad, woh **Mobile Number** jiss se aap ne payment bheji hai, woh niche enter karein.</li>
                                <li>Aap ka access **verification** ke baad active ho ga.</li>
                            </ol>
                        </div>
                        
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">Mobile number (03XXXXXXXXX)</label>
                            <input
                                type="tel"
                                placeholder="0300xxxxxxx"
                                value={extraInfo}
                                onChange={(e) =>
                                    handleFieldChange("extraInfo", e.target.value.replace(/\D/g, "").slice(0, 11))
                                }
                                onBlur={() => handleBlur("extraInfo", extraInfo)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/6 border ${
                                    touched.extraInfo && errors.extraInfo
                                        ? "border-red-400"
                                        : touched.extraInfo && !errors.extraInfo
                                        ? "border-green-400"
                                        : "border-white/20"
                                } text-white placeholder-white/50 outline-none transition`}
                            />
                            {touched.extraInfo && errors.extraInfo && (
                                <p className="text-red-300 text-sm mt-1">{errors.extraInfo}</p>
                            )}
                        </div>
                    </div>
                )}
                {/* Local Payment Instructions Section (Easypaisa / JazzCash) (End) */}

                {/* Local Payment Instructions Section (Bank Transfer) (Start) */}
                {payment === "Bank Transfer" && (
                    <div className="space-y-4">
                        <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-white/90">
                            <p className="font-bold mb-2 text-teal-300">🏦 Bank Transfer Instructions:</p>
                            <p className="mb-2 text-sm">Apne bank app se is account mein **Rs {price}** transfer karein:</p>
                            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                                <li>**Bank Name:** <b className="text-white">[Bank Name]</b> (e.g., HBL, Meezan).</li>
                                <li>**Account Title:** <b className="text-white">[Your Name]</b>.</li>
                                <li>**Account Number:** <b className="text-white">01234567890123</b> (Apna number daalein).</li>
                            </ul>
                            <p className="mt-3 text-sm">Transfer ke baad, **Transaction ID (TID) / Reference Number** niche enter karein.</p>
                        </div>
                        
                        <div>
                            <label className="text-sm text-white/80 mb-1 block">Transaction ID / Reference Number</label>
                            <input
                                type="text"
                                placeholder="Enter transaction ID"
                                value={extraInfo}
                                onChange={(e) => handleFieldChange("extraInfo", e.target.value)}
                                onBlur={() => handleBlur("extraInfo", extraInfo)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/6 border ${
                                    touched.extraInfo && errors.extraInfo
                                        ? "border-red-400"
                                        : touched.extraInfo && !errors.extraInfo
                                        ? "border-green-400"
                                        : "border-white/20"
                                } text-white placeholder-white/50 outline-none transition`}
                            />
                            {touched.extraInfo && errors.extraInfo && (
                                <p className="text-red-300 text-sm mt-1">{errors.extraInfo}</p>
                            )}
                        </div>
                    </div>
                )}
                {/* Local Payment Instructions Section (Bank Transfer) (End) */}

                {/* Submit */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-green-400 to-teal-400 text-black font-bold shadow-lg hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin inline-block" />
                        Processing...
                      </span>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>

      {/* Success Modal (SAME) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          />
          {/* Modal Content */}
          <div className="relative max-w-lg w-full bg-white/95 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 z-10"> 
            {subscriptionStatus && (() => {
                const { icon, titleText, bodyText, buttonText, buttonAction } = getModalContent();
                return (
                    <>
                        <h2 className="text-2xl font-bold text-black mb-4">
                            {icon} {titleText}
                        </h2>
                        <p className="text-black/80 mb-6">
                            {bodyText}
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="flex-1 py-2 rounded-xl bg-gray-300 text-black font-semibold hover:bg-gray-400 transition"
                            >
                                Close
                            </button>
                            {subscriptionStatus === 'paid' && (
                                <button
                                    onClick={buttonAction}
                                    className="flex-1 py-2 rounded-xl bg-green-400 text-black font-semibold hover:bg-green-500 transition"
                                >
                                    {buttonText}
                                </button>
                            )}
                        </div>
                    </>
                );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPage;