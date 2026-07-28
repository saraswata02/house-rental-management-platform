# SmartrentAI - House Rental & Property Management Platform

SmartrentAI is a modern, full-featured web application designed to connect property owners/landlords and tenants seamlessly. The platform offers dedicated portals for tenants to discover, filter, and schedule property visits, while giving landlords powerful tools to manage listings, track inquiries, view analytics, and coordinate property tours.

---

## 🚀 Features

### 🏢 Tenant Portal
- **Property Search & Discovery**: Search properties with advanced filtering options (price range, property type, location, amenities, and availability).
- **Interactive Google Maps**: View property locations directly on an integrated map view.
- **Visit Booking & Rescheduling**: Schedule property visits online with real-time slot selection, status tracking, and rescheduling capabilities.
- **Property Details & Galleries**: Explore high-resolution property image galleries, detailed specifications, host profiles, and similar property recommendations.
- **Wishlist & Favorites**: Save properties to a personal wishlist for quick access.
- **Direct Messaging & Notifications**: Communicate directly with property owners and receive instant status updates on visit requests.

### 🏠 Owner / Landlord Portal
- **Dashboard & Quick Analytics**: View key statistics including active listings, pending visit requests, total inquiries, and occupancy metrics.
- **Property Management**: Add, update, edit, and manage rental property listings with rich details and photo galleries.
- **Appointment & Tour Management**: Manage tenant visit requests, approve/reschedule appointments, and track visit histories.
- **Advanced Analytics**: Interactive charts powered by Recharts for tracking views, inquiries, and revenue trends over time.
- **Tenant Communication**: Integrated messaging portal to answer tenant inquiries and coordinate leases.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Mapping & Location**: [@react-google-maps/api](https://www.npmjs.com/package/@react-google-maps/api)
- **Icons & UI Elements**: [React Icons](https://react-icons.github.io/react-icons/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: Custom CSS System with modular CSS stylesheets

---

## 📁 Repository Structure

```
SmartrentAI/
├── frontend/                 # Frontend React 19 + Vite Application
│   ├── public/               # Static assets & public resources
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Cards, Modals, Maps)
│   │   ├── Data/             # Mock dataset & initial state data
│   │   ├── pages/            # Application pages (Tenant & Owner Portals)
│   │   ├── styles/           # Modular CSS files per page/component
│   │   ├── utils/            # Helper functions & utility modules
│   │   ├── App.jsx           # Main Router & Application Root
│   │   ├── main.jsx          # Entry point
│   │   └── global.css        # Global CSS design tokens & base styles
│   ├── package.json          # Dependencies & scripts
│   ├── vite.config.js        # Vite configuration
│   └── README.md             # Frontend specific documentation
└── README.md                 # Project root documentation
```

---

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation & Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saraswata02/house-rental-management-platform.git
   cd house-rental-management-platform
   ```

2. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Open [http://localhost:5173](http://localhost:5173) in your browser to explore the application.

---

## 📜 Available Scripts

Inside the `frontend` directory, you can run:

- `npm run dev`: Starts the Vite development server with HMR.
- `npm run build`: Builds the production-ready bundle.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/saraswata02/house-rental-management-platform/issues).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
