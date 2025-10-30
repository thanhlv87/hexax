# HƯỚNG DẪN CẤU HÌNH FIREBASE - SIÊU ĐƠN GIẢN

## Bước 1: Tạo tài khoản Firebase (MIỄN PHÍ)

1. Mở trình duyệt và vào: https://console.firebase.google.com/
2. Đăng nhập bằng tài khoản Google của bạn
3. Click nút "Create a project" (Tạo dự án mới)
4. Đặt tên project (ví dụ: "hexachat-demo")
5. Bỏ chọn Google Analytics (không cần)
6. Click "Create project" và đợi vài giây

## Bước 2: Lấy thông tin cấu hình (5 phút)

### 2.1. Tạo Web App
1. Trong Firebase Console, click vào biểu tượng "</>" (Web)
2. Đặt tên app: "HexaChat Web"
3. Click "Register app"
4. Bạn sẽ thấy một đoạn code như thế này:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

5. **COPY** toàn bộ đoạn code này (quan trọng!)
6. Click "Continue to console"

### 2.2. Bật Authentication (Xác thực)
1. Ở menu bên trái, click "Authentication"
2. Click "Get started"
3. Click vào "Email/Password"
4. Bật ON cái công tắc đầu tiên (Email/Password)
5. Click "Save"

✅ XONG Authentication!

### 2.3. Tạo Firestore Database
1. Ở menu bên trái, click "Firestore Database"
2. Click "Create database"
3. Chọn "Start in **production mode**"
4. Click "Next"
5. Chọn location gần bạn nhất (ví dụ: asia-southeast1)
6. Click "Enable"
7. Đợi vài giây cho database được tạo

#### Cấu hình Rules cho Firestore:
1. Click tab "Rules" ở trên
2. Xóa toàn bộ nội dung cũ
3. Paste đoạn code này:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        request.auth.uid in resource.data.participants;
      match /messages/{messageId} {
        allow read: if request.auth != null;
        allow create: if request.auth != null;
      }
    }
  }
}
```

4. Click "Publish"

✅ XONG Firestore!

### 2.4. Tạo Storage (Lưu trữ file)
1. Ở menu bên trái, click "Storage"
2. Click "Get started"
3. Click "Next" (giữ nguyên rules mặc định)
4. Chọn location giống Firestore
5. Click "Done"

#### Cấu hình Rules cho Storage:
1. Click tab "Rules" ở trên
2. Xóa toàn bộ nội dung cũ
3. Paste đoạn code này:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /chats/{chatId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

4. Click "Publish"

✅ XONG Storage!

## Bước 3: Cập nhật code (1 phút)

1. Mở file `src/config/firebase.js` trong project
2. Tìm đoạn code:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  ...
};
```

3. Thay thế toàn bộ bằng đoạn code bạn đã copy ở Bước 2.1

4. Lưu file (Ctrl+S hoặc Cmd+S)

## Bước 4: Chạy lại ứng dụng

1. Dừng server cũ (Ctrl+C trong terminal)
2. Chạy lại: `npm run dev`
3. Mở http://localhost:5173

## Bước 5: Test ứng dụng

1. Click "Đăng ký ngay"
2. Nhập:
   - Tên hiển thị: "Test User"
   - Email: test@example.com
   - Mật khẩu: 123456
3. Click "Đăng ký"

🎉 XONG! Bạn đã có ứng dụng nhắn tin hoạt động!

---

## Nếu gặp lỗi:

### Lỗi "Firebase: Error (auth/invalid-api-key)"
→ Kiểm tra lại bạn đã copy đúng firebaseConfig chưa

### Lỗi "Missing or insufficient permissions"
→ Kiểm tra lại Firestore Rules và Storage Rules

### Không thấy tin nhắn
→ Đảm bảo đã bật Firestore Database

---

## Cần trợ giúp?

Nếu bạn gặp bất kỳ lỗi nào, hãy:
1. Chụp màn hình lỗi
2. Check console trong browser (F12 → Console tab)
3. Gửi thông tin lỗi để được hỗ trợ

---

**LƯU Ý**: Firebase có gói miễn phí (Spark Plan) với:
- 50,000 lượt đọc/ngày
- 20,000 lượt ghi/ngày
- 5GB storage
- Hoàn toàn đủ để test và demo!
