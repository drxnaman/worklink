// ============================================================
// WorkLink — Mock Data
// ============================================================

const CATEGORIES = [
  { id: 'plumber',     name: 'Plumber',       icon: '\ud83d\udd27', desc: 'Pipes, leaks & drainage' },
  { id: 'electrician', name: 'Electrician',   icon: '\u26a1', desc: 'Wiring, fixtures & repairs' },
  { id: 'carpenter',   name: 'Carpenter',     icon: '\ud83e\udeba', desc: 'Furniture, doors & cabinets' },
  { id: 'painter',     name: 'Painter',       icon: '\ud83c\udfa8', desc: 'Walls, ceilings & exterior' },
  { id: 'mechanic',    name: 'Mechanic',      icon: '\ud83d\udd29', desc: 'Vehicle repair & servicing' },
  { id: 'cleaner',     name: 'House Cleaner', icon: '\ud83e\uddf9', desc: 'Deep clean & regular cleaning' },
  { id: 'mason',       name: 'Mason',         icon: '\ud83c\udfd7\ufe0f', desc: 'Brickwork, tiles & plastering' },
  { id: 'welder',      name: 'Welder',        icon: '\ud83d\udd25', desc: 'Metal work & fabrication' },
  { id: 'gardener',    name: 'Gardener',      icon: '\ud83c\udf3f', desc: 'Lawn care & landscaping' },
  { id: 'ac_tech',     name: 'AC Technician', icon: '\u2744\ufe0f', desc: 'AC repair & installation' },
];

