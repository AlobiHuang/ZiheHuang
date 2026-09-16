const portfolio = {
  architecture: {
    name: 'Architecture', short: 'ARCH', code: '10²', accent: '#ff3d16',
    copy: 'A portfolio of buildings, systems, and stories shaped through observation, rule-making, and making.',
    projects: [
      {
        slug: 'convergence-environmental-middle-school', no: 'A—01', title: 'Convergence', date: '2025 Fall', type: 'Studio Project',
        role: 'Environmental Middle School · Second Year First Semester',
        question: 'How can a school make climate and urban history tangible?',
        summary: 'An environmental middle school near Pittsburgh’s Bakery Square that teaches the city’s history of weather, pollution, and urban change through the building itself.',
        evidence: ['Lao and Thai vernacular compounds studied as models of intersection, opening, and cross ventilation', 'Field drawings and a visual rule set translated into connected loops, atriums, and shared programs', 'Continuous roofs, rain gardens, sections, plans, and a detachable physical model tested climate and social experience'],
        tags: ['Climate', 'Precedent', 'Rule set', 'Physical model']
      },
      {
        slug: 'the-tinkerers-imaginarium', no: 'A—02', title: "The Tinkerer's Imaginarium", date: '2025 Spring', type: 'Studio Project',
        role: 'Maker Space · First Year Second Semester',
        question: 'How can a maker space belong to a changing neighborhood?',
        summary: 'A maker space for artists and creative workers at 3521 Butler Street in Lower Lawrenceville, shaped by the neighborhood’s industrial history and diverse creative community.',
        evidence: ['Lawrenceville mapped from steel mills and warehouses to creative enterprises and adaptive reuse', 'A cluster organized outdoor circulation, shared gardens, and gradients of privacy', 'Axonometric studies, massing, plans, and site diagrams connected the building to its neighborhood'],
        tags: ['Community', 'Massing', 'Privacy', 'Adaptive reuse']
      },
      {
        slug: 'radical-empathy', no: 'A—03', title: 'Radical Empathy', date: '2025 Spring', type: 'Studio Project',
        role: 'Multi-generational House · First Year Second Semester',
        question: 'How can a house hold a family across generations and distance?',
        summary: 'A multi-generational house and children’s learning space in Pittsburgh, rooted in a family story that connects Chaoshan, China, and a dispersed generation.',
        evidence: ['Family journeys and reunions translated into a spatial idea of the bridge', 'Exploded axonometrics, massing models, and moment studies connected generations vertically and horizontally', 'Ground, upper-floor, and sectional drawings developed around shared learning and gathering'],
        tags: ['Family', 'Empathy', 'Bridge', 'Collective living']
      },
      {
        slug: 're-serv-oir', no: 'A—05', title: 'RE.SERV.OIR', date: '2026', type: 'Design Studio',
        role: 'Community Ecology Center · Portland, Oregon',
        question: 'How can obsolete infrastructure become civic ground?',
        summary: 'A community ecology center that reclaims Portland’s decommissioned concrete water tanks as civic ground for environmental learning, gathering, and ecological repair.',
        evidence: ['Existing reservoirs, neighborhoods, and transportation systems mapped as one civic infrastructure', 'A transformation sequence moved from drain and cut to reposition, frame, and reclaim', 'Retained concrete walls, mass timber, rain gardens, and shared courtyards formed an adaptive system'],
        tags: ['Reuse', 'Ecology', 'Civic', 'Infrastructure']
      },
      {
        slug: 'how-to-build-a-ruin', no: 'A—06', title: 'How to Build a Ruin', date: '2026', type: 'Option Studio',
        role: 'Seed Bank · Option Studio 48-205',
        question: 'What if architecture grows with what it protects?',
        summary: 'A seed bank and ecological research institute that turns a former coal landscape into a long-term system for energy production, soil repair, and agricultural resilience.',
        evidence: ['The seed bank positioned between a redeveloped power plant and surrounding agricultural communities', 'Rice became both a living system and a material research subject for a spine-and-branch architecture', 'Plans, sections, and technical assemblies developed around growth, harvest, waste, and repair'],
        tags: ['Seed bank', 'Climate', 'Material', 'Long time']
      },
      {
        slug: 'call-of-the-sea', no: 'A—07', title: 'Call of the Sea', date: '2026—Present', type: 'In progress',
        role: 'Mixed Use / Accommodation · Torosiaje, Indonesia',
        question: 'How can a building remain open to life on water?',
        summary: 'A way of living on water that connects community, hospitality, and the tides through a porous network of rooms, circulation, and shared exchange.',
        evidence: ['The settlement read as a living network shaped by water, movement, and collective routines', 'Layered maps, plans, and sectional studies tested circulation and exchange', 'The coastal condition translated into an architecture that remains open to change'],
        tags: ['Water', 'Community', 'Hospitality', 'Adaptation']
      }
    ]
  },
  pm: {
    name: 'Product Management', short: 'PM', code: '10⁰', accent: '#171816',
    copy: 'Product thinking as disciplined translation across people, evidence, constraints, and delivery.',
    projects: [
      {
        slug: 'sankofa-multi-stakeholder-delivery', no: 'P—01', title: 'Sankofa Bamboo Greenhouse', date: 'Jun 2026—Present', type: 'Work',
        role: 'Project Designer',
        question: 'How do many stakeholders move one experimental project forward?',
        summary: 'Coordinating the technical, civic, financial, and community work required to move an experimental greenhouse toward construction.',
        evidence: ['USDA, Intertek, city, media, and community coordination', 'Fundraising, testing, permitting, and engagement workstreams', 'Interview insights translated into actionable priorities'],
        tags: ['Stakeholders', 'Delivery', 'Risk', 'Prioritization']
      },
      {
        slug: 'mentorship-as-a-feedback-system', no: 'P—02', title: 'Mentorship as a Feedback System', date: '2025—Present', type: 'Leadership',
        role: 'Undergraduate Mentor · Carnegie Mellon University',
        question: 'How can weekly critique become a reliable feedback system?',
        summary: 'Creating a dependable feedback loop that helps first-year designers move from open-ended problems to concrete next actions.',
        evidence: ['Critiques structured around goals, blockers, and actions', 'Guidance adapted to different levels of experience', 'Work reviewed against project intent and deliverables'],
        tags: ['Leadership', 'Communication', 'Feedback', 'Enablement']
      },
      {
        slug: 'ai-workflow-from-opportunity-to-adoption', no: 'P—03', title: 'AI Workflow: From Opportunity to Adoption', date: '2023—2024', type: 'Industry',
        role: 'Design Intern · Hong Kong Huayi Design Consultants',
        question: 'What does it take to move AI from experiment to adoption?',
        summary: 'A product-shaped initiative to identify, prototype, evaluate, and operationalize generative AI within an established design team.',
        evidence: ['Opportunity mapped inside the existing workflow', '10+ models compared through 600+ controlled iterations', 'Team feedback converted into a repeatable process'],
        tags: ['Discovery', 'Prototyping', 'Evaluation', 'Adoption']
      }
    ]
  },
  hci: {
    name: 'Human-Computer Interaction', short: 'HCI', code: '10⁻²', accent: '#4038ff',
    copy: 'Human-centered systems grounded in behavior, context, prototyping, and evaluation.',
    projects: [
      {
        slug: 'community-research-for-sankofa', no: 'H—01', title: 'Community Research for Sankofa', date: 'Jun 2026—Present', type: 'Work',
        role: 'Project Designer · Sankofa Bamboo Greenhouse',
        question: 'How can community input remain active inside technical decisions?',
        summary: 'Using direct community input to ensure a technically ambitious system stays grounded in how people will encounter and use it.',
        evidence: ['Community interviews conducted through weekly design reviews', 'Feedback synthesized into interior, furniture, and environmental design changes', 'Human priorities connected to structural and delivery constraints'],
        tags: ['Interviews', 'Synthesis', 'Participation', 'Systems']
      },
      {
        slug: 'evaluating-an-ai-assisted-design-tool', no: 'H—02', title: 'Evaluating an AI-assisted Design Tool', date: '2023—2024', type: 'Industry',
        role: 'Design Intern · Hong Kong Huayi Design Consultants',
        question: 'What makes an AI-assisted workflow understandable and trustworthy?',
        summary: 'Treating a generative AI workflow as an interaction problem: useful inputs, trustworthy outputs, and fit with existing practice.',
        evidence: ['10+ models and 600+ output iterations tested', 'Designer feedback gathered on usability and quality', 'Parameters refined into a repeatable interaction flow'],
        tags: ['AI interaction', 'Usability', 'Iteration', 'Workflow']
      },
      {
        slug: 'design-learning-through-critique', no: 'H—03', title: 'Design Learning Through Critique', date: '2025—Present', type: 'Leadership',
        role: 'Undergraduate Mentor · Carnegie Mellon University',
        question: 'How can feedback adapt to how different people learn?',
        summary: 'Adapting technical and visual guidance to how different students understand, practice, and communicate design.',
        evidence: ['Weekly one-to-one critique and project reviews', 'Complex workflows explained through hands-on support', 'Iterative feedback used to build confidence and independence'],
        tags: ['Learning', 'Feedback', 'Communication', 'Accessibility']
      }
    ]
  }
};

