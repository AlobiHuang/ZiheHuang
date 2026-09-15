const categoryData = {
  architecture: {
    name: 'Architecture',
    short: 'ARCH',
    code: '10²',
    accent: '#ff3d16',
    question: ['SELECTED WORKS'],
    intro: 'I use architecture to study how people, material systems, and environmental forces meet. Each project moves from observation to rules, from rules to form, and from form to lived experience.',
    lens: ['Observe the context', 'Build a rule set', 'Test the experience'],
    experiences: [
      {
        no: 'A—01',
        slug: 'convergence-environmental-middle-school',
        title: 'Convergence',
        org: 'Environmental Middle School · Second Year First Semester',
        date: '2025 Fall',
        type: 'Studio Project',
        summary: 'An environmental middle school near Pittsburgh’s Bakery Square that teaches the city’s history of weather, pollution, and urban change through the building itself.',
        evidence: [
          'Studied Lao and Thai vernacular compounds to identify intersecting structures and open space.',
          'Translated a field model and visual rule set into connected loops, atriums, and shared programs.',
          'Developed roofs, rain gardens, sections, plans, and a detachable physical model to test climate and social experience.'
        ],
        tags: ['Climate', 'Precedent', 'Rule set', 'Physical model']
      },
      {
        no: 'A—02',
        slug: 'the-tinkerers-imaginarium',
        title: "The Tinkerer's Imaginarium",
        org: 'Maker Space · First Year Second Semester',
        date: '2025 Spring',
        type: 'Studio Project',
        summary: 'A maker space for artists and creative workers at 3521 Butler Street in Lower Lawrenceville, shaped by the neighborhood’s industrial history and diverse creative community.',
        evidence: [
          'Mapped Lawrenceville’s transformation from steel mills and warehouses to creative enterprises.',
          'Organized programs as a cluster with outdoor circulation, shared gardens, and gradients of privacy.',
          'Used axonometric studies, massing, plans, and site diagrams to connect the building to its neighborhood.'
        ],
        tags: ['Community', 'Massing', 'Privacy', 'Adaptive reuse']
      },
      {
        no: 'A—03',
        slug: 'radical-empathy',
        title: 'Radical Empathy',
        org: 'Multi-generational House · First Year Second Semester',
        date: '2025 Spring',
        type: 'Studio Project',
        summary: 'A multi-generational house and children’s learning space in Pittsburgh, rooted in a family story that connects Chaoshan, China, and a dispersed generation.',
        evidence: [
          'Translated the family’s journeys and reunions into a spatial idea of the bridge.',
          'Used exploded axonometrics, massing models, and moment studies to connect generations vertically and horizontally.',
          'Developed ground, upper-floor, and sectional drawings around shared learning and gathering.'
        ],
        tags: ['Family', 'Empathy', 'Bridge', 'Collective living']
      },
      {
        no: 'A—05',
        slug: 're-serv-oir',
        title: 'RE.SERV.OIR',
        org: 'Community Ecology Center · Portland, Oregon',
        date: '2026',
        type: 'Design Studio',
        summary: 'A community ecology center that reclaims Portland’s decommissioned concrete water tanks as civic ground for environmental learning, gathering, and ecological repair.',
        evidence: [
          'Mapped existing reservoirs, neighborhoods, and transportation systems to understand the infrastructure’s civic reach.',
          'Developed a transformation sequence from drain and cut to reposition, frame, and reclaim.',
          'Combined retained concrete walls, mass timber, rain gardens, and shared courtyards into one adaptive system.'
        ],
        tags: ['Reuse', 'Ecology', 'Civic', 'Infrastructure']
      },
      {
        no: 'A—06',
        slug: 'how-to-build-a-ruin',
        title: 'How to Build a Ruin',
        org: 'Seed Bank · Option Studio 48-205',
        date: '2026',
        type: 'Option Studio',
        summary: 'A seed bank and ecological research institute that turns a former coal landscape into a long-term system for energy production, soil repair, and agricultural resilience.',
        evidence: [
          'Positioned the seed bank between a redeveloped power plant and surrounding agricultural communities.',
          'Used rice as both a living system and a material research subject for a spine-and-branch architecture.',
          'Developed plans, sections, and technical assemblies around growth, harvest, waste, and repair.'
        ],
        tags: ['Seed bank', 'Climate', 'Material', 'Long time']
      },
      {
        no: 'A—07',
        slug: 'call-of-the-sea',
        title: 'Call of the Sea',
        org: 'Mixed Use / Accommodation · Torosiaje, Indonesia',
        date: '2026—Present',
        type: 'In progress',
        summary: 'A way of living on water that connects community, hospitality, and the tides through a porous network of rooms, circulation, and shared exchange.',
        evidence: [
          'Read the settlement as a living network shaped by water, movement, and collective routines.',
          'Tested circulation and exchange through layered maps, plans, and sectional studies.',
          'Translated the coastal condition into an architecture that remains open to change.'
        ],
        tags: ['Water', 'Community', 'Hospitality', 'Adaptation']
      }
    ],
    methodTitle: 'Architecture begins with attention.',
    methods: [
      ['01', 'Read the context', 'Look across history, climate, culture, and everyday behavior before deciding what a building should be.'],
      ['02', 'Make rules visible', 'Use drawings, models, and diagrams to turn observations into spatial rules that can be tested.'],
      ['03', 'Think through making', 'Move between image, model, section, and material so the design is felt as well as understood.']
    ],
    capabilities: ['Rhino', 'Revit', 'Adobe Creative Suite', 'Physical modeling', 'Digital fabrication', '3D printing', 'Environmental analysis', 'Architectural representation']
  },
  pm: {
    name: 'Product Management',
    short: 'PM',
    code: '10⁰',
    accent: '#171816',
    question: ['One project.', 'Many stakeholders.', 'A shared outcome'],
    intro: 'The Sankofa Bamboo Greenhouse is a long-form study in turning community ambition, research, engineering, and fabrication into one coordinated path toward construction.',
    lens: ['Listen before deciding', 'Make risk visible', 'Coordinate the build'],
    experiences: [
      {
        no: 'P—01',
        title: 'Sankofa: Multi-stakeholder Delivery',
        org: 'Sankofa Bamboo Greenhouse · Project Designer',
        date: 'Jun 2026—Present',
        period: '2026—',
        range: 'Present',
        type: 'Research',
        summary: 'Coordinating the technical, civic, financial, and community work required to move an experimental greenhouse toward construction.',
        evidence: [
          'Worked across USDA staff, Intertek engineers, permitting officials, media, and community partners.',
          'Supported fundraising, testing, permitting, and public engagement workstreams.',
          'Synthesized community interviews into actionable priorities during weekly reviews.',
          'Balanced structural requirements with community needs and project feasibility.'
        ],
        tags: ['Stakeholders', 'Delivery', 'Risk', 'Prioritization']
      }
    ],
    methodTitle: 'Product work is disciplined translation.',
    methods: [
      ['01', 'Frame the real problem', 'Separate the visible request from the underlying user, business, and system need.'],
      ['02', 'Make uncertainty testable', 'Turn assumptions into prototypes, comparisons, interviews, and measurable decisions.'],
      ['03', 'Align and deliver', 'Create shared language across disciplines, surface tradeoffs, and keep learning after handoff.']
    ],
    capabilities: ['Product discovery', 'Stakeholder coordination', 'User interviews', 'Prototyping', 'Excel', 'Tableau', 'PowerPoint', 'Python', 'HTML/CSS/JavaScript']
  },
  hci: {
    name: 'Human-Computer Interaction',
    short: 'HCI',
    code: '10⁻²',
    accent: '#4038ff',
    question: ['How can technology', 'respond to how people', 'actually think and act'],
    intro: 'I use research, prototyping, and systems thinking to make complex tools more legible, useful, and responsive to real human behavior.',
    lens: ['Human-centered research', 'Interaction prototyping', 'Usability and systems'],
    experiences: [
      {
        no: 'H—01', title: 'Community Research for Sankofa', org: 'Sankofa Bamboo Greenhouse · Project Designer', date: 'Jun 2026—Present', period: '2026—', range: 'Jun—Present', type: 'Work',
        summary: 'Using direct community input to ensure a technically ambitious system stays grounded in how people will encounter and use it.',
        evidence: ['Conducted community interviews through weekly design reviews.', 'Synthesized feedback into interior, furniture, and environmental design changes.', 'Connected community feedback with structural, permitting, and delivery constraints.'],
        tags: ['Interviews', 'Synthesis', 'Participatory design', 'Systems']
      },
      {
        no: 'H—02', title: 'Evaluating an AI-assisted Design Tool', org: 'Hong Kong Huayi Design Consultants · Design Intern', date: '2023—2024', period: '2023—24', range: 'Dec—Jan', type: 'Industry',
        summary: 'Treating a generative AI workflow as an interaction problem: what inputs make sense, what outputs are trustworthy, and what fits existing practice?',
        evidence: ['Tested more than 10 models and 600+ output iterations.', 'Gathered designer feedback on output quality and usability.', 'Refined parameters and interaction steps into a repeatable workflow.'],
        tags: ['AI interaction', 'Usability', 'Rapid iteration', 'Workflow design']
      },
      {
        no: 'H—03', title: 'Design Learning Through Critique', org: 'Carnegie Mellon University · Undergraduate Mentor', date: '2025—Present', period: '2025—', range: 'Present', type: 'Leadership',
        summary: 'Adapting technical and visual guidance to how different students understand, practice, and communicate design.',
        evidence: ['Facilitated weekly one-to-one critique and project reviews.', 'Explained complex modeling and representation workflows through hands-on support.', 'Used iterative feedback to help students build confidence and independence.'],
        tags: ['Learning experience', 'Feedback', 'Communication', 'Accessibility']
      }
    ],
    methodTitle: 'Interaction begins before the interface.',
    methods: [
      ['01', 'Observe the context', 'Understand goals, behaviors, workarounds, language, and constraints around the interaction.'],
      ['02', 'Prototype the relationship', 'Use flows and interfaces to test how information, action, and feedback should connect.'],
      ['03', 'Evaluate and refine', 'Measure usefulness through real reactions, not only visual polish or technical completion.']
    ],
    capabilities: ['Figma', 'Axure', 'User interviews', 'Research synthesis', 'Prototyping', 'HTML/CSS/JavaScript', 'Python', 'Adobe Creative Suite']
  }
};

