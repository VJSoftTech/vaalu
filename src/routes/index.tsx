import { Routes, Route } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import AuthLayout from '@/layouts/AuthLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'

// Auth
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'

// Public
import Home from '@/pages/public/Home'
import Books from '@/pages/public/Books'
import BookDetail from '@/pages/public/BookDetail'
import Authors from '@/pages/public/Authors'
import AuthorDetail from '@/pages/public/AuthorDetail'
import Blog from '@/pages/public/Blog'
import BlogDetail from '@/pages/public/BlogDetail'
import VaaluTV from '@/pages/public/VaaluTV'
import Cart from '@/pages/public/Cart'
import Checkout from '@/pages/public/Checkout'
import OrderConfirmation from '@/pages/public/OrderConfirmation'
import Profile from '@/pages/public/Profile'
import OrderHistory from '@/pages/public/OrderHistory'
import Wishlist from '@/pages/public/Wishlist'
import Offers from '@/pages/public/Offers'
import NotFound from '@/pages/public/NotFound'

// Admin
import Dashboard from '@/pages/admin/Dashboard'
import BooksList from '@/pages/admin/books/BooksList'
import AddBook from '@/pages/admin/books/AddBook'
import EditBook from '@/pages/admin/books/EditBook'
import AuthorsList from '@/pages/admin/authors/AuthorsList'
import AddAuthor from '@/pages/admin/authors/AddAuthor'
import EditAuthor from '@/pages/admin/authors/EditAuthor'
import BlogsList from '@/pages/admin/blogs/BlogsList'
import AddBlog from '@/pages/admin/blogs/AddBlog'
import EditBlog from '@/pages/admin/blogs/EditBlog'
import OrdersList from '@/pages/admin/orders/OrdersList'
import OrderDetail from '@/pages/admin/orders/OrderDetail'
import CustomersList from '@/pages/admin/customers/CustomersList'
import CustomerDetail from '@/pages/admin/customers/CustomerDetail'
import VideosList from '@/pages/admin/vaalu-tv/VideosList'
import AddVideo from '@/pages/admin/vaalu-tv/AddVideo'
import EditVideo from '@/pages/admin/vaalu-tv/EditVideo'
import CategoriesList from '@/pages/admin/categories/CategoriesList'
import AdsList from '@/pages/admin/advertisements/AdsList'
import AddAd from '@/pages/admin/advertisements/AddAd'
import EditAd from '@/pages/admin/advertisements/EditAd'
import SalesReport from '@/pages/admin/reports/SalesReport'
import RevenueReport from '@/pages/admin/reports/RevenueReport'
import PopularBooks from '@/pages/admin/reports/PopularBooks'
import CustomerReport from '@/pages/admin/reports/CustomerReport'
import ContactUs from '@/pages/public/ContactUs'
import ShippingDelivery from '@/pages/public/ShippingDelivery'
import ReturnsRefunds from '@/pages/public/ReturnsRefunds'
import PrivacyPolicy from '@/pages/public/PrivacyPolicy'
import TermsConditions from '@/pages/public/TermsConditions'
import FAQ from '@/pages/public/FAQ'
import Gifts from '@/pages/public/Gifts'
import GiftDetail from '@/pages/public/GiftDetail'
import GiftsList from '@/pages/admin/gifts/GiftsList'
import AddGift from '@/pages/admin/gifts/AddGift'
import EditGift from '@/pages/admin/gifts/EditGift'
import GiftEnquiries from '@/pages/admin/gifts/GiftEnquiries'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>

      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="books" element={<Books />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="authors" element={<Authors />} />
        <Route path="authors/:id" element={<AuthorDetail />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="vaalu-tv" element={<VaaluTV />} />
        <Route path="gifts" element={<Gifts />} />
        <Route path="gifts/:slug" element={<GiftDetail />} />
        <Route path="offers" element={<Offers />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="shipping" element={<ShippingDelivery />} />
        <Route path="returns" element={<ReturnsRefunds />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsConditions />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="books" element={<BooksList />} />
          <Route path="books/add" element={<AddBook />} />
          <Route path="books/:id/edit" element={<EditBook />} />
          <Route path="authors" element={<AuthorsList />} />
          <Route path="authors/add" element={<AddAuthor />} />
          <Route path="authors/:id/edit" element={<EditAuthor />} />
          <Route path="categories" element={<CategoriesList />} />
          <Route path="blogs" element={<BlogsList />} />
          <Route path="blogs/add" element={<AddBlog />} />
          <Route path="blogs/:id/edit" element={<EditBlog />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="vaalu-tv" element={<VideosList />} />
          <Route path="vaalu-tv/add" element={<AddVideo />} />
          <Route path="vaalu-tv/:id/edit" element={<EditVideo />} />
          <Route path="advertisements" element={<AdsList />} />
          <Route path="advertisements/add" element={<AddAd />} />
          <Route path="advertisements/:id/edit" element={<EditAd />} />
          <Route path="gifts" element={<GiftsList />} />
          <Route path="gifts/add" element={<AddGift />} />
          <Route path="gifts/:id/edit" element={<EditGift />} />
          <Route path="gifts/enquiries" element={<GiftEnquiries />} />
          <Route path="reports/sales" element={<SalesReport />} />
          <Route path="reports/revenue" element={<RevenueReport />} />
          <Route path="reports/popular-books" element={<PopularBooks />} />
          <Route path="reports/customers" element={<CustomerReport />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
