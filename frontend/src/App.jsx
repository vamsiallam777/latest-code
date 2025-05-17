import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './Components/SignIn';
import Register from './Components/Register';
import Dashboard from './Components/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'STUDENT']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
