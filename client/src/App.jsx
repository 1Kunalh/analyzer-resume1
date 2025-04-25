import { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="cointainer-fixed d-flex flex-column align-items-center justify-content-center m-4">
      <h1 className='text-primary fw-bold mb-5'>Resume Analyzer</h1>
      <div className='row card p-3 d-flex flex-column align-items-center justify-content-center'>
        <label className='fw-bold mb-2 fs-5'>Upload Your Resume</label>
        <input type="file" accept='.pdf' className='form-control' onChange={handleChange} />
        <button className='btn btn-primary mt-4 fw-bold' onClick={handleSubmit}>{loading ? "Analyzing...." : "Analyze Resume"}</button>
      </div>

      {
        error && <div className='alert alert-danger mt-4'>
          <strong>Error:</strong> {error}
        </div>
      }

      {
        result && <div className='card p-3 mt-4'>
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
      }
    </div>
  )
}

export default App