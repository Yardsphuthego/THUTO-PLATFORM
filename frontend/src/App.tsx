import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ScrollProgress } from './components/ScrollProgress';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Register } from './pages/Register';
import { Elections } from './pages/Elections';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MyProfile } from './pages/MyProfile';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <ScrollProgress />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Home initialAuthModal="student" />} />
              <Route path="/admin-login" element={<Home initialAuthModal="admin" />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/elections"
                element={
                  <ProtectedRoute>
                    <Elections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-profile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
