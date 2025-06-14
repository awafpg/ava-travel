import NavBar from "../components/NavBar";
import Footer from "../components/footer";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet /> {/* This is where nested routes render */}
      </main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;
