import { createContext, useContext, useReducer } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const INITIAL_STATE = {
    chatId: null,
    user: null,
    isGroup: false
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          chatId: action.payload.chatId,
          user: action.payload.user,
          isGroup: false
        };
      case 'CHANGE_GROUP':
        return {
          chatId: action.payload.chatId,
          user: action.payload.group,
          isGroup: true
        };
      case 'CLEAR_CHAT':
        return INITIAL_STATE;
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
