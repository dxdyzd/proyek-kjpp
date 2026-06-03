import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import AdminOfficeDashboard from './pages/AdminOfficeDashboard.jsx';
import AdminTeknikDashboard from './pages/AdminTeknikDashboard.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';
import StyleGuidePage from './pages/StyleGuidePage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin-office"
        element={
          <ProtectedRoute>
            <AdminOfficeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin-teknik"
        element={
          <ProtectedRoute>
            <AdminTeknikDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/owner"
        element={
          <ProtectedRoute>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/style-guide" element={<StyleGuidePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