const params = new URLSearchParams(location.search);
const isPmLanding = /^\/pm\/?$/i.test(location.pathname);
const requestedLens = params.get('lens') || (isPmLanding ? 'pm' : 'architecture');
const lensKey = portfolio[requestedLens] ? requestedLens : 'architecture';
const lens = portfolio[lensKey];
if (lensKey === 'architecture') {
  const architectureOrder = ['re-serv-oir', 'how-to-build-a-ruin', 'convergence-environmental-middle-school', 'the-tinkerers-imaginarium', 'radical-empathy', 'call-of-the-sea'];
  lens.projects = lens.projects.slice().sort((a, b) => architectureOrder.indexOf(a.slug) - architectureOrder.indexOf(b.slug)).map((item, index) => ({ ...item, no: `A—${String(index + 1).padStart(2, '0')}` }));
}
const projectAliases = {
  convergence: 'convergence-environmental-middle-school',
  'the-tinkerer-s-imaginarium': 'the-tinkerers-imaginarium'
};
const requestedProjectSlug = params.get('project') || (isPmLanding ? 'sankofa-multi-stakeholder-delivery' : null);
const requestedSlug = projectAliases[requestedProjectSlug] || requestedProjectSlug;
const projectIndex = Math.max(0, lens.projects.findIndex(item => item.slug === requestedSlug));
const project = lens.projects[projectIndex];
const previous = lens.projects[(projectIndex - 1 + lens.projects.length) % lens.projects.length];
const next = lens.projects[(projectIndex + 1) % lens.projects.length];
const lensHref = `../${lensKey === 'architecture' ? 'architecture' : lensKey}/`;
const projectHref = item => `?lens=${lensKey}&project=${item.slug}`;
const mediaByProject = {
  'convergence-environmental-middle-school': ['convergence-pdf-01.jpg', 'convergence-pdf-02.jpg', 'convergence-pdf-03.jpg', 'convergence-pdf-04.jpg', 'convergence-pdf-05.jpg', 'convergence-pdf-06.jpg', 'convergence-pdf-07.jpg', 'convergence-pdf-08.jpg', 'convergence-pdf-09.jpg', 'convergence-pdf-10.jpg', 'convergence-pdf-11.jpg', 'convergence-pdf-12.jpg'],
  'the-tinkerers-imaginarium': ['tinkerers-pdf-01.jpg', 'tinkerers-pdf-02.jpg', 'tinkerers-pdf-03.jpg', 'tinkerers-pdf-04.jpg'],
  'radical-empathy': ['radical-empathy-pdf-01.jpg', 'radical-empathy-pdf-02.jpg', 'radical-empathy-pdf-03.jpg', 'radical-empathy-pdf-04.jpg', 'radical-empathy-pdf-05.jpg', 'radical-empathy-pdf-06.jpg'],
  're-serv-oir': ['reservoir-pdf-01.jpg', 'reservoir-pdf-02.jpg', 'reservoir-pdf-03.jpg', 'reservoir-pdf-04.jpg', 'reservoir-pdf-05.jpg'],
  'how-to-build-a-ruin': ['ruin-pdf-01.jpg', 'ruin-pdf-02.jpg', 'ruin-pdf-03.jpg', 'ruin-pdf-04.jpg', 'ruin-pdf-05.jpg'],
  'call-of-the-sea': ['sea-hero.png', 'sea-map.png', 'sea-section.png', 'ruin-parti-01.jpg', 'ruin-parti-03.jpg'],
  'sankofa-multi-stakeholder-delivery': ['sankofa-full-scale-assembly.webp', 'sankofa-build-progress.webp', 'sankofa-project-team.webp', 'sankofa-joinery-detail.webp', 'sankofa-community-presentation.webp', 'sankofa-community-dialogue.webp', 'sankofa-design-review.webp'],
  'mentorship-as-a-feedback-system': ['1-img-9736.webp', '19-img-9665.webp', '21-img-9647.webp'],
  'ai-workflow-from-opportunity-to-adoption': ['conceptual-timeline-03.webp', 'parti-01.webp', 'parti-03.webp', 'parti-04.webp'],
  'community-research-for-sankofa': ['add-circular-site-map.webp', 'new-circular-site-map-01.webp', 'new-circular-site-map-02.webp'],
  'evaluating-an-ai-assisted-design-tool': ['conceptual-timeline-01.webp', 'conceptual-timeline-02.webp', 'exchange-room-new.webp'],
  'design-learning-through-critique': ['site-plan-new-01.webp', 'ground-plan.webp', 'long-section.webp', 'reservoir.webp']
};
const mediaCaptionsByProject = {
  'convergence-environmental-middle-school': ['Final perspective — a climate-aware school gathered around shared atriums', 'Field model — loops, openings, and the continuous roof tested at model scale', 'Rule set pattern — the field drawing translated into a repeatable spatial system', 'Rule set — circle locations and curves extracted from the site matrix', 'Research map — weather, rivers, traffic, and neighborhood systems', 'Site map — Bakery Square and the surrounding urban context', 'Site model — massing and circulation positioned within the neighborhood', 'Physical model — structure, landscape, and the polluted-water cycle', 'Ground plan — library, cafe, multipurpose room, and learning commons', 'Upper plan — classrooms and shared programs around the atrium', 'Sections — daylight, ventilation, and connected floor levels', 'Climate section — rain gardens and the water cycle', 'Site plan and section — the school as an environmental field'],
  'the-tinkerers-imaginarium': ['Exploded axonometric — the maker space assembled as a shared cluster', 'Call-out axonometric — privacy, publicity, and movement through the building', 'Timeline collage — Lawrenceville’s shift from industry to creative work', 'Context map — the project connected to Butler Street and its neighbors', 'Field model — outdoor circulation and shared gardens tested in massing', 'Plan diagram — hallways become places to pause, meet, and make', 'Plan — public and private rooms organized around the cluster', 'Section — the cluster opens into a shared landscape'],
  'radical-empathy': ['Sectional perspective — a house where generations learn across a bridge', 'Exploded axonometric — the bridge connects rooms, floors, and family rituals', 'Plans — ground and upper levels arranged around shared learning', 'Enclosed and void — massing studies for connection and retreat', 'Moment study 01 — the family story as a spatial sequence', 'Moment study 02 — everyday exchange across generations', 'Moment study 03 — shared making and observation', 'Moment study 04 — thresholds between private and communal life', 'Moment study 05 — the bridge as a vertical room', 'Moment study 06 — reunion, memory, and the garden', 'Section — the house as a continuous family landscape'],
  're-serv-oir': ['Exterior view of the community ecology center', 'Project form study', 'Site systems map', 'Ground floor plan', 'Mezzanine plan', 'First floor plan', 'Environmental axonometric', 'Climate section', 'Long section', 'Transportation and neighborhood map'],
  'how-to-build-a-ruin': ['Former coal-site landscape', 'Climate timeline and projected growing conditions', 'Temperature projections and climate thresholds', 'Rice, infrastructure, and continuous reconstruction', 'Growth sequence studies', 'Ground floor plan', 'Program circulation and landscape', 'Parti: spine and branch', 'Parti: field organization', 'Parti: growth and structure', 'Parti: circulation rules', 'Physical model'],
  'call-of-the-sea': ['A way of living on water — community, hospitality, and the tides', 'Site map — Torosiaje as a network of water and exchange', 'Section — porous rooms and shared movement across the water', 'Spatial study — thresholds between dwelling and community', 'Exchange study — architecture shaped by daily coastal routines'],
  'sankofa-multi-stakeholder-delivery': ['Full-scale assembly — the greenhouse moving from prototype toward construction', 'Build progress — the prototype becoming a full-scale structure', 'Project team — coordinating a shared direction across disciplines', 'Joinery detail — making the connection legible and repeatable', 'Community presentation — bringing the model into public conversation', 'Community dialogue — actively discussing with clients and designing furniture and layouts around their needs', 'Design review — translating feedback into visible decisions'],
};
const projectMedia = mediaByProject[project.slug] || ['teaser-final-dark-foreground.webp'];
const portfolioPageDimensions = {
  're-serv-oir': [1653, 1070],
  'how-to-build-a-ruin': [1653, 1070],
  'convergence-environmental-middle-school': [1070, 827],
  'the-tinkerers-imaginarium': [1070, 827],
  'radical-empathy': [1070, 827]
};
const projectPageDimensions = portfolioPageDimensions[project.slug];
const architecturePortfolioOverview = {
  're-serv-oir': 'A Community Ecology Center Reclaiming Portland’s Water Infrastructure',
  'how-to-build-a-ruin': 'A Seed Bank Growing with What it Protects',
  'call-of-the-sea': 'A Way of Living on Water'
};
const isPdfPortfolioProject = lensKey === 'architecture' && ['re-serv-oir', 'how-to-build-a-ruin', 'convergence-environmental-middle-school', 'the-tinkerers-imaginarium', 'radical-empathy'].includes(project.slug);
const isPairedSpreadProject = lensKey === 'architecture' && ['convergence-environmental-middle-school', 'radical-empathy'].includes(project.slug);
const sourceOverview = lensKey === 'architecture' && !isPdfPortfolioProject ? architecturePortfolioOverview[project.slug] : '';
const isInProgressArchitecture = lensKey === 'architecture' && project.slug === 'call-of-the-sea';
const isSankofaProject = lensKey === 'pm' && project.slug === 'sankofa-multi-stakeholder-delivery';
const mediaCaptions = mediaCaptionsByProject[project.slug] || [];
const mediaAlt = index => mediaCaptions[index] || `${project.title} portfolio visual ${index + 1}`;
const sectionMedia = projectMedia.slice(1, 7);
const sectionCount = sectionMedia.length;
const sectionHeadline = index => {
  const caption = mediaCaptions[index + 1] || `${project.title} study`;
  const [first] = caption.split(' — ');
  return first;
};
const processSteps = lensKey === 'architecture'
  ? 'Context → Research → System → Prototype → Resolve'
  : lensKey === 'pm'
    ? 'Frame → Align → Test → Deliver → Learn'
    : 'Observe → Frame → Prototype → Test → Share';
