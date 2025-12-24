import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import StudioPage from './pages/StudioPage';
import ExplorePage from './pages/ExplorePage';
import LibraryPage from './pages/LibraryPage';
import HistoryPage from './pages/HistoryPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import TrendsPage from './pages/TrendsPage';
import AdminPage from './pages/AdminPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AuthModal from './components/AuthModal';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/ca9a3cbe-8dd1-4252-b6a2-25f17acd1183', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('https://functions.poehali.dev/ca9a3cbe-8dd1-4252-b6a2-25f17acd1183', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name }),
      });
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
        setIsAuthModalOpen(false);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Header 
          currentUser={currentUser}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className="flex pt-14">
          <Sidebar 
            isOpen={isSidebarOpen} 
            currentUser={currentUser}
          />
          
          <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-60' : 'ml-0'}`}>
            <Routes>
              <Route path="/" element={<HomePage currentUser={currentUser} />} />
              <Route path="/video/:id" element={<VideoPage currentUser={currentUser} />} />
              <Route path="/studio" element={currentUser ? <StudioPage currentUser={currentUser} /> : <Navigate to="/" />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/library" element={<LibraryPage currentUser={currentUser} />} />
              <Route path="/history" element={<HistoryPage currentUser={currentUser} />} />
              <Route path="/subscriptions" element={<SubscriptionsPage currentUser={currentUser} />} />
              <Route path="/trends" element={<TrendsPage />} />
              <Route path="/admin" element={<AdminPage currentUser={currentUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </div>
    </Router>
  );
}

export default App;