import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/toaster';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CreatorProfilePage from './pages/CreatorProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.3,
  ease: "easeInOut"
};

function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/10">
            <Navbar />
            
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route 
                    path="/" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <HomePage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/products" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <ProductsPage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/products/:slug" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <ProductDetailPage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/creators/:handle" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <CreatorProfilePage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/cart" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <CartPage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="/checkout" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <CheckoutPage />
                      </motion.div>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <motion.div
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                      >
                        <NotFoundPage />
                      </motion.div>
                    } 
                  />
                </Routes>
              </AnimatePresence>
            </main>

            <Footer />
            <Toaster />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;