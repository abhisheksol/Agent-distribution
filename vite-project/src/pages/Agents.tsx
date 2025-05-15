import { useState, useEffect } from 'react';
import { agents } from '../services/api';
import AgentModal from '../components/AgentModal';
import { PlusIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

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
    <div className="space-y-6">
      <header className="bg-white shadow-sm rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
            <p className="mt-1 text-sm text-gray-600">Manage and oversee your team members</p>
          </div>
          <button
            onClick={() => {
              setCurrentAgent(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <span>Add Agent</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agentsList.map((agent) => (
          <div key={agent._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <UserCircleIcon className="w-8 h-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.email}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Mobile:</span> {agent.mobileNumber}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentAgent(agent);
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
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
