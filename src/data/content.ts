export const services = [
  {
    id: 'eye',
    title: '눈성형',
    description: '자연스러운 눈매 교정으로 또렷하고 생기있는 인상을 만들어드립니다.',
    icon: 'Eye',
  },
  {
    id: 'nose',
    title: '코성형',
    description: '얼굴의 중심인 코를 조화롭게 디자인하여 세련된 이미지를 완성합니다.',
    icon: 'Sparkles',
  },
  {
    id: 'contour',
    title: '안면윤곽',
    description: '갸름하고 세련된 얼굴라인으로 자신감 있는 옆모습을 선사합니다.',
    icon: 'CircleUser',
  },
  {
    id: 'lifting',
    title: '리프팅',
    description: '처진 피부를 탄력있게 끌어올려 젊고 건강한 인상을 되찾아드립니다.',
    icon: 'TrendingUp',
  },
  {
    id: 'breast',
    title: '가슴성형',
    description: '체형에 맞는 자연스러운 가슴라인으로 균형잡힌 바디를 만들어드립니다.',
    icon: 'Heart',
  },
  {
    id: 'liposuction',
    title: '지방흡입',
    description: '부분별 지방 제거로 매끄럽고 탄력있는 바디라인을 완성합니다.',
    icon: 'Flame',
  },
  {
    id: 'skin',
    title: '피부시술',
    description: '레이저, 보톡스, 필러 등 비수술 시술로 젊은 피부를 유지합니다.',
    icon: 'Sun',
  },
  {
    id: 'petit',
    title: '쁘띠성형',
    description: '간단한 시술로 큰 변화를 원하시는 분들을 위한 맞춤 솔루션입니다.',
    icon: 'Wand2',
  },
]

export const doctors = [
  {
    id: 'doc-1',
    name: '김태호',
    title: '대표원장',
    specialty: '눈·코성형 전문',
    image: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?w=400&h=400&fit=facearea&facepad=2&auto=format',
    careers: [
      '서울대학교 의과대학 졸업',
      '서울아산병원 성형외과 전공의 수료',
      '대한성형외과학회 정회원',
      '대한미용성형외과학회 정회원',
      '미국성형외과학회(ASPS) 국제회원',
      '성형외과 전문의 자격 취득',
      '눈·코성형 전문 22년 경력',
    ],
  },
  {
    id: 'doc-2',
    name: '이서연',
    title: '원장',
    specialty: '안면윤곽·리프팅 전문',
    image: 'https://images.unsplash.com/photo-1736289173074-df6009da27c9?w=400&h=400&fit=facearea&facepad=2&auto=format',
    careers: [
      '연세대학교 의과대학 졸업',
      '세브란스병원 성형외과 전공의 수료',
      '대한성형외과학회 정회원',
      '대한두개안면성형외과학회 정회원',
      '안면윤곽·리프팅 전문 18년 경력',
    ],
  },
  {
    id: 'doc-3',
    name: '박준혁',
    title: '원장',
    specialty: '가슴·체형성형 전문',
    image: 'https://images.unsplash.com/photo-1645066928295-2506defde470?w=400&h=400&fit=facearea&facepad=2&auto=format',
    careers: [
      '고려대학교 의과대학 졸업',
      '삼성서울병원 성형외과 전공의 수료',
      '대한성형외과학회 정회원',
      '대한미용성형외과학회 정회원',
      '가슴·체형성형 전문 15년 경력',
    ],
  },
  {
    id: 'doc-4',
    name: '최민지',
    title: '원장',
    specialty: '피부·쁘띠성형 전문',
    image: 'https://images.unsplash.com/photo-1618053448748-b7251851d014?w=400&h=400&fit=facearea&facepad=2&auto=format',
    careers: [
      '이화여자대학교 의과대학 졸업',
      '서울대학교병원 피부과 전공의 수료',
      '대한피부과학회 정회원',
      '대한레이저의학회 정회원',
      '피부·쁘띠성형 전문 12년 경력',
    ],
  },
]

