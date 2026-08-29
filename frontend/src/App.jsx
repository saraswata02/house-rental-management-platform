import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TenantDashboard from "./pages/TenantDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import MyAppointments from "./pages/MyAppointments";
import MyProperties from "./pages/MyProperties";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import OwnerAppointments from "./pages/OwnerAppointments";
import AppointmentDetails from "./pages/AppointmentDetails";
import OwnerAnalytics from "./pages/OwnerAnalytics";
import OwnerMessages from "./pages/OwnerMessages";
import OwnerNotifications from "./pages/OwnerNotifications";
import OwnerProfile from "./pages/OwnerProfile";
import TenantNotifications from "./pages/TenantNotifications";
import TenantProfile from "./pages/TenantProfile";
import TenantMessages from "./pages/TenantMessages";
import TenantWishlist from "./pages/TenantWishlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* Tenant-only routes */}
        <Route path="/tenant-dashboard" element={<ProtectedRoute requiredRole="tenant"><TenantDashboard /></ProtectedRoute>} />
        <Route path="/my-appointments" element={<ProtectedRoute requiredRole="tenant"><MyAppointments /></ProtectedRoute>} />
        <Route path="/tenant-notifications" element={<ProtectedRoute requiredRole="tenant"><TenantNotifications /></ProtectedRoute>} />
        <Route path="/tenant-profile" element={<ProtectedRoute requiredRole="tenant"><TenantProfile /></ProtectedRoute>} />
        <Route path="/tenant-messages" element={<ProtectedRoute requiredRole="tenant"><TenantMessages /></ProtectedRoute>} />
        <Route path="/tenant-wishlist" element={<ProtectedRoute requiredRole="tenant"><TenantWishlist /></ProtectedRoute>} />

        {/* Owner-only routes */}
        <Route path="/owner-dashboard" element={<ProtectedRoute requiredRole="landlord"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner-properties" element={<ProtectedRoute requiredRole="landlord"><MyProperties /></ProtectedRoute>} />
        <Route path="/add-property" element={<ProtectedRoute requiredRole="landlord"><AddProperty /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute requiredRole="landlord"><EditProperty /></ProtectedRoute>} />
        <Route path="/owner-appointments" element={<ProtectedRoute requiredRole="landlord"><OwnerAppointments /></ProtectedRoute>} />
        <Route path="/appointment-details" element={<ProtectedRoute requiredRole="landlord"><AppointmentDetails /></ProtectedRoute>} />
        <Route path="/owner-analytics" element={<ProtectedRoute requiredRole="landlord"><OwnerAnalytics /></ProtectedRoute>} />
        <Route path="/owner-messages" element={<ProtectedRoute requiredRole="landlord"><OwnerMessages /></ProtectedRoute>} />
        <Route path="/owner-notifications" element={<ProtectedRoute requiredRole="landlord"><OwnerNotifications /></ProtectedRoute>} />
        <Route path="/owner-profile" element={<ProtectedRoute requiredRole="landlord"><OwnerProfile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;