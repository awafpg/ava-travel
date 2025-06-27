import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const TransactionPage = () => {
  const [filterStatus, setFilterStatus] = useState("pending");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await axios.get(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/my-transactions",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactions(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    }

    loadTransactions();
  }, []);

  const handleCancelTransaction = async (transactionId) => {
    try {
      const res = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/cancel-transaction/${transactionId}`,
        {},
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("🚀 ~ res:", res);
      // Optionally refresh the list or show a message
      toast.success("Transaction canceled.");
      window.location.reload();
    } catch (err) {
      console.log("🚀 ~ err:", err);
      alert("Failed to cancel transaction.");
    }
  };

  const filteredTransactions = transactions.filter(
    (tx) => tx.status === filterStatus
  );

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <div className="flex items-center mb-4 gap-2">
        <button
          onClick={() => navigate("/activities")}
          className="flex items-center gap-2 text-green-600 hover:underline text-sm font-medium"
        >
          <span className="text-lg">&#60;</span>
          Browse Activities
        </button>
      </div>

      {/* Filter Radio */}
      <div className="flex gap-4 mb-4">
        {[
          { label: "Waiting for Payment", value: "pending" },
          { label: "Success", value: "success" },
          { label: "Canceled", value: "cancelled" },
          { label: "Failed", value: "failed" },
        ].map(({ label, value }) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              name="filter"
              checked={filterStatus === value}
              onChange={() => setFilterStatus(value)}
            />
            {label}
          </label>
        ))}
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-6">
        {filteredTransactions.length === 0 ? (
          <p className="text-gray-500 text-center">No transactions found.</p>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 bg-white shadow rounded-lg flex flex-col gap-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-lg">
                    Invoice #{tx.invoiceId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.orderDate).toLocaleString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-blue-600 font-bold text-lg">
                  Rp {tx.totalAmount.toLocaleString("id-ID")}
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <img
                  src={tx.payment_method?.imageUrl}
                  alt={tx.payment_method?.name}
                  className="w-6 h-4 object-contain"
                />
                <span>{tx.payment_method?.name}</span>
              </div>

              <div className="space-y-2">
                {tx.transaction_items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={item.imageUrls?.[0]}
                      alt={item.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 self-end mt-2">
                {tx.status === "pending" && (
                  <button
                    onClick={() => handleCancelTransaction(tx.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => navigate(`/transaction/${tx.id}`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View Detail
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
