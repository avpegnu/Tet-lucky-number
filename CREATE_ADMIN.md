# Tạo Admin Account

Có 2 cách để tạo admin account:

## 🚀 Cách 1: Dùng Script Seed (KHUYẾN NGHỊ)

```bash
cd backend

# Tạo admin với username/password mặc định
npm run seed:admin

# Hoặc tùy chỉnh username/password
ADMIN_USERNAME=myadmin ADMIN_PASSWORD=mypassword npm run seed:admin
```

**Thông tin đăng nhập mặc định:**
- Username: `admin`
- Password: `admin123`

---

## 🔧 Cách 2: Tạo Manually trong MongoDB

### Bước 1: Tạo hashed password

Tạo file `hash-password.js`:
```javascript
const bcrypt = require('bcrypt');

async function hashPassword() {
  const password = 'your-password-here';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hashed password:', hash);
}

hashPassword();
```

Chạy: `node hash-password.js`

### Bước 2: Insert vào MongoDB

Dùng MongoDB Compass hoặc mongo shell:

```javascript
db.admins.insertOne({
  username: "admin",
  password: "$2b$10$hashedPasswordHere",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## ✅ Sau khi tạo Admin

1. Khởi động backend: `npm run start:dev`
2. Mở frontend tại `http://localhost:5173`
3. Vào `/admin/login`
4. Đăng nhập với credentials đã tạo
5. Bắt đầu tạo users! 🎉