const projectMetaLabel = lensKey === 'pm' ? 'Team' : 'Mode';
const projectMetaValue = lensKey === 'pm' ? 'Vicky Achnani, Zihe Huang, Shirley Xie, Victor Teng' : project.type;
const impactHeading = isSankofaProject
  ? 'Moving the Sankofa Bamboo Greenhouse from research prototype to full-scale construction.'
  : project.summary;
const impactCopy = isSankofaProject
  ? 'Presented the project to USDA staff, supported a $4,000 annual award and eligibility for an additional $8,000 implementation award in 2027, and designed more than 10 original joinery details with structural engineer John M. Schneider, P.E.'
  : 'The work leaves a record of what changed, what was learned, and what the next decision can build on.';
const impactStats = isSankofaProject
  ? [['$4K', 'annual award'], ['$8K', '2027 eligibility'], ['10+', 'unique joinery details']]
  : [[sectionCount, 'visual studies'], [project.evidence.length, 'key decisions'], [project.tags.length, 'working lenses']];
const architectureGalleryMarkup = isPairedSpreadProject
  ? Array.from({ length: Math.ceil(projectMedia.length / 2) }, (_, spreadIndex) => {
      const pages = projectMedia.slice(spreadIndex * 2, spreadIndex * 2 + 2);
      return `<figure class="gallery-item gallery-spread gallery-spread-${spreadIndex + 1}">${pages.map((image, pageIndex) => {
        const absoluteIndex = spreadIndex * 2 + pageIndex;
        return `<span class="gallery-spread-page"><img src="../assets/portfolio/${image}" alt="${project.title} portfolio page ${absoluteIndex + 1}"${projectPageDimensions ? ` width="${projectPageDimensions[0]}" height="${projectPageDimensions[1]}"` : ''} loading="${spreadIndex === 0 ? 'eager' : 'lazy'}" decoding="async"></span>`;
      }).join('')}</figure>`;
    }).join('')
  : projectMedia.map((image, index) => `<figure class="gallery-item gallery-item-${index + 1}"><img src="../assets/portfolio/${image}" alt="${project.title} portfolio image ${index + 1}"${projectPageDimensions ? ` width="${projectPageDimensions[0]}" height="${projectPageDimensions[1]}"` : ''} loading="${isPdfPortfolioProject && index === 0 ? 'eager' : 'lazy'}" decoding="async"></figure>`).join('');

