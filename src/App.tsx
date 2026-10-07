import { useState, type FormEvent } from 'react';
import axios from 'axios';
import './App.css';

// 🔧 CHANGE THESE WHEN YOU GET YOUR REAL API KEY
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
        // MOCK DATA (works offline)
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
        // REAL API (needs a valid key)
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
    <div className="app">
      <header>
        <h1>🇳🇬 Nigerian Postcode Lookup</h1>
        <p>Find your postal code by area, street, or LGA</p>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Enter area, street, or postcode..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <div className="result-row">
            <span className="label">Postcode</span>
            <span className="value code">{result.code}</span>
          </div>
          <div className="result-row">
            <span className="label">Area</span>
            <span className="value">{result.area}</span>
          </div>
          <div className="result-row">
            <span className="label">LGA</span>
            <span className="value">{result.lga}</span>
          </div>
          <div className="result-row">
            <span className="label">State</span>
            <span className="value">{result.state}</span>
          </div>
          <button className="copy-btn" onClick={copyToClipboard}>
            {copied ? '✅ Copied!' : '📋 Copy Postcode'}
          </button>
        </div>
      )}

      <footer>
        <p>Built with the NIPOST Postcode API</p>
      </footer>
    </div>
  );
}

export default App;