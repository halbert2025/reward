export type RewardValidationInput = {
  title: string;
  rewardText: string;
  taskText: string;
  evidenceText: string;
  screenTimeMinutes?: number;
};

export type ValidationResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      code: string;
      message: string;
    };

const forbiddenRewardPatterns = [
  /cash|money|transfer|red packet|红包|现金|转账|打钱|零钱/i,
  /recharge|top[- ]?up|game coin|游戏充值|点券|虚拟币|充值/i,
  /blind box|loot box|gacha|抽卡|盲盒|十连|保底|稀有/i,
  /ipad|iphone|phone|tablet|switch|平板|手机|高价|贵重/i,
  /rank|top ?1|first place|排名|第一名|考第一|班级排名/i,
  /school|teacher|class|institution|学校|老师|班级|机构/i,
  /merchant|shopping|store|payment|wallet|商家|导购|支付|钱包/i,
];

const forbiddenEvidencePatterns = [
  /face|selfie|portrait|人脸|自拍|正脸|合照/i,
  /address|home address|doorplate|住址|门牌|家庭地址/i,
  /school|class|teacher|校徽|校服|学校|班级|老师/i,
  /id card|passport|certificate|证件|身份证|护照/i,
  /chat|message screenshot|聊天|截图/i,
  /video|location|gps|视频|定位/i,
];

const harmfulRepairPatterns = [
  /wrong|fault|punish|liar|shame|judge|blame|错了|惩罚|撒谎|羞耻|裁判|责备|失信|举报/i,
];

function firstMatchedPattern(value: string, patterns: RegExp[]) {
  return patterns.find((pattern) => pattern.test(value));
}

export function validateRewardInput(input: RewardValidationInput): ValidationResult {
  const combined = `${input.title} ${input.rewardText} ${input.taskText} ${input.evidenceText}`;

  if (!input.title.trim() || input.title.trim().length > 40) {
    return {
      ok: false,
      code: "REWARD_TITLE_INVALID",
      message: "先写一个孩子能看懂、40 字以内的小愿望。",
    };
  }

  if (firstMatchedPattern(combined, forbiddenRewardPatterns)) {
    return {
      ok: false,
      code: "REWARD_FORBIDDEN",
      message: "这个奖励先不放进家庭愿望池，可以换成一次陪伴、体验或轻量选择权。",
    };
  }

  if ((input.screenTimeMinutes ?? 0) > 30) {
    return {
      ok: false,
      code: "SCREEN_TIME_TOO_LONG",
      message: "屏幕时间先放轻一点，让愿望更容易兑现。",
    };
  }

  return { ok: true };
}

export function validateEvidencePlaceholder(photoLabel: string): ValidationResult {
  if (!photoLabel.trim()) {
    return { ok: true };
  }

  if (firstMatchedPattern(photoLabel, forbiddenEvidencePatterns)) {
    return {
      ok: false,
      code: "EVIDENCE_PRIVACY_RISK",
      message: "只拍任务成果局部，避开人脸、住址、学校标识、证件、聊天截图和定位信息。",
    };
  }

  return { ok: true };
}

export function validateNeutralRepairMessage(message: string): ValidationResult {
  if (!message.trim()) {
    return {
      ok: false,
      code: "REPAIR_MESSAGE_REQUIRED",
      message: "写一句中性的说明，比如：这个愿望需要一起商量一下。",
    };
  }

  if (firstMatchedPattern(message, harmfulRepairPatterns)) {
    return {
      ok: false,
      code: "REPAIR_MESSAGE_NOT_NEUTRAL",
      message: "这里不做裁判或责备，请换成一起商量的表达。",
    };
  }

  return { ok: true };
}
