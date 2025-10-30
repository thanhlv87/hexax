import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import { useChat } from '../contexts/ChatContext';

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data } = useChat();

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar - responsive */}
      <div
        className={`
          fixed lg:static inset-0 z-40 lg:z-0
          ${isSidebarOpen ? 'block' : 'hidden lg:block'}
          w-full lg:w-96 bg-white border-r border-gray-200
        `}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatArea onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      {/* Welcome screen when no chat is selected */}
      {!data.chatId && (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block p-6 bg-blue-100 rounded-full mb-4">
              <svg className="w-20 h-20 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Chào mừng đến HexaChat</h2>
            <p className="text-gray-500">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