const WORKERS = [
  {
    id: 1, name: 'Ramesh Kumar', category: 'plumber', city: 'Delhi',
    experience: 8, rating: 4.7, reviewCount: 124, jobsDone: 234,
    responseTime: '~15 min', minRate: 250, maxRate: 500, available: true,
    lat: 28.6300, lng: 77.2200, color: '#1565C0', initials: 'RK',
    skills: ['Pipe fitting', 'Leak repair', 'Bathroom fitting', 'Drainage cleaning'],
    bio: 'Experienced plumber with 8 years serving Delhi NCR. Available 7 days a week and handles emergency calls promptly. Brings own tools and genuine spare parts.',
    pastWorks: [
      { title: 'Kitchen pipe repair', location: 'Lajpat Nagar', date: 'Feb 2025', rating: 5, description: 'Fixed burst pipe under kitchen sink, no mess left behind.' },
      { title: 'Bathroom renovation plumbing', location: 'Vasant Vihar', date: 'Jan 2025', rating: 5, description: 'Complete bathroom plumbing for new construction.' },
      { title: 'Geyser installation', location: 'Dwarka', date: 'Dec 2024', rating: 4, description: 'Installed 25L geyser with safety valve and fitting.' },
    ],
    reviews: [
      { name: 'Priya Sharma', initials: 'PS', rating: 5, text: 'Excellent work! Fixed our kitchen leak quickly and cleanly. Highly recommended!', date: 'Mar 10, 2025' },
      { name: 'Ankit Gupta', initials: 'AG', rating: 5, text: 'Very professional. Came exactly on time and finished perfectly.', date: 'Feb 15, 2025' },
      { name: 'Sunita Verma', initials: 'SV', rating: 4, text: 'Good work, reasonable price. Would hire again.', date: 'Jan 20, 2025' },
    ]
  },
  {
    id: 2, name: 'Suresh Yadav', category: 'plumber', city: 'Delhi',
    experience: 5, rating: 4.5, reviewCount: 89, jobsDone: 156,
    responseTime: '~20 min', minRate: 200, maxRate: 400, available: true,
    lat: 28.6020, lng: 77.1980, color: '#1976D2', initials: 'SY',
    skills: ['Tank cleaning', 'RO installation', 'Faucet repair', 'Pipe fitting'],
    bio: 'Specialized in water tank cleaning and RO installations. 5 years in south Delhi. Affordable and reliable.',
    pastWorks: [
      { title: 'Water tank cleaning', location: 'Saket', date: 'Mar 2025', rating: 5, description: 'Cleaned 500L overhead tank thoroughly.' },
      { title: 'RO purifier installation', location: 'Greater Kailash', date: 'Feb 2025', rating: 4, description: 'Installed 7-stage RO purifier with membrane change.' },
    ],
    reviews: [
      { name: 'Rohit Malhotra', initials: 'RM', rating: 5, text: 'Did a great job cleaning our tank. Very thorough work.', date: 'Mar 5, 2025' },
      { name: 'Kavita Singh', initials: 'KS', rating: 4, text: 'Affordable and efficient. No complaints!', date: 'Feb 10, 2025' },
    ]
  },
  {
    id: 3, name: 'Amit Singh', category: 'electrician', city: 'Delhi',
    experience: 10, rating: 4.8, reviewCount: 198, jobsDone: 312,
    responseTime: '~10 min', minRate: 300, maxRate: 600, available: true,
    lat: 28.6220, lng: 77.2300, color: '#E65100', initials: 'AS',
    skills: ['Full home wiring', 'MCB panel upgrades', 'Fan & AC fitting', 'Inverter installation'],
    bio: 'Licensed electrician with 10 years experience. Specializes in complete home rewiring and solar panel installation. Certified by IIEE.',
    pastWorks: [
      { title: 'Full home rewiring', location: 'Pitampura', date: 'Mar 2025', rating: 5, description: '3BHK complete rewiring with new MCB distribution box.' },
      { title: 'Inverter & battery setup', location: 'Rohini', date: 'Feb 2025', rating: 5, description: 'Installed 1.5kVA inverter with 150Ah battery bank.' },
      { title: 'LED light fittings', location: 'Shalimar Bagh', date: 'Jan 2025', rating: 5, description: 'LED downlights and chandeliers throughout 2BHK.' },
    ],
    reviews: [
      { name: 'Neha Kapoor', initials: 'NK', rating: 5, text: 'Amit is exceptional! Got our home rewired safely and on budget.', date: 'Mar 12, 2025' },
      { name: 'Vivek Joshi', initials: 'VJ', rating: 5, text: 'Fixed our MCB tripping issue in no time. Highly recommended.', date: 'Feb 20, 2025' },
      { name: 'Meena Agarwal', initials: 'MA', rating: 5, text: 'Professional and reliable. Will definitely hire again.', date: 'Jan 25, 2025' },
    ]
  },
  {
    id: 4, name: 'Deepak Sharma', category: 'electrician', city: 'Delhi',
    experience: 6, rating: 4.3, reviewCount: 67, jobsDone: 118,
    responseTime: '~25 min', minRate: 250, maxRate: 450, available: false,
    lat: 28.6440, lng: 77.1880, color: '#F57C00', initials: 'DS',
    skills: ['CCTV installation', 'AC wiring', 'Switch repair', 'Light fitting'],
    bio: 'Specialized in CCTV security systems and AC power fitting. Available on weekdays.',
    pastWorks: [
      { title: 'CCTV installation', location: 'Janakpuri', date: 'Feb 2025', rating: 4, description: '8-camera security system for commercial shop.' },
      { title: 'AC power point', location: 'Uttam Nagar', date: 'Jan 2025', rating: 4, description: 'New dedicated power point for 1.5T AC.' },
    ],
    reviews: [
      { name: 'Suresh Bhatia', initials: 'SB', rating: 4, text: 'Good CCTV setup. Took slightly longer but quality is good.', date: 'Feb 28, 2025' },
    ]
  },
  {
    id: 5, name: 'Ravi Prasad', category: 'carpenter', city: 'Delhi',
    experience: 12, rating: 4.6, reviewCount: 145, jobsDone: 267,
    responseTime: '~30 min', minRate: 400, maxRate: 800, available: true,
    lat: 28.6100, lng: 77.2400, color: '#5D4037', initials: 'RP',
    skills: ['Modular kitchen', 'Custom wardrobes', 'Door & window fitting', 'Furniture repair'],
    bio: 'Master carpenter with 12 years crafting premium furniture. Specializes in modular kitchens and built-in wardrobes.',
    pastWorks: [
      { title: 'Modular kitchen', location: 'Mayur Vihar', date: 'Mar 2025', rating: 5, description: 'L-shaped modular kitchen with granite countertop.' },
      { title: 'Bedroom wardrobe', location: 'Patparganj', date: 'Feb 2025', rating: 5, description: '6-door sliding wardrobe with full-length mirror.' },
      { title: 'Custom study table', location: 'Vasundhara', date: 'Jan 2025', rating: 4, description: 'Study table with integrated bookshelf and storage.' },
    ],
    reviews: [
      { name: 'Alka Mishra', initials: 'AM', rating: 5, text: 'Amazing kitchen! Finished in 4 days exactly as discussed.', date: 'Mar 15, 2025' },
      { name: 'Pankaj Tyagi', initials: 'PT', rating: 5, text: 'Beautiful wardrobe, excellent craftsmanship. Very professional.', date: 'Feb 22, 2025' },
    ]
  },
  {
    id: 6, name: 'Mohd. Arif Khan', category: 'carpenter', city: 'Delhi',
    experience: 7, rating: 4.4, reviewCount: 78, jobsDone: 132,
    responseTime: '~20 min', minRate: 300, maxRate: 600, available: true,
    lat: 28.5920, lng: 77.2100, color: '#4E342E', initials: 'MK',
    skills: ['Door repair', 'Window frames', 'Wood polishing', 'False ceiling'],
    bio: 'Expert in door/window carpentry and premium wood polishing. Quick repairs with quality finishes.',
    pastWorks: [
      { title: 'Door repair & fitting', location: 'Okhla', date: 'Mar 2025', rating: 4, description: 'Repaired 3 warped doors and fitted new handles.' },
    ],
    reviews: [
      { name: 'Farida Begum', initials: 'FB', rating: 4, text: 'Fixed our doors perfectly. Good rates and neat work.', date: 'Mar 1, 2025' },
    ]
  },
  {
    id: 7, name: 'Sunil Gupta', category: 'painter', city: 'Delhi',
    experience: 9, rating: 4.7, reviewCount: 112, jobsDone: 198,
    responseTime: '~20 min', minRate: 15, maxRate: 30, available: true,
    lat: 28.6060, lng: 77.2500, color: '#7B1FA2', initials: 'SG',
    skills: ['Texture painting', 'Interior painting', 'Exterior painting', 'Waterproofing'],
    bio: 'Specialist in texture painting and terrace waterproofing. 9 years delivering spotless finishes for homes and offices.',
    pastWorks: [
      { title: 'Full home interior painting', location: 'Noida Sector 62', date: 'Feb 2025', rating: 5, description: '3BHK interior + texture finish in living room.' },
      { title: 'Terrace waterproofing', location: 'Ghaziabad', date: 'Jan 2025', rating: 5, description: 'Waterproofed 1200 sqft terrace — zero leakage since.' },
    ],
    reviews: [
      { name: 'Rakesh Nair', initials: 'RN', rating: 5, text: 'Sunil transformed our home! Texture work in living room is stunning.', date: 'Feb 25, 2025' },
      { name: 'Geeta Tiwari', initials: 'GT', rating: 5, text: 'No leakage since waterproofing. Excellent job!', date: 'Jan 30, 2025' },
    ]
  },
  {
    id: 8, name: 'Prakash Meena', category: 'painter', city: 'Delhi',
    experience: 4, rating: 4.2, reviewCount: 45, jobsDone: 76,
    responseTime: '~35 min', minRate: 12, maxRate: 25, available: true,
    lat: 28.6230, lng: 77.1770, color: '#8E24AA', initials: 'PM',
    skills: ['Interior painting', 'Primer & putty', 'Room painting', 'Wall repair'],
    bio: 'Affordable painting for small to medium projects. Good quality at budget prices.',
    pastWorks: [
      { title: 'Bedroom painting', location: 'Shahdara', date: 'Mar 2025', rating: 4, description: 'Bedroom with primer, putty and 2 finish coats.' },
    ],
    reviews: [
      { name: 'Sarita Devi', initials: 'SD', rating: 4, text: 'Affordable and clean work. Our bedroom looks great.', date: 'Mar 8, 2025' },
    ]
  },
  {
    id: 9, name: 'Rajesh Verma', category: 'mechanic', city: 'Delhi',
    experience: 15, rating: 4.8, reviewCount: 234, jobsDone: 456,
    responseTime: '~10 min', minRate: 200, maxRate: 500, available: true,
    lat: 28.6340, lng: 77.2380, color: '#37474F', initials: 'RV',
    skills: ['Engine repair', 'AC & cooling', 'Brake service', 'All brands'],
    bio: 'Master mechanic with 15 years handling Maruti, Honda, Hyundai, Tata. Home visits available.',
    pastWorks: [
      { title: 'Engine service', location: 'Laxmi Nagar', date: 'Mar 2025', rating: 5, description: 'Complete engine service for Maruti Swift.' },
      { title: 'AC gas recharge', location: 'Preet Vihar', date: 'Feb 2025', rating: 5, description: 'AC gas refill and compressor check for Hyundai i20.' },
    ],
    reviews: [
      { name: 'Dinesh Rawat', initials: 'DR', rating: 5, text: 'Best mechanic I have hired. Honest, professional, and fast!', date: 'Mar 20, 2025' },
      { name: 'Monika Sood', initials: 'MS', rating: 5, text: 'Home visit mechanic is so convenient. Great work!', date: 'Feb 28, 2025' },
    ]
  },
  {
    id: 10, name: 'Santosh Kumar', category: 'cleaner', city: 'Delhi',
    experience: 6, rating: 4.5, reviewCount: 156, jobsDone: 298,
    responseTime: '~15 min', minRate: 500, maxRate: 1500, available: true,
    lat: 28.6050, lng: 77.2280, color: '#00695C', initials: 'SK',
    skills: ['Deep cleaning', 'Sofa & carpet cleaning', 'Kitchen deep clean', 'Move-in cleaning'],
    bio: 'Professional cleaning team leader. Brings all equipment and eco-friendly supplies. Specializes in post-renovation deep cleaning.',
    pastWorks: [
      { title: 'Post-renovation clean', location: 'Noida Sector 18', date: 'Mar 2025', rating: 5, description: 'Complete deep clean after renovation of 2BHK.' },
    ],
    reviews: [
      { name: 'Pooja Bansal', initials: 'PB', rating: 5, text: 'Spotless! Every corner was cleaned. My flat looks brand new!', date: 'Mar 18, 2025' },
    ]
  },
  {
    id: 11, name: 'Dinesh Rathore', category: 'mason', city: 'Delhi',
    experience: 11, rating: 4.6, reviewCount: 89, jobsDone: 145,
    responseTime: '~30 min', minRate: 500, maxRate: 1000, available: true,
    lat: 28.6440, lng: 77.2070, color: '#4527A0', initials: 'DR',
    skills: ['Tile fitting', 'Brick laying', 'Plaster work', 'Concrete & RCC'],
    bio: 'Expert mason specializing in tile fitting and civil construction. 11 years on residential and commercial projects.',
    pastWorks: [
      { title: 'Bathroom tile fitting', location: 'Vasundhara', date: 'Feb 2025', rating: 5, description: 'Full bathroom tile laying — floor and all walls.' },
    ],
    reviews: [
      { name: 'Harish Chandra', initials: 'HC', rating: 5, text: 'Perfect tile work, no gaps, excellent finish. Very professional.', date: 'Feb 20, 2025' },
    ]
  },
  {
    id: 12, name: 'Arun Thakur', category: 'welder', city: 'Delhi',
    experience: 13, rating: 4.7, reviewCount: 67, jobsDone: 123,
    responseTime: '~25 min', minRate: 400, maxRate: 900, available: true,
    lat: 28.5940, lng: 77.2390, color: '#BF360C', initials: 'AT',
    skills: ['Gate fabrication', 'Window grills', 'Stainless steel work', 'Structural welding'],
    bio: 'Expert welder for gates, grills, and custom metal fabrication. Brings own MIG and ARC equipment.',
    pastWorks: [
      { title: 'Main gate fabrication', location: 'Faridabad', date: 'Feb 2025', rating: 5, description: 'Decorative iron main gate with powder coating.' },
    ],
    reviews: [
      { name: 'Mahesh Dagar', initials: 'MD', rating: 5, text: 'Beautiful gate! Better than I imagined. Fair price and fast.', date: 'Feb 15, 2025' },
    ]
  },
  {
    id: 13, name: 'Manoj Bind', category: 'gardener', city: 'Delhi',
    experience: 7, rating: 4.4, reviewCount: 54, jobsDone: 88,
    responseTime: '~20 min', minRate: 300, maxRate: 700, available: true,
    lat: 28.6240, lng: 77.1960, color: '#2E7D32', initials: 'MB',
    skills: ['Terrace gardens', 'Lawn mowing', 'Plant care & pruning', 'Garden design'],
    bio: 'Passionate gardener specializing in kitchen gardens, terrace gardens, and seasonal plant care.',
    pastWorks: [
      { title: 'Terrace garden setup', location: 'Gurgaon', date: 'Mar 2025', rating: 5, description: 'Created vegetable garden with 20+ plants on terrace.' },
    ],
    reviews: [
      { name: 'Nandita Roy', initials: 'NR', rating: 5, text: 'Our terrace looks amazing now! Manoj is very knowledgeable about plants.', date: 'Mar 10, 2025' },
    ]
  },
  {
    id: 14, name: 'Vijay Saxena', category: 'ac_tech', city: 'Delhi',
    experience: 9, rating: 4.8, reviewCount: 189, jobsDone: 345,
    responseTime: '~10 min', minRate: 350, maxRate: 700, available: true,
    lat: 28.6130, lng: 77.2490, color: '#0277BD', initials: 'VS',
    skills: ['AC installation', 'Gas recharge', 'Annual servicing', 'Compressor repair'],
    bio: 'Certified AC technician handling all brands. Quick diagnosis and same-day service with genuine spare parts.',
    pastWorks: [
      { title: 'Split AC installation', location: 'Dwarka Sector 10', date: 'Mar 2025', rating: 5, description: '1.5T Daikin inverter AC wall installation.' },
      { title: 'Annual service x2 ACs', location: 'Janakpuri', date: 'Feb 2025', rating: 5, description: 'Full service + gas top-up for 2 split ACs.' },
      { title: 'Compressor replacement', location: 'Uttam Nagar', date: 'Jan 2025', rating: 5, description: 'Samsung compressor replaced with original part.' },
    ],
    reviews: [
      { name: 'Sonal Jain', initials: 'SJ', rating: 5, text: 'Diagnosed the issue in 10 minutes. Very efficient and reasonable.', date: 'Mar 22, 2025' },
      { name: 'Pradeep Kumar', initials: 'PK', rating: 5, text: 'Got 3 ACs serviced — all working perfectly. Best AC tech!', date: 'Feb 10, 2025' },
    ]
  },
  {
    id: 15, name: 'Sanjay Chauhan', category: 'plumber', city: 'Delhi',
    experience: 6, rating: 4.3, reviewCount: 54, jobsDone: 98,
    responseTime: '~30 min', minRate: 200, maxRate: 450, available: false,
    lat: 28.6450, lng: 77.2170, color: '#1565C0', initials: 'SC',
    skills: ['Drainage cleaning', 'Sewer line', 'Flush repair', 'Tap fitting'],
    bio: 'Specialized in drainage and sewer line clearing using jet machine. 6 years solving tough blockage problems.',
    pastWorks: [
      { title: 'Sewer line clearing', location: 'Tilak Nagar', date: 'Jan 2025', rating: 4, description: 'Cleared badly blocked main sewer line with jet.' },
    ],
    reviews: [
      { name: 'Champa Devi', initials: 'CD', rating: 4, text: 'Fixed our blocked drain quickly. Came within 30 minutes.', date: 'Jan 15, 2025' },
    ]
  },
];

const MOCK_BOOKINGS = [
  { id: 'WL-483921', workerId: 3, workerName: 'Amit Singh', category: 'Electrician', type: 'Scheduled', date: 'Apr 5, 2025', timeSlot: 'Morning (9 AM - 12 PM)', status: 'confirmed', amount: 800, description: 'Fan installation in 2 bedrooms' },
  { id: 'WL-371048', workerId: 1, workerName: 'Ramesh Kumar', category: 'Plumber', type: 'Quick Fix', date: 'Mar 28, 2025', timeSlot: 'Immediate', status: 'completed', amount: 450, description: 'Kitchen tap repair and pipe tightening' },
  { id: 'WL-295613', workerId: 14, workerName: 'Vijay Saxena', category: 'AC Technician', type: 'Scheduled', date: 'Apr 10, 2025', timeSlot: 'Afternoon (12 PM - 4 PM)', status: 'pending', amount: 600, description: 'Annual servicing for 2 AC units' },
];