const resumeExperiences = [
  {
    period: '2026—',
    range: 'Jun—Present',
    type: 'Work',
    role: 'Project Designer',
    org: 'Sankofa Bamboo Greenhouse · Pittsburgh, PA',
    summary: 'Helping move the Sankofa Bamboo Greenhouse from a research prototype into full-scale construction for Pittsburgh’s Homewood community.',
    evidence: [
      'Contributed to wind and gravity testing with Intertek and zoning and permitting with the City of Pittsburgh.',
      'Translated community interviews into updates to the interior layout, furniture, and environmental strategies.',
      'Designed 10+ original joinery details with structural engineer John M. Schneider, P.E.',
      'Presented to USDA staff while supporting a $4,000 annual award and eligibility for an additional $8,000 implementation award in 2027.'
    ],
    tags: ['ARCH', 'COMMUNITY', 'DELIVERY']
  },
  {
    period: '2026—',
    range: 'Aug—Present',
    type: 'Leadership',
    role: 'Teaching Assistant',
    org: 'Carnegie Mellon University · Pittsburgh, PA',
    summary: 'Leading a 14-student project team through coordinated fabrication and assembly.',
    evidence: [
      'Organized students into CNC routing, 3D printing, metal preparation, joinery fabrication, and assembly teams.',
      'Assigned responsibilities and coordinated work across groups.',
      'Reviewed work quality, resolved technical issues, and enforced safe tool operation.'
    ],
    tags: ['LEADERSHIP', 'FABRICATION', 'TEAMWORK']
  },
  {
    period: '2026',
    range: 'May—Aug',
    type: 'Research',
    role: 'Research Assistant',
    org: 'CMU Summer Undergraduate Research Apprenticeship · Pittsburgh, PA',
    summary: 'Translated Southeast Asian precedents and traditional bamboo construction research into tested joinery systems.',
    evidence: [
      'Developed joinery systems through hand sketches, technical drawings, and physical prototypes.',
      'Fabricated iterative bamboo prototypes at increasing scales using hand tools.',
      'Tested prototypes under loads ranging from 100 to 5,000 pounds.'
    ],
    tags: ['RESEARCH', 'JOINERY', 'PROTOTYPING']
  },
  {
    period: '2023—24',
    range: 'Dec—Jan',
    type: 'Industry',
    role: 'Design Intern',
    org: 'Hong Kong Huayi Design Consultants (S.Z.) Ltd. · Shenzhen, China',
    summary: 'Evaluated generative AI use cases in architectural visualization with the Director of Design.',
    evidence: [
      'Identified opportunities to streamline client-facing workflows.',
      'Prototyped 10+ LoRA models through 600+ Stable Diffusion render iterations.',
      'Turned design-team feedback into a repeatable hand-sketch-to-render workflow.'
    ],
    tags: ['DESIGN', 'AI', 'VISUALIZATION']
  }
];

