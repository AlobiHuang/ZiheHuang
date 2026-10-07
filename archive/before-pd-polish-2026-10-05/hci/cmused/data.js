// CMUsed numbers, from the site's own admin dashboard.
//
// Each entry in SNAPSHOTS is one reading of the dashboard. The first is the
// baseline: where CMUsed stood when I joined. To update the page, ADD a new
// snapshot at the end (keep the first one as it is). The page always shows
// the newest numbers; Total users also shows how many joined since I did.
//
// Money in dollars, times in hours, everything else a count. Percentages
// (sell-through, share of users, reply rate) are worked out on the page.
export const SNAPSHOTS = [
  {
    id: 'joined',
    label: 'When I joined',
    date: '2026-09-24', // the day these numbers were read off the dashboard (YYYY-MM-DD)
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
  },
  {
    id: 'update-1',
    label: 'Update 1',
    date: '2026-10-02',
    // Figures the dashboard showed this time; everything else is carried over
    // from the reading before it (see the end of this file).
    values: {
      // Listings
      listingsTotal: 874,
      listingsActive: 471,
      listingsSold: 403,
      newListings24h: 0,
      newListings7d: 0,
      newListings30d: 24,
      // People
      totalUsers: 1794,
      dau: 24,
      wau: 84,
      mau: 278,
      signups24h: 7,
      signups7d: 22,
      signups30d: 143,
      partnerAccounts: 3,
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
  // , { id: 'update-2', label: 'Update 2', date: 'YYYY-MM-DD', values: { ...only the keys that were read... } }
];

// A reading only needs the figures that were actually read; the rest carry
// over from the reading before it.
for (let i = 1; i < SNAPSHOTS.length; i += 1) {
  SNAPSHOTS[i].values = { ...SNAPSHOTS[i - 1].values, ...SNAPSHOTS[i].values };
}
