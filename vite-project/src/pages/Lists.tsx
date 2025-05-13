import { useState, useEffect } from 'react';
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Lists Management</h1>
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
            className={`cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md ${
              uploading ? 'opacity-50' : ''
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload List'}
          </label>
        </div>
      </div>

      {Object.entries(distributedLists).map(([agentId, { agent, items }]) => (
        <div key={agentId} className="mb-8 bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">{agent.name}</h2>
            <p className="text-gray-600">{agent.email} | {agent.mobileNumber}</p>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{item.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Lists;
