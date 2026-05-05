import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ListingsView from "./pages/ListingsView";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import PublicLayout from "./layout/PublicLayout";
import ScrollToTop from "./components/ScrollToTop";
import CreateBusiness from "./pages/admin/CreateBusiness";
import EditBusiness from "./pages/admin/EditBusiness";
import { Toaster } from "sonner";
import BusinessesList from "./pages/admin/BusinessesList";
import ReviewsList from "./pages/admin/ReviewsList";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-right" richColors theme="dark" />
      <Routes>
        {/*This is Public Layout */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingsView />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/*This is Admin Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/businesses" element={<BusinessesList />} />
          <Route path="/businesses/create" element={<CreateBusiness />} />
          <Route path="/businesses/edit/:id" element={<EditBusiness />} />
          <Route path="/businesses/:id/reviews" element={<ReviewsList />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;