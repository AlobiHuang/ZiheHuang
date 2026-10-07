// CMUsed case page: draws the numbers from data.js. The newest snapshot is
// shown; anything that has moved since the first one (when I joined) is
// marked with the change and the starting value.
import { SNAPSHOTS } from './data.js?v=3';

const base = SNAPSHOTS[0];
const latest = SNAPSHOTS[SNAPSHOTS.length - 1];
const updated = SNAPSHOTS.length > 1;
const b = base.values, v = latest.values;

// ---- formatting --------------------------------------------------------
const int = n => Math.round(n).toLocaleString('en-US');
const money = n => (Math.abs(n) >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${int(n)}`);
const pct = (n, d = 1) => `${n.toFixed(d)}%`;
const hours = n => `${n.toFixed(1)}h`;
const share = (part, whole) => (whole ? part / whole * 100 : 0);
const FORMAT = { count: int, money, pct, hours };
const DELTA = {
  count: d => int(Math.abs(d)),
  money: d => money(Math.abs(d)),
  pct: d => `${Math.abs(d).toFixed(1)} pts`,
  hours: d => hours(Math.abs(d))
};

// ---- the metrics ---------------------------------------------------------
// get: the value from a snapshot's values; note: the small line under it.
// since: also show how far it has grown since I joined (only for running
// totals; rolling windows such as "last 7 days" are not compared).
const M = (label, type, get, note = () => '', since = false) => ({ label, type, get, note, since });
const GROUPS = {
  headline: [
    M('Sold value', 'money', s => s.soldValue, s => `${int(s.listingsSold)} items sold`),
    M('Active inventory', 'money', s => s.activeInventory, s => `${int(s.listingsActive)} listings unsold`),
    M('Sell-through', 'pct', s => share(s.listingsSold, s.listingsTotal), () => 'Share of all listings sold'),
    M('Median sale', 'money', s => s.medianSale, s => `Average ${money(s.averageSale)}`)
  ],
  people: [
    M('Total users', 'count', s => s.totalUsers, () => 'All accounts', true),
    M('Monthly active', 'count', s => s.mau, () => 'Last 30 days'),
    M('Weekly active', 'count', s => s.wau, () => 'Last 7 days'),
    M('Daily active', 'count', s => s.dau, () => 'Last 24 hours'),
    M('New sign-ups', 'count', s => s.signups30d, () => 'Last 30 days'),
    M('New sign-ups', 'count', s => s.signups7d, () => 'Last 7 days'),
    M('New sign-ups', 'count', s => s.signups24h, () => 'Last 24 hours'),
    M('Partner accounts', 'count', s => s.partnerAccounts, () => 'All time')
  ],
  sides: [
    M('Sellers', 'count', s => s.sellers, () => 'Sold at least one item'),
    M('Would-be sellers', 'count', s => s.wouldBeSellers, () => 'Listed something, nothing sold yet'),
    M('Buyers*', 'count', s => s.buyers, () => 'Asked about an item that then sold'),
    M('Would-be buyers', 'count', s => s.wouldBeBuyers, () => 'Asked about items, none have sold'),
    M('Both sides', 'count', s => s.bothSides, () => 'Have both bought and sold'),
    M('Never listed', 'count', s => s.neverListed, s => `${pct(share(s.neverListed, s.totalUsers))} of all users`),
    M('Never messaged', 'count', s => s.neverMessaged, s => `${pct(share(s.neverMessaged, s.totalUsers))} of all users`)
  ],
  messages: [
    M('Sellers who never replied', 'pct', s => share(s.sellersNeverReplied, s.sellersContacted), s => `${int(s.sellersNeverReplied)} of ${int(s.sellersContacted)} people who were contacted`),
    M('Median reply time', 'hours', s => s.medianReplyHours, s => `Among the ${int(s.repliesAnswered)} that got an answer`),
    M('Unanswered messages', 'count', s => s.unansweredMessages, () => 'Buyers left on read')
  ],
  listings: [
    M('Listings, all time', 'count', s => s.listingsTotal, () => 'Ever posted'),
    M('Active', 'count', s => s.listingsActive, () => 'Not sold'),
    M('Sold', 'count', s => s.listingsSold, () => 'Marked sold'),
    M('New listings', 'count', s => s.newListings30d, () => 'Last 30 days'),
    M('New listings', 'count', s => s.newListings7d, () => 'Last 7 days'),
    M('New listings', 'count', s => s.newListings24h, () => 'Last 24 hours')
  ]
};

const cell = metric => {
  const now = metric.get(v), then = metric.get(b);
  const d = now - then;
  const gained = updated && metric.since && Math.abs(d) > 1e-9;
  const badge = gained
    ? `<span class="cm-gain" data-dir="${d > 0 ? 'up' : 'down'}" title="Since I joined">${d > 0 ? '+' : '−'}${DELTA[metric.type](d)}</span>`
    : '';
  const note = metric.note(v);
  return `<div class="cm-cell"><dt>${metric.label}</dt><dd><b>${FORMAT[metric.type](now)}${badge}</b><small>${note}</small></dd></div>`;
};
document.querySelectorAll('[data-cm-group]').forEach(list => {
  const group = GROUPS[list.dataset.cmGroup];
  if (group) list.innerHTML = group.map(cell).join('');
});

// ---- which reading this is ----------------------------------------------
const stamp = document.querySelector('[data-cm-stamp]');
if (stamp) {
  // Not live: say when the numbers were read, and where from.
  const day = date => {
    const [y, m, d] = (date || '').split('-').map(Number);
    if (!y || !m) return '';
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][m - 1];
    return d ? `${month} ${d}, ${y}` : `${month} ${y}`;
  };
  const when = day(latest.date);
  stamp.innerHTML = `<span>${when ? `LAST RECORDED ${when} · ` : ''}FROM THE CMUSED DASHBOARD</span>`;
}

const heading = document.querySelector('[data-cm-title]');
if (heading && updated) heading.textContent = 'Where it stands now.';

// ---- reading the baseline: three observations, from the first snapshot ----
const notes = document.querySelector('[data-cm-notes]');
if (notes) {
  const items = [
    ['Most people only look.', `${pct(share(b.neverListed, b.totalUsers))} of accounts had never listed anything, and ${pct(share(b.neverMessaged, b.totalUsers))} had never sent a message.`],
    ['Conversations stall.', `${pct(share(b.sellersNeverReplied, b.sellersContacted))} of contacted sellers never replied. When they did, the median wait was ${hours(b.medianReplyHours)}.`],
    ['New supply is thin.', `${int(b.newListings7d)} new listings went up in the same week that brought ${int(b.signups7d)} new sign-ups.`]
  ];
  notes.innerHTML = items.map(([title, text], i) => `<li><span>0${i + 1}</span><b>${title}</b><p>${text}</p></li>`).join('');
}

// ---- active listings by category: one series, so one ink, sorted -------------
const chart = document.querySelector('[data-cm-categories]');
if (chart) {
  const rows = Object.entries(v.categories).sort((a, c) => c[1] - a[1]);
  const max = Math.max(...rows.map(r => r[1]), ...Object.values(b.categories));
  const total = rows.reduce((sum, r) => sum + r[1], 0);
  chart.innerHTML = rows.map(([name, count]) => {
    const was = b.categories[name] ?? 0;
    const moved = updated && was !== count;
    const tip = `${int(count)} active listings · ${pct(share(count, total))} of all active${moved ? ` · was ${int(was)} when I joined` : ''}`;
    return `<li tabindex="0" aria-label="${name}: ${tip}"><span class="cm-cat">${name}</span><span class="cm-track"><i style="width:${(count / max * 100).toFixed(2)}%"></i>${moved ? `<u style="left:${(was / max * 100).toFixed(2)}%" title="When I joined: ${was}"></u>` : ''}</span><b>${int(count)}</b><span class="cm-tip" aria-hidden="true">${tip}</span></li>`;
  }).join('');
  const key = document.querySelector('[data-cm-categories-key]');
  if (key && rows.some(([name, count]) => (b.categories[name] ?? 0) !== count)) key.innerHTML = '<u class="cm-key" aria-hidden="true"></u>WHEN I JOINED · ';
  const sum = document.querySelector('[data-cm-categories-total]');
  if (sum) sum.textContent = `${int(total)} ACTIVE LISTINGS`;
}

// ---- the screen loop (as on the PD page) ----------------------------------
const loop = document.querySelector('[data-pd-loop]');
if (loop) {
  const frames = [...loop.querySelectorAll('img')];
  let index = 0, timer = 0;
  const show = next => { frames.forEach((f, i) => f.classList.toggle('is-shown', i === next)); index = next; };
  show(0);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const tick = () => { show((index + 1) % frames.length); timer = setTimeout(tick, 3800); };
    new IntersectionObserver(entries => {
      clearTimeout(timer);
      if (entries[0].isIntersecting) timer = setTimeout(tick, 3800);
    }, { threshold: .25 }).observe(loop);
  }
}
