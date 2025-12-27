import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Assignments from './pages/Assignments';
import Practice from './pages/Practice';
import Login from './pages/Login';
import Register from './pages/Register';

// Layout wrapper that conditionally shows header/footer
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isPracticePage = location.pathname.startsWith('/practice/');

  return (
    <div className="app">
      {!isAuthPage && !isPracticePage && <Header />}
      <main className={`main ${isPracticePage ? 'main--practice' : ''}`}>
        {children}
      </main>
      {!isAuthPage && !isPracticePage && <Footer />}
    </div>
  );
};

// Inner app component that uses Router context
const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/practice/:id" element={<Practice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AppLayout>
  );
};

// Toast wrapper that uses theme
const ThemedToaster = () => {
  const { isDark } = useTheme();
  
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#252f3f' : '#ffffff',
          color: isDark ? '#f8fafc' : '#0f172a',
          border: isDark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(15, 23, 42, 0.1)',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: isDark 
            ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)' 
            : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#f43f5e',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
          <ThemedToaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
