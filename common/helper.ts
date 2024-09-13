import axios from 'axios';

export function localDate(date: Date): Date {
  const KOREAN_OFF_SET = 9 * 60 * 60 * 1000;
  const localDate = new Date(date.getTime() + KOREAN_OFF_SET);
  return localDate;
}

export function exclude<Obj extends object, Key extends keyof Obj>(
  obj: Obj,
  keys: Key[],
): Omit<Obj, Key> {
  for (const key of keys) {
    delete obj[key];
  }
  return obj;
}

export function excelDateToJSDate(serial) {
  const daysSince1900 = Math.floor(serial) - 1;
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const UTChour = 9 * 60 * 60 * 1000;
  const baseDate = new Date(1900, 0, 1);

  const baseTime = baseDate.getTime() + daysSince1900 * millisecondsPerDay;

  const time = new Date(baseTime - UTChour);
  // const date = new Date(
  //   baseDate.getTime() + daysSince1900 * millisecondsPerDay,
  // );

  return time;
}

export function mergeLogs(total, quiz, save) {
  const mergedLogs = {};

  const addToLogs = (logs, key) => {
    logs.forEach((log) => {
      const date = new Date(log.createdAt).toISOString();
      if (!mergedLogs[date]) {
        mergedLogs[date] = { createdAt: log.createdAt };
      }
      mergedLogs[date][key] = log._count;
    });
  };

  addToLogs(total, 'total');
  addToLogs(quiz, 'quiz');
  addToLogs(save, 'save');

  return Object.values(mergedLogs);
}

export function dateToSqlDateTime(date: Date) {
  const pad = (num: number) => (num < 10 ? '0' + num : num);

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate())
  );
}

export async function getFinalUrl(url: string): Promise<string> {
  try {
    // 요청을 보내고 최종 URL을 추적합니다.
    const response = await axios.get(url, {
      maxRedirects: 10, // 리디렉션을 따라가며 최종 URL을 찾습니다.
      validateStatus: (status) => status >= 200 && status < 400, // 상태 코드가 200~399일 때만 유효하다고 간주합니다.
    });
    return response.request.res.responseUrl; // 최종 URL
  } catch (error) {
    if (error.response && error.response.request) {
      // 리디렉션이 발생한 경우, 최종 URL을 반환합니다.
      return error.response.request.res.responseUrl;
    }
    throw new Error('Failed to fetch final URL');
  }
}
