import { useState, useEffect } from 'react';
import { agents, lists } from '../services/api';
import { UsersIcon, ListBulletIcon, ChartBarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-8">
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="mt-2 text-indigo-100">Here's what's happening with your agents today.</p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 rounded-xl p-4">
              <UsersIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAgents}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>Active and ready</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 rounded-xl p-4">
              <ListBulletIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lists</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLists}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>Steadily increasing</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-50 rounded-xl p-4">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Distribution Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalAgents ? Math.round(stats.totalLists / stats.totalAgents) : 0}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
            <span>On the rise</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity content */}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Performance Overview</h2>
          {/* Add performance charts */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
