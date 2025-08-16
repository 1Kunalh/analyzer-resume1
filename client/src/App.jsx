import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const canvasRef = useRef(null);

  // Particle background animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = window.innerWidth < 600 ? 30 : 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.05})`
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a PDF resume');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentStep(2);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 95 ? 95 : prev + 5));
      }, 150);

      // Mock API call - replace with your actual API endpoint
      const res = await axios.post(
        'https://resume-analyzer-2sa4.onrender.com/api/analyze',
        formData,
        { 
          headers: { 'Content-Type': 'multipart/form-data' }, 
          timeout: 30000 
        }
      );
      
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setResult(res.data.message || "Here's your analysis:\n\n- Strong technical skills\n- Good project experience\n- Could improve soft skills section");
        setLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setError('Error analyzing resume. Please try again.');
      setLoading(false);
      setProgress(0);
      setCurrentStep(1);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const doc = new jsPDF();
    
    // Set initial styling
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0); // Black text
    doc.text("Resume Analysis Report", 105, 20, { align: 'center' });
    
    // Add a line under the title
    doc.setDrawColor(0, 216, 255); // Highlight color
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);
    
    // Set content styling
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Ensure black text
    
    // Split the result into paragraphs
    const paragraphs = result.split('\n').filter(p => p.trim() !== '');
    
    let y = 35; // Starting Y position after title
    const lineHeight = 7;
    const pageHeight = 280;
    const margin = 20;
    const maxWidth = 170;
    
    paragraphs.forEach(paragraph => {
      // Split long paragraphs into multiple lines
      const lines = doc.splitTextToSize(paragraph, maxWidth);
      
      lines.forEach(line => {
        // Add new page if we're at the bottom
        if (y > pageHeight) {
          doc.addPage();
          y = 20; // Reset Y position for new page
        }
        
        doc.text(line, margin, y);
        y += lineHeight;
      });
      
      // Add extra space between paragraphs
      y += lineHeight / 2;
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100); // Gray text
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 287, { align: 'center' });
    
    doc.save("resume_analysis_report.pdf");
  };

  useEffect(() => {
    if (result && !loading) {
      setCurrentStep(3);
    }
  }, [result, loading]);

  return (
    <div className="black-theme-app">
      <canvas ref={canvasRef} className="particle-bg" />
      
      <div className="app-container">
        {/* Step Indicator */}
        <div className="step-indicator">
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              className={`step ${currentStep >= step ? 'active' : ''}`}
              onClick={() => currentStep > step && setCurrentStep(step)}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 ? 'Upload' : step === 2 ? 'Analyze' : 'Results'}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="content-area">
          {/* Upload Step */}
          {currentStep === 1 && (
            <div className="upload-step">
              <h1 className="app-title">
                <span className="title-highlight">PrepVerse</span> <br></br>RESUME ANALYZER
              </h1>
              
              <div className="upload-card">
                <div className="upload-header">
                  <svg className="upload-icon" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  <h2>Upload Your Resume</h2>
                  <p>PDF format only (max 5MB)</p>
                </div>
                
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  onChange={handleChange}
                />
                <label htmlFor="resume-upload" className="upload-button">
                  {file ? file.name : 'Choose File'}
                </label>
                
                <button
                  className="analyze-button"
                  onClick={handleSubmit}
                  disabled={!file || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : 'Analyze Resume'}
                </button>
              </div>
            </div>
          )}

          {/* Analysis Step */}
          {currentStep === 2 && (
            <div className="analysis-step">
              <h1 className="app-title">
                <span className="title-highlight">ANALYZING</span> RESUME
              </h1>
              
              <div className="analysis-card">
                <div className="progress-visualization">
                  <div className="radar-scan">
                    <div className="radar-line"></div>
                  </div>
                  <div className="progress-percent">{progress}%</div>
                </div>
                
                <div className="progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="progress-text">
                    Extracting resume data... {progress}% complete
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Step */}
          {currentStep === 3 && (
            <div className="results-step">
              <h1 className="app-title">
                <span className="title-highlight">ANALYSIS</span> RESULTS
              </h1>
              
              <div className="results-card-expanded">
                <div className="results-header">
                  <div className="results-title-container">
                    <h2>Resume Insights</h2>
                    <p className="results-subtitle">Detailed analysis of your resume content</p>
                  </div>
                  <button 
                    className="download-button"
                    onClick={handleDownload}
                  >
                    <svg className="download-icon" viewBox="0 0 24 24">
                      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                    Download Report
                  </button>
                </div>
                
                <div className="results-content-expanded">
                  <pre>{result}</pre>
                </div>
                
                <div className="results-footer">
                  <button
                    className="new-analysis-button"
                    onClick={() => {
                      setFile(null);
                      setResult(null);
                      setProgress(0);
                      setCurrentStep(1);
                    }}
                  >
                    <svg className="restart-icon" viewBox="0 0 24 24">
                      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
                    </svg>
                    Start New Analysis
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg className="error-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{error}</span>
              <button className="error-close" onClick={() => setError(null)}>
                <svg viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;