const pmLandingHeroMarkup=isPmLanding?`
  <section class="pm-spatial-hero" aria-label="Projects and leadership">
    <div class="pm-spatial-field" data-pm-spatial aria-hidden="true"><canvas class="pm-spatial-canvas"></canvas></div>
    <p class="pm-spatial-kicker">10⁰ / PRODUCT MANAGEMENT<br>DECISIONS · TEAMS · DELIVERY</p>
    <h1 class="pm-spatial-title" aria-label="Projects"><span data-pm-title-type></span></h1>
  </section>`:'';

document.body.dataset.lens = lensKey;
document.body.style.setProperty('--project-accent', lens.accent);
document.body.style.setProperty('--project-index', projectIndex);
document.title = `${project.title} — Zihe Huang`;
document.querySelector('meta[name="description"]')?.setAttribute('content', `${project.title}: ${project.summary}`);
document.querySelector('.transition-label').textContent = `PROJECT / ${project.no}`;
document.getElementById('project-coordinates').innerHTML = isPmLanding
  ? `${lens.code} / ${lens.name.toUpperCase()}<br />PROJECTS / LEADERSHIP`
  : `${lens.code} / ${lens.name.toUpperCase()}<br />${project.no} / PROJECT RECORD`;
document.getElementById('project-index-copy').textContent = lens.copy;
document.querySelector(`[data-lens-link="${lensKey}"]`)?.setAttribute('aria-current', 'page');

