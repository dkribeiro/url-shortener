import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './contexts/UserContext';
import { Navbar } from './components/Navbar';
import { UrlShortenerForm } from './components/UrlShortenerForm';
import { MyUrls } from './pages/MyUrls';
import { UrlStats } from './pages/UrlStats';

export function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-vh-100 bg-light">
          <Navbar />
          <Routes>
            <Route path="/" element={
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12 col-md-8 col-lg-6 pt-5">
                    <UrlShortenerForm />
                  </div>
                </div>
              </div>
            } />
            <Route path="/my-urls" element={<MyUrls />} />
            <Route path="/stats/:slug" element={<UrlStats />} />
          </Routes>
        </div>
        <Toaster position="top-right" />
      </Router>
    </UserProvider>
  );
}
