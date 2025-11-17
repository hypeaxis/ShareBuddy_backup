# Web App Chia sẻ Tài liệu (Document Sharing Platform)

Nền tảng chia sẻ tài liệu học tập trực tuyến cho sinh viên và giảng viên.

## 📋 Mô tả

Ứng dụng web cho phép người dùng:
- Tải lên và chia sẻ tài liệu học tập (PDF, DOCX, PPTX, etc.)
- Tìm kiếm tài liệu theo từ khóa, trường học, môn học
- Đánh giá và bình luận về tài liệu
- Hệ thống điểm (credits) để khuyến khích đóng góp
- Theo dõi tác giả yêu thích
- Đánh dấu tài liệu để xem sau
- Quản trị nội dung (Admin/Moderator)

## 🏗️ Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **Bootstrap** - CSS framework
- **React Bootstrap** - Bootstrap components for React
- **Axios** - HTTP client

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js >= 14.x
- PostgreSQL >= 12.x
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd project
```

### Bước 2: Cài đặt dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
cd ..
```

### Bước 3: Cấu hình môi trường

Tạo file `.env` ở thư mục gốc (copy từ `.env.example`):
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin của bạn:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=document_sharing_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_here

# Server
PORT=5000
```

### Bước 4: Tạo database

Tạo database PostgreSQL:
```sql
CREATE DATABASE document_sharing_db;
```

### Bước 5: Chạy ứng dụng

#### Development mode (riêng biệt)

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
```

Backend sẽ chạy tại: `http://localhost:5000`
Frontend sẽ chạy tại: `http://localhost:3000`

#### Production build
```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
project/
├── client/                  # Frontend React app
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context (Auth)
│       ├── pages/          # Page components
│       ├── services/       # API services
│       ├── App.js
│       └── index.js
├── server/                 # Backend Node.js app
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── docs/                  # Documentation
├── uploads/               # Uploaded files
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔑 Tài khoản mặc định

Sau khi khởi chạy, bạn có thể:
1. Đăng ký tài khoản mới
2. Hoặc tạo tài khoản admin thủ công trong database

Để tạo admin, sau khi đăng ký tài khoản, chạy SQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com';
```

## 🚀 Tính năng chính

### Người dùng thường
- ✅ Đăng ký/Đăng nhập
- ✅ Tìm kiếm và duyệt tài liệu
- ✅ Xem chi tiết tài liệu
- ✅ Tải lên tài liệu (nhận 5 credits)
- ✅ Tải xuống tài liệu (tiêu credits nếu là premium)
- ✅ Đánh giá và bình luận
- ✅ Đánh dấu tài liệu yêu thích
- ✅ Theo dõi tác giả
- ✅ Quản lý profile
- ✅ Xem lịch sử tải xuống

### Moderator
- ✅ Tất cả quyền của người dùng
- ✅ Duyệt/từ chối tài liệu
- ✅ Xử lý báo cáo vi phạm
- ✅ Xem thống kê hệ thống

### Admin
- ✅ Tất cả quyền của Moderator
- ✅ Quản lý người dùng
- ✅ Phân quyền
- ✅ Xóa người dùng

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Documents
- `GET /api/documents` - Lấy danh sách tài liệu
- `GET /api/documents/:id` - Lấy chi tiết tài liệu
- `POST /api/documents` - Upload tài liệu
- `GET /api/documents/:id/download` - Tải xuống
- `DELETE /api/documents/:id` - Xóa tài liệu

### Comments
- `GET /api/comments/document/:documentId` - Lấy comments
- `POST /api/comments` - Thêm comment
- `DELETE /api/comments/:id` - Xóa comment

### Bookmarks
- `GET /api/bookmarks` - Lấy danh sách bookmark
- `POST /api/bookmarks` - Thêm bookmark
- `DELETE /api/bookmarks/:documentId` - Xóa bookmark

### Follow
- `POST /api/follows` - Follow user
- `DELETE /api/follows/:userId` - Unfollow user
- `GET /api/follows/feed` - Lấy feed từ người đang follow

### Admin
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/users` - Danh sách users
- `GET /api/admin/documents` - Danh sách documents
- `PUT /api/admin/documents/:id/status` - Cập nhật trạng thái document

## 🔧 Troubleshooting

### Database connection error
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra thông tin trong `.env` đúng chưa
- Đảm bảo database đã được tạo

### Port already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install

# For client
cd client
rm -rf node_modules
npm install
```

## 👥 Nhóm phát triển

**Nhóm 14 - HUST**
- Nguyễn Hải Anh - 20225597
- Đỗ Tuấn Minh - 20225741
- Vũ Minh Trí - 20225940
- Cao Đức Anh - 20225781
- Nguyễn Mạnh Quân - 20225758
- Lê Đình Quốc Huy - 20225857

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng liên hệ qua email các thành viên nhóm.
