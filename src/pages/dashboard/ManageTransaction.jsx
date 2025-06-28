import React, { useEffect, useState } from "react";

const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const BASE_URL = "http://localhost:4000";

const ManageTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/all-transactions`, {
      headers: {
        apiKey: API_KEY,
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();
    setTransactions(json.data || []);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const res = await fetch(
      `${BASE_URL}/api/v1/update-transaction-status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey: API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (res.ok) fetchTransactions();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((tx) => (
            <div key={tx.id} className="border rounded shadow p-4">
              <h3 className="font-semibold text-lg">#{tx.code}</h3>
              <p className="text-sm text-gray-600">
                Total: Rp{tx.totalPayment?.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Status:
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-white text-xs ${
                    tx.status === "success"
                      ? "bg-green-600"
                      : tx.status === "failed"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {tx.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Payment: {tx.paymentMethod?.name}
              </p>

              {tx.proofPaymentUrl && (
                <a
                  href={tx.proofPaymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mt-1 block"
                >
                  View Proof
                </a>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  Change Status:
                </label>
                <select
                  value={tx.status}
                  onChange={(e) => handleStatusChange(tx.id, e.target.value)}
                  className="w-full border p-1 rounded"
                >
                  <option value="waiting">waiting</option>
                  <option value="success">success</option>
                  <option value="failed">failed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageTransaction;
