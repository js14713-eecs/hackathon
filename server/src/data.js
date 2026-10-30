export const TYPES = {
  qyf:     { label: 'Go Far · Study Journey',  color: '#f5a623' },
  caravan: { label: 'Dream Caravan',           color: '#ff6b35' },
  sports:  { label: 'Sports Dream',            color: '#2bb3a3' },
  border:  { label: 'Border School',           color: '#9b6bd6' },
  coach:   { label: 'Dream Coach Program',     color: '#3f7fb8' },
  citizen: { label: 'Kids in Governance',      color: '#4caf7d' },
};

export const KNOWN_LOCATIONS = [
  'Yunnan Province','Henan Province','Shandong Province','Jilin Province','Xinjiang Uygur Autonomous Region',
  'Fujian Province','Gansu Province','Shanghai','Nanjing','Chongqing','Uncategorized',
];

export const PARTICIPATING = [
  '北京市','天津市','河北省','山西省','内蒙古自治区','辽宁省','吉林省','黑龙江省','上海市','江苏省','浙江省',
  '安徽省','福建省','江西省','山东省','河南省','湖北省','湖南省','广东省','广西壮族自治区','海南省','重庆市',
  '四川省','贵州省','云南省','陕西省','甘肃省','青海省','宁夏回族自治区','新疆维吾尔自治区',
];

