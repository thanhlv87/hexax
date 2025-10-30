# HƯỚNG DẪN DEPLOY LÊN GITHUB PAGES

## ✅ Đã cấu hình xong!

Tôi đã cấu hình tất cả mọi thứ để deploy ứng dụng lên GitHub Pages. Bây giờ bạn chỉ cần làm theo các bước sau:

## Bước 1: Merge code vào main branch

Hiện tại code đang ở branch `claude/messaging-app-features-011CUdWMEfYm7kW3xHNxKsms`. Bạn cần merge vào main/master branch:

### Cách 1: Merge trực tiếp (nhanh)

```bash
# Checkout về main hoặc master
git checkout main
# hoặc
git checkout master

# Merge từ branch feature
git merge claude/messaging-app-features-011CUdWMEfYm7kW3xHNxKsms

# Push lên remote
git push origin main
# hoặc
git push origin master
```

### Cách 2: Tạo Pull Request (khuyên dùng)

1. Vào GitHub repository: https://github.com/thanhlv87/hexax
2. Click nút "Compare & pull request" (sẽ xuất hiện sau khi push)
3. Hoặc vào tab "Pull requests" → "New pull request"
4. Chọn:
   - Base: `main` (hoặc `master`)
   - Compare: `claude/messaging-app-features-011CUdWMEfYm7kW3xHNxKsms`
5. Click "Create pull request"
6. Click "Merge pull request"
7. Click "Confirm merge"

## Bước 2: Bật GitHub Pages

1. Vào Settings của repository: https://github.com/thanhlv87/hexax/settings/pages
2. Tìm phần "Build and deployment"
3. Chọn:
   - **Source**: GitHub Actions
4. Click "Save"

## Bước 3: Đợi GitHub Actions chạy

1. Vào tab "Actions": https://github.com/thanhlv87/hexax/actions
2. Bạn sẽ thấy workflow "Deploy to GitHub Pages" đang chạy
3. Đợi khoảng 2-3 phút để deploy hoàn tất
4. Khi thấy dấu ✅ màu xanh là đã xong!

## Bước 4: Test ứng dụng

Sau khi deploy xong, truy cập:

🌐 **https://thanhlv87.github.io/hexax/**

---

## ⚠️ Lưu ý quan trọng

### 1. Cấu hình Firebase

Ứng dụng sẽ chạy nhưng **chưa hoạt động đầy đủ** cho đến khi bạn cấu hình Firebase. Xem file `HUONG_DAN_FIREBASE.md` để biết chi tiết.

### 2. Mỗi lần thay đổi code

Mỗi khi bạn push code mới lên main/master branch, GitHub Actions sẽ tự động build và deploy lại.

### 3. Check lỗi

Nếu trang vẫn trắng sau khi deploy:
- Vào tab Actions và check log
- Đảm bảo workflow chạy thành công (dấu ✅)
- Clear cache trình duyệt (Ctrl+Shift+R)

---

## 🚀 Các bước tiếp theo

1. ✅ Merge code vào main
2. ✅ Bật GitHub Pages
3. ✅ Đợi deploy xong
4. ⚠️ Cấu hình Firebase (bắt buộc để app hoạt động)
5. ✅ Đăng ký tài khoản và test!

---

## 🛠️ Troubleshooting

### Trang vẫn trắng sau khi deploy
- Check Console trong browser (F12 → Console)
- Có thể do chưa cấu hình Firebase
- Check workflow trong Actions tab có lỗi không

### Workflow không chạy
- Đảm bảo đã merge vào main/master branch
- Check Settings → Actions → General → Allow all actions

### 404 Not Found
- Đảm bảo đã bật GitHub Pages
- Check lại Source phải là "GitHub Actions"

---

**Cần giúp đỡ?** Hãy check log trong Actions tab hoặc gửi screenshot lỗi!
