import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Wishlist from './pages/Wishlist';
import Footer from './components/Footer';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="page-container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <NavBar />
          <main style={{ flex: 1, position: 'relative' }}>
            <Routes>
              <Route path="/" element={
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Home />
                  <Explore />
                </div>
              } />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
