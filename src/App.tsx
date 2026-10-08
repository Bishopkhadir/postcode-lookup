import { useState, type FormEvent } from 'react';
import axios from 'axios';
import './App.css';

const USE_MOCK = true;
const API_BASE = 'https://api.postcode.gov.ng/v1';
const API_KEY = 'PASTE_YOUR_KEY_HERE';

interface Postcode {
  code: string;
  area: string;
  lga: string;
  state: string;
}

const mockData: Postcode[] = [
  { code: '100271', area: 'Ikeja', lga: 'Ikeja', state: 'Lagos' },
  { code: '100001', area: 'Lagos Island', lga: 'Lagos Island', state: 'Lagos' },
  { code: '900211', area: 'Garki', lga: 'Abuja Municipal', state: 'FCT' },
  { code: '500101', area: 'Port Harcourt', lga: 'Port Harcourt', state: 'Rivers' },
  { code: '700101', area: 'Kano Municipal', lga: 'Kano Municipal', state: 'Kano' },
];

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Postcode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 500));
        const found = mockData.find(
          p =>
            p.area.toLowerCase().includes(query.toLowerCase()) ||
            p.code.includes(query) ||
            p.lga.toLowerCase().includes(query.toLowerCase())
        );
        if (found) setResult(found);
        else setError('No postcode found. Try "Ikeja" or "100271"');
      } else {
        const res = await axios.get(`${API_BASE}/lookup`, {
          params: { code: query },
          headers: { 'X-API-Key': API_KEY },
        });
        setResult(res.data);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container-fluid py-4 py-md-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-7 col-xl-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h3 fw-bold mb-2">🇳🇬 Nigerian Postcode Lookup</h1>
                <p className="text-muted small mb-0">
                  Find your postal code by area, street, or LGA
                </p>
              </div>

              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Enter area, street, or postcode..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn-success btn-lg px-4"
                    disabled={loading}
                  >
                    {loading ? '...' : 'Search'}
                  </button>
                </div>
              </form>

              {error && (
                <div className="alert alert-danger text-center">{error}</div>
              )}

              {result && (
                <div className="alert alert-light border rounded-3 p-3">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <span className="text-muted small">Postcode</span>
                    <span className="fw-bold text-success fs-5 font-monospace">
                      {result.code}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <span className="text-muted small">Area</span>
                    <span className="fw-semibold">{result.area}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                    <span className="text-muted small">LGA</span>
                    <span className="fw-semibold">{result.lga}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-muted small">State</span>
                    <span className="fw-semibold">{result.state}</span>
                  </div>
                  <button
                    className="btn btn-success w-100"
                    onClick={copyToClipboard}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy Postcode'}
                  </button>
                </div>
              )}

              <p className="text-center text-muted small mb-0">
                * Currently uses mock data pending NIPOST API access
              </p>
            </div>
          </div>

          <p className="text-center text-muted small mt-4 mb-0">
            Built with the NIPOST Postcode API
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;