const resumeExperienceEntriesMarkup = resumeExperiences.map((experience, index) => `
  <article class="experience-entry">
    <div class="experience-period"><b>${experience.period}</b><span>${experience.range}</span></div>
    <header><small>${String(index + 1).padStart(2, '0')} / ${experience.type}</small><h3>${experience.role}</h3><p>${experience.org}</p></header>
    <div class="experience-copy"><p>${experience.summary}</p><ul>${experience.evidence.map(item => `<li>${item}</li>`).join('')}</ul></div>
    <div class="experience-field">${experience.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
  </article>`).join('');

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const returnAnchorStorageKey = 'alobi-category-return-anchor';
let returnAnchor = '';
try {
  returnAnchor = sessionStorage.getItem(returnAnchorStorageKey) || '';
  sessionStorage.removeItem(returnAnchorStorageKey);
} catch {}
if (!returnAnchor && location.hash) {
  history.replaceState(null, '', `${location.pathname}${location.search}`);
}
let entryPositionResolved = false;
const applyEntryPosition = () => {
  if (entryPositionResolved) return;
  const target = returnAnchor ? document.getElementById(returnAnchor) : null;
  if (target) {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    entryPositionResolved = true;
    return;
  }
  if (!returnAnchor) {
    if (window.scrollY <= 1) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    entryPositionResolved = true;
  }
};
applyEntryPosition();
requestAnimationFrame(applyEntryPosition);
window.addEventListener('load', applyEntryPosition, { once: true });
window.addEventListener('pageshow', applyEntryPosition);

const key = document.body.dataset.category;
const data = categoryData[key] || categoryData.architecture;
if (key === 'architecture') {
  const architectureOrder = ['re-serv-oir', 'how-to-build-a-ruin', 'convergence-environmental-middle-school', 'radical-empathy', 'the-tinkerers-imaginarium', 'call-of-the-sea'];
  const archiveSlug = title => title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  data.experiences = data.experiences.slice().sort((a, b) => {
    const aRank = architectureOrder.indexOf(a.slug || archiveSlug(a.title));
    const bRank = architectureOrder.indexOf(b.slug || archiveSlug(b.title));
    return (aRank < 0 ? 999 : aRank) - (bRank < 0 ? 999 : bRank);
  }).map((item, index) => ({ ...item, no: `A—${String(index + 1).padStart(2, '0')}` }));
}
const root = document.getElementById('category-root');
document.documentElement.style.setProperty('--category-accent', data.accent);
document.title = `${data.name} — Zihe Huang`;
document.querySelector('meta[name="description"]')?.setAttribute('content', `${data.name} work and experience by Zihe Huang.`);

const isArchitecture = key === 'architecture';
const hasSelectedWork = ['architecture', 'pm', 'hci'].includes(key);
const projectSlug = title => title
  .normalize('NFKD')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
const projectHref = experience => `../project/?lens=${key}&project=${experience.slug || projectSlug(experience.title)}`;
const projectRouteLabel = experience => `PROJECT / ${experience.title.toUpperCase()}`;
const categoryImages = {
  architecture: {
    'convergence-environmental-middle-school': 'convergence-pdf-02.jpg',
    'the-tinkerers-imaginarium': 'tinkerers-site-model-cover.jpg',
    'radical-empathy': 'radical-empathy-cover.jpg',
    're-serv-oir': 'reservoir-exterior.png',
    'how-to-build-a-ruin': 'ruin-hero.jpg',
    'call-of-the-sea': 'sea-hero.png'
  },
  pm: ['stepping-massing-05.webp', 'conceptual-timeline-01.webp', 'new-circulation.webp'],
  hci: ['add-circular-site-map.webp', 'conceptual-timeline-03.webp', 'site-plan-new-01.webp']
};
const categoryHeroImage = {
  architecture: 'p2-final-final-perspective-1-for-print.webp',
  pm: 'stepping-massing-04.webp',
  hci: 'plan-oblique.webp'
};
const workImages = categoryImages[key] || categoryImages.architecture;
const experienceMarkup = data.experiences.map((experience, index) => {
  if (isArchitecture) {
    const isInProgress = experience.slug === 'call-of-the-sea';
    return `
    <a class="arch-work-card project-gateway-link" id="architecture-project-${index + 1}" href="${projectHref(experience)}" data-route data-route-label="${projectRouteLabel(experience)}" aria-label="Open the ${experience.title} project gateway">
      <figure class="arch-work-image arch-work-image-0${index + 1}${isInProgress ? ' arch-work-image-progress' : ''}">
        ${isInProgress ? '<div class="arch-progress-cover" aria-hidden="true"><small>ONGOING / 2026</small><strong>IN<br>PROGRESS</strong><i>TOROSIAJE · INDONESIA</i></div>' : `<img src="../assets/portfolio/${workImages[experience.slug || projectSlug(experience.title)]}" alt="Selected portfolio visual for ${experience.title}" loading="eager" decoding="async">`}
        <span>${experience.no}</span>
        <figcaption>OPEN PROJECT ↗</figcaption>
      </figure>
      <div><h3>${experience.title}</h3><time>${experience.date}</time><p>${experience.type}</p></div>
    </a>`;
  }

  return `
    <article class="case-sheet reveal">
      <header>
        <span>${experience.no}</span>
        <div><h3>${experience.title}</h3><p>${experience.org}</p></div>
        <time>${experience.date}</time>
      </header>
      <div class="case-content">
        <p class="case-summary">${experience.summary}</p>
        <ul>${experience.evidence.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
      <footer>${experience.tags.map(tag => `<span>${tag}</span>`).join('')}</footer>
    </article>`;
}).join('');

