# Vaalu Pathippagam 

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Project Flow](#project-flow)
4. [Features](#features)
5. [User Roles & Access Control](#user-roles--access-control)
6. [Security Measures](#security-measures)
7. [Advantages](#advantages)
8. [Technology Stack](#technology-stack)
9. [API Endpoints](#api-endpoints)
10. [Database Schema](#database-schema)
11. [Deployment Information](#deployment-information)

---

## Project Overview

Vaalu Pathippagam Publishing & eCommerce Management System (VPMS) is a comprehensive digital publishing platform designed to modernize Tamil book publishing, online book sales, content management, and customer engagement.

The system provides a premium online bookstore experience while offering a centralized administrative dashboard for managing books, authors, blogs, orders, advertisements, and Vaalu TV content.

The platform aims to preserve Tamil literature while embracing modern digital commerce technologies.

### Current Environment

| Environment | Details |
|---|---|
| Development | Localhost |
---

## System Architecture

### Client (Frontend)

- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Shadcn UI
- React Router
- Responsive Mobile-first Design

### Server (Backend)

- Node.js
- Express.js
- JWT Authentication
- Role-Based Access Control
- RESTful APIs
- Multer File Upload Service
- Razorpay Payment Integration

### Database

- PostgreSQL

### External Integrations

| Service | Purpose |
|---|---|
| Razorpay | Payment Gateway |
| YouTube API | Vaalu TV |
| Cloudinary | Image Storage |
| Firebase | Push Notifications |
| WhatsApp Business API | Customer Communication |

---

## Project Flow

### Book Purchase Flow

```
Customer Visits Website
        ↓
   Browse Books
        ↓
  View Book Details
        ↓
    Add to Cart
        ↓
   Apply Coupon
        ↓
     Checkout
        ↓
Payment Processing
        ↓
Order Confirmation
        ↓
  Shipping Process
        ↓
  Order Delivery
```

### Blog Reading Flow

```
Visitor Opens Blog
        ↓
Browse Categories
        ↓
  Read Article
        ↓
View Related Posts
        ↓
  Share Article
        ↓
Subscribe Newsletter
```

### Vaalu TV Flow

```
User Opens Vaalu TV
        ↓
  Browse Videos
        ↓
Watch Featured Content
        ↓
Explore Categories
        ↓
Subscribe to Channel
```

### Advertisement Flow

```
Admin Creates Promotion
        ↓
  Schedules Campaign
        ↓
  Banner Published
        ↓
Customer Views Offer
        ↓
 Redirect to Product
        ↓
 Purchase Completed
```

---

## Features

### Core Modules

#### Book Management

- Add Books
- Edit Books
- Delete Books
- Manage Inventory
- Upload Cover Images
- Upload PDF Preview
- Bulk Import Support

#### Author Management

- Author Profiles
- Biography Management
- Social Media Integration
- Published Books Listing

#### Blog Management

- Blogger Content Migration
- Rich Text Editor
- Category Management
- Tags Management
- Search Functionality
- Related Posts

#### Order Management

- Order Tracking
- Payment Verification
- Shipping Status
- Return Requests
- Invoice Generation

#### Customer Management

- Customer Profiles
- Order History
- Wishlist Management
- Reviews and Ratings

#### Vaalu TV Management

- YouTube Video Integration
- Featured Videos
- Playlist Management
- Video Categories

#### Advertisement Management

- Currency Gift Advertisements
- Festival Campaigns
- Promotional Banners
- Countdown Offers

---

## API Endpoints

### Authentication

```
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/profile
```

### Books

```
GET    /api/books
GET    /api/books/{id}
POST   /api/books
PUT    /api/books/{id}
DELETE /api/books/{id}
```

### Authors

```
GET    /api/authors
POST   /api/authors
PUT    /api/authors/{id}
DELETE /api/authors/{id}
```

### Orders

```
GET    /api/orders
GET    /api/orders/{id}
PUT    /api/orders/{id}/status
```

### Blogs

```
GET    /api/blogs
POST   /api/blogs
PUT    /api/blogs/{id}
DELETE /api/blogs/{id}
```

### Vaalu TV

```
GET    /api/videos
POST   /api/videos
PUT    /api/videos/{id}
DELETE /api/videos/{id}
```

### Advertisements

```
GET    /api/advertisements
POST   /api/advertisements
PUT    /api/advertisements/{id}
DELETE /api/advertisements/{id}
```

### Reports

```
GET    /api/reports/sales
GET    /api/reports/revenue
GET    /api/reports/popular-books
GET    /api/reports/customers
```

---

## Database Schema

### `users`

| Column | Type |
|---|---|
| id | PK |
| name | string |
| email | string |
| password_hash | string |
| role_id | FK |
| is_active | boolean |
| created_at | timestamp |

### `books`

| Column | Type |
|---|---|
| id | PK |
| title | string |
| author_id | FK |
| category_id | FK |
| isbn | string |
| description | text |
| price | decimal |
| discount_price | decimal |
| stock_quantity | integer |
| cover_image | string |
| preview_pdf | string |
| rating | decimal |
| created_at | timestamp |

### `authors`

| Column | Type |
|---|---|
| id | PK |
| name | string |
| biography | text |
| photo | string |
| social_links | json |

### `categories`

| Column | Type |
|---|---|
| id | PK |
| name | string |
| slug | string |

### `customers`

| Column | Type |
|---|---|
| id | PK |
| name | string |
| email | string |
| mobile_number | string |

### `orders`

| Column | Type |
|---|---|
| id | PK |
| customer_id | FK |
| order_number | string |
| subtotal | decimal |
| gst_amount | decimal |
| shipping_amount | decimal |
| total_amount | decimal |
| payment_status | string |
| order_status | string |

### `order_items`

| Column | Type |
|---|---|
| id | PK |
| order_id | FK |
| book_id | FK |
| quantity | integer |
| unit_price | decimal |

### `blogs`

| Column | Type |
|---|---|
| id | PK |
| title | string |
| slug | string |
| content | text |
| featured_image | string |
| author_id | FK |
| published_at | timestamp |

### `videos`

| Column | Type |
|---|---|
| id | PK |
| youtube_id | string |
| title | string |
| thumbnail | string |
| duration | string |
| is_featured | boolean |

### `advertisements`

| Column | Type |
|---|---|
| id | PK |
| title | string |
| banner_image | string |
| redirect_url | string |
| start_date | date |
| end_date | date |
| is_active | boolean |

---

## Deployment Information

### Development Environment

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Database | PostgreSQL Local Instance |
