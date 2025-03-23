import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import toast from 'react-hot-toast';

interface Visit {
  id: number;
  user_agent: string | null;
  referrer: string | null;
  ip: string | null;
  location: string | null;
  created_at: string;
}

interface VisitsResponse {
  items: Visit[];
  total: number;
}

const PAGE_SIZE = 20;

export function UrlStats() {
  const { slug } = useParams<{ slug: string }>();
  const { userId } = useUser();
  const navigate = useNavigate();
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const mountedRef = useRef(false);

  const lastVisitElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      if (!mountedRef.current) return;

      try {
        setLoading(true);
        const [countResponse, visitsResponse] = await Promise.all([
          axios.get<{ count: number }>(`http://localhost:3000/tracker/${slug}/count`, {
            headers: userId ? { user_id: userId } : undefined,
          }),
          axios.get<VisitsResponse>(`http://localhost:3000/tracker/${slug}/visits`, {
            params: {
              page,
              limit: PAGE_SIZE,
            },
            headers: userId ? { user_id: userId } : undefined,
          }),
        ]);

        if (mountedRef.current) {
          setVisitCount(countResponse.data.count);
          if (page === 1) {
            setVisits(visitsResponse.data.items);
          } else {
            setVisits(prev => [...prev, ...visitsResponse.data.items]);
          }
          setHasMore(visitsResponse.data.items.length === PAGE_SIZE);
        }
      } catch (error) {
        if (mountedRef.current) {
          console.error('Error fetching stats:', error);
          toast.error('Failed to load URL statistics');
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    if (slug) {
      fetchStats();
    }
  }, [slug, userId, page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading && page === 1) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 pb-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate('/my-urls')}
        >
          ← Back to My URLs
        </button>
        <h2 className="mb-0">URL Statistics</h2>
      </div>

      <div className="row">
        <div className="col-md-3 col-lg-2 mb-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center text-center">
                <h6 className="card-title mb-2">Total Visits</h6>
                <span className="fs-2 fw-bold">{visitCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-9 col-lg-10 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Visit Details</h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Location</th>
                      <th>Referrer</th>
                      <th>User Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visits.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-4 text-muted">
                          No visits recorded yet
                        </td>
                      </tr>
                    ) : (
                      visits.map((visit, index) => (
                        <tr
                          key={visit.id}
                          ref={index === visits.length - 1 ? lastVisitElementRef : undefined}
                        >
                          <td>{formatDate(visit.created_at)}</td>
                          <td>{visit.location || '-'}</td>
                          <td>{visit.referrer || '-'}</td>
                          <td className="text-truncate" style={{ maxWidth: '200px' }}>
                            {visit.user_agent || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {loading && page > 1 && (
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 