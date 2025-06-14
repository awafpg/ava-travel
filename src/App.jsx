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

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activities/:id" element={<ActivityDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/promo" element={<PromoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
