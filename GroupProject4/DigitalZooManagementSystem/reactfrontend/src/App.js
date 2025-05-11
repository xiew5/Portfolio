import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EventLog from './components/EventLog';
import Feedback from './components/Feedback';
import AddVisitorForm from './components/AddVisitorForm';
import ZooManager from './components/ZooManager';

import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visitorData, setVisitorData] = useState(null);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/" />;
  };

  return (
    <Router>
      <div>
        <header>
          <nav style={{ display: "flex", gap: "10px", padding: "8px", backgroundColor: "#333" }}>
            <Link to="/" style={{ padding: "8px 20px", backgroundColor: "#333", color: "white", borderRadius: "5px", textDecoration: "none" }}>Login</Link>
            <Link to="/register" style={{ padding: "8px 20px", backgroundColor: "#333", color: "white", borderRadius: "5px", textDecoration: "none" }}>Register</Link>
            <Link to="/zooManager" style={{ padding: "8px 20px", backgroundColor: "#333", color: "white", borderRadius: "5px", textDecoration: "none" }}>Zoo Manager</Link>
            <Link to="/eventlog" style={{ padding: "8px 20px", backgroundColor: "#333", color: "white", borderRadius: "5px", textDecoration: "none" }}>Event Log</Link>
            <Link to="/feedback" style={{ padding: "8px 20px", backgroundColor: "#333", color: "white", borderRadius: "5px", textDecoration: "none" }}>Feedback</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setVisitorData={setVisitorData} />} />
            <Route path="/register" element={<AddVisitorForm />} />
            <Route path="/zooManager" element={<ZooManager />} />
            <Route path="/eventlog" element={<PrivateRoute element={<EventLog visitorData={visitorData} />} />} />
            <Route path="/feedback" element={<PrivateRoute element={<Feedback visitorData={visitorData} />} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
