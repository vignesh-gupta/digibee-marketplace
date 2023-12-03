export const PRODUCT_CATEGORIES = [
  {
    label: "UI Kits",
    value: "ui_kits" as const,
    featured: [
      {
        name: 'Editors pick',
        href: '#',
        image: '/nav/ui-kits/mixed.jpg'
      },
      {
        name: 'New Arrivals',
        href: '#',
        image: '/nav/ui-kits/blue.jpg'
      },
      {
        name: 'Best Sellers',
        href: '#',
        image: '/nav/ui-kits/purple.jpg'
      }
    ]
  },
  {
    label: "Icons",
    value: "icons" as const,
    featured: [
      {
        name: 'Favorite Picks',
        href: '#',
        image: '/nav/icons/picks.jpg'
      },
      {
        name: 'New Arrivals',
        href: '#',
        image: '/nav/icons/new.jpg'
      },
      {
        name: 'Best Selling Icons',
        href: '#',
        image: '/nav/icons/bestsellers.jpg'
      }
    ]
  },
];
