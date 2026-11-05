/* ==========================================================================
   NALEDI_DATA — Central content registry
   --------------------------------------------------------------------------
   Paths are ROOT-relative ("pages/x.html" or full https URLs).
   app.js's resolveHref() converts them to work from any page depth.

   Contact numbers and staff names are drawn from the live Naledi website
   and official municipal directories. Verify all details with the
   municipality before public launch.
   ========================================================================== */

window.NALEDI_DATA = {
  /* ------------------------------------------------------------------ */
  /*  MENUS                                                              */
  /* ------------------------------------------------------------------ */
  menus: {
    municipality: [
      { title: "About the municipality", links: [
        ["Overview",        "pages/about.html"],
        ["Management",      "pages/management.html"],
        ["Stella offices",  "pages/stella-offices.html"]
      ]},
      { title: "Council & leadership", links: [
        ["Executive committee", "pages/council.html"],
        ["Office of the Mayor", "pages/mayor.html"],
        ["Office of the Speaker","pages/speaker.html"],
        ["Councillors",         "pages/councillors.html"]
      ]},
      { title: "Community", links: [
        ["Public participation","pages/public-participation.html"],
        ["Council meetings",    "pages/council-meetings.html"],
        ["Tourism",             "pages/tourism.html"]
      ]}
    ],

    services: [
      { title: "Resident services", links: [
        ["Water & sanitation",           "pages/water-services.html"],
        ["Electricity",                  "pages/electricity.html"],
        ["Housing & human settlements",  "pages/housing.html"],
        ["Waste management",             "pages/waste-management.html"]
      ]},
      { title: "Municipal operations", links: [
        ["Municipal accounts",         "pages/municipal-accounts.html"],
        ["Emergency services",         "pages/emergency-services.html"],
        ["Town planning",              "pages/town-planning.html"],
        ["Property administration",    "pages/property-administration.html"]
      ]},
      { title: "Business & opportunities", links: [
        ["Tenders",       "pages/tenders.html"],
        ["Vacancies",     "pages/vacancies.html"],
        ["Revenue forms", "pages/forms.html"]
      ]}
    ],

    governance: [
      { title: "Municipal leadership", links: [
        ["Executive committee",   "pages/executive-committee.html"],
        ["Mayor's office",        "pages/mayor-office.html"],
        ["Speaker's office",      "pages/speaker-office.html"]
      ]},
      { title: "Administration", links: [
        ["Departments",           "pages/departments.html"],
        ["Municipal manager",     "pages/municipal-manager.html"],
        ["Budget & treasury",     "pages/budget-treasury.html"]
      ]},
      { title: "Accountability", links: [
        ["MPAC",                  "pages/mpac.html"],
        ["Performance management","pages/performance-management.html"],
        ["Batho Pele principles", "pages/batho-pele.html"]
      ]}
    ],

    resources: [
      { title: "Planning & performance", links: [
        ["IDP",                   "pages/idp.html"],
        ["Annual plans",          "pages/annual-plans.html"],
        ["SDBIP",                 "pages/sdbip.html"],
        ["Performance agreements","pages/performance-agreements.html"]
      ]},
      { title: "Finance & reports", links: [
        ["Budgets",              "pages/budgets.html"],
        ["Annual reports",       "pages/annual-reports.html"],
        ["Financial statements", "pages/financial-statements.html"],
        ["Tariffs",              "pages/tariffs.html"]
      ]},
      { title: "Public information", links: [
        ["Public notices", "pages/public-notices.html"],
        ["Tenders",        "pages/tenders.html"],
        ["Vacancies",      "pages/vacancies.html"],
        ["Policies",       "pages/policies.html"],
        ["Forms",          "pages/forms.html"],
        ["Valuation roll", "pages/valuation-roll.html"]
      ]}
    ]
  },

  /* ------------------------------------------------------------------ */
  /*  SEARCH INDEX                                                       */
  /* ------------------------------------------------------------------ */
  searchIndex: [
    // Municipality
    ["About Naledi",                    "About the municipality, overview, location, vision, mandate, communities", "pages/about.html"],
    ["Municipal management",            "Management, administration, departments, municipal manager",               "pages/management.html"],
    ["Stella offices",                  "Stella satellite office, service points outside Vryburg",                  "pages/stella-offices.html"],
    ["Council and leadership",          "Council, executive committee, political leadership, MPAC",                 "pages/council.html"],
    ["Office of the Mayor",             "Mayor, executive leadership, political head",                              "pages/mayor.html"],
    ["Office of the Speaker",           "Speaker, council chair, oversight, code of conduct",                       "pages/speaker.html"],
    ["Councillors",                     "Elected representatives, ward councillors, constituency",                  "pages/councillors.html"],
    ["Public participation",            "Public participation, community meetings, comment, petitions, ward committees", "pages/public-participation.html"],
    ["Council meetings",                "Council meetings, agendas, minutes, schedule, attendance",                 "pages/council-meetings.html"],
    ["Tourism",                         "Tourism, attractions, visitors, heritage, accommodation",                  "pages/tourism.html"],

    // Services
    ["Water and sanitation",          "Water services, sanitation, water problems, leaks and service information", "pages/water-services.html"],
    ["Electricity",                   "Electricity, power, electrical faults, connections, prepaid meters",        "pages/electricity.html"],
    ["Housing and human settlements", "Housing, title deeds, human settlements, property administration",         "pages/housing.html"],
    ["Waste management",              "Refuse collection, waste, recycling, illegal dumping, landfill",           "pages/waste-management.html"],
    ["Municipal accounts",            "Billing, payments, tariffs, account queries, indigent support",            "pages/municipal-accounts.html"],
    ["Emergency services",            "Fire, rapid response, emergency contacts, safety",                         "pages/emergency-services.html"],
    ["Town planning",                 "Town planning, building plans, rezoning, zoning, land use management",      "pages/town-planning.html"],
    ["Property administration",       "Property administration, leases, municipal property, land register",      "pages/property-administration.html"],

    // Governance
    ["Executive committee",  "Executive committee, EXCO, political leadership",                                 "pages/executive-committee.html"],
    ["Mayor's office",       "Mayor, executive leadership, political head",                                     "pages/mayor-office.html"],
    ["Speaker's office",     "Speaker, council chair, oversight",                                               "pages/speaker-office.html"],
    ["Departments",          "Municipal departments, administration, executive directors",                      "pages/departments.html"],
    ["Municipal manager",    "Municipal manager, accounting officer, administration head",                      "pages/municipal-manager.html"],
    ["Budget and treasury",  "Budget, treasury, finance, revenue, MFMA, financial statements",                  "pages/budget-treasury.html"],
    ["MPAC",                 "Municipal Public Accounts Committee, oversight, Auditor-General, accountability", "pages/mpac.html"],
    ["Performance management","Performance management, SDBIP, KPIs, reporting, IDP delivery",                   "pages/performance-management.html"],
    ["Batho Pele",           "Batho Pele, people first, service principles, public service",                    "pages/batho-pele.html"],

    // Resources
    ["Integrated Development Plan", "IDP, development planning, strategic plan, community priorities",       "pages/idp.html"],
    ["Annual plans",                "Annual plan, planning documents, annual cycle",                         "pages/annual-plans.html"],
    ["SDBIP",                       "Service Delivery and Budget Implementation Plan, SDBIP, KPIs, targets",  "pages/sdbip.html"],
    ["Performance agreements",      "Performance agreements, senior managers, KPIs",                         "pages/performance-agreements.html"],
    ["Budgets",                     "Budget, MTREF, adjustment budget, budget statements",                   "pages/budgets.html"],
    ["Annual reports",              "Annual report, performance, year-end, accountability",                 "pages/annual-reports.html"],
    ["Financial statements",        "Financial statements, audited, Auditor-General, GRAP",                  "pages/financial-statements.html"],
    ["Tariffs",                     "Tariffs, rates, water, electricity, refuse, charges",                   "pages/tariffs.html"],
    ["Policies",                    "Policies, by-laws, financial policies, HR policies",                    "pages/policies.html"],
    ["Forms",                       "Forms, applications, municipal forms, account queries",                 "pages/forms.html"],
    ["Valuation roll",              "Valuation roll, property valuation, rates, objections",                 "pages/valuation-roll.html"],

    // News / public information
    ["Tenders and procurement", "Tender opportunities, procurement, suppliers, bids",     "pages/tenders.html"],
    ["Vacancies",               "Jobs, careers, employment opportunities",                 "pages/vacancies.html"],
    ["Public notices",          "Notices, announcements, public comment, deadlines",      "pages/public-notices.html"],
    ["News and notices",        "Latest news, announcements, service updates, notices",   "pages/news.html"],

    // Contact
    ["Contact municipality", "Phone, email, address, office hours, enquiry form",         "pages/contact.html"],

    // External reference
    ["Official Naledi site", "Official Naledi municipality website and external resources", "https://www.naledilm.co.za/"]
  ],

  /* ------------------------------------------------------------------ */
  /*  CHATBOT KNOWLEDGE                                                  */
  /*  Includes verified details from the live Naledi website.            */
  /* ------------------------------------------------------------------ */
  knowledge: [
    // === CONTACT (verified from live site) ===
    { keys: ["contact", "phone", "call", "telephone", "email", "address", "where are you", "switchboard"],
      answer: "Naledi Local Municipality: 19A Market Street, Vryburg, 8600. Tel: 053 928 2200. Email: info@naledigov.co.za (or info@naledilm@gmail.com per the Local Government Handbook). Web: www.naledilm.co.za. Office hours: Mon–Fri, 07:30–16:00. Full contact page: pages/contact.html" },

    { keys: ["water department", "water contact", "water number", "report water", "water leak", "burst pipe", "no water"],
      answer: "Water department: 053 928 2254 (Mr L Pretorius, pretoriusl@naledi.local.gov.za). Rapid response: 053 928 2252. Full details: pages/water-services.html" },

    { keys: ["electricity department", "power contact", "electricity number", "electrical fault"],
      answer: "Electricity: 053 927 2267 (Mr G Sehloho, sehlohog@naledi.local.gov.za). Eskom: 0860 037 566. Full details: pages/electricity.html" },

    { keys: ["refuse department", "waste contact", "rubbish collection", "missed collection"],
      answer: "Refuse & Waste: 053 927 0007 (Ms M Talane, talanem@naledi.local.gov.za). Full details: pages/waste-management.html" },

    { keys: ["accounts department", "billing contact", "account query", "pay account"],
      answer: "Accounts: 053 928 2320 (Ms S Morrison, morrisons@naledi.local.gov.za). Full details: pages/municipal-accounts.html" },

    { keys: ["roads department", "road maintenance", "pothole"],
      answer: "Roads: 053 928 2207 (Mr R Mokoen, mokoenar@naledi.local.gov.za)." },

    { keys: ["service delivery", "service request"],
      answer: "Service Delivery: 071 412 3574 (Mr L Plaatjie, plaatjiel@naledi.local.gov.za). Also Assistant Manager: Rapid Response and Complaints — Mr Luke Plaatjie, 053 928 2241, plaatjiel@naledi.local.gov.za." },

    { keys: ["municipal manager", "accounting officer", "MM"],
      answer: "Municipal Manager (Acting): Ms Excinia Makgahlela. The Municipal Manager is the Accounting Officer and heads the administration. Office: pages/municipal-manager.html" },

    { keys: ["mayor", "who is the mayor"],
      answer: "Mayor: Mr CJ Groep (Mayor and Chairperson: Executive Committee). See pages/mayor.html. Note: the municipality has been under S139 administration since January 2022." },

    { keys: ["speaker", "who is the speaker"],
      answer: "Speaker: Mr PGC Gulane. See pages/speaker.html." },

    { keys: ["cfo", "chief financial officer"],
      answer: "Chief Financial Officer: Mr Kagisho Maruping." },

    { keys: ["town planning contact", "town planner", "building plans", "rezoning", "zoning"],
      answer: "Town Planning: Mr Arnold Manamela (Manager), 053 928 2257. Town & Regional Planners: Mrs Nthabiseng Ikaneng and Mr Tshiamo Lecoge, 053 928 2311. Full details: pages/town-planning.html" },

    { keys: ["housing contact", "human settlement", "title deed", "housing application"],
      answer: "Human Settlement Unit: Assistant Manager Mr Neo Mokomela, 053 928 2361, mokomelen@naledigov.co.za. Services include housing provision, beneficiary management, site permits and title deeds. Full details: pages/housing.html" },

    { keys: ["property administration contact", "lease", "municipal property"],
      answer: "Property administration information is on pages/property-administration.html. For enquiries, call 053 928 2200." },

    // === GENERAL ===
    { keys: ["tender", "procurement", "supplier", "bid", "rfq"],
      answer: "Tender information is on pages/tenders.html. Always read the advert itself for closing dates, briefings and submission requirements." },

    { keys: ["vacancy", "job", "career", "employment", "hire", "recruit"],
      answer: "Vacancies are listed on pages/vacancies.html. The live site (www.naledilm.co.za) also publishes adverts with closing dates." },

    { keys: ["emergency", "fire", "rapid response", "crime", "police", "ambulance"],
      answer: "Local: General 053 928 2200 (24h), Rapid response 053 928 2252, Fire 053 928 2295/78, Crime patrollers 053 928 2225. National: Police 10111, Ambulance 10177, Cell 112. Full details: pages/emergency-services.html" },

    { keys: ["budget", "financial", "treasury", "mtref"],
      answer: "Budgets and financial documents are on pages/budgets.html. The 2023/24 total revenue was R529.263m with a deficit of R178.301m (Local Government Handbook 2025)." },

    { keys: ["idp", "development plan", "planning"],
      answer: "The IDP is on pages/idp.html. The municipality adopted its 2022–27 Spatial Development Framework. The IDP prioritises infrastructure maintenance, fiscal responsibility and inclusive governance." },

    { keys: ["sdbip", "implementation plan"],
      answer: "The SDBIP is on pages/sdbip.html." },

    { keys: ["mpac", "public accounts", "audit"],
      answer: "MPAC is on pages/mpac.html. Audit outcomes: Adverse (2022/23) and Disclaimer (2021/22) per the Local Government Handbook 2025." },

    { keys: ["batho pele", "people first"],
      answer: "Batho Pele information is on pages/batho-pele.html." },

    { keys: ["performance", "kpi"],
      answer: "Performance information is on pages/performance-management.html." },

    { keys: ["notice", "public comment", "announcement", "news"],
      answer: "Public notices: pages/public-notices.html. Latest news: pages/news.html." },

    { keys: ["policy", "policies", "by-law"],
      answer: "Policies and by-laws are on pages/policies.html." },

    { keys: ["form", "forms", "application"],
      answer: "Municipal forms are on pages/forms.html." },

    { keys: ["valuation roll", "property valuation", "objection"],
      answer: "Valuation roll information is on pages/valuation-roll.html." },

    { keys: ["tariff", "tariffs", "rates", "charges"],
      answer: "Approved tariffs are on pages/tariffs.html." },

    { keys: ["departments", "department"],
      answer: "Department overview is on pages/departments.html." },

    { keys: ["stella office", "stella"],
      answer: "Stella satellite office: pages/stella-offices.html. Stella Manager: Mrs LC Tsipane, 073 191 0088." },

    { keys: ["tourism", "visit", "attraction", "accommodation"],
      answer: "Tourism information is on pages/tourism.html." },

    { keys: ["population", "how many people", "demographics"],
      answer: "Population: 63,755 (Local Government Handbook 2025). The municipality covers 7,032 km² and is known as the 'Texas of South Africa' for its cattle and agriculture." },

    { keys: ["area", "how big", "size"],
      answer: "Naledi Local Municipality covers 7,032 km² — the second-largest of the five municipalities in the Dr Ruth Segomotsi Mompati District." },

    { keys: ["audit outcome", "auditor general"],
      answer: "Audit outcomes: Adverse (2022/23) and Disclaimer (2021/22) per the Local Government Handbook 2025. The municipality has been under S139 administration since January 2022." },

    { keys: ["s139", "administration", "under administration"],
      answer: "Yes — Naledi Local Municipality has been under S139 administration since January 2022 (Local Government Handbook 2025)." },

    { keys: ["hello", "hi", "hey", "good morning", "good afternoon"],
      answer: "Hello! I can help you find municipal contacts, services, tenders, vacancies, budgets, public notices, council and leadership information. What do you need help with?" },

    { keys: ["thank", "thanks"],
      answer: "You're welcome! If you need anything else, just ask — or call 053 928 2200." },

    { keys: ["who are you", "are you ai", "is this a bot"],
      answer: "I'm the Naledi Assistant — a demonstration keyword assistant, not a connected AI model. I can help you find municipal pages and contacts. For verified information, always confirm with the municipality on 053 928 2200." },

    { keys: ["report", "complaint", "issue", "problem"],
      answer: "To report a problem (water leak, electricity fault, refuse collection, pothole), call 053 928 2200 during office hours or rapid response on 053 928 2252. See pages/contact.html." }
  ]
};

/* Sanity check */
(function () {
  const d = window.NALEDI_DATA;
  const missing = [];
  if (!d) missing.push("NALEDI_DATA object");
  if (d && !d.menus) missing.push("menus");
  if (d && !d.searchIndex) missing.push("searchIndex");
  if (d && !d.knowledge) missing.push("knowledge");
  if (missing.length) {
    console.warn("[Naledi] data.js is missing:", missing.join(", "));
  }
})();