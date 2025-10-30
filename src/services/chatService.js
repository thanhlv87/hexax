import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  arrayUnion,
  increment
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { v4 as uuidv4 } from 'uuid';

// Create or get 1-1 chat
export const createOrGetChat = async (currentUserId, otherUserId) => {
  // Create a consistent chat ID by sorting user IDs
  const chatId = [currentUserId, otherUserId].sort().join('_');

  const chatRef = doc(db, 'chats', chatId);
  const chatDoc = await getDoc(chatRef);

  if (!chatDoc.exists()) {
    // Create new chat
    await setDoc(chatRef, {
      participants: [currentUserId, otherUserId],
      createdAt: serverTimestamp(),
      lastMessage: null,
      lastMessageTime: serverTimestamp(),
      type: 'private'
    });
  }

  return chatId;
};

// Create group chat
export const createGroupChat = async (currentUserId, groupName, memberIds) => {
  const groupId = uuidv4();

  const groupRef = doc(db, 'chats', groupId);
  await setDoc(groupRef, {
    name: groupName,
    participants: [currentUserId, ...memberIds],
    admins: [currentUserId],
    createdBy: currentUserId,
    createdAt: serverTimestamp(),
    lastMessage: null,
    lastMessageTime: serverTimestamp(),
    type: 'group',
    photoURL: null
  });

  return groupId;
};

// Send message
export const sendMessage = async (chatId, senderId, content, type = 'text', fileUrl = null) => {
  const messagesRef = collection(db, 'chats', chatId, 'messages');

  const message = {
    senderId,
    content,
    type, // 'text', 'image', 'file'
    fileUrl,
    createdAt: serverTimestamp(),
    read: false
  };

  await addDoc(messagesRef, message);

  // Update chat's last message
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    lastMessage: type === 'text' ? content : `[${type}]`,
    lastMessageTime: serverTimestamp()
  });
};

// Upload file to Firebase Storage
export const uploadFile = async (file, chatId) => {
  const fileName = `${Date.now()}_${file.name}`;
  const storageRef = ref(storage, `chats/${chatId}/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Get user chats
export const getUserChats = (userId, callback) => {
  const chatsQuery = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
    orderBy('lastMessageTime', 'desc')
  );

  return onSnapshot(chatsQuery, callback);
};

// Get chat messages
export const getChatMessages = (chatId, callback) => {
  const messagesQuery = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(messagesQuery, callback);
};

// Search users
export const searchUsers = async (searchTerm) => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef);
  const querySnapshot = await getDocs(q);

  const users = [];
  querySnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userData.email?.toLowerCase().includes(searchTerm.toLowerCase())) {
      users.push({ id: doc.id, ...userData });
    }
  });

  return users;
};

// Get all users (for group creation)
export const getAllUsers = async (currentUserId) => {
  const usersRef = collection(db, 'users');
  const querySnapshot = await getDocs(usersRef);

  const users = [];
  querySnapshot.forEach((doc) => {
    if (doc.id !== currentUserId) {
      users.push({ id: doc.id, ...doc.data() });
    }
  });

  return users;
};

// Add member to group
export const addMemberToGroup = async (chatId, userId) => {
  const chatRef = doc(db, 'chats', chatId);
  await updateDoc(chatRef, {
    participants: arrayUnion(userId)
  });
};

// Leave group
export const leaveGroup = async (chatId, userId) => {
  const chatRef = doc(db, 'chats', chatId);
  const chatDoc = await getDoc(chatRef);

  if (chatDoc.exists()) {
    const chatData = chatDoc.data();
    const updatedParticipants = chatData.participants.filter(id => id !== userId);

    await updateDoc(chatRef, {
      participants: updatedParticipants
    });
  }
};
