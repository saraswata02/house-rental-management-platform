# SmartrentAI Frontend Application

This directory contains the React 19 + Vite frontend client for the **SmartrentAI** House Rental & Property Management Platform.

---

## 🧰 Tech Stack & Libraries

- **React 19**: Modern UI library utilizing functional components and hooks.
- **Vite 8**: Next Generation Frontend Tooling for fast HMR and optimized production builds.
- **React Router DOM v7**: Client-side routing for multi-page application flows.
- **Recharts**: Responsive charting library for owner analytics and metrics.
- **React Google Maps API**: Interactive maps for property location display.
- **React Icons**: Icon system covering navigation, actions, and features.
- **Axios**: HTTP client for API requests.

---

## 📂 Component & Page Architecture

```
src/
├── components/
│   ├── AuthNavbar.jsx        # Navigation bar for authentication flows
│   ├── BookVisitModal.jsx    # Modal for booking property visit appointments
│   ├── ConfirmationModal.jsx # Reusable confirmation dialog modal
│   ├── Footer.jsx            # Footer component
│   ├── HeroSlider.jsx        # Hero banner image slider
│   ├── ImageGallery.jsx      # Property image showcase gallery
│   ├── Navbar.jsx            # Main navigation bar with role switching
│   ├── OwnerNavbar.jsx       # Landlord-specific navigation bar
│   ├── OwnerSlider.jsx       # Landlord dashboard banner slider
│   ├── PropertyCard.jsx      # Rental property card preview
│   ├── PropertyFilter.jsx    # Advanced property filter bar
│   ├── PropertyMap.jsx       # Google Maps property pin display
│   ├── QuickStats.jsx        # Dashboard metric statistics cards
│   ├── RescheduleModal.jsx   # Appointment rescheduling modal
│   └── SearchBar.jsx         # Global search input component
│
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── RoleSelection.jsx     # User role onboarding (Tenant vs Owner)
│   ├── Login.jsx             # User authentication login page
│   ├── Signup.jsx            # User registration signup page
│   │
│   ├── Tenants/
│   │   ├── Properties.jsx           # Property listing directory
│   │   ├── PropertyDetails.jsx      # Individual property view with booking
│   │   ├── TenantDashboard.jsx      # Tenant control center & activity
│   │   ├── MyAppointments.jsx       # Scheduled property visits
│   │   ├── TenantWishlist.jsx       # Saved favorite properties
│   │   ├── TenantMessages.jsx       # Messaging interface with landlords
│   │   ├── TenantNotifications.jsx  # Real-time alert feed
│   │   └── TenantProfile.jsx        # User account & preference settings
│   │
│   └── Owners/
│       ├── OwnerDashboard.jsx       # Landlord control center
│       ├── MyProperties.jsx         # Property listing management
│       ├── AddProperty.jsx          # New listing creation form
│       ├── EditProperty.jsx         # Listing edit form
│       ├── OwnerAppointments.jsx    # Received visit request management
│       ├── OwnerAnalytics.jsx       # Performance & inquiry metrics
│       ├── OwnerMessages.jsx        # Communication portal with tenants
│       ├── OwnerNotifications.jsx   # Owner alert feed
│       └── OwnerProfile.jsx         # Landlord account details
```

---

## ⚡ Quick Start

```bash
# Navigate to frontend folder
cd frontend

# Install node packages
npm install

# Start Vite dev server
npm run dev
```

The app will start at `http://localhost:5173`.
