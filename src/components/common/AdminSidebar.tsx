import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  ShoppingBag,
  UserCheck,
  Tv,
  Megaphone,
  BarChart2,
  ChevronDown,
  Tag,
  Gift,
  MessageSquare,
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
      // { to: '/admin/advertisements', label: 'Advertisements', icon: Megaphone },
      { to: '/admin/gifts', label: 'Gift & Calendars', icon: Gift },
      { to: '/admin/gifts/enquiries', label: 'Gift Enquiries', icon: MessageSquare },
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
        'fixed left-0 top-0 h-full bg-card border-r z-40 transition-all duration-300 overflow-y-auto scrollbar-hide',
        sidebarOpen ? 'w-64' : 'w-16',
      )}
    >
      <div className="p-4 border-b">
        <span className={cn('font-bold text-primary text-lg', !sidebarOpen && 'hidden')}>
          VPMS Admin
        </span>
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
                  end={item.exact}
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
