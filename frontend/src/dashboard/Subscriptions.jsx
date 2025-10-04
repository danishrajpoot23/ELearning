import { useEffect, useState } from "react";
import { verifySubscription, fetchAllSubscriptions } from "../services/adminSubscriptionService";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await fetchAllSubscriptions();
      if (Array.isArray(data)) {
        setSubscriptions(data);
      } else if (Array.isArray(data.subscriptions)) {
        setSubscriptions(data.subscriptions);
      } else {
        setSubscriptions([]);
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
      toast.error(err.message || "Failed to load subscriptions. Check if Admin token is valid.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleVerify = async (id) => {
    try {
      setVerifyingId(id);
      const res = await verifySubscription(id);
      if (res?.error) {
        throw new Error(res.error);
      }
      toast.success("Subscription verified successfully!");
      fetchSubscriptions();
    } catch (err) {
      console.error("Verification failed:", err);
      toast.error(err.message || "Failed to verify subscription");
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    // ✨ KEY CHANGE HERE: Added flex properties to center the child div
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* This inner card will now be centered on the page */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-7xl">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Subscriptions
        </h1>

        {loading ? (
          <p className="text-gray-500">Loading subscriptions...</p>
        ) : subscriptions.length === 0 ? (
          <p className="text-gray-500">No subscriptions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Name</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Email</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Test</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Payment</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Price</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Status</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Transaction ID</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Created At</th>
                  <th className="py-3 px-4 text-left font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                  <tr
                    key={sub._id}
                    className={`hover:bg-gray-50 ${
                      verifyingId === sub._id ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="py-3 px-4">{sub.name}</td>
                    <td className="py-3 px-4">{sub.email}</td>
                    <td className="py-3 px-4">{sub.title}</td>
                    <td className="py-3 px-4">{sub.paymentMethod}</td>
                    <td className="py-3 px-4">{sub.price}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        sub.status === "paid"
                          ? "text-green-600"
                          : sub.status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {sub.status}
                    </td>
                    <td className="py-3 px-4 truncate max-w-xs">{sub.transactionId}</td>
                    <td className="py-3 px-4">
                      {sub.createdAt ? new Date(sub.createdAt).toLocaleString() : ""}
                    </td>
                    <td className="py-3 px-4">
                      {sub.paymentMethod &&
                      ["easypaisa", "jazzcash"].includes(sub.paymentMethod.toLowerCase()) &&
                      sub.status === "pending" ? (
                        <button
                          onClick={() => handleVerify(sub._id)}
                          disabled={verifyingId === sub._id}
                          className={`flex items-center gap-2 px-3 py-1 rounded text-white ${
                            verifyingId === sub._id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {verifyingId === sub._id ? (
                            <>
                              <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                              </svg>
                              Verifying…
                            </>
                          ) : (
                            "✅ Verify"
                          )}
                        </button>
                      ) : sub.status === "paid" ? (
                        <span className="text-gray-400">Verified</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriptions;