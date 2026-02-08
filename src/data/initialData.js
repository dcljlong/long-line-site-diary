export const initialSites = [];
export const initialTasks = [];

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
