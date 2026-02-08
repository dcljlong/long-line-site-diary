export const initialSites = [
  {
    id: 'site-1',
    name: 'Harbor View Office Fitout',
    client: 'Maritime Investments Ltd',
    address: '42 Harbor Drive, Docklands',
    projectValue: 450000,
    startDate: '2024-01-15',
    endDate: '2024-04-30',
    priority: 'high',
    status: 'active',
    manager: 'Self',
    contactPhone: '+61 400 123 456',
    contactEmail: 'project@maritime.com',
    description: 'Complete interior fitout of Level 3 office space including reception, open plan, 6 offices, kitchen and amenities',
    milestones: [
      { id: 'm1', name: 'Demolition', status: 'completed', date: '2024-01-20' },
      { id: 'm2', name: 'Framing', status: 'completed', date: '2024-02-05' },
      { id: 'm3', name: 'Electrical Rough-in', status: 'in-progress', date: '2024-02-15' },
      { id: 'm4', name: 'Plumbing Rough-in', status: 'pending', date: '2024-02-18' },
      { id: 'm5', name: 'Drywall', status: 'pending', date: '2024-03-01' },
      { id: 'm6', name: 'Painting', status: 'pending', date: '2024-03-15' },
      { id: 'm7', name: 'Flooring', status: 'pending', date: '2024-04-01' },
      { id: 'm8', name: 'Final Fitoff', status: 'pending', date: '2024-04-20' },
    ],
    budget: {
      total: 450000,
      spent: 125000,
      remaining: 325000,
      categories: {
        labor: 85000,
        materials: 40000,
        subcontractors: 0,
        permits: 5000,
        contingency: 0
      }
    },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  },
  {
    id: 'site-2',
    name: 'Metro Retail Store',
    client: 'Fashion Forward Pty Ltd',
    address: '128 Queen Street, CBD',
    projectValue: 280000,
    startDate: '2024-02-01',
    endDate: '2024-05-15',
    priority: 'medium',
    status: 'active',
    manager: 'Self',
    contactPhone: '+61 400 789 012',
    contactEmail: 'build@fashionforward.com',
    description: 'Retail fitout with custom joinery, lighting design, and specialized flooring',
    milestones: [
      { id: 'm1', name: 'Strip Out', status: 'completed', date: '2024-02-05' },
      { id: 'm2', name: 'New Floor Screed', status: 'in-progress', date: '2024-02-12' },
      { id: 'm3', name: 'Electrical', status: 'pending', date: '2024-02-20' },
      { id: 'm4', name: 'Joinery Install', status: 'pending', date: '2024-03-10' },
      { id: 'm5', name: 'Painting', status: 'pending', date: '2024-04-01' },
      { id: 'm6', name: 'Handover', status: 'pending', date: '2024-05-10' },
    ],
    budget: { total: 280000, spent: 45000, remaining: 235000, categories: {} },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  },
  {
    id: 'site-3',
    name: 'Riverside Apartments - Unit 12',
    client: 'Private Owner',
    address: '89 Riverside Boulevard',
    projectValue: 125000,
    startDate: '2024-02-10',
    endDate: '2024-03-30',
    priority: 'low',
    status: 'active',
    manager: 'Self',
    contactPhone: '+61 412 345 678',
    contactEmail: 'owner@email.com',
    description: 'Luxury apartment renovation including kitchen, bathrooms, and living areas',
    milestones: [
      { id: 'm1', name: 'Demolition', status: 'pending', date: '2024-02-12' },
      { id: 'm2', name: 'Kitchen Install', status: 'pending', date: '2024-03-01' },
      { id: 'm3', name: 'Bathroom Works', status: 'pending', date: '2024-03-15' },
      { id: 'm4', name: 'Final Clean', status: 'pending', date: '2024-03-28' },
    ],
    budget: { total: 125000, spent: 0, remaining: 125000, categories: {} },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  },
  {
    id: 'site-4',
    name: 'Tech Hub Co-working Space',
    client: 'Innovation Spaces Inc',
    address: '77 Innovation Way, Tech Park',
    projectValue: 650000,
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    priority: 'high',
    status: 'planning',
    manager: 'Self',
    contactPhone: '+61 400 555 999',
    contactEmail: 'projects@innovationspaces.com',
    description: 'Co-working space with phone booths, meeting rooms, hot desks and event space',
    milestones: [
      { id: 'm1', name: 'Permits Approved', status: 'in-progress', date: '2024-02-28' },
      { id: 'm2', name: 'Demolition', status: 'pending', date: '2024-03-05' },
      { id: 'm3', name: 'Services Rough-in', status: 'pending', date: '2024-03-20' },
      { id: 'm4', name: 'Partitioning', status: 'pending', date: '2024-04-10' },
      { id: 'm5', name: 'Kitchen/Breakout', status: 'pending', date: '2024-05-01' },
      { id: 'm6', name: 'IT Infrastructure', status: 'pending', date: '2024-05-20' },
      { id: 'm7', name: 'Final Fitout', status: 'pending', date: '2024-06-15' },
    ],
    budget: { total: 650000, spent: 15000, remaining: 635000, categories: {} },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  },
  {
    id: 'site-5',
    name: 'Medical Centre Reception',
    client: 'HealthFirst Medical',
    address: '15 Wellness Street',
    projectValue: 195000,
    startDate: '2024-01-20',
    endDate: '2024-03-15',
    priority: 'urgent',
    status: 'active',
    manager: 'Self',
    contactPhone: '+61 400 777 888',
    contactEmail: 'facilities@healthfirst.com.au',
    description: 'Medical reception and waiting area with infection control standards',
    milestones: [
      { id: 'm1', name: 'Demolition', status: 'completed', date: '2024-01-25' },
      { id: 'm2', name: 'Infection Control Barrier', status: 'completed', date: '2024-02-01' },
      { id: 'm3', name: 'Specialized Flooring', status: 'in-progress', date: '2024-02-10' },
      { id: 'm4', name: 'Joinery', status: 'pending', date: '2024-02-20' },
      { id: 'm5', name: 'Medical Gas Install', status: 'pending', date: '2024-03-01' },
      { id: 'm6', name: 'Handover', status: 'pending', date: '2024-03-12' },
    ],
    budget: { total: 195000, spent: 78000, remaining: 117000, categories: {} },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  },
  {
    id: 'site-6',
    name: 'Restaurant Kitchen Upgrade',
    client: 'Bistro Deluxe',
    address: '56 Gourmet Lane',
    projectValue: 220000,
    startDate: '2024-02-15',
    endDate: '2024-04-01',
    priority: 'medium',
    status: 'active',
    manager: 'Self',
    contactPhone: '+61 400 333 222',
    contactEmail: 'chef@bistrodeluxe.com',
    description: 'Commercial kitchen upgrade with new exhaust, grease trap, and appliances',
    milestones: [
      { id: 'm1', name: 'Equipment Removal', status: 'completed', date: '2024-02-16' },
      { id: 'm2', name: 'Exhaust Ducting', status: 'in-progress', date: '2024-02-20' },
      { id: 'm3', name: 'Grease Trap', status: 'pending', date: '2024-02-25' },
      { id: 'm4', name: 'New Equipment', status: 'pending', date: '2024-03-10' },
      { id: 'm5', name: 'Commissioning', status: 'pending', date: '2024-03-25' },
    ],
    budget: { total: 220000, spent: 35000, remaining: 185000, categories: {} },
    diaryEntries: [],
    photos: [],
    documents: [],
    tasks: []
  }
];