export const LOCATIONS = [
  {
    id: 'yunnan', name: 'Yunnan Province', geo: '云南省', coords: [102.71, 24.97],
    tagline: '373 teams · 1,937 children · 270,000+ class hours of Dream Courses (by Aug 2025)',
    stats: [['373', 'journey teams'], ['1,937', 'children traveled'], ['270K+', 'class hours']],
    projects: [
      {
        id: 'yn-qyf', type: 'qyf', title: 'Go Far · Study Journeys in Yunnan', years: '2014 — 2025 · 12 editions', img: '/img/classroom.png',
        summary: 'From the first team in 2014 to 373 teams in 2025, 1,937 Yunnan children turned "far away" from a word in their textbooks into roads under their feet. Dream Centers across the province have delivered more than 270,000 class hours.',
        timeline: [
          { y: '2014', lab: 'First Edition', t: 'The first team leaves the mountains', d: 'The Go Far course entered rural Yunnan schools for the first time. Two teams — 11 children — left the mountains, planning their own routes and budgets.', ph: ['Course', 'Journey'], st: [['2', 'teams'], ['11', 'children']], img: '/img/classroom.png' },
          { y: '2016', lab: 'Course Takes Root', t: 'The most-loved Dream Course', d: '12 teams traveled. Kids learned to be trip planners: check timetables, compare prices, design research themes.', ph: ['Course', 'Trip Plan'], st: [['12', 'teams']] },
          { y: '2018', lab: 'Home as the Far', t: 'Local journeys launch', d: '"Make your hometown someone else\'s faraway place" — 28 teams visited ethnic villages and rice terraces, learning to love home.', ph: ['Trip Plan', 'Journey', 'Sharing'], st: [['28', 'teams']] },
          { y: '2020', lab: 'Cloud Journeys', t: 'Virtual trips go live', d: 'In a difficult year, 15 teams connected to faraway cities through "cloud study trips" with online volunteers.', ph: ['Course', 'Journey'], st: [['15', 'teams']] },
          { y: '2022', lab: 'Teams Double', t: '45 teams depart', d: 'At the defense sessions, kids presented their plans with their own slide decks. Judges were teachers and alumni members.', ph: ['Trip Plan', 'Team Defense'], st: [['45', 'teams']] },
          { y: '2023', lab: 'Guardian Program', t: 'Volunteer escorts on every route', d: '63 teams traveled. "Journey Guardians" and "online safety officers" escorted trips at scale for the first time.', ph: ['Journey'], st: [['63', 'teams'], ['40+', 'guardians']] },
          { y: '2024', lab: 'Huanfang Special', t: '6,297 students start the course', d: 'Funded by Huanfang Quant, Dream Center schools in Gansu, Yunnan, Shaanxi and Inner Mongolia opened the course together; 48 teachers joined special training and 23 teams traveled.', ph: ['Course', 'Journey'], st: [['6,297', 'students'], ['116', 'teachers']] },
          { y: '2025', lab: '12th Edition', t: 'The answer sheet of 373 teams', d: 'The 12th edition wrapped: a cumulative 373 teams and 1,937 children completed journeys; Dream Courses province-wide passed 270,000 class hours.', ph: ['Journey', 'Sharing'], st: [['373', 'teams total'], ['1,937', 'children total'], ['270K+', 'class hours']], img: '/img/sea.png' },
        ],
      },
      {
        id: 'yn-caravan', type: 'caravan', title: 'Dream Caravan · 10th Anniversary Finale', years: '2015 — 2025', img: '/img/caravan.png',
        summary: 'The caravan\'s 2015 launch route, "Westbound", came to Yunnan. In 2025, its 10th-anniversary finale returned. Over a decade: 27 provinces, 103 regions, 254 schools.',
        timeline: [
          { y: '2015', lab: 'Launch · Westbound', t: 'A 27-ton mobile Dream Center', d: 'The caravan drove into Yunnan towns; children experienced technology, art and ethnic-culture classes for the first time.', ph: ['Launch Ceremony', 'Carnival'], st: [['27t', 'unfolded 60m² classroom']] },
          { y: '2018', lab: 'Borderline Tour', t: 'Classrooms at the gate towns', d: 'The caravan followed the border, bringing literacy carnivals to frontier schools.', ph: ['Carnival'], st: [['27', 'provinces to date']] },
          { y: '2022', lab: 'Sports Carnival', t: 'Mobile PE in the mountains', d: 'With Anta, sports-literacy classes rode into mountain schools.', ph: ['Carnival', 'Teacher Training'] },
          { y: '2025', lab: '10th Anniversary', t: 'The finale returns to Yunnan', d: 'Supported by the Qilu Pharmaceutical Charity Foundation. Decade totals: 27 provinces, 103 regions, 254 schools, 170,000+ km driven, 290,000+ children met the caravan.', ph: ['Carnival', 'Finale'], st: [['27 prov.', '103 regions'], ['254', 'schools'], ['170K+', 'km']], img: '/img/caravan.png' },
        ],
      },
    ],
  },
  {
    id: 'henan', name: 'Henan Province', geo: '河南省', coords: [113.6, 34.7],
    tagline: '2023 Central Plains Tour · 8 stops across 7 cities · tradition × technology',
    stats: [['8', 'tour stops'], ['959', 'Dream Courses (cum.)'], ['514', 'STEAM classes (cum.)']],
    projects: [
      {
        id: 'hn-caravan', type: 'caravan', title: 'Dream Caravan · Central Plains Tour (2023)', years: '2023 · May — June', img: '/img/caravan.png',
        summary: 'On May 8, 2023, the Xiaohongshu-branded caravan departed from Zhongyuan District, Zhengzhou, touring 8 stops across 7 cities and counties — literacy classrooms blending traditional culture with modern technology.',
        timeline: [
          { y: '05.08', lab: 'Departure', t: 'Zhengzhou · Zhongyuan District', d: 'Launch ceremony — the "Literacy Education Central Plains Tour" officially begins.', ph: ['Launch Ceremony'], st: [['8', 'stops planned']], img: '/img/caravan.png' },
          { y: 'May', lab: 'Stop 2', t: 'Xinmi City', d: 'Kids moved between intangible-heritage classes and science experiments in a single day.', ph: ['Carnival', 'STEAM'], st: [['600+', 'children']] },
          { y: 'May', lab: 'Stop 3', t: 'Gongyi City', d: 'In the hometown of poetry, verse recital and coding share one classroom.', ph: ['Carnival'] },
          { y: 'May', lab: 'Stop 4', t: 'Luoyang · Xin\'an County', d: 'By the ancient capital, children designed their "city of the future" on tablets.', ph: ['STEAM'], st: [['300+', 'city designs']] },
          { y: 'May', lab: 'Stop 5', t: 'Sanmenxia · Lushi County', d: 'Mountain kids tried VR headsets and 3D-printing pens for the first time.', ph: ['STEAM'] },
          { y: 'Jun', lab: 'Stop 6', t: 'Kaifeng · Weishi County', d: 'Song-dynasty culture workshops — volunteers and kids co-created crafts.', ph: ['Carnival'], st: [['100+', 'volunteers']] },
          { y: 'Jun', lab: 'Finale', t: 'Nanyang · Neixiang County', d: 'Finale: children left with "Dream Cards". Project totals over 8 years: 959 Dream Courses, 514 STEAM classes, 2,543 volunteers.', ph: ['Carnival', 'Finale'], st: [['959', 'Dream Courses'], ['514', 'STEAM classes'], ['2,543', 'volunteers']] },
        ],
      },
      {
        id: 'hn-qyf', type: 'qyf', title: 'Go Far · Dream Courses in Henan', years: '2017 — 2025', img: '/img/classroom.png',
        summary: 'Through Dream Centers across the province, the Go Far course took root on the Central Plains. Kids write Luoyang and Kaifeng into their own journey plans.',
        timeline: [
          { y: '2017', lab: 'Course In', t: 'First 15 schools', d: 'The Go Far course entered Henan\'s first 15 Dream Center schools.', ph: ['Course'], st: [['15', 'schools']] },
          { y: '2021', lab: 'First Teams', t: '20 teams depart', d: 'Destinations: Xi\'an, Qingdao, Beijing. Kids bought tickets and made transfers on their own.', ph: ['Trip Plan', 'Journey'], st: [['20', 'teams']] },
          { y: '2023', lab: 'Tour Tie-in', t: '400+ children complete the course', d: 'Schools along the caravan route ran the course in sync during the tour.', ph: ['Course'], st: [['400+', 'children']] },
          { y: '2025', lab: '8th Edition', t: '120+ teams cumulative', d: 'More Henan kids depart with plans titled "My Hometown Deserves to Be Seen".', ph: ['Journey', 'Sharing'], st: [['120+', 'teams total']], img: '/img/sea.png' },
        ],
      },
    ],
  },
  {
    id: 'shandong', name: 'Shandong Province', geo: '山东省', coords: [118.0, 36.4],
    tagline: '2024 YAO Health Tour · 6 cities · 10,105 students joined',
    stats: [['10,105', 'students'], ['493', 'teachers'], ['6', 'tour stops']],
    projects: [
      {
        id: 'sd-caravan', type: 'caravan', title: 'Dream Caravan · YAO Health Tour (2024)', years: '2024 · September', img: '/img/caravan.png',
        summary: 'September 2024, supported by the Qilu Pharmaceutical Charity Foundation: the caravan visited 6 cities and counties in Shandong with literacy carnivals and health classes.',
        timeline: [
          { y: 'Sep', lab: 'Kickoff', t: 'Dezhou · Linyi County', d: '"YAO Health · Grow Happy" tour launches with the first health-literacy class.', ph: ['Launch Ceremony', 'Carnival'] },
          { y: 'Sep', lab: 'Stop 2', t: 'Laoling City', d: 'In the home of jujubes, children learned nutrition and fun fitness classes.', ph: ['Carnival'] },
          { y: 'Sep', lab: 'Stop 3', t: 'Zibo · Zhoucun District', d: 'A friend since 2014 — Dream Classrooms landed years ago; the caravan brought upgraded STEAM classes.', ph: ['STEAM'], st: [['10yrs', 'partnership']] },
          { y: '09.24', lab: 'Stop 4', t: 'Weifang · Zhucheng City', d: 'Donglu School\'s art troupe opened the camp; kids tried 3D printing in the hometown of Emperor Shun.', ph: ['Carnival', 'STEAM'] },
          { y: 'Sep', lab: 'Stop 5', t: 'Tai\'an · Ningyang County', d: 'At the foot of Mount Tai: student carnival and teacher training ran side by side.', ph: ['Carnival', 'Teacher Training'] },
          { y: 'Sep', lab: 'Finale', t: 'Linyi · Yinan County', d: 'Finale: 10,105 students and 493 teachers across 6 stops.', ph: ['Finale'], st: [['10,105', 'students'], ['493', 'teachers']], img: '/img/caravan.png' },
        ],
      },
      {
        id: 'sd-qyf', type: 'qyf', title: 'Go Far · Shandong', years: '2021 — 2025', img: '/img/sea.png',
        summary: 'Children across Shandong write the sea and Mount Tai into their journey plans.',
        timeline: [
          { y: '2021', lab: 'First Teams', t: '10 teams depart', d: 'Destinations: Qingdao and Jinan. Kids completed transfers alone for the first time.', ph: ['Trip Plan', 'Journey'], st: [['10', 'teams']] },
          { y: '2024', lab: 'Tour Tie-in', t: 'Course × caravan', d: 'During the YAO Health Tour, schools along the route ran the Go Far course in sync.', ph: ['Course'], st: [['20+', 'schools']] },
          { y: '2025', lab: '5th Edition', t: '60+ teams cumulative', d: 'More Shandong kids depart for destinations beyond the province.', ph: ['Journey'], st: [['60+', 'teams total']] },
        ],
      },
    ],
  },
  {
    id: 'jilin', name: 'Jilin Province', geo: '吉林省', coords: [126.5, 43.8],
    tagline: '2024 Winter Games · Astronomy Club trip to Beijing',
    stats: [['100', 'students & teachers'], ['6 prov. 13 regions', 'joined the games'], ['7 days', 'in Beijing']],
    projects: [
      {
        id: 'jl-sports', type: 'sports', title: 'Sports Dream · Winter Games', years: '2017 — 2025', img: '/img/snow.png',
        summary: 'Anta\'s "Sports Dream" course brings professional PE to rural children. At Chinese New Year 2024, 100 students and teachers from 6 provinces and 13 regions gathered in Jilin for the Winter Games.',
        timeline: [
          { y: '2017', lab: 'Course Launch', t: 'Anta × Adream', d: 'Professional sports curriculum enters rural schools.', ph: ['Training'], st: [['First', 'pilot schools']] },
          { y: '2022', lab: 'System Matured', t: '100+ schools covered', d: 'Basketball, football and ice-snow curricula take shape.', ph: ['Training', 'Leagues'], st: [['100+', 'schools']] },
          { y: '2024', lab: 'Winter Games', t: 'Chinese New Year · Jilin', d: '100 students and teachers from 20 rural schools across 6 provinces and 13 regions gathered in Jilin — first-time skiing, skating and curling for most.', ph: ['Winter Games'], st: [['100', 'participants'], ['20', 'schools'], ['6 prov.', '13 regions']], img: '/img/snow.png' },
          { y: '2025', lab: 'Permanent', t: 'Ice-snow classes replicate', d: 'Course packs and trainer systems distilled; serving more schools year-round.', ph: ['Regular Classes'] },
        ],
      },
      {
        id: 'jl-qyf', type: 'qyf', title: 'Go Far · Astronomy Club in Beijing', years: '2025 · July · 7 days', img: '/img/classroom.png',
        summary: 'In July 2025, the Astronomy Club of Jilin Adream School flew to Beijing with their telescopes — pondering fossils and gazing at stars through telescopes at Tsinghua.',
        timeline: [
          { y: 'D1', lab: 'Departure', t: 'First time on a plane', d: 'Nine club members and their teachers flew to Beijing, notebooks of homemade star charts in their bags.', ph: ['Journey'], st: [['9', 'children']], img: '/img/classroom.png' },
          { y: 'D2', lab: 'Natural Museum', t: 'Pondering before fossils', d: 'At the National Natural History Museum, the scale of the universe became concrete for the first time.', ph: ['Journey'] },
          { y: 'D3', lab: 'Tsinghua University', t: 'Holding breath at the telescope', d: 'Kids learned to observe with a professional telescope alongside university students.', ph: ['Journey'], st: [['1', 'pro telescope session']] },
          { y: 'D4', lab: 'Jiukun Philanthropy', t: 'Giving back a moon lamp', d: 'The children gave handmade moon lamps to their funders — "repaying kindness with the fruits of the journey".', ph: ['Sharing'], st: [['1', 'lamp of gratitude']] },
          { y: 'D7', lab: 'Return', t: 'The journey has just begun', d: '"The universe never abandons a single grain of dust, just as society holds up every child who looks up."', ph: ['Sharing'], st: [['7 days', 'completed']] },
        ],
      },
    ],
  },
  {
    id: 'xinjiang', name: 'Xinjiang Uygur Autonomous Region', geo: '新疆维吾尔自治区', coords: [75.2, 39.9],
    tagline: 'Border Schools · the 20th school at Jigen Township, China\'s westernmost frontier',
    stats: [['20', 'border schools'], ['2024.9', 'westernmost opening'], ['2', 'teachers honored nationally']],
    projects: [
      {
        id: 'xj-border', type: 'border', title: 'Border Schools · Light the Gate', years: '2018 — 2025', img: '/img/classroom.png',
        summary: 'In September 2024, Jigen Township Primary School in Wuqia County — China\'s westernmost point — became the 20th "Border Schools · Light the Gate" project school, bringing a Dream Center right to the national gate.',
        timeline: [
          { y: '2018', lab: 'Program Launch', t: 'For border counties', d: 'A support program launches to build Dream Centers in frontier schools.', ph: ['Signing'], st: [['1st', 'school']] },
          { y: '2021', lab: '10th School', t: 'Dream Centers reach more frontier schools', d: 'Courses and teacher training follow each new center.', ph: ['Center Opening'], st: [['10', 'schools']] },
          { y: '2024.9', lab: '20th School', t: 'Jigen Township · the westernmost gate', d: 'The Dream Center opens at Jigen Township Primary School in Wuqia County; teacher Sailiman becomes a Dream Teacher.', ph: ['Center Opening', 'Border Course'], st: [['20th', 'border school']], img: '/img/classroom.png' },
          { y: '2024.10', lab: 'National Feature', t: 'Salute, border teachers', d: 'Teacher Sailiman (Jigen) and Teacher Sangji Zhuoma (Yadong) were featured in the China Teachers\' Daily National Day special.', ph: ['Showcase'] },
          { y: '2025', lab: 'Regular Classes', t: 'Dream Courses under the gate', d: 'Dream Courses run as a regular part of the school week at border schools.', ph: ['Border Course'], st: [['20+', 'schools']] },
        ],
      },
      {
        id: 'xj-qyf', type: 'qyf', title: 'Go Far · Children of the Pamirs', years: '2022 — 2025', img: '/img/sea.png',
        summary: 'For frontier children, "far away" means old cities and big towns — from Kashgar to Urumqi, the 4th edition of teams has already departed.',
        timeline: [
          { y: '2022', lab: 'First Teams', t: 'Kashgar Old City', d: 'Children wrote their own travel guides for the first time and walked the old city of Kashgar.', ph: ['Trip Plan', 'Journey'], st: [['5', 'teams']] },
          { y: '2024', lab: 'Urumqi Stop', t: 'Museums and observatories', d: 'Teams visited the Xinjiang Museum and the observatory, turning textbooks into scenery.', ph: ['Journey'], st: [['12', 'teams']] },
          { y: '2025', lab: '4th Edition', t: 'More border schools join', d: 'Course and travel plans now cover more frontier counties.', ph: ['Course', 'Journey'], st: [['20+', 'teams']] },
        ],
      },
    ],
  },
  {
    id: 'fujian', name: 'Fujian Province', geo: '福建省', coords: [118.1, 26.1],
    tagline: 'Shunchang kids see the sea — "the sea really is as salty as the textbook said"',
    stats: [['40+', 'teams traveled'], ['2025', 'Qingdao trip'], ['5', 'editions']],
    projects: [
      {
        id: 'fj-qyf', type: 'qyf', title: 'Go Far · Study Journeys in Fujian', years: '2019 — 2025', img: '/img/sea.png',
        summary: 'In summer 2025, fifth graders from Shunchang County Experimental Primary School in Nanping saw the ocean for the first time in Qingdao — one of the most classic Go Far stories.',
        timeline: [
          { y: '2019', lab: 'Course In', t: 'Shunchang, Nanping opens the course', d: 'The Go Far course entered schools in Shunchang and other counties; children learned to plan trips for the first time.', ph: ['Course'], st: [['10+', 'first schools']] },
          { y: '2022', lab: 'First Teams', t: 'The Wuyi Mountain route', d: 'Local journeys launched; kids planned a two-day Wuyi Mountain route on their own.', ph: ['Trip Plan', 'Journey'], st: [['8', 'teams']] },
          { y: '2024', lab: 'Teams Double', t: '40+ teams depart', d: 'Destinations expanded beyond the province; defense sessions got livelier.', ph: ['Team Defense', 'Journey'], st: [['40+', 'teams']] },
          { y: '2025', lab: 'First Sight of the Sea', t: 'Shunchang → Qingdao', d: 'Fifth graders reached Qingdao and opened their arms on the beach: "The sea really is as salty as the textbook said."', ph: ['Journey', 'Sharing'], st: [['1st', 'sight of the sea']], img: '/img/sea.png' },
        ],
      },
    ],
  },
  {
    id: 'gansu', name: 'Gansu Province', geo: '甘肃省', coords: [103.7, 36.1],
    tagline: 'Huanfang Special · 116 teachers & 6,297 students · the Tianzhu Heroes\' Journey',
    stats: [['6,297', 'students enrolled'], ['116', 'teachers'], ['23', 'teams traveled']],
    projects: [
      {
        id: 'gs-qyf', type: 'qyf', title: 'Go Far · Study Journeys in Gansu', years: '2020 — 2025', img: '/img/classroom.png',
        summary: 'Kids in Tianzhu, Wuwei asked: "What\'s beyond the mountains?" In 2025\'s "Heroes\' Journey", Tianzhu students left the snowy grasslands to see the world.',
        timeline: [
          { y: '2020', lab: 'Course Lands', t: 'Tianzhu, Wuwei opens the course', d: 'The Go Far course entered township schools in Tianzhu and beyond.', ph: ['Course'], st: [['First', 'township schools']] },
          { y: '2022', lab: 'First Teams', t: 'Lanzhou becomes the first "far away"', d: '12 teams departed; many children rode a high-speed train for the first time.', ph: ['Trip Plan', 'Journey'], st: [['12', 'teams']] },
          { y: '2024', lab: 'Huanfang Special', t: 'Four provinces together', d: '116 teachers and 6,297 students in Gansu, Yunnan, Shaanxi and Inner Mongolia opened the course; 48 teachers joined special training and 23 teams traveled.', ph: ['Course', 'Journey'], st: [['6,297', 'students'], ['116', 'teachers'], ['23', 'teams']], img: '/img/classroom.png' },
          { y: '2025', lab: 'Heroes\' Journey', t: 'Tianzhu students see the world', d: 'From the Hexi Corridor to eastern cities, children of the snowy grasslands departed with their hometown stories.', ph: ['Journey', 'Sharing'], st: [['30+', 'teams']], img: '/img/sea.png' },
        ],
      },
    ],
  },
  {
    id: 'shanghai', name: 'Shanghai', geo: '上海市', coords: [121.47, 31.23],
    tagline: 'Go Far headquarters · Dream Coach Program · Kids in Governance',
    stats: [['310+', 'teams on the road (2021)'], ['10K+', 'teachers served / year'], ['83%', 'school course rate']],
    projects: [
      {
        id: 'sh-qyf', type: 'qyf', title: 'Go Far · Arriving in Shanghai', years: '2018 — 2025', img: '/img/hero.png',
        summary: 'Shanghai is both the headquarters of Go Far and the dream destination of countless teams. In summer 2021, 310+ teams hit the road nationwide — many headed for Shanghai.',
        timeline: [
          { y: '2018', lab: 'First Arrivals', t: 'Teams explore Shanghai on their own routes', d: 'The Bund, the Natural History Museum, university campuses — kids knew the city through routes they designed themselves.', ph: ['Journey'], st: [['First', 'arriving teams']] },
          { y: '2021', lab: '310 Teams', t: 'Guardians and safety officers', d: '310+ teams traveled nationwide; "Journey Guardians" and "online safety officers" were recruited at scale for the first time.', ph: ['Journey'], st: [['310+', 'teams']], img: '/img/hero.png' },
          { y: '2024', lab: 'Routes Upgraded', t: 'Company open days join the routes', d: 'Corporate open days and museum courses joined Shanghai journey routes.', ph: ['Trip Plan'] },
          { y: '2025', lab: 'HQ Open Day', t: 'Kids tell their journey stories', d: 'Teams visited the Adream headquarters and shared their faraway stories.', ph: ['Sharing'], st: [['12', 'editions running']] },
        ],
      },
      {
        id: 'sh-coach', type: 'coach', title: 'Dream Coach Program', years: '2010 — 2025', img: '/img/classroom.png',
        summary: 'A companionship-based growth program for rural teachers. In 2022 it served 10,000+ rural teachers; 83% of operating schools ran courses, with 200 districts at 100%.',
        timeline: [
          { y: '2010', lab: 'Program Launch', t: 'The first Dream Coaches enter schools', d: 'The companionship teacher-growth model started from Shanghai.', ph: ['Recruiting', 'Mentoring'], st: [['First', 'coaches']] },
          { y: '2016', lab: '1,000 Coaches', t: 'Curriculum standardized', d: 'Cumulative trained teachers passed 1,000; course and training systems took shape.', ph: ['Training'], st: [['1,000+', 'teachers']] },
          { y: '2020', lab: 'Online First', t: 'Cloud training', d: 'In a difficult year, the program moved fully online.', ph: ['Training'] },
          { y: '2024', lab: 'Record Course Rate', t: '83% of schools running courses', d: 'Serving 10,000+ teachers a year; 83% course rate and 200 districts at 100% — a new high.', ph: ['Mentoring', 'Certification'], st: [['10K+', 'teachers / yr'], ['83%', 'course rate'], ['200', 'districts at 100%']], img: '/img/classroom.png' },
        ],
      },
      {
        id: 'sh-citizen', type: 'citizen', title: 'Kids in Governance', years: '2021 — 2025', img: '/img/hero.png',
        summary: 'A practice course that lets children take part in community governance — kids change their small world through "campus hearings".',
        timeline: [
          { y: '2021', lab: 'Pilot Launch', t: '6 communities pilot', d: 'Children\'s councils landed in Shanghai.', ph: ['Research'], st: [['6', 'communities']] },
          { y: '2023', lab: 'Campus Hearings', t: 'Kids chair the hearings', d: '"How should we spend recess?" "Who decides the lunch menu?" — kids chaired hearings and voted.', ph: ['Hearing'], st: [['10+', 'hearings']] },
          { y: '2025', lab: 'Regular Course', t: 'Kids\' proposals adopted', d: 'The course entered more schools; several children\'s proposals were genuinely adopted by their communities.', ph: ['Adoption'], st: [['Several', 'proposals adopted']] },
        ],
      },
    ],
  },
  {
    id: 'nanjing', name: 'Nanjing', geo: '江苏省', coords: [118.796, 32.06],
    tagline: '2025 · The Nanjing Dream Team asked what makes Republican-era architecture special — and left new questions behind',
    stats: [['2025', 'first edition'], ['6', 'students'], ['1', 'picture-book draft']],
    projects: [
      {
        id: 'nj-dream-team', type: 'qyf', title: 'From Chongqing to Nanjing: Six Kids Explore Republican-era Architecture', years: '2025 · July · 7 days', img: '/samples/nanjing/nanjing-presidential-gate.png',
        summary: 'Six third-graders from Youyang Minzu Primary School in Chongqing traveled to Nanjing with one question: what makes Republican-era architecture special? They came home with a picture-book draft — and three new questions for the next cohort.',
        timeline: [
          { y: 'Stage 1', lab: 'Preparation', t: 'Setting off with questions', d: 'Before departure the team dug into old photos, year tables and museum guides, and pinned down three questions: why are the roofs sloped, what are the red-brick walls made of, and who lived in these buildings?', ph: ['Preparation'], st: [['3', 'questions']], img: '/samples/nanjing/nanjing-museum-republican-hall.png' },
          { y: 'Stage 2', lab: 'Challenges', t: 'First night away from home', d: 'Away from home for the first time, the six kids had to navigate, buy metro tickets, find the hotel and order food on their own. Xixi miscounted change, so she and Manman invented a two-person bookkeeping system; Jiejie practiced asking for directions until he could speak up.', ph: ['Challenges', 'Reflection'], st: [['1', 'double-bookkeeping duo']], img: '/samples/nanjing/nanjing-sketch.png' },
          { y: 'Stage 3', lab: 'Field Work', t: 'Finding answers in Nanjing', d: 'At the Nanjing Museum Republican-era hall, the Yihe Road mansion district and the Presidential Palace, the team stopped just looking and started observing: roof shapes, brick patterns, carved windows, interior layouts.', ph: ['Field Work'], st: [['3', 'sites visited']], img: '/samples/nanjing/nanjing-yihe-window.png' },
          { y: 'Stage 4', lab: 'Creation', t: 'Six kids, one picture book', d: 'Every evening the six sat together, reviewing the day\'s photos and sketches. Chenchen and Jiejie drew architectural details, Manman and Yueyue drew the team, and Feifei and Xixi organized the words and history.', ph: ['Collaboration', 'Creation'], st: [['3', 'pages drafted']], img: '/samples/nanjing/nanjing-sketch.png' },
          { y: 'Stage 5', lab: 'Outcomes', t: 'Coming home with more than a book', d: 'The team finished the first draft of their picture book. But the journey also left them with independent planning skills, teamwork habits, and the courage to face unfamiliar places.', ph: ['Outcomes', 'Sharing'], st: [['1', 'picture-book draft']], img: '/samples/nanjing/nanjing-presidential-gate.png' },
        ],
      },
    ],
  },
  {
    id: 'chongqing', name: 'Chongqing', geo: '重庆市', coords: [106.579, 29.562],
    tagline: '2026 · A six-kid research team asked how Hongyadong was "grown" onto a cliff — and measured the answer themselves',
    stats: [['2026', 'first edition'], ['6', 'students'], ['12', 'report pages']],
    projects: [
      {
        id: 'cq-hongyadong', type: 'qyf', title: 'How Hongyadong Grew on a Cliff', years: '2026 · July · 5 days', img: '/samples/hongyadong/hongyadong-night-overview.png',
        summary: 'Six fifth-graders from Chongqing spent five days around Hongyadong asking one question: why can stilted houses stand on such a steep cliff? They measured columns, counted eleven layers and came home with a 12-page research report.',
        timeline: [
          { y: 'Stage 1', lab: 'Preparation', t: 'A cardboard model that kept falling down', d: 'In class the team tried to build a stilt-house model from cardboard. It collapsed at the third floor until they added diagonal braces — the first hint of the answer they would find on the cliff.', ph: ['Preparation'], st: [['1', 'model rebuilt']], img: '/samples/hongyadong/hongyadong-riverside-bridge.png' },
          { y: 'Stage 2', lab: 'Field Work', t: 'Looking down at the columns', d: 'On the riverbank below Hongyadong the team crouched and traced where each wooden column lands: the uphill side rests straight on rock, the river side stands on long posts over stone platforms.', ph: ['Field Work'], st: [['160', 'photos taken']], img: '/samples/hongyadong/hongyadong-night-overview.png' },
          { y: 'Stage 3', lab: 'Interview', t: 'The noodle seller and the flood line', d: 'A vendor told them the river reaches the lowest floor in flood years, which is why nobody sleeps there. Old photos in the Three Gorges Museum confirmed the same habit across old Chongqing.', ph: ['Reflection'], st: [['1', 'interview']], img: '/samples/hongyadong/hongyadong-riverside-bridge.png' },
          { y: 'Stage 4', lab: 'Creation', t: 'Drawing a section from the bridge', d: 'From Qiansimen Bridge the team drew a cross-section and counted eleven layers, each roof serving as the street level of the floor above.', ph: ['Creation'], st: [['11', 'layers counted']], img: '/samples/hongyadong/hongyadong-night-overview.png' },
          { y: 'Stage 5', lab: 'Outcomes', t: '“Grown”, not “built”', d: 'The team finished a 12-page report and a take-apart model, concluding that Hongyadong was grown with the slope and the river — not simply built on flat ground.', ph: ['Outcomes', 'Sharing'], st: [['12', 'report pages']], img: '/samples/hongyadong/hongyadong-riverside-bridge.png' },
        ],
      },
    ],
  },
];

