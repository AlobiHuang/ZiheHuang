// CMUsed case page: draws the numbers from data.js. The newest snapshot is
// shown; anything that has moved since the first one (when I joined) is
// marked with the change and the starting value.
import { SNAPSHOTS } from './data.js?v=8';

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
    M('New listings', 'count', s => s.newListings30d, () => 'Last 30 days')
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
  stamp.innerHTML = `<span>${when ? `DATA RETRIEVED ${when} · ` : ''}FROM THE CMUSED ADMIN DASHBOARD</span>`;
}

const heading = document.querySelector('[data-cm-title]');
if (heading && updated) heading.textContent = 'Where it stands now.';

// ---- the problem, read from the baseline (the first snapshot) ---------------
// Oct 13: short on purpose, one line each, so the problem reads in seconds. They fill the
// left column of the problem vs solution table.
const problems = {
  activation: `${pct(share(b.neverListed, b.totalUsers), 0)} never listed an item; ${pct(share(b.neverMessaged, b.totalUsers), 0)} never sent a message.`,
  response: `${pct(share(b.sellersNeverReplied, b.sellersContacted), 0)} of contacted sellers never replied. Median reply: ${Math.round(b.medianReplyHours)} hours.`,
  supply: `${int(b.newListings7d)} new listings vs ${int(b.signups7d)} new sign-ups in one week.`,
  retention: `${pct(share(b.mau, b.totalUsers), 0)} of accounts active in a month; DAU/MAU stickiness ${pct(share(b.dau, b.mau), 0)}.`
};
document.querySelectorAll("[data-cm-problem]").forEach(el => { el.textContent = problems[el.dataset.cmProblem] || ""; });

// ---- active listings by category: one series, so one ink, sorted -------------
const chart = document.querySelector('[data-cm-categories]');
if (chart) {
  const rows = Object.entries(v.categories).sort((a, c) => c[1] - a[1]);
  // Oct 7: the chart shows today's numbers only; the "since I joined"
  // comparison is kept for Total users alone.
  const max = Math.max(...rows.map(r => r[1]));
  const total = rows.reduce((sum, r) => sum + r[1], 0);
  chart.innerHTML = rows.map(([name, count]) => {
    const tip = `${int(count)} active listings · ${pct(share(count, total))} of all active`;
    return `<li tabindex="0" aria-label="${name}: ${tip}"><span class="cm-cat">${name}</span><span class="cm-track"><i style="width:${(count / max * 100).toFixed(2)}%"></i></span><b>${int(count)}</b><span class="cm-tip" aria-hidden="true">${tip}</span></li>`;
  }).join('');
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
