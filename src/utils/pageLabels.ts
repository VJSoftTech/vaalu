const PAGE_LABEL_RULES: [RegExp, string][] = [
  [/^\/$/, 'Home'],
  [/^\/books\/[^/]+$/, 'Book Detail'],
  [/^\/books/, 'Books'],
  [/^\/authors\/[^/]+$/, 'Author Detail'],
  [/^\/authors/, 'Authors'],
  [/^\/blog\/[^/]+$/, 'Blog Detail'],
  [/^\/blog/, 'Blog'],
  [/^\/reviews/, 'Reviews'],
  [/^\/vaalu-tv/, 'Vaalu TV'],
  [/^\/gifts\/[^/]+$/, 'Gift Detail'],
  [/^\/gifts/, 'Gifts'],
  [/^\/donate-books/, 'Donate Books'],
  [/^\/corporate-enquiries/, 'Corporate Enquiries'],
  [/^\/copyright-enquiries/, 'Copyright Enquiries'],
  [/^\/offers/, 'Offers'],
  [/^\/about/, 'About Us'],
  [/^\/publish-plan/, 'Publish Plan'],
  [/^\/contact/, 'Contact Us'],
  [/^\/cart/, 'Cart'],
  [/^\/checkout/, 'Checkout'],
  [/^\/order-confirmation/, 'Order Confirmation'],
  [/^\/profile/, 'Profile'],
  [/^\/orders/, 'Order History'],
  [/^\/wishlist/, 'Wishlist'],
  [/^\/announcements/, 'Announcements'],
]

export const getPageName = (pathname: string): string => {
  for (const [pattern, label] of PAGE_LABEL_RULES) {
    if (pattern.test(pathname)) return label
  }
  return pathname
}
