import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LawsRegulations = () => {
  const [laws, setLaws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // We try to fetch from DB. If DB is empty, we hit seed first, or fallback to fixed array if offline.
    const fetchLaws = async () => {
      try {
        let res = await axios.get('http://localhost:5000/api/laws');
        if (res.data.length === 0) {
           await axios.post('http://localhost:5000/api/laws/seed');
           res = await axios.get('http://localhost:5000/api/laws');
        }
        setLaws(res.data);
      } catch (err) {
        console.warn("Backend not reachable or laws not seeded, using fallback data.");
        setLaws([
          { category: 'speed', icon: '🏙️', title: 'City Road Speed Limit', section: '§112 MV Act', fine: '50 km/h', description: 'Maximum speed on urban roads.', penalty: 'Penalty: ₹1,000–₹2,000 for LMV' },
          { category: 'speed', icon: '🚦', title: 'Red Light Jumping', section: '§119 / §177A', fine: '₹5,000', description: 'Crossing a red traffic signal.', penalty: '₹5,000 fine + 6 points on DL', isDanger: true },
          { category: 'safety', icon: '⛑️', title: 'Helmet — Rider Mandatory', section: '§129 / §194D', fine: '₹1,000', description: 'ISI-marked helmet compulsory.', penalty: '₹1,000 fine + 3-month DL disqualification', isDanger: true },
          { category: 'docs', icon: '🪪', title: 'No Driving Licence', section: '§181', fine: '₹5,000', description: 'Operating any motor vehicle without a valid DL.', penalty: '₹5,000 fine', isDanger: true }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLaws();
  }, []);

  const filteredLaws = laws.filter(law => {
    const matchesTab = activeTab === 'all' || law.category === activeTab;
    const matchesSearch = law.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (law.description && law.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  return (
    <section className="section" id="laws">
      <div className="container">
        <div className="section-header">
          <div className="section-badge laws-badge">Motor Vehicles Act 2019</div>
          <h2 className="section-title">India Road Laws & Regulations</h2>
          <p className="section-desc">Complete reference of Indian traffic laws, penalties, and your rights. Updated as per MV Amendment Act 2019.</p>
        </div>

        <div className="laws-search-wrap">
          <div className="laws-search-box">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              className="laws-search-input" 
              placeholder="Search any law, fine, section… e.g. 'helmet', 'drunk', '₹5000'" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button className="laws-search-clear" onClick={() => setSearchTerm('')}>✕</button>}
          </div>
          <div className="laws-search-count">{filteredLaws.length} law{filteredLaws.length !== 1 ? 's' : ''} found</div>
        </div>

        <div className="laws-tabs" role="tablist">
          <button className={`laws-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Laws</button>
          <button className={`laws-tab ${activeTab === 'speed' ? 'active' : ''}`} onClick={() => setActiveTab('speed')}>🚦 Speed & Zones</button>
          <button className={`laws-tab ${activeTab === 'safety' ? 'active' : ''}`} onClick={() => setActiveTab('safety')}>🛡️ Safety Gear</button>
          <button className={`laws-tab ${activeTab === 'impaired' ? 'active' : ''}`} onClick={() => setActiveTab('impaired')}>🍺 Impaired</button>
          <button className={`laws-tab ${activeTab === 'docs' ? 'active' : ''}`} onClick={() => setActiveTab('docs')}>📄 Docs</button>
        </div>

        {loading ? (
          <div style={{textAlign: 'center', padding: '2rem'}}>Loading laws database...</div>
        ) : (
          <div className="laws-cards-grid">
            {filteredLaws.map((law, idx) => (
              <div key={idx} className={`law-card ${law.isDanger ? 'law-card-danger' : ''}`} style={{opacity: 1, transform: 'none'}}>
                <div className="law-card-header">
                  <div className="law-icon">{law.icon}</div>
                  <div className="law-info">
                    <div className="law-title">{law.title}</div>
                    <div className="law-section">{law.section}</div>
                  </div>
                  <div className="law-fine">{law.fine}</div>
                </div>
                <div className="law-desc">{law.description}</div>
                <div className="law-penalty">{law.penalty}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LawsRegulations;
