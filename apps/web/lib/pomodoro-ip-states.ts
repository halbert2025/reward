export type PomodoroIpState = {
  id: "idle" | "focus" | "guest" | "look_up" | "complete" | "exit";
  label: string;
  trigger: string;
  childCopy: string;
  primaryAsset: string;
  fallbackAsset: string;
  qaAssertion: string;
};

export const pomodoroIpStates: PomodoroIpState[] = [
  {
    id: "idle",
    label: "待机",
    trigger: "任务可开始但孩子尚未主动开始",
    childCopy: "猫猫在擦杯子，等你准备好。",
    primaryAsset: "/assets/pomodoro/coffee/barista_idle_counter_close_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png",
    qaAssertion: "未运行状态显示开始按钮，不出现催促、排行或锁机承诺。",
  },
  {
    id: "focus",
    label: "专注",
    trigger: "孩子点击开始后进入计时",
    childCopy: "猫猫安静做饮品，不催促。",
    primaryAsset: "/assets/pomodoro/coffee/barista_idle_counter_close_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png",
    qaAssertion: "运行态显示倒计时和低刺激画面，完成按钮在计时结束前禁用。",
  },
  {
    id: "guest",
    label: "来访",
    trigger: "计时过半后出现安静客人背影",
    childCopy: "有猫猫坐下，空间仍然安静。",
    primaryAsset: "/assets/pomodoro/coffee/guest_back_bar_scene_wide_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png",
    qaAssertion: "过半后客人素材可见，但不出现强提醒或动效干扰。",
  },
  {
    id: "look_up",
    label: "抬头",
    trigger: "孩子在计时未结束前点击画面",
    childCopy: "猫猫看了你一眼，又继续做饮品。",
    primaryAsset: "/assets/pomodoro/coffee/barista_look_up_counter_close_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/barista_idle_counter_close_01.png",
    qaAssertion: "点击画面只改变轻反馈，不中断计时，不产生惩罚文案。",
  },
  {
    id: "complete",
    label: "完成",
    trigger: "倒计时结束且孩子点击完成",
    childCopy: "递上一杯猫猫笑脸拉花。",
    primaryAsset: "/assets/pomodoro/coffee/barista_serve_drink_counter_close_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/drink_cat_latte_art_close_01.png",
    qaAssertion: "完成按钮可用，提交后进入反思页并生成奖励小票数据。",
  },
  {
    id: "exit",
    label: "暂停",
    trigger: "孩子选择先停一下",
    childCopy: "写一句原因就好，不会变成惩罚。",
    primaryAsset: "/assets/pomodoro/coffee/barista_look_up_counter_close_01.png",
    fallbackAsset: "/assets/pomodoro/coffee/scene_teahouse_empty_wide_01.png",
    qaAssertion: "退出必须选择原因，保存后回到孩子后院，不写入完成证据。",
  },
];

export function getPomodoroIpState(id: PomodoroIpState["id"]) {
  return pomodoroIpStates.find((state) => state.id === id) ?? pomodoroIpStates[0];
}
