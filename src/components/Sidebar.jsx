import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import { getUserChats, createOrGetChat, searchUsers } from '../services/chatService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import NewChatModal from './NewChatModal';
import NewGroupModal from './NewGroupModal';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const Sidebar = ({ onClose }) => {
  const { currentUser, logout } = useAuth();
  const { dispatch } = useChat();
  const [chats, setChats] = useState([]);
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = getUserChats(currentUser.uid, async (snapshot) => {
      const chatsData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const chatData = docSnap.data();
          const chatId = docSnap.id;

          let chatInfo = {
            id: chatId,
            ...chatData
          };

          // For private chats, get other user's info
          if (chatData.type === 'private') {
            const otherUserId = chatData.participants.find(id => id !== currentUser.uid);
            const userDoc = await getDoc(doc(db, 'users', otherUserId));
            if (userDoc.exists()) {
              chatInfo = {
                ...chatInfo,
                otherUser: { id: otherUserId, ...userDoc.data() }
              };
            }
          }

          return chatInfo;
        })
      );

      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSelectChat = (chat) => {
    if (chat.type === 'private') {
      dispatch({
        type: 'CHANGE_USER',
        payload: {
          chatId: chat.id,
          user: chat.otherUser
        }
      });
    } else {
      dispatch({
        type: 'CHANGE_GROUP',
        payload: {
          chatId: chat.id,
          group: chat
        }
      });
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true, locale: vi });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-blue-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-semibold">
              {currentUser?.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{currentUser?.displayName}</h2>
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-blue-700 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
                  <button
                    onClick={() => {
                      setIsNewChatOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Chat mới</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsNewGroupOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Tạo nhóm</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold">Chat</h1>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
            <svg className="w-16 h-16 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-center">Chưa có cuộc trò chuyện nào</p>
            <button
              onClick={() => setIsNewChatOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Bắt đầu chat
            </button>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-lg">
                    {chat.type === 'private'
                      ? chat.otherUser?.displayName?.charAt(0).toUpperCase() || 'U'
                      : chat.name?.charAt(0).toUpperCase() || 'G'
                    }
                  </div>
                  {chat.type === 'private' && chat.otherUser?.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {chat.type === 'private' ? chat.otherUser?.displayName : chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {formatTime(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage || 'Chưa có tin nhắn'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {isNewChatOpen && (
        <NewChatModal
          onClose={() => setIsNewChatOpen(false)}
          currentUserId={currentUser.uid}
        />
      )}

      {isNewGroupOpen && (
        <NewGroupModal
          onClose={() => setIsNewGroupOpen(false)}
          currentUserId={currentUser.uid}
        />
      )}
    </div>
  );
};

export default Sidebar;
