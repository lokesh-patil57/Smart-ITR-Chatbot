import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FormDownload.css';

const forms = [
    {
        id: 'itr1',
        name: 'ITR-1 (Sahaj)',
        description: 'For individuals with salary, one house property, other sources',
        filename: 'ITR1.pdf',
        path: '/forms/ITR1.pdf'
    },
    {
        id: 'itr2',
        name: 'ITR-2',
        description: 'For individuals with capital gains, foreign income',
        filename: 'ITR2.pdf',
        path: '/forms/ITR2.pdf'
    },
    {
        id: 'itr3',
        name: 'ITR-3',
        description: 'For individuals with business/professional income',
        filename: 'ITR3.pdf',
        path: '/forms/ITR3.pdf'
    },
    {
        id: 'itr4',
        name: 'ITR-4 (Sugam)',
        description: 'For presumptive business income',
        filename: 'ITR4.pdf',
        path: '/forms/ITR4.pdf'
    },
    {
        id: 'itr5',
        name: 'ITR-5',
        description: 'For firms, LLPs, and associations of persons (AOPs)',
        filename: 'ITR5.pdf',
        path: '/forms/ITR5.pdf'
    },
    {
        id: 'itr6',
        name: 'ITR-6',
        description: 'For companies other than those claiming exemption under section 11',
        filename: 'ITR6.pdf',
        path: '/forms/ITR6.pdf'
    },
    {
        id: 'itr7',
        name: 'ITR-7',
        description: 'For charitable/religious trusts, political parties, research institutions',
        filename: 'ITR7.pdf',
        path: '/forms/ITR7.pdf'
    }
];

function FormDownload() {
    const [downloading, setDownloading] = useState({});
    const navigate = useNavigate();

    const handleDownload = (form) => {
        setDownloading(prev => ({ ...prev, [form.id]: true }));
        
        try {
            // Create a link element
            const link = document.createElement('a');
            link.href = form.path;
            link.download = form.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download the form. Please try again.');
        } finally {
            setDownloading(prev => ({ ...prev, [form.id]: false }));
        }
    };

    const getButtonText = (formId) => {
        return downloading[formId] ? 'Downloading...' : 'Download';
    };

    return (
        <div className="form-download-container">
            <h2>Download ITR Forms</h2>
            <div className="forms-grid">
                {forms.map(form => (
                    <div key={form.id} className="form-card">
                        <h3>{form.name}</h3>
                        <p>{form.description}</p>
                        <button
                            className="download-btn"
                            onClick={() => handleDownload(form)}
                            disabled={downloading[form.id]}
                        >
                            {getButtonText(form.id)}
                        </button>
                    </div>
                ))}
            </div>
            
            {/* Tax Saving Guide Button */}
            <div className="tax-guide-section">
                <button 
                    className="tax-guide-btn"
                    onClick={() => navigate('/tax-saving-guide')}
                >
                    View Tax Saving Guide
                </button>
            </div>
        </div>
    );
}

export default FormDownload; 