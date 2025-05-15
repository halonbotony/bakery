// components/PaymentMethod.tsx

import React, { useState } from "react";

const paymentOptions = [
  { id: "cash", label: "Cash" },
  { id: "gcash", label: "GCash" },
  { id: "credit_card", label: "Credit Card" },
];

const PaymentMethod: React.FC = () => {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [amountReceived, setAmountReceived] = useState<number>(0);

  const handlePaymentSelect = (id: string) => {
    setSelectedPayment(id);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountReceived(Number(e.target.value));
  };

  const handleConfirmPayment = () => {
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }
    alert(`Payment confirmed via ${selectedPayment.toUpperCase()}.\nAmount: ₱${amountReceived.toFixed(2)}`);
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="relative p-6 w-full max-w-lg bg-pink-200 shadow-lg rounded-lg">
        
        {/* BIG Back Button */}
        <button
          onClick={handleBack}
          className=" top-4 left-4 w-3 h-3  text-5xl rounded-full flex items-center justify-center text-gray-800 font-bold"
        >
          ←
        </button>

        <h2 className="text-2xl font-bold text-center mb-6">Select Payment Method</h2>

        <div className="flex flex-col gap-4 mb-6">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              className={`w-full py-3 text-lg rounded-full border font-medium ${
                selectedPayment === option.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-blue-100`}
              onClick={() => handlePaymentSelect(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-base font-medium mb-1">Amount Received</label>
          <input
            type="number"
            value={amountReceived}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min={0}
            className="w-full px-4 py-3 border rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleConfirmPayment}
          className="w-full py-3 text-lg bg-green-500 text-white rounded-full font-semibold hover:bg-green-600"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
