export interface PointInfo {
  pointCategory?: string;
  title?: string;
  pointType?: string;
}

export const PointCategories = {
  greenp: 'A11',
  hotPosting: 'C12',
  pinMoney: 'C13',
  pinMonetBonus: 'C13_0',
};

export const pushIndex = {
  invidePush: '101',
  eventAnnounce: '102',
  eventPush: '104',
  homePush: '105',
};

export function getPointInfo(data: PointInfo) {
  switch (data.pointCategory) {
    case 'AI':
      data.pointType = 'I';
      break;
    case 'AO':
      data.pointType = 'O';
      break;
    case 'U':
      data.pointType = 'O';
      break;
    case 'J':
      data.pointType = 'I';
      data.title = '회원가입';
      break;
    case 'M':
      data.pointType = 'I';
      data.title = '추천코드 지급';
      break;
    case 'C0':
      data.pointType = 'I';
      data.title = '출석체크';
      break;
    case 'C1':
      data.pointType = 'I';
      data.title = '체리룰렛';
      break;
    case 'C2':
      data.pointType = 'I';
      data.title = '황금룰렛';
      break;
    case 'C3':
      data.pointType = 'I';
      data.title = '체리복권';
      break;
    case 'C4':
      data.pointType = 'I';
      data.title = '체리게임';
      break;
    case 'C5':
      data.pointType = 'I';
      data.title = '체리설문';
      break;
    case 'C6':
      data.pointType = 'I';
      data.title = '체리워킹';
      break;
    case 'C7':
      data.pointType = 'I';
      data.title = '첼린지';
      break;
    case 'C8':
      data.pointType = 'I';
      data.title = '체리버튼';
      break;
    case 'C9':
      data.pointType = 'I';
      break;
    case 'C10_1':
      data.pointType = 'I';
      break;
    case 'C10_2':
      data.pointType = 'I';
      break;
    case 'C10_3':
      data.pointType = 'I';
      break;
    case 'C10_4':
      data.pointType = 'I';
      break;
    case 'C10_0':
      data.pointType = 'I';
      break;
    case 'C11':
      data.pointType = 'I';
      data.title = '30초 간단미션';
      break;
    case 'C12':
      data.pointType = 'I';
      data.title = '커뮤니티 인기글 선정';
      break;
    case 'C13':
      data.pointType = 'I';
      data.title = '체리 용돈 벌기';
      break;
    case 'C13_0':
      data.pointType = 'I';
      data.title = '체리 용돈 벌기 보너스';
      break;
    case 'Z':
      data.pointType = 'I';
      data.title = '시스템 처리';
      break;
    default:
      data.pointType = 'I';
      data.title = '';
      break;
  }

  return data;
}
