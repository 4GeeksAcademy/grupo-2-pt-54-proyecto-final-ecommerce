import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import CartDrawer from "../components/CartDrawer";

export const Layout = () => {
    return (
        <ScrollToTop>
            <div className="d-flex flex-column min-vh-100">
                <Navbar />
                <main className="flex-fill">
                    <Outlet />
                </main>
                <Footer />
                <CartDrawer />
            </div>
        </ScrollToTop>
    );
};
