import React, { useState } from 'react';

const Modal = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('triton1');
  const [customUrl, setCustomUrl] = useState('');

  const endpoints = [
    { id: 'triton1', name: 'Triton RPC Pool 1', latency: 201 },
    { id: 'helius1', name: 'Helius RPC 1', latency: 190 },
    { id: 'triton2', name: 'Triton RPC Pool 2', latency: 215 },
  ];

  return (
    <div  id="tooltip" className="w-full md:w-[250px] max-h-[90vh] webkit-scrollbar overflow-y-auto lg:w-[420px] py-6 bg-zinc-900 rounded-xl shadow-xl text-white">
      <div className="border-b border-zinc-800 p-6">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>
      
      <div className="p-6">
        <h3 className="text-sm font-medium text-zinc-300 mb-4">
          RPC Endpoint
        </h3>

        <div className="space-y-3">
          {endpoints.map((endpoint, index) => (
            <label
              key={endpoint.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
                  selectedEndpoint === endpoint.id 
                    ? 'border-red-500 bg-red-500/20' 
                    : 'border-zinc-600'
                }`}>
                  <span className="text-sm">{index + 1}</span>
                </div>
                <span className="text-sm">{endpoint.name}</span>
              </div>
              
              <div className="flex items-center space-x-7 text-xs">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  endpoint.latency < 200 ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span>{endpoint.latency}ms</span>
              </div>
              
              <input
                type="radio"
                name="endpoint"
                value={endpoint.id}
                checked={selectedEndpoint === endpoint.id}
                onChange={() => setSelectedEndpoint(endpoint.id)}
                className="sr-only"
              />
            </label>
          ))}

          <label className="flex items-center space-x-4 p-3 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
            <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 ${
              selectedEndpoint === 'custom' 
                ? 'border-red-500 bg-red-500/20' 
                : 'border-zinc-600'
            }`}>
              <span className="text-sm">{endpoints.length + 1}</span>
            </div>
            <span className="text-sm">Custom</span>
            <input
              type="radio"
              name="endpoint"
              value="custom"
              checked={selectedEndpoint === 'custom'}
              onChange={() => setSelectedEndpoint('custom')}
              className="sr-only"
            />
          </label>

          {selectedEndpoint === 'custom' && (
            <div className="relative mt-3">
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Custom RPC URL"
                className="w-full bg-zinc-800 border border-red-500/50 focus:border-red-500 rounded-lg px-4 py-2 text-white placeholder:text-zinc-400 outline-none"
              />
              <button
                disabled={!customUrl}
                className={`absolute right-2 top-1/2 -translate-y-1/2 ${
                  customUrl 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-zinc-700 cursor-not-allowed'
                } text-xs px-3 py-1 rounded transition-colors`}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;