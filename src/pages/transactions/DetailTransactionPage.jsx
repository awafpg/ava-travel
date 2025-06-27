import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UploadCloud, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const TransactionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";

  const [transaction, setTransaction] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // Step 1: Find matching transaction ID based on code
  useEffect(() => {
    async function fetchTransactionById() {
      try {
        const detailRes = await axios.get(
          `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/transaction/${id}`,
          {
            headers: {
              apiKey,
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTransaction(detailRes.data.data);
      } catch {
        navigate("/404");
      }
    }

    fetchTransactionById();
  }, [id, navigate, token]);

  const handleUpload = async () => {
    if (!selectedFile || !transaction) return;
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      setUploading(true);
      const res = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Upload success!");
      setUploadedUrl(res.data.url);
    } catch (error) {
      console.log("🚀 ~ handleUpload ~ error:", error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!transaction) return <p className="text-center py-8">Loading...</p>;

  const {
    invoiceId,
    orderDate,
    status,
    totalAmount,
    payment_method,
    transaction_items,
  } = transaction;
  console.log("🚀 ~ TransactionPage ~ status:", status);

  // Determine badge color based on status
  const getStatusColor = (status) => {
    if (status === "cancelled" || status === "Canceled") return "gray";
    if (status === "failed") return "red";
    if (status === "success") return "green";
    return "yellow";
  };
  const statusColor = getStatusColor(status);

  // Approve/Reject transaction handlers
  const handleReject = async () => {
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${id}`,
        { status: "failed" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      toast.error("Transaction rejected.");
      window.location.reload();
    } catch {
      toast.error("Failed to reject transaction.");
    }
  };

  const handleApprove = async () => {
    try {
      await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-transaction-status/${id}`,
        { status: "success" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Transaction approved.");
      window.location.reload();
    } catch {
      toast.error("Failed to approve transaction.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/transaction")}
          className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
        >
          <X className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">Transaction ID</p>
          <p className="font-semibold">{invoiceId}</p>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full bg-${statusColor}-100 text-${statusColor}-600 capitalize`}
        >
          {status}
        </span>
      </div>

      <div
        className={`p-4 bg-${statusColor}-50 text-${statusColor}-700 rounded`}
      >
        {status === "pending" && (
          <>
            <p className="font-semibold">🕒 Waiting for Payment</p>
            <p className="text-sm">
              Please complete your payment and upload proof of payment
            </p>
          </>
        )}
        {statusColor === "red" && status !== "pending" && (
          <>
            <p className="font-semibold">❌ Transaction Cancelled</p>
            <p className="text-sm">This transaction has been cancelled.</p>
          </>
        )}
        {statusColor === "green" && status !== "pending" && (
          <>
            <p className="font-semibold">✅ Payment Success</p>
            <p className="text-sm">Your payment was successful. Thank you!</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Transaction Information</h3>
          <p>
            Amount:{" "}
            <strong className="text-blue-600">
              Rp {totalAmount.toLocaleString()}
            </strong>
          </p>
          <p>Payment Method: {payment_method?.name}</p>
          <p>Date: {new Date(orderDate).toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">
            Items ({transaction_items?.length})
          </h3>
          <ul className="divide-y">
            {transaction_items.map((item, i) => (
              <li key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrls?.[0]}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <p>{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-blue-600 font-medium">
                  Rp {(item.price * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Upload Payment Proof</h3>
          {status === "pending" ? (
            <>
              <p className="text-sm text-gray-600 mb-2">
                Please upload proof after payment is completed.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="mb-2 bg-blue-200 rounded-md p-2 mr-2"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              {uploadedUrl && (
                <div className="mt-2 flex flex-col gap-2">
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 bg-blue-50 p-2 rounded-md underline text-sm"
                  >
                    View Uploaded Proof
                  </a>
                  <div className="flex gap-2">
                    <button
                      className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded"
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                    <button
                      className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p
              className={`text-sm text-gray-600 mb-2 rounded px-2 py-1 bg-${getStatusColor(
                status
              )}-100`}
            >
              Payment proof upload is not available. Status:{" "}
              <span
                className={`capitalize font-semibold text-${getStatusColor(
                  status
                )}-600`}
              >
                {status}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="text-right">
        <button
          onClick={() => navigate("/activities")}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Browse More Activities
        </button>
      </div>
    </div>
  );
};

export default TransactionPage;
