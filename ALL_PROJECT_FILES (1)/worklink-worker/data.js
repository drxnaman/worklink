// ============================================================
// WorkLink Worker Portal — Mock Data (10% Worker Platform Fee)
// ============================================================

const WORKER = {
  id: 1,
  name: 'Verified Specialist',
  category: 'Plumber',
  categoryId: 'plumber',
  city: 'Delhi',
  experience: 9,
  rating: 4.9,
  reviewCount: 212,
  jobsDone: 257,
  responseTime: '~5 min',
  minRate: 350,
  maxRate: 700,
  available: true,
  color: '#E65100',
  initials: 'RK',
  phone: '+91 98765 43210',
  email: 'specialist@worklink.in',
  memberSince: 'Jan 2017',
  bio: 'Licensed master plumber with 9 years serving Delhi NCR. Available 7 days a week for quick fixes & scheduled projects. 100% genuine parts.',
  skills: ['Pipe fitting', 'Leak repair', 'Bathroom fitting', 'Drainage cleaning', 'Geyser installation', 'RO installation'],
  bankAccount: 'HDFC Bank ****4521',
};

const EMPLOYERS = {
  E1: { name: 'Priya Sharma', initials: 'PS', color: '#7B1FA2' },
  E2: { name: 'Ankit Gupta', initials: 'AG', color: '#1565C0' },
  E3: { name: 'Sunita Verma', initials: 'SV', color: '#00695C' },
  E4: { name: 'Rohit Malhotra', initials: 'RM', color: '#C62828' },
  E5: { name: 'Kavita Singh', initials: 'KS', color: '#4527A0' },
  E6: { name: 'Dinesh Rawat', initials: 'DR', color: '#37474F' },
  E7: { name: 'Neha Kapoor', initials: 'NK', color: '#AD1457' },
};

const JOB_REQUESTS = [
  {
    id: 'JR-001', employer: 'E1', status: 'pending', type: 'Quick Fix',
    title: 'Kitchen sink pipe leaking badly',
    description: 'Water leaking from under kitchen sink. Loose pipe joint causing water pooling.',
    offeredPrice: 450, date: 'Today', timeSlot: 'Immediate (30 min)',
    location: 'Lajpat Nagar, Block C, Flat 302',
    createdAt: '10 min ago',
  },
  {
    id: 'JR-002', employer: 'E2', status: 'pending', type: 'Scheduled',
    title: 'Bathroom tap replacement',
    description: 'Replace old mixer tap with brand new Kohler faucet already purchased.',
    offeredPrice: 500, date: 'Tomorrow', timeSlot: 'Morning (09:00 AM)',
    location: 'Vasant Vihar, D-45',
    createdAt: '35 min ago',
  },
  {
    id: 'JR-003', employer: 'E7', status: 'pending', type: 'Quick Fix',
    title: 'Toilet flush valve repair',
    description: 'Flush valve continuously leaking water into bowl.',
    offeredPrice: 400, date: 'Today', timeSlot: 'Immediate',
    location: 'Saket, J-Block, House 18',
    createdAt: '1 hr ago',
  },
  {
    id: 'JR-004', employer: 'E3', status: 'accepted', type: 'Scheduled',
    title: 'Geyser installation in new bathroom',
    description: 'Install 25L water geyser with safety valve.',
    offeredPrice: 600, date: 'Today', timeSlot: 'Afternoon (02:00 PM)',
    location: 'Dwarka Sector 7, Flat 1204',
    createdAt: '2 hrs ago',
    jobStatus: 'en_route',
  },
  {
    id: 'JR-005', employer: 'E4', status: 'accepted', type: 'Quick Fix',
    title: 'Drainage pipe clearing',
    description: 'Kitchen drain blocked. Water backed up.',
    offeredPrice: 450, date: 'Today', timeSlot: 'Evening (05:00 PM)',
    location: 'Greater Kailash II, M-22',
    createdAt: '3 hrs ago',
    jobStatus: 'in_progress',
  },
  {
    id: 'JR-006', employer: 'E5', status: 'declined', type: 'Scheduled',
    title: 'Full bathroom plumbing overhaul',
    description: 'Complete re-plumbing for entire flat.',
    offeredPrice: 300, date: 'Sep 5, 2026', timeSlot: 'Morning',
    location: 'Rohini Sector 15',
    createdAt: '1 day ago',
    declineReason: 'Offered rate too low for full overhaul',
  },
  {
    id: 'JR-007', employer: 'E6', status: 'completed', type: 'Quick Fix',
    title: 'Burst pipe emergency repair',
    description: 'Main supply burst fixed with brass joint.',
    offeredPrice: 500, date: 'Yesterday', timeSlot: 'Immediate',
    location: 'Laxmi Nagar, Block B',
    createdAt: '1 day ago',
    completedAt: 'Yesterday',
    rating: 5,
    review: 'The specialist arrived in 15 mins and saved our flooring from flooding! Top-tier service.',
    earned: 450, // 500 - 10% (50) = 450
  }
];

const EARNINGS = {
  totalBalance: 4850,
  thisMonth: 3870,
  lastMonth: 12400,
  totalEarned: 38650,
  platformFeeRate: 0.10, // 10% worker platform fee
  transactions: [
    { id: 'TXN-101', jobId: 'JR-007', employer: 'E6', title: 'Burst pipe emergency repair', date: 'Yesterday', gross: 500, fee: 50, net: 450, status: 'credited' },
    { id: 'TXN-102', jobId: 'JR-008', employer: 'E1', title: 'Sink drain trap renewal', date: '3 days ago', gross: 400, fee: 40, net: 360, status: 'credited' },
    { id: 'TXN-103', jobId: 'JR-009', employer: 'E2', title: 'Balcony pipeline fitting', date: '5 days ago', gross: 800, fee: 80, net: 720, status: 'credited' },
    { id: 'TXN-104', jobId: null, employer: null, title: 'Bank payout to HDFC ****4521', date: '1 week ago', gross: 0, fee: 0, net: -3500, status: 'withdrawn' }
  ]
};

const REVIEWS = [
  { employer: 'E6', rating: 5, text: 'The specialist arrived in 15 mins and saved our flooring! Top-tier service.', date: 'Yesterday', jobTitle: 'Burst pipe repair' },
  { employer: 'E1', rating: 5, text: 'Clean work and very polite. Solved our kitchen leak effortlessly.', date: '3 days ago', jobTitle: 'Kitchen pipe repair' },
  { employer: 'E2', rating: 5, text: 'Very professional, arrived with all required tools and washers.', date: '5 days ago', jobTitle: 'Pipeline fitting' }
];

const ACTIVITY = [
  { icon: '📩', text: 'New Quick Fix request from Priya Sharma (₹450)', time: '10 min ago' },
  { icon: '📩', text: 'New appointment request from Ankit Gupta (₹500)', time: '35 min ago' },
  { icon: '✅', text: 'Accepted drainage job from Rohit Malhotra', time: '3 hrs ago' },
  { icon: '💰', text: '₹450 net credited (10% platform fee applied)', time: 'Yesterday' }
];
