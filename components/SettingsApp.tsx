'use client';

import { useState } from 'react';

export default function SettingsApp() {
  const [activeTab, setActiveTab] = useState('home');

  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'network', icon: '🌐', label: 'Network & Internet' },
    { id: 'personalization', icon: '🎨', label: 'Personalization' },
    { id: 'apps', icon: '📦', label: 'Apps' },
    { id: 'privacy', icon: '🔒', label: 'Privacy & Security' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Home</h1>
            <div className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚙️</span>
                  <h3 className="font-semibold text-gray-800">Quick Settings</h3>
                </div>
                <p className="text-sm text-gray-600">Manage your most used settings and preferences</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-200">
                  <div className="text-2xl mb-2">🌐</div>
                  <div className="font-semibold text-gray-800 text-sm">Network</div>
                  <div className="text-xs text-gray-600 mt-1">Connected</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-4 border border-pink-200">
                  <div className="text-2xl mb-2">🔔</div>
                  <div className="font-semibold text-gray-800 text-sm">Notifications</div>
                  <div className="text-xs text-gray-600 mt-1">3 new alerts</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'network':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Network & Internet</h1>
            <div className="space-y-3">
              {['Wi-Fi', 'Ethernet', 'VPN', 'Proxy'].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 hover:border-blue-300 cursor-pointer transition-all">
                  <div className="font-medium text-gray-800">{item}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'personalization':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Personalization</h1>
            <div className="space-y-3">
              {['Background', 'Colors', 'Themes', 'Fonts'].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 hover:border-purple-300 cursor-pointer transition-all">
                  <div className="font-medium text-gray-800">{item}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'apps':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Apps</h1>
            <div className="space-y-3">
              {['Installed Apps', 'Default Apps', 'Startup Apps'].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-200 hover:border-pink-300 cursor-pointer transition-all">
                  <div className="font-medium text-gray-800">{item}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy & Security</h1>
            <div className="space-y-3">
              {['Permissions', 'Security', 'Activity History', 'Search Permissions'].map((item) => (
                <div key={item} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-200 hover:border-purple-300 cursor-pointer transition-all">
                  <div className="font-medium text-gray-800">{item}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Sidebar */}
      <div className="w-64 bg-white/70 backdrop-blur-xl border-r border-purple-200/50 flex flex-col">
        <div className="p-4 border-b border-purple-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 text-sm truncate">Guest</div>
              <div className="text-xs text-gray-600 truncate">guest@portfolio.os</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3">
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab(tab.id);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-200/60 to-pink-200/60 text-gray-900 shadow-sm'
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
