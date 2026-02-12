<div align="center">

# 🏢 Apartment Management System  
### (E-partment / Apna Complex)

*A production-grade SaaS platform for streamlining apartment & society management.*

![Last Commit](https://img.shields.io/github/last-commit/rishabh-sikarwar/Apartment-Management?style=flat&logo=git&logoColor=white&color=0080ff)
![Top Language](https://img.shields.io/github/languages/top/rishabh-sikarwar/Apartment-Management?style=flat&color=0080ff)

<p>
  <img src="https://img.shields.io/badge/Next.js-black?style=flat&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white" />
  <img src="https://img.shields.io/badge/PM2-2B037B?style=flat&logo=pm2&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white" />
</p>

🌐 **Live Demo:** http://eways.co.in  

</div>

---

# 📖 Overview

Apartment-Management is a **multi-tenant society management platform** built for real production deployment on a Linux VPS.

It manages:

- Residents  
- Society Admins  
- Staff  
- Security  
- Payments  
- Visitors  
- Complaints  
- Parking  

Built with a **custom authentication system** (OTP + JWT) to avoid heavy third-party dependencies.

---

# 🚀 Key Features

### 🔐 Authentication & Security
- Custom OTP login (Fast2SMS)
- JWT based authentication
- Role-based dashboards
- Secure cookie sessions

### 🏘️ Society Management
- Multi-society support
- Building & flat mapping
- Resident approval workflow
- Vehicle management system

### 💳 Payments & Utilities
- Razorpay integration
- QR based visitor entry
- Cloudinary image storage
- Complaint management
- Staff & salary system

---

# 💻 Tech Stack

| Category | Tech |
|---------|------|
Frontend | Next.js 15, React, Tailwind, Shadcn UI |
Backend | Next.js API Routes, Prisma |
Database | MySQL |
Auth | JWT, Fast2SMS OTP, bcrypt |
DevOps | Ubuntu VPS, PM2, Nginx |
Storage | Cloudinary |
Payments | Razorpay |

---

# ⚡ Local Setup

## 1️⃣ Clone repo
```bash
git clone https://github.com/rishabh-sikarwar/Apartment-Management.git
cd Apartment-Management
```

## 2️⃣ Install dependencies
```bash
npm install
```

## 3️⃣ Create `.env`
```
DATABASE_URL="mysql://user:password@localhost:3306/apartment_db"
JWT_SECRET="your_secret"
FAST2SMS_API_KEY="your_key"

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

## 4️⃣ Setup DB
```bash
npx prisma generate
npx prisma db push
```

## 5️⃣ Run dev server
```bash
npm run dev
```

App → http://localhost:3000

---

# ☁️ VPS Deployment (Ubuntu)

## Build app
```bash
npm run build
```

## Start with PM2
```bash
pm2 start server.js --name epartment
pm2 save
pm2 startup
```

## Nginx Reverse Proxy
```
Port 80 → Port 3000
```

Enable firewall:
```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
```

---

# 🧱 Database

MySQL self-hosted on VPS  
Managed using Prisma ORM

---

# 🤝 Contributing
Pull requests welcome.  
Open issues for bugs/features.

---

<div align="center">

Built with ❤️ by  
**Rishabh Sikarwar**

</div>
