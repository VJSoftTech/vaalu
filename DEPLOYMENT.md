# Vaalu Pathippagam — VPS Deployment Guide

## Prerequisites

| Requirement | Version |
|---|---|
| Ubuntu / Debian VPS | 20.04 LTS or later |
| Node.js | 20.x LTS |
| PostgreSQL | 14+ |
| PM2 | Latest |
| Nginx | Latest |

---

## 1. Connect to Your VPS

```bash
ssh root@your_server_ip
```

---

## 2. Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
node -v   # should print v20.x.x
npm -v
```

---

## 3. Install PostgreSQL

```bash
apt-get install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### Create database and user

```bash
sudo -u postgres psql
```

Inside the psql prompt:

```sql
CREATE DATABASE vaalu_db;
CREATE USER vaalu_user WITH ENCRYPTED PASSWORD 'your_strong_password';
GRANT ALL PRIVILEGES ON DATABASE vaalu_db TO vaalu_user;
\q
```

---

## 4. Install PM2

```bash
npm install -g pm2
```

---

## 5. Install Nginx

```bash
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## 6. Deploy the Application

### Clone the repository

```bash
mkdir -p /var/www/vaalu
cd /var/www/vaalu
git clone <your-repo-url> vaalu_web
cd vaalu_web
```

### Install dependencies

```bash
npm install
```

### Build the frontend

```bash
npm run build
```

This generates a `dist/` folder with the compiled React app.

---

## 7. Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

Fill in all values:

```env
DATABASE_URL=postgresql://vaalu_user:your_strong_password@localhost:5432/vaalu_db
VITE_API_BASE_URL=https://your-domain.com
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 8. Start the Backend with PM2

```bash
cd /var/www/vaalu/vaalu_web
pm2 start npm --name "vaalu_web" -- start
pm2 save
pm2 startup
```

Run the command printed by `pm2 startup` to enable auto-start on reboot.

### Verify the server is running

```bash
pm2 status
pm2 logs vaalu_web --lines 30
```

The API server starts on **port 5000**.

---

## 9. Configure Nginx

Create a new Nginx site config:

```bash
nano /etc/nginx/sites-available/vaalu
```

Paste the following (replace `your-domain.com`):

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Serve the React frontend (built files)
    root /var/www/vaalu/vaalu_web/dist;
    index index.html;

    # Handle React Router (SPA fallback)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the Node.js backend
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/vaalu/vaalu_web/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    client_max_body_size 20M;
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/vaalu /etc/nginx/sites-enabled/
nginx -t          # test config — must say "syntax is ok"
systemctl reload nginx
```

---

## 10. Enable HTTPS with Let's Encrypt (Recommended)

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```

Certbot will auto-update your Nginx config for HTTPS and set up auto-renewal.

---

## 11. Open Firewall Ports

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
ufw status
```

---

## Default Admin Credentials

| Field | Value |
|---|---|
| Email | admin@vaalu.com |
| Password | admin123 |

**Change the password immediately after first login.**

---

## Useful PM2 Commands

```bash
pm2 status                     # check process status
pm2 logs vaalu_web             # tail live logs
pm2 logs vaalu_web --lines 50  # last 50 log lines
pm2 restart vaalu_web          # restart the server
pm2 stop vaalu_web             # stop the server
pm2 delete vaalu_web           # remove from PM2
```

---

## Updating the Application

```bash
cd /var/www/vaalu/vaalu_web
git pull origin main
npm install
npm run build
pm2 restart vaalu_web
```

---

## Troubleshooting

### Port 5000 already in use

```bash
lsof -i :5000                 # find the conflicting PID
kill -9 <PID>
pm2 restart vaalu_web
```

### Cannot connect to PostgreSQL

```bash
sudo -u postgres psql -c "\l"           # list databases
systemctl status postgresql             # check service status
```

### Nginx returns 502 Bad Gateway

The Node.js backend is not running. Check:

```bash
pm2 status
pm2 logs vaalu_web --lines 30
```

### Uploads folder permissions

```bash
chown -R www-data:www-data /var/www/vaalu/vaalu_web/uploads
chmod -R 755 /var/www/vaalu/vaalu_web/uploads
```

---

## Directory Structure on Server

```
/var/www/vaalu/vaalu_web/
├── dist/           ← built React frontend (served by Nginx)
├── uploads/        ← user-uploaded images
│   ├── books/
│   ├── authors/
│   ├── blogs/
│   └── gifts/
├── server.cjs      ← Node.js backend
├── .env            ← environment variables (never commit this)
└── package.json
```
