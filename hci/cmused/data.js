// CMUsed numbers, from the site's own admin dashboard.
//
// Each entry in SNAPSHOTS is one reading of the dashboard. The first is the
// baseline: where CMUsed stood when I joined. To update the page, ADD a new
// snapshot at the end (keep the first one as it is). The page always shows
// the newest numbers, and every figure that has moved since I joined is
// marked with the change and the starting value.
//
// Money in dollars, times in hours, everything else a count. Percentages
// (sell-through, share of users, reply rate) are worked out on the page.
export const SNAPSHOTS = [
  {
    id: 'joined',
    label: 'When I joined',
    date: '', // e.g. '2026-09' — fill in when known
    values: {
      // Marketplace
      soldValue: 23800,        // total value of sold items
      activeInventory: 33600,  // total asking price of unsold listings
      medianSale: 15,
      averageSale: 59,
      // Listings
      listingsTotal: 874,
      listingsActive: 471,
      listingsSold: 403,
      newListings24h: 0,
      newListings7d: 3,
      newListings30d: 24,
      // People
      totalUsers: 1781,
      dau: 22,
      wau: 116,
      mau: 288,
      signups24h: 2,
      signups7d: 55,
      signups30d: 147,
      partnerAccounts: 3,
      // Buyers and sellers
      sellers: 80,             // sold at least one item
      wouldBeSellers: 90,      // listed something, nothing sold yet
      buyers: 39,              // asked about an item that then sold (estimate)
      wouldBeBuyers: 111,      // asked about items, none have sold
      bothSides: 0,
      neverListed: 1611,
      neverMessaged: 1631,
      // Messaging
      sellersContacted: 104,
      sellersNeverReplied: 94,
      repliesAnswered: 31,     // conversations that got an answer
      medianReplyHours: 28.1,
      unansweredMessages: 312,
      // Active listings by category
      categories: {
        Clothing: 112,
        Furniture: 136,
        Electronics: 68,
        Rideables: 3,
        Appliances: 75,
        'Home Decor': 29,
        Books: 5,
        Other: 43
      }
    }
  }
  // , { id: 'update-1', label: 'Update 1', date: '2026-11', values: { ...same keys... } }
];