const architectureIndexLabels = data.experiences.map(experience => experience.title);
const architectureArchiveMarkup = isArchitecture ? `
  <section class="arch-lens-work category-architecture-archive" id="experience" aria-labelledby="architecture-archive-title">
    <aside class="arch-work-index">
      <p>01 / SELECTED WORK</p>
      <h2 id="architecture-archive-title">ZIHE HUANG</h2>
      <div>
        <strong>WORK</strong>
        <nav aria-label="Selected architecture projects">
          ${architectureIndexLabels.map((label, index) => `<a href="${projectHref(data.experiences[index])}" data-route data-route-label="${projectRouteLabel(data.experiences[index])}">${label}</a>`).join('')}
        </nav>
      </div>
    </aside>
    <div class="arch-work-grid">${experienceMarkup}</div>
  </section>` : '';

const pmWorkMarkup = key === 'pm' ? data.experiences.map((experience, index) => `
  <a class="arch-work-card project-gateway-link" id="pm-project-${index + 1}" href="${projectHref(experience)}" data-route data-route-label="${projectRouteLabel(experience)}" aria-label="Open the ${experience.title} project gateway">
    <figure class="arch-work-image arch-work-image-0${index + 1}">
      <img src="../assets/portfolio/${workImages[index % workImages.length]}" alt="Selected portfolio visual for ${experience.title}" loading="lazy" decoding="async">
      <span>${experience.no}</span>
      <figcaption>OPEN PROJECT ↗</figcaption>
    </figure>
    <div><h3>${experience.title}</h3><time>${experience.date}</time><p>${experience.type}</p></div>
  </a>`).join('') : '';

const pmIndexLabels = ['Sankofa Delivery'];
const pmArchiveMarkup = key === 'pm' ? `
  <section class="arch-lens-work pm-lens-work category-pm-archive" id="experience" aria-labelledby="pm-archive-title">
    <aside class="arch-work-index">
      <p>01 / SELECTED WORK</p>
      <h2 id="pm-archive-title">ZIHE HUANG</h2>
      <div>
        <strong>WORK</strong>
        <nav aria-label="Selected product management work">
          ${pmIndexLabels.map((label, index) => `<a href="${projectHref(data.experiences[index])}" data-route data-route-label="${projectRouteLabel(data.experiences[index])}">${label}</a>`).join('')}
        </nav>
      </div>
      <a class="arch-work-archive-link" href="#pm-experience">Experience ↓</a>
    </aside>
    <div class="arch-work-grid">${pmWorkMarkup}</div>
  </section>` : '';

const hciWorkMarkup = key === 'hci' ? data.experiences.map((experience, index) => `
  <a class="arch-work-card project-gateway-link" id="hci-project-${index + 1}" href="${projectHref(experience)}" data-route data-route-label="${projectRouteLabel(experience)}" aria-label="Open the ${experience.title} project gateway">
    <figure class="arch-work-image arch-work-image-0${index + 1}">
      <img src="../assets/portfolio/${workImages[index % workImages.length]}" alt="Selected portfolio visual for ${experience.title}" loading="lazy" decoding="async">
      <span>${experience.no}</span>
      <figcaption>OPEN PROJECT ↗</figcaption>
    </figure>
    <div><h3>${experience.title}</h3><time>${experience.date}</time><p>${experience.type}</p></div>
  </a>`).join('') : '';

const hciIndexLabels = ['Community Research', 'AI-assisted Tool', 'Design Learning'];
const hciArchiveMarkup = key === 'hci' ? `
  <section class="arch-lens-work hci-lens-work category-hci-archive" id="experience" aria-labelledby="hci-archive-title">
    <aside class="arch-work-index">
      <p>01 / SELECTED WORK</p>
      <h2 id="hci-archive-title">ZIHE HUANG</h2>
      <div>
        <strong>WORK</strong>
        <nav aria-label="Selected human-computer interaction work">
          ${hciIndexLabels.map((label, index) => `<a href="${projectHref(data.experiences[index])}" data-route data-route-label="${projectRouteLabel(data.experiences[index])}">${label}</a>`).join('')}
        </nav>
      </div>
      <a class="arch-work-archive-link" href="#hci-experience">Experience ↓</a>
    </aside>
    <div class="arch-work-grid">${hciWorkMarkup}</div>
  </section>` : '';

const architectureExperienceLedgerMarkup = `
  <section class="career-ledger category-architecture-experience" id="architecture-experience">
    <header class="section-head"><div><span>02</span><h2>Experience</h2></div><p>Roles, responsibilities, and outcomes.<br>Curriculum Vitae</p></header>
    <div class="ledger-columns" aria-hidden="true"><span>Period</span><span>Role / Organization</span><span>Selected contribution</span><span>Field</span></div>

    ${resumeExperienceEntriesMarkup}

    <footer class="ledger-footer"><p>Carnegie Mellon University · B.Arch + Additional Major in HCI · GPA 3.88</p><a href="../assets/ZiheHuang_Resume.pdf" download>Download full résumé ↓</a></footer>
  </section>`;

const pmExperienceLedgerMarkup = key === 'pm' ? `
  <section class="career-ledger pm-career-ledger category-pm-experience" id="pm-experience">
    <header class="section-head"><div><span>02</span><h2>Experience</h2></div><p>Roles, responsibilities, and outcomes.<br>Résumé / selected record</p></header>
    <div class="ledger-columns" aria-hidden="true"><span>Period</span><span>Role / Organization</span><span>Selected contribution</span><span>Field</span></div>

    ${resumeExperienceEntriesMarkup}

    <footer class="ledger-footer"><p>Carnegie Mellon University · B.Arch + Additional Major in HCI · GPA 3.88</p><a href="../assets/ZiheHuang_Resume.pdf" download>Download full résumé ↓</a></footer>
  </section>` : '';

const hciExperienceLedgerMarkup = key === 'hci' ? `
  <section class="career-ledger hci-career-ledger category-hci-experience" id="hci-experience">
    <header class="section-head"><div><span>02</span><h2>Experience</h2></div><p>Roles, responsibilities, and outcomes.<br>Résumé / selected record</p></header>
    <div class="ledger-columns" aria-hidden="true"><span>Period</span><span>Role / Organization</span><span>Selected contribution</span><span>Field</span></div>

    ${resumeExperienceEntriesMarkup}

    <footer class="ledger-footer"><p>Carnegie Mellon University · B.Arch + Additional Major in HCI · GPA 3.88</p><a href="../assets/ZiheHuang_Resume.pdf" download>Download full résumé ↓</a></footer>
  </section>` : '';