export const reviews = [
  {
    id: 1,
    procedure: '눈성형',
    rating: 5,
    content: '자연스러운 쌍꺼풀을 원했는데 정말 만족스러워요! 친구들도 성형한 티가 안 난다고 해요. 상담부터 수술, 사후관리까지 정말 꼼꼼하게 케어해주셔서 감사합니다.',
    author: '김**',
    date: '2025.01.15',
    doctorName: '김태호 원장',
  },
  {
    id: 2,
    procedure: '코성형',
    rating: 5,
    content: '낮은 코가 콤플렉스였는데 이제는 자신감이 생겼어요. 원장님께서 제 얼굴에 맞는 코 높이를 추천해주셔서 정말 자연스럽게 나왔습니다.',
    author: '박**',
    date: '2025.01.10',
    doctorName: '김태호 원장',
  },
  {
    id: 3,
    procedure: '안면윤곽',
    rating: 5,
    content: '광대랑 턱 라인이 고민이었는데 수술 후 갸름해진 얼굴 보고 너무 행복해요. 붓기 관리도 잘 해주셔서 회복도 빨랐어요!',
    author: '이**',
    date: '2025.01.05',
    doctorName: '이서연 원장',
  },
  {
    id: 4,
    procedure: '리프팅',
    rating: 5,
    content: '나이가 들면서 처진 피부가 고민이었는데 리프팅 후 10년은 젊어 보인다는 소리 들어요. 비절개라 흉터도 없고 너무 만족합니다.',
    author: '최**',
    date: '2024.12.28',
    doctorName: '이서연 원장',
  },
  {
    id: 5,
    procedure: '가슴성형',
    rating: 5,
    content: '체형에 맞는 사이즈를 추천해주셔서 정말 자연스러워요. 촉감도 자연스럽고 주변에서 모르더라고요. 박준혁 원장님 감사합니다!',
    author: '정**',
    date: '2024.12.20',
    doctorName: '박준혁 원장',
  },
  {
    id: 6,
    procedure: '피부시술',
    rating: 5,
    content: '보톡스, 필러 시술 받았는데 자연스럽게 예뻐졌어요. 주사 맞을 때도 거의 안 아팠고 결과도 너무 좋아서 주기적으로 방문하려고요.',
    author: '한**',
    date: '2024.12.15',
    doctorName: '최민지 원장',
  },
  {
    id: 7,
    procedure: '코성형',
    rating: 4,
    content: '매부리코 교정했는데 옆모습이 완전 달라졌어요. 처음에 걱정 많이 했는데 김태호 원장님이 꼼꼼하게 설명해주셔서 안심하고 수술 받았습니다.',
    author: '오**',
    date: '2024.11.30',
    doctorName: '김태호 원장',
  },
  {
    id: 8,
    procedure: '쁘띠성형',
    rating: 5,
    content: '윤곽주사랑 보톡스 같이 받았는데 얼굴이 한층 갸름해졌어요! 시술 시간도 짧고 바로 일상생활 가능해서 너무 좋았습니다.',
    author: '강**',
    date: '2024.11.20',
    doctorName: '최민지 원장',
  },
]

export const faqs = [
  {
    question: '수술 후 회복 기간은 얼마나 걸리나요?',
    answer: '시술 종류에 따라 다르지만, 일반적으로 눈성형은 5-7일, 코성형은 7-14일, 안면윤곽은 2-4주 정도 소요됩니다. 개인차가 있으며, 정확한 회복 기간은 상담 시 안내드립니다.',
  },
  {
    question: '상담 비용은 어떻게 되나요?',
    answer: '첫 상담은 무료로 진행됩니다. 원장님과 1:1 상담을 통해 본인에게 맞는 시술을 추천받으실 수 있습니다. 부담 없이 방문해주세요.',
  },
  {
    question: '수술 흉터가 남나요?',
    answer: '최소절개 및 비절개 수술법을 사용하여 흉터를 최소화합니다. 눈성형의 경우 쌍꺼풀 라인에 숨겨지고, 코성형은 콧구멍 안쪽 절개로 외부에서 보이지 않습니다.',
  },
  {
    question: '재수술도 가능한가요?',
    answer: '네, 재수술도 가능합니다. 이전 수술 기록과 현재 상태를 정밀하게 분석하여 최선의 결과를 도출합니다. 재수술은 더욱 섬세한 접근이 필요하므로 충분한 상담 후 진행합니다.',
  },
  {
    question: '할부 결제도 가능한가요?',
    answer: '네, 무이자 할부를 포함한 다양한 결제 방법을 지원합니다. 신용카드 2-12개월 무이자 할부 및 의료 할부 서비스를 이용하실 수 있습니다.',
  },
  {
    question: '수술 전 준비사항이 있나요?',
    answer: '수술 2주 전부터 아스피린, 비타민E 등 출혈 위험이 있는 약물 복용을 중단해주세요. 수술 당일은 금식이 필요하며, 편한 복장으로 내원해주시면 됩니다.',
  },
]

