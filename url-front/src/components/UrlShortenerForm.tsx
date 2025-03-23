import { useState } from 'react';
import axios from 'axios';
import { ClipboardIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useUser } from '../contexts/UserContext';

interface ShortenedUrl {
  slug: string;
}

export function UrlShortenerForm() {
  const { userId } = useUser();
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const headers = userId ? { user_id: userId } : undefined;
      const response = await axios.post<ShortenedUrl>(
        'http://localhost:3000/url/new',
        {
          url,
          ...(slug && { slug }),
        },
        { headers }
      );
      
      const baseUrl = 'http://localhost:3000';
      setShortenedUrl(`${baseUrl}/${response.data.slug}`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while shortening the URL');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl);
        toast.success('URL copied to clipboard!', {
          duration: 2000,
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
        });
      } catch (err) {
        console.error('Failed to copy URL:', err);
        toast.error('Failed to copy URL');
      }
    }
  };

  return (
    <div className="card shadow mt-5" style={{ maxWidth: '500px', width: '100%' }}>
      <div className="card-header bg-primary text-white">
        <h5 className="card-title mb-0">URL Shortener</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="url" className="form-label">
              Enter the URL to shorten
            </label>
            <input
              type="url"
              className="form-control"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/foo/bar/biz"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="slug" className="form-label">
              Custom slug (optional)
            </label>
            <input
              type="text"
              className="form-control"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value.slice(0, 10))}
              placeholder="e.g., my-link"
              maxLength={10}
            />
            <div className="form-text">
              Maximum 10 characters. Leave empty for auto-generated slug.
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-100 ${isLoading ? 'disabled' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Shortening...
              </>
            ) : (
              'Shorten'
            )}
          </button>
        </form>

        {error && (
          <div className="alert alert-danger mt-3" role="alert">
            {error}
          </div>
        )}

        {shortenedUrl && (
          <div className="mt-4">
            <h6 className="text-success mb-2">Success! Here's your short URL:</h6>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={shortenedUrl}
                readOnly
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={copyToClipboard}
              >
                <ClipboardIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 