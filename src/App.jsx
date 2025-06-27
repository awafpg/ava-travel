import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { HomePage } from "./pages/homepage/HomePage";
import RegisterPage from "./pages/auth/RegisterPage";
import ActivitiesPage from "./pages/activities/ActivitiesPage";
import { ToastContainer } from "react-toastify";
import ActivityDetailPage from "./pages/activityDetail/ActivityDetailPage";
import DefaultLayout from "./layouts/DefaultLayout";
import CategoriesPage from "./pages/categories/CategoriesPage";
import PromoPage from "./pages/promo/PromoPage";
import ProfilePage from "./pages/profil/ProfilPage";
import CartPage from "./pages/cart/CartPage";
import TransactionPage from "./pages/transactions/TransactionPage";
import DetailTransactionPage from "./pages/transactions/DetailTransactionPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center" // required to let it render
        className="!fixed !top-1/2 !left-1/2 !transform !-translate-x-1/2 !-translate-y-1/2 z-[9999]"
        toastClassName="bg-white text-black text-center px-6 py-4 shadow-lg rounded-lg"
        bodyClassName="text-sm font-medium"
        autoClose={2000}
      />

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<CartPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route
              path="/transaction/:id"
              element={<DetailTransactionPage />}
            />
          </Route>
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/promo" element={<PromoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
