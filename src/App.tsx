import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PrivateRoute, PublicAuthRoute } from './components/auth/PrivateRoute.js';
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicAuthRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