export const diaryTemplate = {
  weather: {
    conditions: ['Sunny', 'Cloudy', 'Rain', 'Windy', 'Storm', 'Fog', 'Extreme Heat'],
    temperature: ''
  },
  labor: {
    totalWorkers: 0,
    trades: {
      carpenters: 0,
      electricians: 0,
      plumbers: 0,
      painters: 0,
      tilers: 0,
      laborers: 0,
      other: 0
    },
    hoursWorked: 0,
    subcontractors: []
  },
  workCompleted: {
    description: '',
    areas: [],
    percentageComplete: 0
  },
  deliveries: {
    materials: [],
    equipment: [],
    issues: ''
  },
  inspections: {
    type: '',
    inspector: '',
    result: '',
    notes: ''
  },
  issues: {
    safety: [],
    defects: [],
    delays: [],
    clientRequests: []
  },
  safety: {
    incidents: false,
    incidentDetails: '',
    toolboxTalk: false,
    talkTopic: '',
    ppeCompliance: 'good'
  },
  quality: {
    checks: [],
    photos: [],
    signOff: ''
  },
  program: {
    onTrack: true,
    delayReason: '',
    recoveryPlan: ''
  },
  communications: {
    clientMeeting: false,
    consultantCall: false,
    subcontractorMeeting: false,
    notes: ''
  },
  nextDayPlan: {
    activities: [],
    resources: [],
    specialRequirements: ''
  },
  photos: [],
  attachments: []
};

