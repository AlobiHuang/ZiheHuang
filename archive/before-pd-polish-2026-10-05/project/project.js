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
    name: 'Leadership', short: 'PM', code: '10⁻²', accent: '#171816',
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
        slug: 'teaching-assistant', no: 'P—02', title: 'Fabrication Team Lead', date: 'Aug 2026—Present', type: 'Leadership',
        role: 'Fabrication Team Lead (Teaching Assistant)',
        question: 'How do fourteen students build one thing together?',
        summary: 'Teaching assistant for a whole course that is mostly hands-on fabrication, leading a 14-student team through coordinated fabrication and assembly.',
        evidence: ['Students organized into CNC routing, 3D printing, metal preparation, joinery fabrication, and assembly teams', 'Responsibilities assigned and work coordinated across groups', 'Work quality reviewed, technical issues resolved, and safe tool use enforced'],
        tags: ['Leadership', 'Fabrication', 'Teamwork']
      }
    ]
  },
  hci: {
    name: 'Product Design', short: 'PD', code: '10⁰', accent: '#4038ff',
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
  'call-of-the-sea': ['sea-hero.webp', 'sea-map.webp', 'sea-section.webp', 'ruin-parti-01.jpg', 'ruin-parti-03.jpg'],
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
const isTaProject = lensKey === 'pm' && project.slug === 'teaching-assistant';
// PM project pages with the title on the left and a picture on the right.
const isSplitProject = isSankofaProject || isTaProject;
const mediaCaptions = mediaCaptionsByProject[project.slug] || [];
// Sankofa: the picture beside the title (file name in assets/portfolio; empty
// shows a blank frame until the drawing or photo is ready), and the visual
// record as a strip you drag sideways. Add drawings to the strip in order.
const sankofaHeroSide = '';
const sankofaHeroSideAlt = 'Sankofa Bamboo Greenhouse';
// The teaching assistant page shows the fabrication drawing until there is a photo.
const taHeroSide = 'sankofa-fabrication-sequence.webp';
const taHeroSideAlt = 'Fabrication sequence drawing: harvesting, splitting, planing, bending and assembling bamboo';
const sankofaStrip = [
  ['sankofa-fabrication-sequence.webp', 'Fabrication sequence — harvesting, splitting, planing, soaking, bending, bundling, reforming, spanning, bracing and assembling the bamboo arches'],
  ['sankofa-long-elevation.webp', 'Long elevation — sheet A-100, drawn by Alobi Zihe Huang, reviewed by Vicky Achnani']
];
const mediaAlt = index => mediaCaptions[index] || `${project.title} portfolio visual ${index + 1}`;
const sectionMedia = projectMedia.slice(1, 7);
const sectionCount = sectionMedia.length;
// Sankofa: one specific line (and a short tag) for each photo in the case study,
// instead of cycling through the general evidence list.
const sectionCopy = isSankofaProject ? [
  ['Construction', 'The prototype growing into a full-scale structure. I supported wind and gravity testing with Intertek and zoning and permitting with the City of Pittsburgh, so it can be built on site.'],
  ['Team', 'A small team working across design, structural engineering, testing and the community partner, Sankofa Village Community Garden and Farms.'],
  ['Joinery', 'I designed more than 10 original joinery details with structural engineer John M. Schneider, P.E., so each connection is clear to read and repeatable to build.'],
  ['Community', 'Presenting the model at Sankofa Village, so the people who will use the greenhouse can see it and respond before it is built.'],
  ['Community', 'Talking the design through with the clients, then designing furniture and layouts around what they need.'],
  ['Iteration', 'Turning what we heard in community interviews into visible changes to the interior layout, furniture and environmental strategies.']
] : null;
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
const projectMetaValue = isTaProject ? '14 students' : lensKey === 'pm' ? 'Zihe Huang, Shirley Xie, Victor Teng, Allen Chen' : project.type;
// PM projects also name the instructor. Sankofa itself began in 2023; the
// time shows the whole project first, then the part I have worked on.
const projectInstructor = lensKey === 'pm' && !isTaProject ? 'Vicky Achnani' : '';
const projectTime = isSankofaProject
  ? '<span class="time-span">2023 — <mark>2026 — Present<em>MY PERIOD</em></mark></span>'
  : project.date;
// Sankofa: what the project has earned so far, shown first (sources linked).
const sankofaRecognition = [
  ['2026', 'Award', 'ACSA Best Design Project', 'The Second Life: From Waste to Oasis | Sankofa Bamboo Greenhouse · Association of Collegiate Schools of Architecture', 'https://www.acsa-arch.org/acsa-announces-the-2026-best-paper-and-best-project-awards/'],
  ['2026', 'Publication', '114th ACSA Annual Meeting Proceedings', '“The Second Life: From Waste to Oasis — Sankofa Bamboo Green House”, Convergence / Divergence', 'https://www.acsa-arch.org/chapter/the-second-life-from-waste-to-oasis-sankofa-bamboo-green-house/'],
  ['2025', 'Exhibition', 'after school · Carnegie Museum of Art', 'A bamboo “urban classroom” by Ayanna Jones and Vicky Achnani, Heinz Architectural Center, Aug 2025 – Jan 2026', 'https://www.e-flux.com/education/features/6732748/a-place-for-everyone-after-school'],
  ['2025', 'Funding', 'Frank-Ratchye Further Fund', 'Grant from the Frank-Ratchye STUDIO for Creative Inquiry, Carnegie Mellon', 'https://studioforcreativeinquiry.org/project/second-life-from-waste-to-oasis'],
  ['2024 – 25', 'Funding', 'PJ Dick Innovation Fund', 'Project grants in 2024 and 2025, Carnegie Mellon School of Architecture', 'https://www.architecture.cmu.edu/works/pj-dick-innovation-fund-project-grant-second-life-waste-oasis'],
  ['2024', 'Funding', 'Isabel Sophia Liceaga Discretionary Fund', '$3,000 to retool the bamboo pavilion for the Sankofa garden in Homewood', 'https://www.architecture.cmu.edu/news/announcing-recipients-fall-2024-architecture-awards'],
  ['2023', 'Research', 'Bamboo research pavilion', '$3,000 Liceaga Fund award for prototyping the bamboo spanning system with robotic arms and steam bending', 'https://cmu-soa-archive.squarespace.com/news-archive/2023/11/17/announcing-the-winners-of-the-fall-2023-awards']
];
const sankofaContribution = [
  'Designed 10+ original joinery details with structural engineer John M. Schneider, P.E.',
  'Supported wind and gravity testing with Intertek, and zoning and permitting with the City of Pittsburgh.',
  'Turned community interviews into changes to the interior layout, furniture and environmental strategies.',
  'Presented the project to USDA staff, supporting a $4,000 annual award and eligibility for an $8,000 implementation award in 2027.'
];
const sankofaContributionMarkup = isSankofaProject ? `<div class="project-contribution" aria-labelledby="contribution-title">
      <p id="contribution-title">MY CONTRIBUTION · JUN 2026—PRESENT</p>
      <ol>${sankofaContribution.map(line => `<li>${line}</li>`).join('')}</ol>
    </div>` : '';
const sankofaRecognitionMarkup = isSankofaProject ? `<div class="project-recognition" aria-labelledby="recognition-title">
      <p id="recognition-title">PROJECT RECOGNITION</p>
      <ul>${sankofaRecognition.map(([year, kind, title, detail, href]) => `<li><time>${year}</time><span class="recognition-kind">${kind}</span><span class="recognition-copy"><b>${title}</b> ${detail}</span>${href ? `<a href="${href}" target="_blank" rel="noreferrer" aria-label="Source: ${title}">↗</a>` : '<i></i>'}</li>`).join('')}</ul>
    </div>` : '';
const impactHeading = isSankofaProject
  ? 'Moving the Sankofa Bamboo Greenhouse from research prototype to full-scale construction.'
  : project.summary;
const impactCopy = isSankofaProject
  ? 'Presented the project to USDA staff and designed more than 10 original joinery details with structural engineer John M. Schneider, P.E.'
  : 'The work leaves a record of what changed, what was learned, and what the next decision can build on.';
const impactStats = isSankofaProject
  ? [['ACSA', '2026 best design project'], ['CMOA', '2025 exhibition'], ['10+', 'unique joinery details']]
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

// Sankofa: the case study told the way the PD pages tell theirs (cm-* from
// hci/cmused/cmused.css): short sections, each a headline, a little prose and
// the pictures that belong to it. (The earlier photo-by-photo layout is in
// archive/sankofa-layout-v1.)
const skImg = (file, alt) => `<img src="../assets/portfolio/${file}" alt="${alt}" loading="lazy" decoding="async">`;
const sankofaBodyMarkup = isSankofaProject ? `<div class="cm sk" id="case-study">
    <section class="cm-section" data-rail="WHY" aria-labelledby="sk-why">
      <header class="cm-section-head"><h2 id="sk-why">A greenhouse built by many hands.</h2></header>
      <div class="cm-prose">
        <p>The Sankofa Bamboo Greenhouse is an experimental bamboo structure for Sankofa Village Community Garden and Farms in Homewood, Pittsburgh. Its path to construction runs through community priorities, bamboo research, structural testing, city approvals, funding and fabrication.</p>
        <p>The project began in 2023. Since June 2026 my part has been the joinery, the testing and permitting, and carrying what the community tells us back into the design.</p>
      </div>
      <figure class="sk-wide">${skImg('sankofa-project-team.webp', 'The Sankofa project team with the community partner')}<figcaption>The project team with our community partner</figcaption></figure>
    </section>

    <section class="cm-section" data-rail="BUILD" aria-labelledby="sk-build">
      <header class="cm-section-head"><h2 id="sk-build">From prototype to full scale.</h2></header>
      <p class="cm-intro">Bamboo raised structural questions that drawings alone could not answer, so the work moved through physical joints, engineering review and testing before anything was built at full size.</p>
      <ol class="cm-steps sk-steps">
        <li><figure>${skImg('sankofa-joinery-detail.webp', 'A custom bamboo connection in plywood and metal')}</figure><span>01</span><b>Joinery.</b><p>${sectionCopy[2][1]}</p></li>
        <li><figure>${skImg('sankofa-joinery-network.webp', 'Bamboo members and custom joints during prototyping')}</figure><span>02</span><b>Prototype.</b><p>The joints tested together as a network, so each connection could be checked in the structure it belongs to.</p></li>
        <li><figure>${skImg('sankofa-build-progress.webp', 'The bamboo prototype growing into a full-scale structure')}</figure><span>03</span><b>Test and permit.</b><p>${sectionCopy[0][1]}</p></li>
        <li><figure>${skImg('sankofa-full-scale-assembly.webp', 'The greenhouse assembled at full scale in the workshop')}</figure><span>04</span><b>Full scale.</b><p>The greenhouse assembled at full scale, moving from prototype toward construction on site.</p></li>
      </ol>
    </section>

    <section class="cm-section" data-rail="COMMUNITY" aria-labelledby="sk-community">
      <header class="cm-section-head"><h2 id="sk-community">The community in the room.</h2></header>
      <p class="cm-intro">The people who will use the greenhouse helped shape it. What we heard was treated as a design input, next to the structural and delivery constraints.</p>
      <ol class="cm-steps sk-steps sk-steps-3">
        <li><figure>${skImg('sankofa-community-presentation.webp', 'Presenting the greenhouse model at Sankofa Village')}</figure><span>01</span><b>Present.</b><p>${sectionCopy[3][1]}</p></li>
        <li><figure>${skImg('sankofa-community-dialogue.webp', 'Talking the design through with the clients around the model')}</figure><span>02</span><b>Listen.</b><p>${sectionCopy[4][1]}</p></li>
        <li><figure>${skImg('sankofa-design-review.webp', 'Students and the community partner reviewing the model together')}</figure><span>03</span><b>Respond.</b><p>${sectionCopy[5][1]}</p></li>
      </ol>
    </section>

    <section class="cm-section" data-rail="IMPACT" aria-labelledby="sk-impact">
      <header class="cm-section-head"><h2 id="sk-impact">Where it stands.</h2></header>
      <dl class="cm-grid cm-grid-3">${impactStats.map(([value, label]) => `<div class="cm-cell"><dt>${label}</dt><dd><b>${value}</b></dd></div>`).join('')}</dl>
    </section>
  </div>` : '';

// PM page: the teaching assistant position, after the Sankofa project.
const taCrews = ['CNC routing', '3D printing', 'Metal preparation', 'Joinery fabrication', 'Assembly'];
const taDuties = [
  ['Plan', 'Split the class into five fabrication crews and gave each student a clear responsibility.'],
  ['Coordinate', 'Coordinated the work across the crews, from cutting and printing parts to final assembly.'],
  ['Review', 'Checked the quality of the work, solved technical problems, and made sure tools were used safely.']
];
const taBodyMarkup = isTaProject ? `<section class="pm-teaching" id="case-study" aria-label="The course">
    <p class="pm-teaching-kicker">02 / THE COURSE</p>
    <p class="pm-teaching-lede">I am the teaching assistant for the whole course. Most of the course is hands-on fabrication, so most of the job is running a team of 14 students through it: who makes what, in what order, and to what standard.</p>
    <div class="pm-teaching-crews">
      <p class="pm-teaching-label"><b>14</b> students, five crews</p>
      <ol>${taCrews.map((name, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><b>${name}</b></li>`).join('')}</ol>
    </div>
    <ol class="pm-teaching-duties">${taDuties.map(([title, text]) => `<li><b>${title}.</b><p>${text}</p></li>`).join('')}</ol>
  </section>` : '';

// The PM page itself: the projects as preview windows, two to a row, as on
// the PD page. Each window is a short loop of pictures (data-pm-loop).
const pmIndex = [
  { slug: 'sankofa-multi-stakeholder-delivery', title: 'Sankofa Bamboo Greenhouse', line: 'a community greenhouse, from research prototype to full-scale construction', meta: 'Project designer · Community · 2023—Present',
    images: [['sankofa-full-scale-assembly.webp', 'The bamboo greenhouse assembled at full scale in the workshop'], ['sankofa-joinery-network.webp', 'Bamboo joinery network with metal connectors'], ['sankofa-community-presentation.webp', 'Presenting the greenhouse model to the community at Sankofa Village']] },
  { slug: 'teaching-assistant', title: 'Fabrication Team Lead', line: 'leading 14 students through a fabrication course', meta: 'Teaching Assistant',
    images: [['sankofa-fabrication-sequence.webp', 'Fabrication sequence drawing: harvesting, splitting, planing, bending and assembling bamboo']], drawing: true }
];
const pmIndexMarkup = isPmLanding ? `<section class="pm-work" id="work" aria-label="Selected leadership work">
    <div class="pm-grid">${pmIndex.map(item => `
      <article class="pm-project${item.drawing ? ' is-drawing' : ''}" aria-labelledby="pm-${item.slug}-title">
        <a class="pm-plate" href="../project/?lens=pm&project=${item.slug}" data-route data-route-label="PM / ${item.title.toUpperCase()}" tabindex="-1" aria-hidden="true">
          <span class="pm-window" data-pm-loop>${item.images.map(([image, alt], index) => `<img src="../assets/portfolio/${image}" alt="${alt}" decoding="async"${index ? ' loading="lazy"' : ''}>`).join('')}</span>
        </a>
        <div class="pm-card-cap">
          <h3 id="pm-${item.slug}-title"><a href="../project/?lens=pm&project=${item.slug}" data-route data-route-label="PM / ${item.title.toUpperCase()}">${item.title}</a><span>: ${item.line}</span></h3>
          <p>${item.meta}</p>
        </div>
      </article>`).join('')}
    </div>
  </section>` : '';

const pmLandingHeroMarkup=isPmLanding?`
  <section class="pm-spatial-hero" aria-label="Projects and leadership">
    <div class="pm-spatial-field" data-pm-spatial aria-hidden="true"><canvas class="pm-spatial-canvas"></canvas></div>
    <p class="pm-spatial-kicker">10⁰ / LEADERSHIP<br>DECISIONS · TEAMS · DELIVERY</p>
    <h1 class="pm-spatial-title" aria-label="Projects"><span data-pm-title-type></span></h1>
  </section>`:'';

document.body.dataset.lens = lensKey;
document.body.style.setProperty('--project-accent', lens.accent);
document.body.style.setProperty('--project-index', projectIndex);
document.title = `${project.title} — Zihe Huang`;
document.querySelector('meta[name="description"]')?.setAttribute('content', `${project.title}: ${project.summary}`);
document.querySelector('.transition-label').textContent = `PROJECT / ${project.no}`;
document.getElementById('project-coordinates').innerHTML = isPmLanding
  ? `${lens.code} / ${lens.name.toUpperCase()}<br />PROJECTS / DELIVERY`
  : `${lens.code} / ${lens.name.toUpperCase()}<br />${project.no} / PROJECT RECORD`;
document.getElementById('project-index-copy').textContent = lens.copy;
document.querySelector(`[data-lens-link="${lensKey}"]`)?.setAttribute('aria-current', 'page');

document.getElementById('project-root').innerHTML = isPmLanding ? `${pmLandingHeroMarkup}${pmIndexMarkup}` : `
  <section class="project-gateway${isPdfPortfolioProject ? ' project-gateway-pdf' : ''}${isSplitProject ? ' project-gateway-split' : ''}" id="top">
    <div class="project-gateway-grid" aria-hidden="true"></div>
    <p class="project-gateway-kicker">01 / WORK GATEWAY<br>${lens.code} / ${lens.name.toUpperCase()}</p>
    ${`<a class="project-back" href="${lensHref}#experience" data-route data-route-label="${lens.name.toUpperCase()}" data-return-anchor="experience">← Selected work</a>`}
    <div class="project-gateway-heading">
      ${isSplitProject ? '' : `<span>${project.no} / ${project.type}</span>`}
      <h1>${project.title}</h1>
      ${lensKey === 'architecture' ? (sourceOverview ? `<p class="project-hook">${sourceOverview}</p>` : '') : `<p class="project-hook">${project.summary}</p>`}
    </div>
    ${isSplitProject ? (() => { const side = isTaProject ? taHeroSide : sankofaHeroSide; const alt = isTaProject ? taHeroSideAlt : sankofaHeroSideAlt; return `<figure class="project-hero-side${side ? '' : ' is-empty'}${isTaProject ? ' is-drawing' : ''}" data-hero-side>${side ? `<img src="../assets/portfolio/${side}" alt="${alt}" fetchpriority="high" decoding="async">` : '<span aria-hidden="true">IMAGE</span>'}</figure>`; })() : ''}
    ${lensKey === 'pm' && !isSankofaProject && !isTaProject ? `<figure class="project-hero-media project-hero-media-pm"><img src="../assets/portfolio/${projectMedia[0]}" alt="${mediaAlt(0)}" fetchpriority="high"></figure>` : ''}
    ${lensKey === 'architecture' ? '' : `<dl class="project-gateway-meta">
      <div><dt>Role</dt><dd>${project.role}</dd></div>
      <div><dt>Time</dt><dd>${projectTime}</dd></div>
      <div><dt>${projectMetaLabel}</dt><dd>${projectMetaValue}</dd></div>
      ${projectInstructor ? `<div><dt>Instructor</dt><dd>${projectInstructor}</dd></div>` : ''}
    </dl>`}
    ${lensKey !== 'pm' && !isInProgressArchitecture && !isPdfPortfolioProject ? `<figure class="project-hero-media"><img src="../assets/portfolio/${projectMedia[0]}" alt="${mediaAlt(0)}" fetchpriority="high"></figure>` : ''}
    <div class="project-aperture aperture-${lensKey}" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span>
      <strong>${project.no}</strong><em>${lens.code}</em>
    </div>
    ${sankofaContributionMarkup}
    ${sankofaRecognitionMarkup}
    ${lensKey === 'architecture' ? '' : '<a class="project-enter" href="#case-study" aria-label="Continue to case study"><i>↓</i></a>'}
  </section>

  ${lensKey === 'architecture' || isSankofaProject || isTaProject ? '' : `<section class="case-framing" id="case-study">
    <p class="case-framing-index">02 / FRAMING<br>QUESTION → POSITION → METHOD</p>
    <div class="case-framing-copy">
      <p class="case-framing-lede">${project.question}</p>
      <p>${project.summary}</p>
      <p>I worked as ${project.role.toLowerCase()}, turning research and constraints into a clear sequence of decisions that people could understand and use.</p>
      <p class="case-process"><span>WORKING SEQUENCE</span>${processSteps}</p>
    </div>
  </section>`}

  ${sankofaBodyMarkup}

  ${lensKey === 'architecture' || isTaProject || isSankofaProject ? '' : `<section class="case-sections" id="case-study" aria-label="Project case study">
    ${isSankofaProject ? '' : '<div class="case-sections-intro"><span>03 / CASE STUDY</span><h2>From question to a working direction.</h2></div>'}
    ${sectionMedia.map((image, index) => `
      <article class="case-section gateway-reveal">
        <div class="case-section-copy">
          <p class="case-section-index">03.${String(index + 1).padStart(2, '0')} / ${sectionCopy?.[index]?.[0] || project.tags[index % project.tags.length] || project.type}</p>
          <h3>${sectionHeadline(index)}</h3>
          <p>${sectionCopy?.[index]?.[1] || project.evidence[index % project.evidence.length]}</p>
        </div>
        <figure class="case-section-media"><img src="../assets/portfolio/${image}" alt="${mediaAlt(index + 1)}" loading="lazy" decoding="async"><figcaption>${mediaCaptions[index + 1] || mediaAlt(index + 1)}</figcaption></figure>
      </article>`).join('')}
  </section>`}

  ${lensKey === 'architecture' || isTaProject || isSankofaProject ? '' : `<section class="case-impact">
    <p class="case-framing-index">04 / IMPACT</p>
    <div class="case-impact-copy"><h2>${impactHeading}</h2><p>${impactCopy}</p></div>
    <div class="case-impact-stats">${impactStats.map(([value, label]) => `<div><b>${value}</b><span>${label}</span></div>`).join('')}</div>
  </section>`}

  ${isTaProject ? '' : isSankofaProject ? `<section class="project-gallery project-gallery-strip sk-gallery" aria-label="Drawings">
    <header><h2>Drawings.</h2><p>The fabrication sequence and the long elevation. Drag to move through them.</p></header>
    <div class="strip-viewport" data-strip tabindex="0" aria-label="Drawings. Drag, or use the arrow keys, to move through them.">
      <div class="strip-track">${sankofaStrip.map(([image, caption], index) => `
        <figure class="gallery-item strip-item"><img src="../assets/portfolio/${image}" alt="${caption}" loading="lazy" decoding="async" draggable="false"><figcaption><span>${String(index + 1).padStart(2, '0')} / ${String(sankofaStrip.length).padStart(2, '0')}</span><b>${caption}</b></figcaption></figure>`).join('')}
      </div>
    </div>
    <div class="strip-status" aria-hidden="true"><span><i></i></span><b>DRAG →</b></div>
  </section>` : isInProgressArchitecture ? `<section class="project-in-progress" aria-label="Project status"><p>2026 / IN PROGRESS</p><h2>Work in progress.</h2><span>More from this project will be shared soon.</span></section>` : `<section class="project-gallery ${isPdfPortfolioProject ? 'project-gallery-pdf' : ''}" aria-label="Additional project visuals">
    ${lensKey === 'architecture' ? '' : '<header><span>05 / VISUAL RECORD</span><h2>Additional drawings, studies, and artifacts.</h2></header>'}
    <div class="project-gallery-grid">${lensKey === 'architecture' ? architectureGalleryMarkup : projectMedia.slice(1 + sectionCount).map((image, index) => `
      <figure class="gallery-item gallery-item-${index + 1}"><img src="../assets/portfolio/${image}" alt="${mediaAlt(index + 1 + sectionCount)}" loading="lazy" decoding="async"><figcaption><span>${String(index + 1 + sectionCount).padStart(2, '0')} / ${project.no}</span>${mediaCaptions[index + 1 + sectionCount] ? `<b>${mediaCaptions[index + 1 + sectionCount]}</b>` : ''}</figcaption></figure>`).join('')}
    </div>
  </section>`}

  ${taBodyMarkup}

  ${isPmLanding ? '' : `<nav class="project-sequence" aria-label="Project navigation">
    <a href="${projectHref(previous)}" data-route data-route-label="PROJECT / ${previous.title.toUpperCase()}"><span>Previous</span><b>← ${previous.title}</b></a>
    <a class="project-sequence-index" href="${lensHref}#experience" data-route data-route-label="${lens.name.toUpperCase()}" data-return-anchor="experience"><span>${lens.short}</span><b>All selected work</b></a>
    <a href="${projectHref(next)}" data-route data-route-label="PROJECT / ${next.title.toUpperCase()}"><span>Next</span><b>${next.title} →</b></a>
  </nav>`}`;

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

window.addEventListener('pageshow', event => {
  if (event.persisted) routing = false;
});
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
  }, 913);
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
    requestAnimationFrame(() => window.setTimeout(() => location.assign(url), 135));
  }, 616);
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

// The visual record strip (Sankofa): drag sideways with the mouse, swipe on
// touch, shift-scroll or use the arrow keys. A drag that moves does not open
// the picture; a plain click still opens it in the viewer.
const strip = document.querySelector('[data-strip]');
if (strip) {
  const section = strip.closest('.project-gallery-strip');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursorLabel = text => {
    const cursor = document.querySelector('.fx-cursor');
    const label = cursor?.querySelector('span');
    if (!cursor || !label) return;
    label.textContent = text;
    cursor.classList.add('is-action', 'is-label');
  };
  let dragging = false, moved = false, suppress = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, velocity = 0, glide = 0;
  const progress = () => {
    const max = strip.scrollWidth - strip.clientWidth;
    section.style.setProperty('--strip-progress', max > 0 ? (strip.scrollLeft / max).toFixed(4) : '1');
  };
  const coast = () => {
    velocity *= .94;
    if (Math.abs(velocity) < .05) { glide = 0; return; }
    strip.scrollLeft += velocity * 16;
    glide = requestAnimationFrame(coast);
  };
  strip.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || event.button !== 0) return;
    cancelAnimationFrame(glide);
    dragging = true; moved = false;
    startX = lastX = event.clientX; startLeft = strip.scrollLeft; lastT = performance.now(); velocity = 0;
  });
  strip.addEventListener('pointermove', event => {
    if (!dragging) return;
    const delta = event.clientX - startX;
    if (!moved && Math.abs(delta) > 5) { moved = true; strip.classList.add('is-dragging'); strip.setPointerCapture(event.pointerId); }
    if (!moved) return;
    const now = performance.now();
    strip.scrollLeft = startLeft - delta;
    velocity = Math.max(-3, Math.min(3, (lastX - event.clientX) / Math.max(8, now - lastT)));
    lastX = event.clientX; lastT = now;
  });
  const release = () => {
    if (!dragging) return;
    dragging = false; suppress = moved;
    strip.classList.remove('is-dragging');
    if (moved && !reducedMotion && Math.abs(velocity) > .05) glide = requestAnimationFrame(coast);
  };
  strip.addEventListener('pointerup', release);
  strip.addEventListener('pointercancel', release);
  strip.addEventListener('click', event => {
    if (!suppress) return;
    suppress = false;
    event.preventDefault(); event.stopImmediatePropagation();
  }, true);
  strip.addEventListener('wheel', event => {
    if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    strip.scrollLeft += event.deltaX || event.deltaY;
  }, { passive: false });
  strip.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const step = strip.clientWidth * .6;
    const left = event.key === 'Home' ? 0 : event.key === 'End' ? strip.scrollWidth : strip.scrollLeft + (event.key === 'ArrowLeft' ? -step : step);
    strip.scrollTo({ left, behavior: reducedMotion ? 'auto' : 'smooth' });
  });
  strip.addEventListener('scroll', progress, { passive: true });
  addEventListener('resize', progress);
  strip.addEventListener('pointerover', event => { if (event.pointerType === 'mouse') { cursorLabel('DRAG'); requestAnimationFrame(() => cursorLabel('DRAG')); } });
  strip.addEventListener('pointerleave', () => document.querySelector('.fx-cursor')?.classList.remove('is-action', 'is-label'));
  progress();
}

// PM page: each preview window cycles through its pictures while on screen.
document.querySelectorAll('[data-pm-loop]').forEach(loop => {
  const frames = [...loop.querySelectorAll('img')];
  let index = 0, timer = 0;
  const show = next => { frames.forEach((frame, i) => frame.classList.toggle('is-shown', i === next)); index = next; };
  show(0);
  if (frames.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const tick = () => { show((index + 1) % frames.length); timer = setTimeout(tick, 3600); };
  new IntersectionObserver(entries => {
    clearTimeout(timer);
    if (entries[0].isIntersecting) timer = setTimeout(tick, 3600);
  }, { threshold: .25 }).observe(loop);
});
