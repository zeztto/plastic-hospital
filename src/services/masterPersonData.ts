import type { Gender } from '@/types/emr'

export interface MasterPerson {
  name: string
  phone: string
  birthDate: string
  gender: Gender
  bloodType: string
  address: string
  allergies: string[]
  medicalHistory: string
}

const N: string[] = [
  '김미영','박지수','이수진','최현우','정예린','한소희','오민서','강다현','윤서연','임지호',
  '송하늘','배수아','김소연','박하나','이지현','최서윤','정다은','한예진','오수빈','강유진',
  '윤채원','임서진','송민지','배지영','조은서','신하영','장수정','문예은','양서현','권다인',
  '류하은','남지우','홍수아','전예나','고은별','서하늘','안지민','유다현','노서윤','황예림',
  '방지혜','차서연','김도현','박정우','이승민','최재원','정민호','한지훈','오성준','강태영',
  '윤하린','김서현','박채원','이나연','최예원','정수아','한다연','오지은','강민서','윤정아',
  '임유나','송수빈','배서아','조민아','신예지','장민지','문지영','양하은','권수연','류지원',
  '남유진','홍서연','전지현','고하영','서미라','안은비','유채린','노하나','황수정','방은서',
  '차민경','김태연','박소율','이보라','최하윤','정서영','한지우','오은서','강서윤','윤미래',
  '임다영','송은채','배예림','조서하','신지아','장유정','문서연','양지혜','권민정','류서현',
  '김진우','박준호','이태현','최민수','정현석','한승우','오재환','강병준','윤성훈','임재원',
  '남서아','홍채영','전하윤','고소연','서은채','안미진','유하은','노민서','황지원','방채린',
  '차은비','김예진','박서율','이주아','최은수','정하영','한서미','오유빈','강지영','윤소미',
  '송진호','배현우','조승현','신동혁','장원석',
  '문정아','양서율','권지은','류민아','남은별','홍다혜','전보라','고예지','서나린','안수현',
  '유지아','노은하','황미소','방예은','차소윤',
  '김학진','박성민','이동건','최용석','정태우',
  '한수민','오서율','강예나','윤보미','임지수','송다현','배은하','조채원','신민아','장서영',
  '문하린','양유진','권소율','류보라','남예원',
  '홍재민','전성호','고영준','서민혁','안준서',
  '유서진','노채은','황하린','방소연','차예림','김수아','박다인','이채연','최보영','정유나',
  '한은별','오나연','강채린','윤지민','임서윤',
  '송영호','배지환','조건우','신상현','장기범',
  '문채영','양은서','권다연','류하린','남지윤',
]

const P: string[] = [
  '010-1234-5678','010-9876-5432','010-5555-1234','010-3333-7777','010-8888-2222',
  '010-7777-3333','010-4444-6666','010-2222-8888','010-1111-9999','010-6666-4444',
  '010-5555-7777','010-3333-1111',
  '010-1111-2222','010-2222-3333','010-3333-4444','010-4444-5555','010-5555-6666',
  '010-6666-7777','010-7777-8888','010-8888-9999','010-1234-1111','010-2345-2222',
  '010-3456-3333','010-4567-4444','010-5678-5555','010-6789-6666','010-7890-7777',
  '010-8901-8888','010-9012-9999','010-1122-3344','010-2233-4455','010-3344-5566',
  '010-4455-6677','010-5566-7788','010-6677-8899','010-7788-9900','010-8899-0011',
  '010-9900-1122','010-1010-2020','010-2020-3030','010-3030-4040','010-4040-5050',
  '010-5050-6060','010-6060-7070','010-7070-8080','010-8080-9090','010-9090-1010',
  '010-1515-2525','010-2525-3535','010-3535-4545',
  ...Array.from({ length: 150 }, (_, i) => {
    const a = String(4100 + i)
    const b = String(5200 + ((i * 37 + 13) % 4800))
    return `010-${a}-${b.padStart(4, '0')}`
  }),
]

const G: Gender[] = [
  'female','female','female','male','female','female','female','female','female','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','male','male','male','male','male','male','male','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'male','male','male','male','male','male','male','male','male','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female','female','female','female','female','female',
  'male','male','male','male','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female',
  'male','male','male','male','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female',
  'male','male','male','male','male',
  'female','female','female','female','female','female','female','female','female','female',
  'female','female','female','female','female',
  'male','male','male','male','male',
  'female','female','female','female','female',
]

const BT = ['A+','B+','O+','AB+','A-','B-','O-','AB-']
const ADDR = [
  '서울시 강남구 역삼동 123-45','서울시 서초구 서초동 456-78','서울시 송파구 잠실동 789-10',
  '서울시 마포구 합정동 567-89','서울시 용산구 이태원동 890-12','서울시 강동구 천호동 345-67',
  '서울시 영등포구 여의대방로 100','서울시 성북구 보문로 80','서울시 관악구 관악로 60',
  '서울시 중구 을지로 30','서울시 강남구 테헤란로 45','서울시 서초구 서초대로 120',
  '서울시 송파구 올림픽로 300','서울시 마포구 월드컵로 55','서울시 용산구 이태원로 200',
  '서울시 강동구 천호대로 150','서울시 종로구 종로동 678-90','서울시 강남구 논현동 234-56',
  '서울시 노원구 상계동 112-5','서울시 광진구 자양동 223-8',
]
const ALG = ['페니실린','아스피린','라텍스','세팔로스포린','리도카인','설파제','NSAIDs','요오드']
const MH = [
  '특이사항 없음','고혈압 가족력','당뇨 전단계','갑상선 기능저하증','아토피 피부염',
  '비중격만곡증 기왕력','빈혈','천식','편두통','위장장애','특이사항 없음','고혈압 가족력',
]

export const MASTER_PERSONS: MasterPerson[] = N.map((name, i) => ({
  name,
  phone: P[i],
  birthDate: `${1980 + (i % 23)}-${String(1 + ((i * 7 + 3) % 12)).padStart(2, '0')}-${String(1 + ((i * 13 + 5) % 28)).padStart(2, '0')}`,
  gender: G[i],
  bloodType: BT[i % BT.length],
  address: ADDR[i % ADDR.length],
  allergies: i % 5 === 0 ? [ALG[i % ALG.length]] : i % 11 === 0 ? [ALG[i % ALG.length], ALG[(i + 3) % ALG.length]] : [],
  medicalHistory: MH[i % MH.length],
}))

export const PERSON_COUNT = MASTER_PERSONS.length
