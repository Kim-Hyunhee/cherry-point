export function calculatePoint({ index }: { index: number }) {
  // if (index === 0) {
  //   return 10000;
  // } else if (index <= 2) {
  //   return 5000;
  // } else if (index <= 4) {
  //   return 3000;
  // } else if (index <= 9) {
  //   return 1000;
  // } else if (index <= 14) {
  //   return 500;
  // } else if (index <= 19) {
  //   return 300;
  // }

  // 240529 순위별 증정 체리 수정
  if (index <= 1) {
    return 5000;
  } else if (index <= 4) {
    return 3000;
  } else if (index <= 9) {
    return 1000;
  } else if (index <= 14) {
    return 500;
  } else if (index <= 19) {
    return 300;
  }
}
