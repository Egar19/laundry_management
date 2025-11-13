import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import TransactionsPage from './pages/TransactionsPage';
import CustomersPage from './pages/CustomersPage';
import ExpensesPage from './pages/ExpensesPage';
import ReportsPage from './pages/ReportsPage';
import HomePage from './pages/HomePage';
import PackageSettingsPage from './pages/PackageSettingsPage';

function App() {
  return (
    <Routes>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/' element={<HomePage />} />

      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/transactions'
        element={
          <ProtectedRoute>
            <MainLayout>
              <TransactionsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/customers'
        element={
          <ProtectedRoute>
            <MainLayout>
              <CustomersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/expenses'
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExpensesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/reports'
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/package_settings'
        element={
          <ProtectedRoute>
            <MainLayout>
              <PackageSettingsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path='/users'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout>
              <UsersPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
