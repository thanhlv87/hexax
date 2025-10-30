# HexaChat - Ứng dụng Nhắn tin Real-time

Ứng dụng nhắn tin real-time giống Telegram/Zalo được xây dựng với React, Firebase, và TailwindCSS. Hỗ trợ nhắn tin 1-1, nhắn tin nhóm, gửi file/hình ảnh, và giao diện responsive tối ưu cho mobile.

## Tính năng

### Xác thực
- ✅ Đăng ký tài khoản với email/password
- ✅ Đăng nhập
- ✅ Đăng xuất
- ✅ Quản lý trạng thái online/offline

### Nhắn tin
- ✅ Chat 1-1 với người dùng khác
- ✅ Tạo và quản lý nhóm chat
- ✅ Gửi tin nhắn text
- ✅ Gửi hình ảnh
- ✅ Gửi file đính kèm
- ✅ Real-time updates (tin nhắn hiển thị ngay lập tức)
- ✅ Hiển thị thời gian gửi tin nhắn
- ✅ Hiển thị trạng thái online của người dùng

### Giao diện
- ✅ Responsive design (tối ưu cho mobile)
- ✅ Giao diện hiện đại với TailwindCSS
- ✅ Dark/Light theme support
- ✅ Smooth animations
- ✅ Sidebar với danh sách chat
- ✅ Chat area với message bubbles
- ✅ Modal để tạo chat mới và tạo nhóm

## Công nghệ sử dụng

- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Firebase Authentication** - Xác thực người dùng
- **Cloud Firestore** - Database real-time
- **Firebase Storage** - Lưu trữ file/hình ảnh
- **TailwindCSS** - Styling
- **date-fns** - Format thời gian

## Cài đặt

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd hexax
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình Firebase

1. Tạo project mới trên [Firebase Console](https://console.firebase.google.com/)

2. Bật các dịch vụ sau:
   - **Authentication** > Sign-in method > Email/Password
   - **Firestore Database** > Create database (chọn Start in production mode)
   - **Storage** > Get started

3. Cấu hình Firestore Rules (Database > Rules):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Chats collection
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;

      // Messages subcollection
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

4. Cấu hình Storage Rules (Storage > Rules):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chats/{chatId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 10 * 1024 * 1024; // Max 10MB
    }
  }
}
```

5. Lấy Firebase config từ Project Settings > General > Your apps > SDK setup and configuration

6. Cập nhật file `src/config/firebase.js` với thông tin của bạn:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Bước 4: Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

### Bước 5: Build cho production

```bash
npm run build
```

## Cấu trúc thư mục

```
hexax/
├── src/
│   ├── components/         # React components
│   │   ├── ChatArea.jsx   # Khu vực chat chính
│   │   ├── MessageBubble.jsx  # Component hiển thị tin nhắn
│   │   ├── NewChatModal.jsx   # Modal tạo chat mới
│   │   ├── NewGroupModal.jsx  # Modal tạo nhóm
│   │   ├── PrivateRoute.jsx   # Route bảo vệ
│   │   └── Sidebar.jsx    # Sidebar danh sách chat
│   ├── config/
│   │   └── firebase.js    # Cấu hình Firebase
│   ├── contexts/
│   │   ├── AuthContext.jsx    # Context xác thực
│   │   └── ChatContext.jsx    # Context chat
│   ├── pages/
│   │   ├── Home.jsx       # Trang chủ
│   │   ├── Login.jsx      # Trang đăng nhập
│   │   └── Signup.jsx     # Trang đăng ký
│   ├── services/
│   │   └── chatService.js # Firebase services
│   ├── App.jsx            # App component chính
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## Hướng dẫn sử dụng

### Đăng ký tài khoản mới

1. Mở ứng dụng
2. Click "Đăng ký ngay"
3. Nhập tên hiển thị, email và mật khẩu
4. Click "Đăng ký"

### Bắt đầu chat 1-1

1. Đăng nhập vào ứng dụng
2. Click vào menu (3 chấm) ở góc trên bên phải
3. Chọn "Chat mới"
4. Tìm kiếm người dùng theo tên hoặc email
5. Click vào người dùng để bắt đầu chat

### Tạo nhóm chat

1. Click vào menu (3 chấm) ở góc trên bên phải
2. Chọn "Tạo nhóm"
3. Nhập tên nhóm
4. Chọn thành viên muốn thêm vào nhóm
5. Click "Tạo nhóm"

### Gửi tin nhắn

- **Text**: Nhập tin nhắn vào ô input và nhấn Enter hoặc click nút gửi
- **File/Hình ảnh**: Click vào icon đính kèm, chọn file, và file sẽ được gửi tự động

## Firebase Collections Structure

### users
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string | null,
  status: 'online' | 'offline',
  lastSeen: timestamp,
  createdAt: timestamp
}
```

### chats
```javascript
{
  type: 'private' | 'group',
  participants: [userId1, userId2, ...],
  name: string, // Chỉ cho group
  admins: [userId], // Chỉ cho group
  createdBy: userId, // Chỉ cho group
  lastMessage: string,
  lastMessageTime: timestamp,
  createdAt: timestamp
}
```

### chats/{chatId}/messages
```javascript
{
  senderId: userId,
  content: string,
  type: 'text' | 'image' | 'file',
  fileUrl: string | null,
  read: boolean,
  createdAt: timestamp
}
```

## Tính năng sắp tới

- [ ] Typing indicators
- [ ] Message read receipts
- [ ] Push notifications
- [ ] Voice messages
- [ ] Video calls
- [ ] Message reactions
- [ ] Message search
- [ ] User profiles
- [ ] Group admin controls
- [ ] Message deletion
- [ ] Edit messages

## Troubleshooting

### Lỗi Firebase

1. **Permission denied**: Kiểm tra lại Firestore và Storage rules
2. **Invalid API key**: Kiểm tra lại Firebase config trong `src/config/firebase.js`
3. **Authentication error**: Đảm bảo đã bật Email/Password trong Firebase Console

### Lỗi build

1. Xóa `node_modules` và `package-lock.json`
2. Chạy `npm install` lại
3. Chạy `npm run dev`

## License

MIT License

## Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên GitHub repository.
