/**
 * 密码强度检测
 *
 * 根据密码的长度、字母、数字、符号的情况来评分，然后加上奖励分。然后根据总分划分等级。
 * @param {string} password 密码
 * @returns {{score: number, level: string}}
 */
export function detection(password) {
  // 长度
  const len = password.length;
  let lengthScore;
  if (len < 6) {
    lengthScore = 0;
  } else if (len < 8) {
    lengthScore = 10;
  } else {
    lengthScore = 20;
  }

  // 字母
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  let letterScore = 0;
  if (hasLower && hasUpper) {
    letterScore = 20;
  } else if (hasLower || hasUpper) {
    letterScore = 10;
  }

  // 数字
  const numCount = (password.match(/\d/g) || []).length;
  let numScore = 0;
  if (numCount === 1) {
    numScore = 10;
  } else if (numCount > 1) {
    numScore = 20;
  }

  // 符号
  const symbolCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
  let symbolScore = 0;
  if (symbolCount === 1) {
    symbolScore = 10;
  } else if (symbolCount > 1) {
    symbolScore = 25;
  }

  // 奖励分
  const hasLetters = hasLower || hasUpper;
  const hasNumbers = numCount > 0;
  const hasSymbols = symbolCount > 0;
  const hasBothLowerUpper = hasLower && hasUpper;

  let reward = 0;
  if (hasBothLowerUpper && hasNumbers && hasSymbols) {
    reward = 5;
  } else if (hasLetters && hasNumbers && hasSymbols) {
    reward = 3;
  } else if (hasLetters && hasNumbers) {
    reward = 2;
  }

  // 计算总分
  const total = lengthScore + letterScore + numScore + symbolScore + reward;

  // 强度评级
  const levels = [
    { score: 90, code: 'safe', level: '安全' },
    { score: 70, code: 'strong', level: '强' },
    { score: 50, code: 'normal', level: '一般' },
    { score: 0, code: 'weak', level: '弱' }
  ]
  const level = levels.find(item => total >= item.score);

  return {
    score: total,
    code: level.code,
    level: level.level
  };
}
