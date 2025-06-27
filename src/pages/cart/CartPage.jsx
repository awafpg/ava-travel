import axios from "axios";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CartPage = () => {
  const apiKey = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
  const token = localStorage.getItem("token");
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  async function fetchCarts() {
    try {
      const cartRes = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const cart = cartRes.data.data;
      localStorage.setItem("cartLength", cart.length);
      setCartItems(cart);

      const paymentRes = await axios.get(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentMethods(paymentRes.data.data);
    } catch (err) {
      console.error("Failed to fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  const updateQuantity = async (itemId, newQty) => {
    try {
      const res = await axios.post(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${itemId}`,
        { quantity: newQty },
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const parsed = JSON.parse(res.config.data);
      localStorage.setItem("cartLength", parsed.quantity);
      fetchCarts();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const handleDeleteCart = async (cartId) => {
    try {
      await axios.delete(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartId}`,
        {
          headers: {
            apiKey,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      fetchCarts();
    } catch (err) {
      console.error("Failed to delete cart item:", err);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!selectedBank) {
      toast.error("Please Choose The payment method");
      return;
    }
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item to proceed.");
      return;
    }

    try {
      // Step 1: Generate payment methods (optional step, bisa di-skip kalau tidak dibutuhkan)
      const res = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/generate-payment-methods",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey,
          },
        }
      );

      toast.success(res.data.message);

      // Step 2: Buat transaksi menggunakan cartIds & paymentMethodId
      console.log("🚀 ~ fetchPaymentMethods ~ selectedItems:", selectedItems);
      const createTransactionRes = await axios.post(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          cartIds: selectedItems.map((item) => item.id),
          paymentMethodId: selectedBank.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey,
          },
        }
      );
      console.log(
        "🚀 ~ fetchPaymentMethods ~ createTransactionRes:",
        createTransactionRes
      );
      fetchCarts(); // Refresh cart items after transaction creation

      // Step 3: Arahkan ke halaman detail transaksi (gunakan ID dari response)
      navigate(`/transaction`);
    } catch (error) {
      console.error("Failed to create transaction:", error);
      toast.error("Failed to create transaction");
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.id === itemId);
      if (exists) {
        return prev.filter((i) => i.id !== itemId);
      } else {
        const found = cartItems.find((i) => i.id === itemId);
        return [...prev, found];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const subtotal = selectedItems.reduce(
    (total, item) => total + item.activity.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (loading) return <p>Loading cart…</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>
      <input
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
        className="mr-2"
      />
      <label className="text-sm font-medium">Select All</label>
      <div className="flex justify-between mt-4 flex-col md:flex-row">
        {/* LEFT: List of Activities */}
        <div className="sm:mr-6 mb-4 md:col-span-2 space-y-6">
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-10 flex flex-col items-center justify-center min-h-[200px]">
              <p className="text-gray-500 text-lg mb-4">
                Belum ada pesanan di keranjang.
              </p>
              <a
                href="/activities"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Browse Activities
              </a>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 rounded-lg p-4 shadow-md bg-white"
              >
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div></div>{" "}
                  <div className="flex items-center gap-3 md:gap-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-blue-500"
                      checked={selectedItems.some((i) => i.id === item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                    <img
                      src={item.activity.imageUrls[0]}
                      alt={item.activity.title}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                      }}
                      className="w-32 h-24 md:w-48 md:h-32 object-cover rounded-md border"
                    />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  {/* Title & Location */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    {/* Left: Title, Location, Unit Price */}
                    <div>
                      <h2 className="text-lg font-semibold">
                        {item.activity.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {item.activity.city}, {item.activity.province}
                      </p>
                      <div className="text-blue-600 font-semibold">
                        Rp {item.activity.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:items-end gap-2">
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteCart(item.id)}
                        className="self-start sm:self-end p-1 text-red-400 hover:text-red-600 transition-transform duration-200 transform hover:scale-125"
                        title="Remove from cart"
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Quantity Controls */}
                      <div className="flex justify-around sm:justify-start items-center gap-2 border border-gray-300 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                          className="px-2 py-1 border-r border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="px-2 py-1 border-l border-gray-300 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Total Price */}
                      <p className="font-semibold text-blue-500 whitespace-nowrap">
                        Rp{" "}
                        {(item.activity.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="sticky top-20 bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="mb-2 flex justify-between">
            <span>Subtotal ({cartItems.length} items)</span>
            <span>Rp {subtotal.toLocaleString()}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>Tax (10%)</span>
            <span>Rp {tax.toLocaleString()}</span>
          </div>
          <div className="mb-4 flex justify-between font-bold text-blue-600">
            <span>Total</span>
            <span>Rp {total.toLocaleString()}</span>
          </div>
          {/* Promo */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Promo code"
              className="border rounded-md px-3 py-2 w-full mb-2"
            />
            <button className="bg-blue-500 text-white w-full py-2 rounded-md hover:bg-blue-600">
              Apply
            </button>
          </div>
          {/* Payment Method */}

          <div className="mb-6">
            <p className="font-medium mb-2">Payment Method</p>
            {paymentMethods.map((bank) => (
              <label
                key={bank.id}
                className={`flex items-center gap-3 mb-2 border px-3 py-2 rounded-lg cursor-pointer transition 
        ${
          selectedBank === bank.name
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300"
        }`}
              >
                <input
                  type="radio"
                  name="bank"
                  value={bank.name}
                  checked={selectedBank.name === bank.name}
                  onChange={() => setSelectedBank(bank)}
                  className="accent-blue-500"
                />
                <img
                  src={bank.imageUrl}
                  alt={bank.name}
                  className="w-8 h-6 object-contain"
                />
                <span className="font-medium">{bank.name}</span>
              </label>
            ))}
          </div>
          {/* Checkout Button */}
          <button
            onClick={() => {
              fetchPaymentMethods();
            }}
            className="bg-blue-500 text-white w-full py-3 rounded-lg text-center font-medium hover:bg-blue-600"
          >
            🛒 Proceed to Checkout
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            Secure checkout. Your data is protected.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
