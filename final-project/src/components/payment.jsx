import React, { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";

export default function Payment() {
  const [method, setMethod] = useState("card"); // default is card
  const [form, setForm] = useState({ name: "", card: "", expiry: "", cvv: "", upi: "" });
  const [status, setStatus] = useState("");
  const [processing, setProcessing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // ✅ Data from previous page
  const { place, stayName, amount, date, type } = location.state || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setStatus("");

    setTimeout(() => {
      if (method === "card") {
        if (
          form.name.length > 2 &&
          form.card.length === 16 &&
          form.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
          form.cvv.length === 3
        ) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } else if (method === "upi") {
        if (form.upi.includes("@")) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      }
      setProcessing(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-indigo-800 to-gray-900 px-4">
      <div className="bg-white text-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Secure Checkout</h2>
          <p className="text-gray-500 text-sm mt-1">Complete your booking payment safely</p>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm space-y-1 border border-gray-200">
          <p><strong>📍 Place:</strong> {place || "N/A"}</p>
          <p><strong>🏨 Stay / Spot:</strong> {stayName || "N/A"}</p>
          <p><strong>🗂️ Type:</strong> {type || "N/A"}</p>
          <p><strong>📅 Date:</strong> {date || "Not Selected"}</p>
          <p className="text-lg mt-2 font-semibold text-indigo-700">
            💰 Total Amount: ₹{amount || 0}
          </p>
        </div>

        {/* Payment Method Tabs */}
        <div className="flex mb-4 border-b border-gray-300">
          <button
            className={`flex-1 py-2 font-semibold ${
              method === "card"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setMethod("card")}
          >
            💳 Card
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${
              method === "upi"
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500"
            }`}
            onClick={() => setMethod("upi")}
          >
            📱 UPI
          </button>
        </div>

        {/* Payment Form / Status */}
        {status === "" && !processing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {method === "card" ? (
              <>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Card Number (16 digits)"
                  maxLength="16"
                  value={form.card}
                  onChange={(e) => setForm({ ...form, card: e.target.value })}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    className="px-4 py-2 w-1/2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength="3"
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                    className="px-4 py-2 w-1/2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </>
            ) : (
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., name@upi)"
                value={form.upi}
                onChange={(e) => setForm({ ...form, upi: e.target.value })}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
            >
              {method === "card" ? "Pay with Card" : "Pay with UPI"} ₹{amount || 0}
            </button>
          </form>
        ) : processing ? (
          <div className="text-center text-yellow-600 font-semibold">
            ⏳ Processing your payment...
          </div>
        ) : status === "success" ? (
          <div className="text-center">
            <p className="text-green-600 font-bold text-lg">✅ Payment Successful!</p>
            <p className="text-gray-600 mt-2">Transaction ID: #{Date.now()}</p>
            <p className="text-sm mt-2">Thank you for booking with us 🙌</p>
            <button
            onClick={()=>{navigate('/login')} } 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Home
          </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-red-600 font-bold text-lg">❌ Payment Failed!</p>
            <p className="text-gray-600 mt-2">Please try again with valid details.</p>
            <button
              onClick={() => {window.location.reload();} }   
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Retry Payment
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