const categorySkillGroups = {
  architecture: [
    {
      code: 'SP—01', title: 'Spatial Design & BIM', subtitle: 'Modeling / documentation / coordination', result: '04 tools', domain: 'Built environments',
      tools: [['rhino', 'Rhino'], ['revit', 'Revit'], ['grasshopper', 'Grasshopper'], ['3dsmax', '3ds Max']],
      lead: 'Turning spatial ideas into coordinated models, drawings, and buildable systems.', mode: '3D modeling + BIM', use: 'Design development, documentation, fabrication', note: 'SPACE → SYSTEM → DETAIL'
    },
    {
      code: 'CR—02', title: 'Creative Production', subtitle: 'Graphics / drawing / editorial systems', result: '03 tools', domain: 'Visual communication',
      tools: [['adobe', 'Adobe Creative Suite'], ['autocad', 'AutoCAD'], ['figma', 'Figma']],
      lead: 'Building visual narratives that make architectural research, systems, and design intent immediately understandable.', mode: 'Drawing + image production', use: 'Diagrams, layouts, presentations, post-production', note: 'INFORMATION → IMAGE → STORY'
    },
    {
      code: 'FB—03', title: 'Physical Fabrication', subtitle: 'Prototyping / making / assembly', result: '04 tools', domain: 'Material practice',
      tools: [['laser-cutting', 'Laser Cutting'], ['cnc-milling', 'CNC Milling'], ['3d-printing', '3D Printing'], ['woodworking', 'Woodworking']],
      lead: 'Moving architectural ideas off the screen and into precise, testable material assemblies.', mode: 'Digital + hands-on fabrication', use: 'Models, prototypes, joinery, components', note: 'FILE → MATERIAL → ASSEMBLY'
    }
  ],
  pm: [
    {
      code: 'DS—01', title: 'Discovery & Framing', subtitle: 'Research / synthesis / problem definition', result: '02 tools', domain: 'User evidence',
      tools: [['figma', 'Figma'], ['axure', 'Axure']],
      lead: 'Finding the real question before committing a team to an answer.', mode: 'User research + synthesis', use: 'Interviews, flows, assumptions, prototypes', note: 'OBSERVE → FRAME → TEST'
    },
    {
      code: 'DD—02', title: 'Data & Decisions', subtitle: 'Evidence / trade-offs / prioritization', result: '02 tools', domain: 'Decision support',
      tools: [['excel', 'Excel'], ['tableau', 'Tableau']],
      lead: 'Making evidence legible enough for teams to compare options and make informed commitments.', mode: 'Analysis + prioritization', use: 'Metrics, matrices, dashboards, trade-offs', note: 'EVIDENCE → PRIORITY → DECISION'
    },
    {
      code: 'AL—03', title: 'Alignment & Communication', subtitle: 'Narratives / stakeholder clarity / handoff', result: '02 tools', domain: 'Shared direction',
      tools: [['powerpoint', 'PowerPoint'], ['word', 'Word']],
      lead: 'Creating a shared language so decisions survive meetings and move cleanly into delivery.', mode: 'Strategy + communication', use: 'Briefs, decks, reports, stakeholder updates', note: 'CONTEXT → ALIGNMENT → HANDOFF'
    },
    {
      code: 'PR—04', title: 'Prototype & Delivery', subtitle: 'Working models / iteration / implementation', result: '04 tools', domain: 'Executable ideas',
      tools: [['python', 'Python'], ['html', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript']],
      lead: 'Reducing uncertainty by turning ideas into something a team can interact with and evaluate.', mode: 'Technical prototyping', use: 'Automation, websites, interactive tests', note: 'LOGIC → PROTOTYPE → DELIVERY'
    }
  ],
  hci: [
    {
      code: 'UX—01', title: 'Research & Prototyping', subtitle: 'Interviews / synthesis / interaction flows', result: '02 tools', domain: 'Human systems',
      tools: [['figma', 'Figma'], ['axure', 'Axure']],
      lead: 'Turning observed behaviors and needs into interaction structures that can be tested early.', mode: 'Research + prototyping', use: 'Interviews, synthesis, flows, interface tests', note: 'OBSERVE → MODEL → TEST'
    },
    {
      code: 'TP—02', title: 'Technical Prototyping', subtitle: 'Interfaces / logic / working experiments', result: '04 tools', domain: 'Interactive systems',
      tools: [['html', 'HTML'], ['css', 'CSS'], ['javascript', 'JavaScript'], ['python', 'Python']],
      lead: 'Building working artifacts that make interaction ideas tangible enough to evaluate and refine.', mode: 'Front-end + computational prototyping', use: 'Interfaces, behavior tests, automation, experiments', note: 'IDEA → INTERACTION → FEEDBACK'
    }
  ]
};

const selectedSkillGroups = categorySkillGroups[key] || [];
const skillGroupsMarkup = selectedSkillGroups.map(group => `
  <article class="project skill-group">
    <button class="project-trigger" type="button" aria-expanded="false"><span class="project-no">${group.code}</span><span class="project-title"><b>${group.title}</b><small>${group.subtitle}</small></span><span class="project-result">${group.result}<br>${group.domain}</span><span class="project-open">↗</span></button>
    <div class="project-detail">
      <div class="visual skill-tool-grid">
        ${group.tools.map(([slug, label]) => `<div class="tool-card"><img src="../assets/tool-logos/${slug}.svg" alt="" aria-hidden="true"><span>${label}</span></div>`).join('')}
      </div>
      <div class="project-story"><p class="lead">${group.lead}</p><dl><div><dt>Mode</dt><dd>${group.mode}</dd></div><div><dt>Use</dt><dd>${group.use}</dd></div><div><dt>Tools</dt><dd>${group.tools.map(([, label]) => label).join(' · ')}</dd></div></dl><span class="skill-note">${group.note}</span></div>
    </div>
  </article>`).join('');

const capabilitiesOrSkillsMarkup = selectedSkillGroups.length ? `
  <section class="projects skills-archive category-skills-archive ${key === 'pm' ? 'pm-skills-archive' : key === 'hci' ? 'hci-skills-archive' : ''}" id="skills">
    <p class="skills-route">${hasSelectedWork ? '04' : '03'} / TOOLKIT<br>${data.short} SKILLS ARCHIVE</p>
    <header class="section-head"><div><span>${hasSelectedWork ? '04' : '03'}</span><h2>Skills</h2></div><p>Select a system to open the toolkit.<br>${selectedSkillGroups.length} focused working systems</p></header>
    ${skillGroupsMarkup}
  </section>` : `
  <section class="category-capabilities">
    <div class="capability-title reveal"><span>03 / CAPABILITIES</span><h2>Tools follow the problem.</h2></div>
    <div class="capability-cloud reveal">${data.capabilities.map(item => `<span>${item}</span>`).join('')}</div>
    <p class="education-note reveal">B.Arch + Additional Major in Human-Computer Interaction<br>Carnegie Mellon University · GPA 3.88 · Expected 2029</p>
  </section>`;

const methodMarkup = data.methods.map(method => `
  <article class="method-card reveal"><span>${method[0]}</span><h3>${method[1]}</h3><p>${method[2]}</p></article>`).join('');

const standardCategoryMarkup = `
  <section class="category-hero${isArchitecture ? ' architecture-waves-hero' : ''}" id="top">
    <div class="category-grid" aria-hidden="true"></div>
    ${isArchitecture ? '<div class="architecture-wave-field" data-selected-waves aria-hidden="true"><canvas class="selected-works-waves" data-selected-waves-canvas></canvas></div>' : ''}
    <p class="category-kicker">${data.code} / ${data.name}<br>SELECTED EXPERIENCE</p>
    ${isArchitecture ? '<h1 class="selected-works-title" aria-label="Selected works"><span data-selected-works-type></span></h1>' : `<h1>${data.question.map((line, index) => `<span class="question-line line-${index + 1}">${line}</span>`).join('')}<i>?</i></h1>`}
    <div class="category-figure figure-${key}" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></div>
    ${isArchitecture ? '' : `<figure class="category-image-stage" aria-hidden="true"><img src="../assets/portfolio/${categoryHeroImage[key]}" alt="" fetchpriority="high"></figure>`}
    ${isArchitecture ? '' : `<p class="category-intro">${data.intro}</p>`}
    ${isArchitecture ? '' : `<div class="category-lenses">${data.lens.map((lens, index) => `<span><i>0${index + 1}</i>${lens}</span>`).join('')}</div>`}
    ${isArchitecture ? '' : `<a class="category-scroll" href="#experience"><span>Enter ${data.short}</span><i>↓</i></a>`}
  </section>

  ${isArchitecture ? architectureArchiveMarkup : key === 'pm' ? pmArchiveMarkup : key === 'hci' ? hciArchiveMarkup : `
    <section class="category-evidence category-evidence-${key}" id="experience">
      <header class="category-section-head reveal"><div><span>01</span><h2>Experience as evidence.</h2></div><p>${String(data.experiences.length).padStart(2, '0')} records<br>${data.name}</p></header>
      <div class="case-list">${experienceMarkup}</div>
    </section>`}

  ${isArchitecture ? architectureExperienceLedgerMarkup : key === 'pm' ? pmExperienceLedgerMarkup : key === 'hci' ? hciExperienceLedgerMarkup : ''}

  <section class="category-method" id="method">
    <header class="category-section-head reveal"><div><span>${hasSelectedWork ? '03' : '02'}</span><h2>${data.methodTitle}</h2></div><p>Working method<br>Not a fixed formula</p></header>
    <div class="method-grid">${methodMarkup}</div>
  </section>

  ${capabilitiesOrSkillsMarkup}`;

const pmCaseStudyMarkup = `
  <article class="pm-story" id="top">
    <section class="pm-story-hero">
      <div class="pm-story-grid" aria-hidden="true"></div>
      <p class="pm-story-eyebrow">10⁰ / PRODUCT MANAGEMENT<br>SANKOFA BAMBOO GREENHOUSE</p>
      <h1>Sankofa<br>Bamboo<br><em>Greenhouse.</em></h1>
      <p class="pm-story-deck">Moving a community-led idea through research, engineering, testing, permitting, fabrication, and full-scale assembly.</p>
      <dl class="pm-story-meta">
        <div><dt>Role</dt><dd>Project Designer</dd></div>
        <div><dt>Period</dt><dd>2026 - Present</dd></div>
        <div><dt>Place</dt><dd>Homewood, Pittsburgh</dd></div>
        <div><dt>Focus</dt><dd>Research · Coordination · Delivery</dd></div>
      </dl>
      <figure class="pm-story-hero-image"><img src="../assets/portfolio/sankofa-build-progress.webp" alt="The Sankofa Bamboo Greenhouse full-scale assembly in progress" fetchpriority="high"><figcaption>Full-scale assembly / Carnegie Mellon University</figcaption></figure>
      <a class="pm-story-enter" href="#pm-overview"><span>Read the case study</span><i>↓</i></a>
    </section>

    <section class="pm-story-overview" id="pm-overview">
      <p class="pm-story-index">00 / OVERVIEW</p>
      <h2>A greenhouse only moves forward when its technical system and its human system move together.</h2>
      <div class="pm-story-intro">
        <p>The Sankofa Bamboo Greenhouse is an experimental structure for Pittsburgh's Homewood community. Its path to construction crosses community priorities, bamboo research, structural testing, city approvals, fundraising, fabrication, and public engagement.</p>
        <p>My role sits between those parts: making decisions legible, turning feedback into concrete changes, and keeping the work moving without losing the project’s social purpose.</p>
      </div>
      <div class="pm-story-stats" aria-label="Project highlights">
        <div><strong>10+</strong><span>original joinery details developed</span></div>
        <div><strong>100-5,000</strong><span>pound range used in prototype testing</span></div>
        <div><strong>14</strong><span>students coordinated for fabrication</span></div>
        <div><strong>01</strong><span>shared project across many disciplines</span></div>
      </div>
    </section>

    <section class="pm-story-brief">
      <div class="pm-story-copy reveal">
        <p class="pm-story-index">01 / FRAME THE SYSTEM</p>
        <h2>Start with the whole network.</h2>
        <p>The visible product is a greenhouse. The delivery problem is a network of people, evidence, approvals, money, materials, and time. I helped connect weekly decisions to the stakeholders who would test, approve, fund, build, and ultimately use the project.</p>
      </div>
      <figure class="pm-story-diagram pm-story-diagram-wide reveal"><img src="../assets/portfolio/stepping-massing-05.webp" alt="Sankofa greenhouse design massing study" loading="lazy" decoding="async"><figcaption>Design intent / a shared spatial model</figcaption></figure>
      <figure class="pm-story-diagram reveal"><img src="../assets/portfolio/add-circular-site-map.webp" alt="Sankofa greenhouse site and community context map" loading="lazy" decoding="async"><figcaption>Context / Homewood and the project site</figcaption></figure>
      <div class="pm-story-stakeholders reveal">
        <span>Community partners</span><span>USDA staff</span><span>Intertek engineers</span><span>City permitting</span><span>Faculty + students</span><span>Media + funders</span>
      </div>
    </section>

    <figure class="pm-story-full-image reveal"><img src="../assets/portfolio/sankofa-project-team.webp" alt="Sankofa greenhouse project team with community partner" loading="lazy" decoding="async"><figcaption><span>Alignment</span> Building a shared language across the project team.</figcaption></figure>

    <section class="pm-story-stage pm-story-stage-dark">
      <header class="reveal"><p class="pm-story-index">02 / MAKE UNCERTAINTY TESTABLE</p><h2>Turn risk into something the team can see, test, and improve.</h2></header>
      <div class="pm-story-stage-copy reveal"><p>Bamboo introduced structural and fabrication questions that drawings alone could not answer. Research moved into physical prototypes, custom connections, engineering review, and increasingly demanding load tests.</p><p>Each cycle reduced uncertainty for the next decision: what to keep, what to revise, and what was ready to scale.</p></div>
      <div class="pm-story-joinery">
        <figure class="reveal"><img src="../assets/portfolio/sankofa-joinery-network.webp" alt="Network of bamboo members and custom joinery during prototyping" loading="lazy" decoding="async"><figcaption>Prototype network / connections in context</figcaption></figure>
        <figure class="reveal"><img src="../assets/portfolio/sankofa-joinery-detail.webp" alt="Close view of a custom plywood and metal bamboo connection" loading="lazy" decoding="async"><figcaption>Custom connection / designed for testing and assembly</figcaption></figure>
      </div>
      <ol class="pm-story-process reveal">
        <li><span>01</span><b>Research</b><p>Study Southeast Asian precedents and traditional bamboo construction.</p></li>
        <li><span>02</span><b>Prototype</b><p>Translate sketches and technical drawings into physical joinery.</p></li>
        <li><span>03</span><b>Test</b><p>Apply increasing loads and document how each connection behaves.</p></li>
        <li><span>04</span><b>Decide</b><p>Carry validated details into coordinated full-scale fabrication.</p></li>
      </ol>
    </section>

    <section class="pm-story-community">
      <header class="reveal"><p class="pm-story-index">03 / KEEP THE COMMUNITY IN THE ROOM</p><h2>Feedback changed the work.</h2><p>Community conversations were treated as project inputs. Comments about use, comfort, furniture, and environmental experience were carried into design reviews alongside structural and delivery constraints.</p></header>
      <div class="pm-story-community-grid">
        <figure class="pm-community-a reveal"><img src="../assets/portfolio/sankofa-community-presentation.webp" alt="Sankofa greenhouse model presented outdoors to project collaborators" loading="lazy" decoding="async"><figcaption>Bring the model to the conversation.</figcaption></figure>
        <figure class="pm-community-b reveal"><img src="../assets/portfolio/sankofa-community-dialogue.webp" alt="Community members discussing the greenhouse model" loading="lazy" decoding="async"><figcaption>Listen for priorities and concerns.</figcaption></figure>
        <figure class="pm-community-c reveal"><img src="../assets/portfolio/sankofa-design-review.webp" alt="Students and a community partner reviewing the greenhouse model together" loading="lazy" decoding="async"><figcaption>Return with visible design responses.</figcaption></figure>
      </div>
      <blockquote class="reveal">The goal was not consensus in one meeting. It was a dependable loop between listening, translating, reviewing, and deciding.</blockquote>
    </section>

    <section class="pm-story-delivery">
      <div class="pm-story-copy reveal"><p class="pm-story-index">04 / COORDINATE DELIVERY</p><h2>One build.<br>Many parallel paths.</h2><p>As the project moved toward construction, design decisions became responsibilities, schedules, quality checks, and handoffs. I supported coordination across testing and permitting while helping organize fabrication teams around CNC routing, 3D printing, metal preparation, joinery, and assembly.</p></div>
      <div class="pm-story-workstreams reveal" aria-label="Delivery workstreams"><span>Testing</span><span>Permitting</span><span>Funding</span><span>Fabrication</span><span>Engagement</span></div>
      <figure class="pm-story-delivery-image reveal"><img src="../assets/portfolio/sankofa-full-scale-assembly.webp" alt="Full-scale Sankofa bamboo greenhouse structure during assembly" loading="lazy" decoding="async"><figcaption>From coordinated decisions to a full-scale structure.</figcaption></figure>
    </section>

    <section class="pm-story-close">
      <p class="pm-story-index">05 / CONTINUING</p>
      <h2>The work is still moving.</h2>
      <p>The Sankofa Bamboo Greenhouse remains an active project. The durable outcome is a clearer path from community ambition to evidence, from evidence to coordinated action, and from coordinated action to something people can build together.</p>
      <a href="#top">Return to the beginning ↑</a>
    </section>
  </article>`;

root.innerHTML = `
  ${key === 'pm' ? pmCaseStudyMarkup : standardCategoryMarkup}

  <section class="contact category-qr-contact" id="category-contact">
    <div class="contact-heading">
      <p>${hasSelectedWork ? '05' : '04'} / CONTACT</p>
      <h2>Contact <em>me</em><span>.</span></h2>
      <a href="mailto:ziheh@andrew.cmu.edu">ziheh@andrew.cmu.edu ↗</a>
      <div class="contact-back-top">
        <span>Back to top</span>
        <a href="#top" aria-label="Back to the top of the ${data.name} page">↑</a>
      </div>
    </div>

    <div class="contact-qr-grid" aria-label="Social media QR codes">
      <article class="qr-card">
        <a class="qr-image-frame" href="https://www.linkedin.com/in/zihe-huang/" target="_blank" rel="noreferrer" aria-label="Open Zihe Huang's LinkedIn profile"><img class="qr-image" src="../assets/qr-linkedin.png" alt="QR code for Zihe Huang's LinkedIn profile" /></a>
        <div><small>01 / PROFESSIONAL</small><h3><a href="https://www.linkedin.com/in/zihe-huang/" target="_blank" rel="noreferrer">LinkedIn ↗</a></h3><p>Scan or open profile</p></div>
      </article>
      <article class="qr-card">
        <a class="qr-image-frame" href="https://www.instagram.com/zihealobi/" target="_blank" rel="noreferrer" aria-label="Open Zihe Huang's Instagram profile"><img class="qr-image" src="../assets/qr-instagram.png" alt="QR code for Zihe Huang's Instagram profile" /></a>
        <div><small>02 / VISUAL</small><h3><a href="https://www.instagram.com/zihealobi/" target="_blank" rel="noreferrer">Instagram ↗</a></h3><p>Scan or open profile</p></div>
      </article>
      <article class="qr-card">
        <div class="qr-image-frame"><img class="qr-image" src="../assets/qr-wechat.png" alt="WeChat QR code for Zihe Huang" /></div>
        <div><small>03 / DIRECT</small><h3>WeChat</h3><p>Scan to add on WeChat</p></div>
      </article>
    </div>

    <footer class="contact-footer">
      <nav class="contact-practice" aria-label="Practice quick links">
        <span>Practice /</span>
        <a href="../architecture/" data-route data-route-label="ARCHITECTURE">ARCH</a>
        <a href="../pm/" data-route data-route-label="PRODUCT MANAGEMENT">PM</a>
        <a href="../hci/" data-route data-route-label="HUMAN-COMPUTER INTERACTION">HCI</a>
      </nav>
      <p>Pittsburgh ↔ Worldwide<br />© 2026 Zihe Huang</p>
      <div class="contact-icons" aria-label="Social links">
        <a class="social-placeholder social-linkedin" href="https://www.linkedin.com/in/zihe-huang/" target="_blank" rel="noreferrer" aria-label="Visit Zihe Huang on LinkedIn">in</a>
        <a class="social-placeholder social-instagram" href="https://www.instagram.com/zihealobi/" target="_blank" rel="noreferrer" aria-label="Visit Zihe Huang on Instagram"><i></i></a>
        <a class="social-placeholder social-mail" href="mailto:ziheh@andrew.cmu.edu" aria-label="Email Zihe Huang"><i></i></a>
      </div>
    </footer>
  </section>`;

const cursor = document.querySelector('.cursor');
const legacyCursorVisible = cursor && getComputedStyle(cursor).display !== 'none';
if (legacyCursorVisible) {
  window.addEventListener('pointermove', ({ clientX, clientY }) => {
    cursor.style.setProperty('--cursor-x', `${clientX}px`);
    cursor.style.setProperty('--cursor-y', `${clientY}px`);
  }, { passive: true });
}

const bindPointerStates = () => document.querySelectorAll('a, button').forEach(element => {
  if (!legacyCursorVisible) return;
  element.addEventListener('pointerenter', () => cursor.classList.add('large'));
  element.addEventListener('pointerleave', () => cursor.classList.remove('large'));
});
bindPointerStates();

document.querySelectorAll('.project-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const project = trigger.closest('.project');
    const shouldOpen = !project.classList.contains('open');
    document.querySelectorAll('.project.open').forEach(item => {
      item.classList.remove('open');
      item.querySelector('.project-trigger')?.setAttribute('aria-expanded', 'false');
    });
    project.classList.toggle('open', shouldOpen);
    trigger.setAttribute('aria-expanded', String(shouldOpen));
  });
});

