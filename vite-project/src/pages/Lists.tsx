import { useState, useEffect } from 'react';
import { CloudArrowUpIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { lists } from '../services/api';

interface ListItem {
  firstName: string;
  phone: string;
  notes: string;
}

interface AgentList {
  agent: {
    name: string;
    email: string;
    mobileNumber: string;
  };
  items: ListItem[];
}

const Lists = () => {
  const [distributedLists, setDistributedLists] = useState<Record<string, AgentList>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const { data } = await lists.getAll();
      setDistributedLists(data);
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await lists.upload(file);
      fetchLists();
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lists Management</h1>
          <p className="text-sm text-gray-500 mt-1">Upload and manage your distribution lists</p>
        </div>
        <div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className={`inline-flex items-center px-4 py-2 ${
              uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white rounded-lg cursor-pointer transition-colors`}
          >
            <CloudArrowUpIcon className="h-5 w-5 mr-2" />
            {uploading ? 'Uploading...' : 'Upload List'}
          </label>
        </div>
      </header>

      {Object.entries(distributedLists).map(([agentId, { agent, items }]) => (
        <div key={agentId} className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-50 rounded-full p-3">
                <UserGroupIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{agent.name}</h2>
                <p className="text-sm text-gray-500">{agent.email} | {agent.mobileNumber}</p>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.firstName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Lists;
