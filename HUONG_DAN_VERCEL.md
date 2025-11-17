# Hướng Dẫn Deploy HexaChat lên Vercel

## 📌 Giới thiệu

Vercel là nền tảng hosting tốt nhất cho ứng dụng React/Vite với:
- ✅ Deploy tự động khi push code
- ✅ HTTPS miễn phí
- ✅ CDN toàn cầu
- ✅ Không cần config phức tạp
- ✅ Preview URL cho mỗi Pull Request

---

## 🚀 Cách Deploy lên Vercel

### Bước 1: Chuẩn bị

1. **Tạo tài khoản Vercel** (nếu chưa có):
   - Truy cập: https://vercel.com
   - Click "Sign Up"
   - Đăng ký bằng GitHub account (khuyến nghị)

2. **Đảm bảo code đã push lên GitHub**:
   ```bash
   git status
   git add .
   git commit -m "Cấu hình cho Vercel deployment"
   git push origin main
   ```

### Bước 2: Import Project từ GitHub

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)

2. Click nút **"Add New..."** → **"Project"**

3. Click **"Import Git Repository"**

4. Tìm và chọn repository **"hexax"** (hoặc tên repo của bạn)

5. Click **"Import"**

### Bước 3: Cấu hình Project

Vercel sẽ tự động detect project settings:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**✅ KHÔNG CẦN SỬA GÌ** - Để mặc định!

### Bước 4: Cấu hình Environment Variables (Firebase)

⚠️ **QUAN TRỌNG**: Bạn cần thêm Firebase config vào Vercel

1. Trong màn hình import project, scroll xuống phần **"Environment Variables"**

2. Thêm các biến sau (lấy từ file `src/config/firebase.js`):

   ```
   VITE_FIREBASE_API_KEY=AIzaSyD...
   VITE_FIREBASE_AUTH_DOMAIN=hexachat-....firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=hexachat-...
   VITE_FIREBASE_STORAGE_BUCKET=hexachat-....appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456...
   VITE_FIREBASE_APP_ID=1:123456...
   ```

   *(Copy giá trị từ Firebase Console của bạn)*

3. Hoặc **bỏ qua bước này** nếu bạn để hardcode trong `firebase.js` (không khuyến nghị cho production)

### Bước 5: Deploy!

1. Click nút **"Deploy"**

2. Chờ khoảng 1-2 phút để Vercel:
   - Install dependencies
   - Build project
   - Deploy lên CDN

3. Sau khi deploy xong, bạn sẽ thấy:
   - ✅ Deployment successful
   - 🔗 URL của app (vd: `https://hexax-abc123.vercel.app`)

4. Click vào URL để xem app!

---

## 🔄 Tự động Deploy khi Push Code

Sau lần deploy đầu tiên, mỗi khi bạn push code lên GitHub:

```bash
git add .
git commit -m "Update features"
git push
```

➡️ Vercel sẽ **TỰ ĐỘNG** build và deploy phiên bản mới!

### Xem Deployment Status:

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click vào project "hexax"
3. Tab "Deployments" để xem lịch sử

---

## 🌐 Custom Domain (Tùy chọn)

Muốn dùng domain riêng thay vì `*.vercel.app`?

1. Vào project → Tab **"Settings"** → **"Domains"**
2. Nhập domain của bạn (vd: `hexachat.com`)
3. Follow hướng dẫn cấu hình DNS
4. Vercel sẽ tự động cấp HTTPS certificate

---

## 🔧 File Quan Trọng cho Vercel

### 1. `vercel.json` - SPA Routing Config

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Giải thích:**
- Mọi URL sẽ redirect về `index.html`
- Cho phép React Router xử lý routing
- Tránh lỗi 404 khi refresh page

### 2. `vite.config.js` - Auto-detect Platform

```js
export default defineConfig({
  plugins: [react()],
  base: process.env.VERCEL ? '/' : '/hexax/',
})
```

**Giải thích:**
- Nếu deploy trên Vercel: dùng base path `/`
- Nếu deploy trên GitHub Pages: dùng base path `/hexax/`
- Tự động detect environment

---

## 🐛 Troubleshooting

### Lỗi: "Firebase is not initialized"

**Nguyên nhân:** Chưa cấu hình Environment Variables

**Giải pháp:**
1. Vào Vercel Dashboard → Project Settings
2. Tab "Environment Variables"
3. Thêm các biến `VITE_FIREBASE_*`
4. Redeploy project

### Lỗi: "404 Not Found" khi refresh page

**Nguyên nhân:** Thiếu file `vercel.json`

**Giải pháp:**
- Đảm bảo có file `vercel.json` ở root directory
- Redeploy project

### Lỗi: Build failed

**Kiểm tra:**
```bash
# Test build locally
npm run build

# Xem log lỗi
npm run preview
```

### Lỗi: Assets không load (CSS, JS)

**Nguyên nhân:** Base path không đúng

**Giải pháp:**
- Check `vite.config.js` có `base: process.env.VERCEL ? '/' : '/hexax/'`
- Redeploy

---

## 📊 So sánh Vercel vs GitHub Pages

| Tính năng | Vercel | GitHub Pages |
|-----------|--------|--------------|
| Deploy Speed | ⚡ 1-2 phút | 🐢 3-5 phút |
| Auto Deploy | ✅ Mọi branch | ✅ Chỉ main/gh-pages |
| Preview URL | ✅ Mỗi PR | ❌ Không |
| Custom Domain | ✅ Miễn phí + HTTPS | ✅ Có (cần config DNS) |
| Environment Variables | ✅ GUI dễ dùng | ❌ Phải hardcode |
| Analytics | ✅ Built-in | ❌ Phải tích hợp GA |
| Server Functions | ✅ Có | ❌ Chỉ static |
| CDN | ✅ Toàn cầu | ✅ GitHub CDN |

**Khuyến nghị:** 🏆 **Vercel** cho production, GitHub Pages cho demo/testing

---

## 🔗 Links Hữu Ích

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Firebase Console](https://console.firebase.google.com)

---

## ✅ Checklist Deploy

- [ ] Push code lên GitHub
- [ ] Tạo tài khoản Vercel
- [ ] Import repository từ GitHub
- [ ] (Tùy chọn) Thêm Environment Variables
- [ ] Click Deploy
- [ ] Test app trên URL Vercel
- [ ] (Tùy chọn) Cấu hình custom domain

---

## 🎉 Hoàn tất!

App của bạn đã online tại: `https://your-project.vercel.app`

Mỗi lần push code, Vercel sẽ tự động deploy phiên bản mới trong vài phút!