export const FEATURED_GEO = LOCATIONS.map(l => l.geo);

export const IMPACTS = [
  { v: 1900000, fmt: '1.9M+', txt: 'children have taken the Go Far course' },
  { v: 5000, fmt: '5,000+', txt: 'Dream Centers built in rural schools' },
  { v: 3600, fmt: '3,600+', txt: 'study-journey teams' },
  { v: 18000, fmt: '18,000+', txt: 'children & teachers have traveled' },
  { v: 170000, fmt: '170,000+', txt: 'km driven by the Dream Caravan' },
  { v: 290000, fmt: '290,000+', txt: 'children have met the caravan' },
];

export const SEED_STORIES = [
  {
    title: '"The sea really is as salty as the textbook said"',
    summary: 'Fifth graders from Shunchang County Experimental Primary School, Fujian, reached Qingdao in 2025 and saw the ocean for the first time in their lives. They opened their arms on the beach and shouted at the waves.',
    location: 'Fujian Province', coords: [118.1, 26.1], image: '/img/sea.png', likes: 41, ageHours: 3,
    timeline: [
      { y: '2019', lab: 'Course In', t: 'Learning to plan a trip', d: 'The Go Far course entered school; kids learned routes and budgets.', ph: ['Course'] },
      { y: '2022', lab: 'First Teams', t: 'Wuyi Mountain on their own', d: 'First local journeys with self-planned routes.', ph: ['Trip Plan', 'Journey'] },
      { y: '2025', lab: 'First Sight of the Sea', t: 'Shunchang → Qingdao', d: 'On the beach, arms wide open: "The sea really is as salty as the textbook said."', ph: ['Journey', 'Sharing'] },
    ],
    tags: ['Go Far', 'first-time', 'Qingdao'],
  },
  {
    title: 'In seven days, the stars fell into their eyes',
    summary: 'In July 2025, the Astronomy Club of Jilin Adream School flew to Beijing: pondering fossils at the Natural History Museum, holding their breath at Tsinghua\'s telescopes, and giving hand-made moon lamps back to their funders.',
    location: 'Jilin Province', coords: [126.5, 43.8], image: '/img/classroom.png', likes: 26, ageHours: 9,
    timeline: [
      { y: 'D1', lab: 'Departure', t: 'First flight', d: 'Nine children and their teachers flew to Beijing.', ph: ['Journey'] },
      { y: 'D3', lab: 'Tsinghua', t: 'At the telescope', d: 'Observing the stars with professional equipment.', ph: ['Journey'] },
      { y: 'D7', lab: 'Return', t: 'The journey has just begun', d: '"The universe never abandons a single grain of dust."', ph: ['Sharing'] },
    ],
    tags: ['Astronomy', 'Beijing', 'Go Far'],
  },
  {
    title: '"What\'s beyond the mountains?" — now I know',
    summary: 'Kids from Tianzhu, Wuwei, Gansu, kept asking what lies beyond the snowy grasslands. In 2025\'s "Heroes\' Journey", they left the Hexi Corridor for eastern cities with their hometown stories in their backpacks.',
    location: 'Gansu Province', coords: [103.7, 36.1], image: '/img/hero.png', likes: 18, ageHours: 30,
    timeline: [
      { y: '2022', lab: 'First Teams', t: 'Lanzhou, the first "far away"', d: '12 teams departed; many rode high-speed rail for the first time.', ph: ['Trip Plan', 'Journey'] },
      { y: '2024', lab: 'Huanfang Special', t: 'Four provinces together', d: '6,297 students opened the course with 116 teachers.', ph: ['Course'] },
      { y: '2025', lab: 'Heroes\' Journey', t: 'Tianzhu students see the world', d: 'From the Hexi Corridor to eastern cities.', ph: ['Journey', 'Sharing'] },
    ],
    tags: ['Go Far', 'Tianzhu', 'Heroes Journey'],
  },
  {
    title: 'When the caravan came, our school felt like New Year',
    summary: 'Along the 2023 Central Plains Tour in Henan, children waited at the school gate for the 27-ton "mobile Dream Center". One boy said the day the caravan arrived felt like New Year.',
    location: 'Henan Province', coords: [113.6, 34.7], image: '/img/caravan.png', likes: 9, ageHours: 55,
    timeline: [
      { y: '05.08', lab: 'Departure', t: 'Zhengzhou launch', d: 'The tour kicked off in Zhongyuan District.', ph: ['Launch Ceremony'] },
      { y: 'May', lab: 'Mid-tour', t: 'STEAM in Lushi County', d: 'Mountain kids tried VR for the first time.', ph: ['STEAM'] },
      { y: 'Jun', lab: 'Finale', t: 'Neixiang County', d: 'Kids left with Dream Cards.', ph: ['Finale'] },
    ],
    tags: ['Dream Caravan', 'Henan', 'STEAM'],
  },
];
