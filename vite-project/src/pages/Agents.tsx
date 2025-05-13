import { useState, useEffect } from 'react';
import { agents } from '../services/api';
import AgentModal from '../components/AgentModal';

interface Agent {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
}

const Agents = () => {
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Partial<Agent> | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await agents.getAll();
      setAgentsList(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleSubmit = async (formData: Partial<Agent>) => {
    try {
      if (currentAgent?._id) {
        await agents.update(currentAgent._id, formData);
      } else {
        await agents.create(formData);
      }
      fetchAgents();
      setShowModal(false);
      setCurrentAgent(null);
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await agents.delete(id);
        fetchAgents();
      } catch (error) {
        console.error('Error deleting agent:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Agents Management</h1>
        <button
          onClick={() => {
            setCurrentAgent(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md"
        >
          Add Agent
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mobile</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agentsList.map((agent) => (
              <tr key={agent._id}>
                <td className="px-6 py-4 whitespace-nowrap">{agent.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{agent.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{agent.mobileNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => {
                      setCurrentAgent(agent);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agent._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AgentModal
          agent={currentAgent}
          onClose={() => {
            setShowModal(false);
            setCurrentAgent(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Agents;
