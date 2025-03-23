import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { ClipboardIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface UrlItem {
  id: number;
  url: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface UrlResponse {
  items: UrlItem[];
  total: number;
}

const PAGE_SIZE = 10;

export function MyUrls() {
  const { userId } = useUser();
  const navigate = useNavigate();
  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver>();
  const mountedRef = useRef(false);

  const lastUrlElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Reset state when user ID changes
  useEffect(() => {
    setUrls([]);
    setPage(1);
    setHasMore(true);
  }, [userId]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // Fetch URLs when page changes
  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const fetchUrls = async () => {
      if (!mountedRef.current) return;

      try {
        setLoading(true);
        const response = await axios.get<UrlResponse>('http://localhost:3000/url/list', {
          params: {
            page,
            limit: PAGE_SIZE,
          },
          headers: {
            user_id: userId,
          },
        });

        if (mountedRef.current) {
          if (page === 1) {
            setUrls(response.data.items);
          } else {
            setUrls(prev => [...prev, ...response.data.items]);
          }
          setHasMore(response.data.items.length === PAGE_SIZE);
        }
      } catch (error) {
        if (mountedRef.current) {
          console.error('Error fetching URLs:', error);
          toast.error('Failed to load URLs');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchUrls();
  }, [userId, page, navigate]);

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mt-4 pb-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="mb-0">My Shortened URLs</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
        >
          Shorten New URL
        </button>
      </div>
      <div className="card">
        <div className="card-body">
          {urls.map((url, index) => (
            <div
              key={url.id}
              ref={index === urls.length - 1 ? lastUrlElementRef : undefined}
              className={`d-flex align-items-center justify-content-between p-3 ${
                index !== urls.length - 1 ? 'border-bottom' : ''
              }`}
            >
              <div className="flex-grow-1">
                <div className="d-flex align-items-center mb-2">
                  <a
                    href={`http://localhost:3000/${url.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-none me-2"
                  >
                    {`http://localhost:3000/${url.slug}`}
                  </a>
                  <button
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => copyToClipboard(`http://localhost:3000/${url.slug}`)}
                  >
                    <ClipboardIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm"
                    onClick={() => navigate(`/stats/${url.slug}`)}
                  >
                    <ChartBarIcon style={{ width: '1rem', height: '1rem' }} />
                  </button>
                </div>
                <div className="text-muted small">
                  Original URL: {url.url}
                </div>
                <div className="text-muted small">
                  Created: {formatDate(url.created_at)}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-center p-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          {!loading && urls.length === 0 && (
            <div className="text-center p-3 text-muted">
              No URLs found. Start shortening some URLs!
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 