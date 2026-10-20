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
  },
  {
    id: 'update-2',
    label: 'Update 2',
    date: '2026-10-05', // admin dashboard, last updated Oct 5, 5:43 PM
    values: {
      // Marketplace
      soldValue: 23900,
      activeInventory: 33400,
      medianSale: 15,
      averageSale: 59,
      // Listings
      listingsTotal: 872,
      listingsActive: 466,
      listingsSold: 406,
      newListings24h: 0,
      newListings7d: 0,
      newListings30d: 10,
      // People
      totalUsers: 1802,
      dau: 25,
      wau: 91,
      mau: 262,
      signups24h: 3,
      signups7d: 20,
      signups30d: 134,
      partnerAccounts: 3,
      // Buyers and sellers
      sellers: 82,
      wouldBeSellers: 87,
      buyers: 42,
      wouldBeBuyers: 111,
      bothSides: 1,
      neverListed: 1633,
      neverMessaged: 1649,
      // Messaging
      sellersContacted: 110,
      sellersNeverReplied: 96,
      repliesAnswered: 40,
      medianReplyHours: 28.7,
      unansweredMessages: 313,
      // Active listings by category
      categories: {
        Clothing: 112,
        Furniture: 136,
        Electronics: 67,
        Rideables: 3,
        Appliances: 73,
        'Home Decor': 28,
        Books: 4,
        Other: 43
      }
    }
  },
  {
    id: 'update-3',
    label: 'Update 3',
    date: '2026-10-06', // admin dashboard, read Oct 6
    // Only the figures on screen this time; the rest carry over from Update 2.
    values: {
      // Listings
      listingsTotal: 872,
      listingsActive: 465,
      listingsSold: 407,
      newListings24h: 0,
      newListings7d: 0,
      newListings30d: 6,
      // People
      totalUsers: 1805,
      dau: 11,
      wau: 88,
      mau: 263,
      signups24h: 3,
      signups7d: 19,
      signups30d: 133,
      partnerAccounts: 3,
      // Buyers and sellers
      bothSides: 1,
      neverListed: 1636,
      neverMessaged: 1652
    }
  },
  {
    id: 'update-4',
    label: 'Update 4',
    date: '2026-10-07', // admin dashboard, read Oct 7
    // Only the figures on screen this time; the rest carry over from Update 3.
    values: {
      // Listings
      listingsTotal: 872,
      listingsActive: 465,
      listingsSold: 407,
      newListings24h: 0,
      newListings7d: 0,
      newListings30d: 6,
      // People
      totalUsers: 1808,
      dau: 10,
      wau: 86,
      mau: 265,
      signups24h: 3,
      signups7d: 21,
      signups30d: 134,
      partnerAccounts: 3,
      // Buyers and sellers
      bothSides: 1,
      neverListed: 1639,
      neverMessaged: 1655
    }
  },
  {
    id: 'update-5',
    label: 'Update 5',
    date: '2026-10-11', // admin dashboard, read Oct 11
    // Only the figures on screen this time; the rest carry over from Update 4.
    values: {
      // Listings
      listingsTotal: 872,
      listingsActive: 465,
      listingsSold: 407,
      // People
      totalUsers: 1813,
      dau: 5,
      wau: 58,
      mau: 249,
      signups24h: 0,
      signups7d: 13,
      signups30d: 118,
      partnerAccounts: 3,
      // Buyers and sellers
      sellers: 83,
      wouldBeSellers: 86,
      buyers: 42,
      wouldBeBuyers: 111,
      bothSides: 1,
      neverListed: 1644,
      neverMessaged: 1660,
      // Messaging
      sellersContacted: 110,
      sellersNeverReplied: 96,
      repliesAnswered: 40,
      medianReplyHours: 28.7,
      unansweredMessages: 313
    }
  },
  {
    id: 'update-6',
    label: 'Update 6',
    date: '2026-10-14', // admin dashboard, read Oct 14
    // Only the figures on screen this time; the rest carry over from Update 5.
    // (The dashboard also showed chats: 353 conversations, 548 messages, 1.6 per chat;
    // conversations with a message: 0 in 24 h, 1 in 7 days, 50 in 30 days; 0.2 per user.
    // Not shown on the page.)
    values: {
      // Listings
      listingsTotal: 873,
      listingsActive: 466,
      listingsSold: 407,
      newListings24h: 1,
      newListings7d: 1,
      newListings30d: 4,
      // People
      totalUsers: 1816,
      dau: 5,
      wau: 47,
      mau: 241,
      signups24h: 0,
      signups7d: 8,
      signups30d: 113,
      partnerAccounts: 3,
      // Active listings by category
      categories: {
        Clothing: 111,
        Furniture: 136,
        Electronics: 68,
        Rideables: 3,
        Appliances: 73,
        'Home Decor': 28,
        Books: 4,
        Other: 43
      }
    }
  },
  {
    id: 'update-7',
    label: 'Update 7',
    date: '2026-10-19', // admin dashboard, read Oct 19
    // Only the figures on screen this time; marketplace money and messaging carry over from Update 6.
    // (The dashboard also showed chats: 355 conversations, 564 messages, 1.6 per chat. Not shown on the page.)
    values: {
      // Listings
      listingsTotal: 876,
      listingsActive: 469,
      listingsSold: 407,
      newListings24h: 1,
      newListings7d: 4,
      newListings30d: 7,
      // People
      totalUsers: 1822,
      dau: 11,
      wau: 36,
      mau: 222,
      signups24h: 2,
      signups7d: 6,
      signups30d: 100,
      partnerAccounts: 3,
      // Buyers and sellers
      sellers: 83,
      wouldBeSellers: 90,
      buyers: 42,
      wouldBeBuyers: 112,
      bothSides: 1,
      neverListed: 1649,
      neverMessaged: 1668,
      // Active listings by category
      categories: {
        Clothing: 111,
        Furniture: 136,
        Electronics: 70,
        Rideables: 3,
        Appliances: 74,
        'Home Decor': 28,
        Books: 4,
        Other: 43
      }
    }
  },
  {
    id: 'update-8',
    label: 'Update 8',
    date: '2026-10-20', // admin dashboard, last updated Oct 20, 12:00 AM
    // Everything else on screen matched Update 7. New this time: the chat funnel and the
    // most active listers (kept here as totals only; the dashboard's names and emails stay off the site).
    values: {
      // Marketplace
      soldValue: 23900,
      activeInventory: 33600,
      medianSale: 15,
      averageSale: 59,
      // Messaging
      sellersContacted: 110,
      sellersNeverReplied: 96,
      repliesAnswered: 41,
      medianReplyHours: 28.1,
      unansweredMessages: 314,
      // Chats: buyer messaged a seller → seller replied → buyer wrote back
      conversations: 355,
      conversationsReplied: 41,
      conversationsBackAndForth: 13,
      messages: 564,
      // The seven most active listers together: listings posted, of them sold
      topListers: 7,
      topListersListings: 279,
      topListersSold: 152
    }
  }
  // , { id: 'update-9', label: 'Update 7', date: 'YYYY-MM-DD', values: { ...only the keys that were read... } }
];

// A reading only needs the figures that were actually read; the rest carry
// over from the reading before it.
for (let i = 1; i < SNAPSHOTS.length; i += 1) {
  SNAPSHOTS[i].values = { ...SNAPSHOTS[i - 1].values, ...SNAPSHOTS[i].values };
}
