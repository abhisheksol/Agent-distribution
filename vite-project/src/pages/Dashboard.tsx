import { useState, useEffect } from 'react';
import { agents, lists } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalLists: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [agentsRes, listsRes] = await Promise.all([
          agents.getAll(),
          lists.getAll(),
        ]);
        
        setStats({
          totalAgents: agentsRes.data.length,
          totalLists: Object.keys(listsRes.data).length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Agents</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalAgents}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium">Total Lists</h2>
          <p className="text-3xl font-bold mt-2">{stats.totalLists}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