export const beforeAfterCategories = [
  { id: 'eye', name: '눈성형' },
  { id: 'nose', name: '코성형' },
  { id: 'contour', name: '안면윤곽' },
  { id: 'lifting', name: '리프팅' },
]

export const beforeAfterCases = {
  eye: [
    { id: 1, procedure: '자연유착 쌍꺼풀', description: '자연스러운 인아웃 라인' },
    { id: 2, procedure: '트임성형', description: '눈매교정 + 앞트임' },
    { id: 3, procedure: '눈밑지방재배치', description: '다크서클 개선' },
  ],
  nose: [
    { id: 1, procedure: '콧대 + 코끝', description: '자연스러운 높이 증가' },
    { id: 2, procedure: '매부리코 교정', description: '부드러운 코라인' },
    { id: 3, procedure: '복코 교정', description: '날렵한 코끝 완성' },
  ],
  contour: [
    { id: 1, procedure: '광대축소', description: '부드러운 얼굴라인' },
    { id: 2, procedure: '사각턱', description: '갸름한 턱라인' },
    { id: 3, procedure: 'V라인', description: '전체적인 윤곽 개선' },
  ],
  lifting: [
    { id: 1, procedure: '실리프팅', description: '비절개 탄력 개선' },
    { id: 2, procedure: '안면거상', description: '처진 피부 개선' },
    { id: 3, procedure: '이마거상', description: '눈썹 처짐 개선' },
  ],
}

export const clinicInfo = {
  name: '뷰티플 성형외과',
  address: '서울시 강남구 테헤란로 123 뷰티빌딩 5층',
  phone: '02-1234-5678',
  hours: {
    weekday: '평일 10:00 - 19:00',
    saturday: '토요일 10:00 - 15:00',
    sunday: '일요일/공휴일 휴진',
  },
  subway: '강남역 3번 출구에서 도보 5분',
}

export const heroImages = {
  main: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&h=1080&fit=crop',
}

export const sectionImages = {
  beforeAfter: {
    eye: [
      'https://images.unsplash.com/photo-1635353692890-80a6b95add47?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1634469875582-a0885fc2f589?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1680669158867-cc840299ec33?w=400&h=400&fit=facearea&facepad=2&auto=format',
    ],
    nose: [
      'https://images.unsplash.com/photo-1680669116394-13028a91533f?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1635353866477-f77a828b431a?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1624091844772-554661d10173?w=400&h=400&fit=facearea&facepad=2&auto=format',
    ],
    contour: [
      'https://images.unsplash.com/photo-1610021685072-9906775314c9?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1680669115241-ab576edd1ad0?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1609840113847-44058810f038?w=400&h=400&fit=facearea&facepad=2&auto=format',
    ],
    lifting: [
      'https://images.unsplash.com/photo-1680669115934-2b04b96d9eac?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1736289173074-df6009da27c9?w=400&h=400&fit=facearea&facepad=2&auto=format',
      'https://images.unsplash.com/photo-1618053448748-b7251851d014?w=400&h=400&fit=facearea&facepad=2&auto=format',
    ],
  },
  location: 'https://images.unsplash.com/photo-1583396082374-14e87b006b63?w=800&h=600&fit=crop',
}