export const taskCategories = [
  { id: 'urgent', label: 'Urgent Deadline', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  { id: 'review', label: 'Review Docs', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'meeting', label: 'Client Meeting', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
  { id: 'inspection', label: 'Site Inspection', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
  { id: 'order', label: 'Order Materials', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  { id: 'submit', label: 'Submit Report', color: 'bg-teal-500', textColor: 'text-teal-700', bgColor: 'bg-teal-50' },
  { id: 'call', label: 'Call Subcontractor', color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  { id: 'permit', label: 'Permit/Legal', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' }
];

export const initialTasks = [
  { id: 't1', title: 'Submit Harbor View electrical drawings for approval', category: 'submit', siteId: 'site-1', dueDate: '2024-02-10', completed: false, priority: 'high' },
  { id: 't2', title: 'Order specialized medical flooring', category: 'order', siteId: 'site-5', dueDate: '2024-02-08', completed: false, priority: 'urgent' },
  { id: 't3', title: 'Client meeting - Metro Store design changes', category: 'meeting', siteId: 'site-2', dueDate: '2024-02-12', completed: false, priority: 'medium' },
  { id: 't4', title: 'Review kitchen equipment specifications', category: 'review', siteId: 'site-6', dueDate: '2024-02-11', completed: false, priority: 'medium' },
  { id: 't5', title: 'Site inspection - Riverside Apartments', category: 'inspection', siteId: 'site-3', dueDate: '2024-02-13', completed: false, priority: 'low' },
  { id: 't6', title: 'Call electrician about rough-in delays', category: 'call', siteId: 'site-1', dueDate: '2024-02-09', completed: false, priority: 'high' },
  { id: 't7', title: 'Submit Tech Hub DA approval', category: 'permit', siteId: 'site-4', dueDate: '2024-02-15', completed: false, priority: 'high' },
];

export const constructionFields = {
  trades: [
    'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Tiler', 
    'Plasterer', 'Flooring Specialist', 'HVAC Technician', 
    'Fire Services', 'Data/Cabling', 'Glazier', 'Steel Fixer',
    'Concretor', 'Roofing', 'Insulation', 'Waterproofer'
  ],
  equipment: [
    'Scaffold', 'Crane', 'Excavator', 'Bobcat', 'Tower Light',
    'Generator', 'Compressor', 'Welding Set', 'Concrete Pump',
    'Scissor Lift', 'Boom Lift', 'Forklift'
  ],
  materials: [
    'Timber', 'Steel', 'Concrete', 'Bricks', 'Drywall',
    'Insulation', 'Roofing', 'Windows', 'Doors', 'Flooring',
    'Tiles', 'Paint', 'Electrical', 'Plumbing', 'HVAC',
    'Fire Services', 'Data/Cabling', 'Joinery'
  ],
  inspections: [
    'Building Surveyor', 'Fire Inspector', 'Electrical Inspector',
    'Plumbing Inspector', 'Engineer', 'Access Consultant',
    'Environmental', 'OH&S Officer', 'Client Walkthrough'
  ],
  delayReasons: [
    'Weather', 'Material Shortage', 'Labor Shortage', 'Design Change',
    'Permit Delay', 'Client Decision', 'Subcontractor Issue',
    'Equipment Breakdown', 'Site Access', 'Discovery Work',
    'Utility Conflict', 'COVID/Health', 'Other'
  ]
};