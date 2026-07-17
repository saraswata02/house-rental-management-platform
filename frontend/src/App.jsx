import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/TenantDashboard";
import RoleSelection from "./pages/RoleSelection";
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
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/role" element={<RoleSelection />} />
        <Route
  path="/tenant-dashboard"
  element={<TenantDashboard />}
/>

<Route
  path="/owner-dashboard"
  element={<OwnerDashboard />}
/>
<Route path="/properties" element={<Properties />} />
<Route path="/property/:id" element={<PropertyDetails />} />
<Route path="/my-appointments" element={<MyAppointments />} />
      <Route path="/owner-properties" element={<MyProperties />} />
      <Route path="/add-property" element={<AddProperty />} />
      <Route path="/edit-property/:id" element={<EditProperty />} />
      <Route path="/owner-appointments" element={<OwnerAppointments />} />
      <Route path="/appointment-details" element={<AppointmentDetails />} />
      <Route path="/owner-analytics" element={<OwnerAnalytics />} />
      <Route path="/owner-messages" element={<OwnerMessages />} />
      <Route path="/owner-notifications" element={<OwnerNotifications />} />
      <Route path="/owner-profile" element={<OwnerProfile />} />
      <Route
path="/tenant-notifications"
element={<TenantNotifications/>}
/>
<Route
path="/tenant-profile"
element={<TenantProfile/>}
/>
<Route
path="/tenant-messages"
element={<TenantMessages/>}
/>
<Route path="/tenant-wishlist" element={<TenantWishlist />} />
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;