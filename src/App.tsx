import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from './components/layout/NavBar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';
import { CartDrawer } from './components/cart/CartDrawer';
import { LoginModal } from './components/auth/LoginModal';
import { HomePage } from './pages/HomePage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [busqueda, setBusqueda] = useState<string>('');

  // Estado de Toast global
  const [toast, setToast] = useState<{
    show: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
  }>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 4500);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-sand text-charcoal dark:bg-charcoal dark:text-sand-100 transition-colors duration-200">
        {/* Barra de Navegación Global */}
        <NavBar busqueda={busqueda} onBusquedaChange={setBusqueda} />

        {/* Enrutamiento Multipágina */}
        <div className="flex-1">
          <Routes>
            {/* 1. Directorio de Tiendas y Feriantes */}
            <Route
              path="/"
              element={
                <HomePage
                  busqueda={busqueda}
                  onBusquedaChange={setBusqueda}
                  onShowToast={showToast}
                />
              }
            />

            {/* 2. Vista Individual de la Tienda de cada Emprendedor */}
            <Route path="/tienda/:id" element={<StoreDetailPage />} />

            {/* 3. Panel de Administración / Mi Taller del Vendedor */}
            <Route path="/admin" element={<AdminPage onShowToast={showToast} />} />
          </Routes>
        </div>

        {/* Footer Institucional */}
        <Footer />

        {/* Panel Drawer de Carrito y Presupuesto Simulado */}
        <CartDrawer />

        {/* Modal de Ingreso para Feriantes */}
        <LoginModal onShowToast={showToast} />

        {/* Notificación Toast Flotante Global */}
        <Toast
          show={toast.show}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    </BrowserRouter>
  );
}