const panel = document.querySelector('.index-panel');
const menu = document.querySelector('.menu-button');
const siteHeader = document.querySelector('.site-head');
const setPanel = open => {
  panel.classList.toggle('open', open);
  siteHeader.classList.toggle('menu-open', open);
  panel.setAttribute('aria-hidden', String(!open));
  menu.setAttribute('aria-expanded', String(open));
};
menu.addEventListener('click', () => setPanel(!panel.classList.contains('open')));
document.addEventListener('click', event => {
  if (!panel.classList.contains('open')) return;
  if (panel.contains(event.target) || menu.contains(event.target)) return;
  event.preventDefault();
  event.stopPropagation();
  setPanel(false);
}, true);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setPanel(false);
});

let headerFrame = 0;
const updateHeader = () => {
  siteHeader.classList.toggle('is-compact', window.scrollY > 80);
  headerFrame = 0;
};
window.addEventListener('scroll', () => {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

const transition = document.querySelector('.page-transition');
const transitionGrid = transition.querySelector('.transition-grid');
const transitionLabel = transition.querySelector('.transition-label');
for (let index = 0; index < 12; index += 1) {
  const cell = document.createElement('span');
  cell.style.setProperty('--cell', index);
  cell.style.setProperty('--reverse-cell', 11 - index);
  transitionGrid.append(cell);
}

let routing = false;
const routeTransitionDuration = 690;
const routeHoldDuration = 170;
const routeRevealDuration = 1050;
const routeStorageKey = 'alobi-route-reveal';

const rememberRouteReveal = (label, effect = 'route') => {
  try {
    sessionStorage.setItem(routeStorageKey, JSON.stringify({ label, effect, createdAt: Date.now() }));
  } catch {}
};

const playIncomingRouteReveal = () => {
  let state = null;
  try {
    const rawState = sessionStorage.getItem(routeStorageKey);
    state = rawState ? JSON.parse(rawState) : null;
    sessionStorage.removeItem(routeStorageKey);
  } catch {}

  if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('route-enter-pending');
    return;
  }

  routing = true;
  transitionLabel.textContent = state.label || data.name;
  transition.className = `page-transition is-active ${state.effect === 'arch-slide' ? 'effect-arch-slide-reveal' : 'effect-route-reveal'}`;
  void transition.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  }));
  window.setTimeout(() => {
    transition.className = 'page-transition';
    routing = false;
    applyEntryPosition();
  }, routeRevealDuration);
};

playIncomingRouteReveal();

const routeTo = (url, label) => {
  if (routing) return;
  setPanel(false);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    location.assign(url);
    return;
  }
  routing = true;
  document.documentElement.classList.add('route-leaving');
  transition.className = 'page-transition is-active effect-route';
  transitionLabel.textContent = label;
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(label);
    requestAnimationFrame(() => window.setTimeout(() => location.assign(url), routeHoldDuration));
  }, routeTransitionDuration);
};

document.querySelectorAll('[data-route]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    routeTo(link.href, link.dataset.routeLabel || link.textContent.trim());
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    setPanel(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.intersectionRatio >= .14) {
      entry.target.classList.remove('is-out');
      entry.target.classList.add('in-view');
    } else if (entry.intersectionRatio <= .04) {
      entry.target.classList.add('is-out');
      entry.target.classList.remove('in-view');
    }
  });
}, { threshold: [0, .04, .14], rootMargin: '-4% 0px -4% 0px' });
document.querySelectorAll('.reveal, .architecture-practice, .arch-lens-work, .career-ledger, .projects, .category-hero, .category-qr-contact').forEach(element => observer.observe(element));

requestAnimationFrame(() => document.body.classList.add('category-ready'));