document.getElementById('project-root').innerHTML = `
  ${pmLandingHeroMarkup}
  <section class="project-gateway${isPdfPortfolioProject ? ' project-gateway-pdf' : ''}" id="top">
    <div class="project-gateway-grid" aria-hidden="true"></div>
    <p class="project-gateway-kicker">01 / WORK GATEWAY<br>${lens.code} / ${lens.name.toUpperCase()}</p>
    ${isSankofaProject ? '' : `<a class="project-back" href="${lensHref}#experience" data-route data-route-label="${lens.name.toUpperCase()}" data-return-anchor="experience">← Selected work</a>`}
    <div class="project-gateway-heading">
      ${isSankofaProject ? '' : `<span>${project.no} / ${project.type}</span>`}
      <h1>${project.title}</h1>
      ${lensKey === 'architecture' ? (sourceOverview ? `<p class="project-hook">${sourceOverview}</p>` : '') : `<p class="project-hook">${project.summary}</p>`}
    </div>
    ${lensKey === 'pm' && !isSankofaProject ? `<figure class="project-hero-media project-hero-media-pm"><img src="../assets/portfolio/${projectMedia[0]}" alt="${mediaAlt(0)}" fetchpriority="high"></figure>` : ''}
    ${lensKey === 'architecture' ? '' : `<dl class="project-gateway-meta">
      <div><dt>Role</dt><dd>${project.role}</dd></div>
      <div><dt>Time</dt><dd>${project.date}</dd></div>
      <div><dt>${projectMetaLabel}</dt><dd>${projectMetaValue}</dd></div>
    </dl>`}
    ${lensKey !== 'pm' && !isInProgressArchitecture && !isPdfPortfolioProject ? `<figure class="project-hero-media"><img src="../assets/portfolio/${projectMedia[0]}" alt="${mediaAlt(0)}" fetchpriority="high"></figure>` : ''}
    <div class="project-aperture aperture-${lensKey}" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
      <strong>${project.no}</strong><em>${lens.code}</em>
    </div>
    ${lensKey === 'architecture' ? '' : '<a class="project-enter" href="#case-study" aria-label="Continue to case study"><i>↓</i></a>'}
  </section>

  ${lensKey === 'architecture' || isSankofaProject ? '' : `<section class="case-framing" id="case-study">
    <p class="case-framing-index">02 / FRAMING<br>QUESTION → POSITION → METHOD</p>
    <div class="case-framing-copy">
      <p class="case-framing-lede">${project.question}</p>
      <p>${project.summary}</p>
      <p>I worked as ${project.role.toLowerCase()}, turning research and constraints into a clear sequence of decisions that people could understand and use.</p>
      <p class="case-process"><span>WORKING SEQUENCE</span>${processSteps}</p>
    </div>
  </section>`}

  ${lensKey === 'architecture' ? '' : `<section class="case-sections" id="case-study" aria-label="Project case study">
    ${isSankofaProject ? '' : '<div class="case-sections-intro"><span>03 / CASE STUDY</span><h2>From question to a working direction.</h2></div>'}
    ${sectionMedia.map((image, index) => `
      <article class="case-section gateway-reveal">
        <div class="case-section-copy">
          <p class="case-section-index">03.${String(index + 1).padStart(2, '0')} / ${project.tags[index % project.tags.length] || project.type}</p>
          <h3>${sectionHeadline(index)}</h3>
          <p>${project.evidence[index % project.evidence.length]}</p>
        </div>
        <figure class="case-section-media"><img src="../assets/portfolio/${image}" alt="${mediaAlt(index + 1)}" loading="lazy" decoding="async"><figcaption>${mediaCaptions[index + 1] || mediaAlt(index + 1)}</figcaption></figure>
      </article>`).join('')}
  </section>`}

  ${lensKey === 'architecture' ? '' : `<section class="case-impact">
    <p class="case-framing-index">04 / IMPACT</p>
    <div class="case-impact-copy"><h2>${impactHeading}</h2><p>${impactCopy}</p></div>
    <div class="case-impact-stats">${impactStats.map(([value, label]) => `<div><b>${value}</b><span>${label}</span></div>`).join('')}</div>
  </section>`}

  ${isInProgressArchitecture ? `<section class="project-in-progress" aria-label="Project status"><p>2026 / IN PROGRESS</p><h2>Work in progress.</h2><span>More from this project will be shared soon.</span></section>` : `<section class="project-gallery ${isPdfPortfolioProject ? 'project-gallery-pdf' : ''}" aria-label="Additional project visuals">
    ${lensKey === 'architecture' ? '' : '<header><span>05 / VISUAL RECORD</span><h2>Additional drawings, studies, and artifacts.</h2></header>'}
    <div class="project-gallery-grid">${lensKey === 'architecture' ? architectureGalleryMarkup : projectMedia.slice(1 + sectionCount).map((image, index) => `
      <figure class="gallery-item gallery-item-${index + 1}"><img src="../assets/portfolio/${image}" alt="${mediaAlt(index + 1 + sectionCount)}" loading="lazy" decoding="async"><figcaption><span>${String(index + 1 + sectionCount).padStart(2, '0')} / ${project.no}</span>${mediaCaptions[index + 1 + sectionCount] ? `<b>${mediaCaptions[index + 1 + sectionCount]}</b>` : ''}</figcaption></figure>`).join('')}
    </div>
  </section>`}

  <nav class="project-sequence" aria-label="Project navigation">
    <a href="${projectHref(previous)}" data-route data-route-label="PROJECT / ${previous.title.toUpperCase()}"><span>Previous</span><b>← ${previous.title}</b></a>
    <a class="project-sequence-index" href="${lensHref}#experience" data-route data-route-label="${lens.name.toUpperCase()}" data-return-anchor="experience"><span>${lens.short}</span><b>All selected work</b></a>
    <a href="${projectHref(next)}" data-route data-route-label="PROJECT / ${next.title.toUpperCase()}"><span>Next</span><b>${next.title} →</b></a>
  </nav>`;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

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
const routeStorageKey = 'alobi-route-reveal';
const rememberRouteReveal = (label, effect = 'line') => {
  try { sessionStorage.setItem(routeStorageKey, JSON.stringify({ label, effect, createdAt: Date.now() })); } catch {}
};
const playIncomingRouteReveal = () => {
  let state = null;
  try {
    const raw = sessionStorage.getItem(routeStorageKey);
    state = raw ? JSON.parse(raw) : null;
    sessionStorage.removeItem(routeStorageKey);
  } catch {}
  if (!state || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.remove('route-enter-pending');
    return;
  }
  if (state.effect === 'line' || state.effect === 'cleaner') {
    transition.className = 'page-transition';
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
    return;
  }
  routing = true;
  transitionLabel.textContent = state.label || `PROJECT / ${project.no}`;
  transition.className = 'page-transition is-active effect-route-reveal';
  void transition.offsetWidth;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.documentElement.classList.remove('route-enter-pending');
    document.getElementById('route-prepaint-style')?.remove();
  }));
  window.setTimeout(() => {
    transition.className = 'page-transition';
    routing = false;
  }, 1050);
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
  if (/ALOBI\s*\/\s*HOME/i.test(label)) {
    try { sessionStorage.setItem('alobi-home-line-return', '1'); } catch {}
  }
  document.documentElement.classList.add('route-leaving');
  transition.className = 'page-transition is-active effect-cleaner-down';
  transitionLabel.textContent = label;
  window.setTimeout(() => {
    transition.classList.add('is-holding');
    rememberRouteReveal(label);
    requestAnimationFrame(() => window.setTimeout(() => location.assign(url), 170));
  }, 780);
};

document.querySelectorAll('[data-route]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  if (link.dataset.returnAnchor) {
    try { sessionStorage.setItem('alobi-category-return-anchor', link.dataset.returnAnchor); } catch {}
  }
  routeTo(link.href, link.dataset.routeLabel || link.textContent.trim());
}));
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('in-view', entry.isIntersecting);
}), { threshold: .14 });
document.querySelectorAll('.gateway-reveal').forEach(element => observer.observe(element));
requestAnimationFrame(() => document.body.classList.add('project-ready'));
