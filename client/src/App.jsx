import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const resume = e.target.files[0];
    if (resume) {
      setFile(resume)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please upload a resume');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await axios.post('http://localhost:5000/api/analyze', formData, {
        headers: {
          'Content-Type': 'application/pdf'
        }
      })
      setResult(res.data.message);
    }
    catch (err) {
      setError('Error uploading file');
      console.error(err);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-5">
      <h1 className='text-primary fw-bold text-center mb-5'>Resume Analyzer</h1>

      <div className='card shadow-lg p-4 mx-auto' style={{ maxWidth: '500px' }}>
        <label className='form-label fw-semibold fs-5 mb-2'>Upload Your Resume (PDF)</label>
        <input
          type="file"
          accept=".pdf"
          className="form-control mb-3"
          onChange={handleChange}
        />
        <button
          className="btn btn-primary w-100 fw-bold"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {error && (
        <div className='alert alert-danger mt-4 text-center'>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className='card shadow-sm p-4 mt-4 mx-auto' style={{ maxWidth: '700px' }}>
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      )}
    </div>
  );

}

export default App