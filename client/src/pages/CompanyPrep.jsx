import React, { useState } from 'react';

const CompanyPrep = () => {
  const [selectedCompany, setSelectedCompany] = useState('Google');

  const companies = {
    Google: {
      name: 'Google',
      description: 'Focuses heavily on core Algorithms, Graph Theory, System Design, and Googlyness.',
      questions: [
        'How would you design a distributed rate limiter for millions of requests?',
        'Find the longest path in a directed acyclic graph (DAG).',
        'Explain how Google Bigtable handles write operations under the hood.'
      ],
      tips: 'Ensure you explain time & space complexity before writing code. Be structured and vocalize your thoughts.'
    },
    Microsoft: {
      name: 'Microsoft',
      description: 'Asks a mix of Tree/Linked List manipulation, OS concurrency, and cloud architectures.',
      questions: [
        'How would you reverse a linked list in blocks of size k?',
        'Explain virtual memory, paging, and page fault handling.',
        'Design a notification system with multi-channel support (SMS, email, push).'
      ],
      tips: 'Show strong OOP design patterns. Focus on clean code modularity and error handling.'
    },
    Amazon: {
      name: 'Amazon',
      description: 'Puts massive weight (50%+) on the 16 Leadership Principles and Web-Scale systems.',
      questions: [
        'Describe a time when you took a calculated risk and failed. What did you learn?',
        'Design an online bookstore search suggestion system like Auto-complete.',
        'Find the top k most frequently purchased items in a stream.'
      ],
      tips: 'Format behavioral responses strictly using the STAR method. Emphasize Customer Obsession.'
    },
    TCS: {
      name: 'TCS / Tata Consultancy Services',
      description: 'Evaluates basic Quantitative Aptitude, C/Java programming syntax, and basic DBMS queries.',
      questions: [
        'What is the difference between primary key, foreign key, and unique key?',
        'Write a SQL query to find the second highest salary of an employee.',
        'What is normalization and why do we use 3NF?'
      ],
      tips: 'Focus on core textbook definitions. Be clear, polite, and maintain good communication grammar.'
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 'calc(100vh - 120px)' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>🏢 Company-Specific Prep Hub</h2>
        <p style={{ color: 'var(--text-muted)' }}>Curated interview experiences, technical questions, and prep guidelines for top tech giants.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '24px' }}>
        {/* Sidebar Selector */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px', height: 'fit-content' }}>
          {Object.keys(companies).map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCompany(c)}
              className="filter-tag"
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: selectedCompany === c ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.02)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '6px',
                fontWeight: 600
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Prep details sheet */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', color: 'white' }}>{companies[selectedCompany].name} Prep Guide</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {companies[selectedCompany].description}
          </p>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <h4 style={{ color: 'var(--accent-secondary)', fontSize: '1rem', marginBottom: '10px' }}>📋 Known Interview Questions:</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '20px', fontSize: '0.88rem', color: 'white' }}>
              {companies[selectedCompany].questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '16px', background: 'rgba(124,58,237,0.03)', padding: '16px', borderRadius: '8px' }}>
            <strong style={{ color: 'white', fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>💡 Coach Pro Tip:</strong>
            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>{companies[selectedCompany].tips}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPrep;
