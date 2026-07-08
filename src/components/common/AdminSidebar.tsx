import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  ShoppingBag,
  UserCheck,
  Tv,
  BarChart2,
  ChevronDown,
  Tag,
  Gift,
  MessageSquare,
  UserCog,
  SlidersHorizontal,
  Star,
  HeartHandshake,
  Building2,
  Copyright,
  Megaphone,
  Eye,
} from 'lucide-react'
import { useState } from 'react'
import { useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true }],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/admin/books',      label: 'Books',      icon: BookOpen },
      { to: '/admin/authors',    label: 'Authors',    icon: Users },
      { to: '/admin/categories', label: 'Categories', icon: Tag },
    ],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/blogs', label: 'Blogs', icon: FileText },
      { to: '/admin/vaalu-tv', label: 'Vaalu TV', icon: Tv },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
      { to: '/admin/advertisements', label: 'Home Slider', icon: SlidersHorizontal },
      { to: '/admin/gifts', label: 'Gift & Calendars', icon: Gift },
      { to: '/admin/gifts/enquiries', label: 'Gift Enquiries', icon: MessageSquare },
      { to: '/admin/reviews', label: 'Book Reviews', icon: Star },
      { to: '/admin/donations', label: 'Book Donations', icon: HeartHandshake },
      { to: '/admin/corporate-enquiries', label: 'Corporate Enquiries', icon: Building2 },
      { to: '/admin/copyright-enquiries', label: 'Copyright Enquiries', icon: Copyright },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
      { to: '/admin/customers', label: 'Customers', icon: UserCheck },
    ],
  },
  {
    label: 'Settings',
    items: [
      { to: '/admin/users', label: 'Staff Users', icon: UserCog },
    ],
  },
  {
    label: 'Visitors',
    items: [
      { to: '/admin/visitors/who-visited-sites', label: 'Who Visited Sites', icon: Eye },
    ],
  },
  {
    label: 'Reports',
    items: [
      { to: '/admin/reports/sales', label: 'Sales', icon: BarChart2 },
      { to: '/admin/reports/revenue', label: 'Revenue', icon: BarChart2 },
      { to: '/admin/reports/popular-books', label: 'Popular Books', icon: BookOpen },
      { to: '/admin/reports/customers', label: 'Customers', icon: UserCheck },
    ],
  },
]

export default function AdminSidebar() {
  const { sidebarOpen } = useUIStore()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggle = (label: string) =>
    setCollapsed((s) => ({ ...s, [label]: !s[label] }))

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-card border-r z-40 transition-all duration-300 overflow-y-auto scrollbar-hide print:hidden',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="p-4 border-b flex items-center gap-2.5">
        <div className="h-9 w-9 shrink-0 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-primary-foreground shadow-sm">
          <BookOpen className="h-5 w-5" />
        </div>
        {sidebarOpen && (
          <div className="leading-tight overflow-hidden">
            <p className="font-bold text-foreground text-sm truncate">வாலு பதிப்பகம்</p>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        )}
      </div>

      <nav className="p-2 space-y-1">
        {navGroups.map((group) => (
          <div key={group.label}>
            {sidebarOpen && (
              <button
                onClick={() => toggle(group.label)}
                className="w-full flex items-center justify-between px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
              >
                {group.label}
                <ChevronDown
                  className={cn('h-3 w-3 transition-transform', collapsed[group.label] && 'rotate-180')}
                />
              </button>
            )}
            {!collapsed[group.label] &&
              group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={'exact' in item ? item.exact : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      !sidebarOpen && 'justify-center',
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {sidebarOpen && item.label}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
