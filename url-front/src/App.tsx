import { UrlShortenerForm } from './components/UrlShortenerForm'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <UrlShortenerForm />
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
