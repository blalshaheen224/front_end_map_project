// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import Unauthorized from './pages/Unauthorized';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Search from './pages/Search';
import MapPage from './pages/MapView';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AddProperty from './pages/admin/AddProperty';
import EditProperty from './pages/admin/EditProperty';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Public Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          {/* Admin Routes with Admin Layout */}
          <Route 
            element={
              <ProtectedRoute requiredRole={['admin', 'employee']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />} />
            <Route path="/admin/properties/new" element={<AddProperty />} />
            <Route path="/admin/properties/:id/edit" element={<EditProperty />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;