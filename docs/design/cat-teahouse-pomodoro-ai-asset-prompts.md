# 猫猫森林饮品店番茄钟 AI 素材生成提示词

日期：2026-05-25  
用途：Reward MVP 猫咪主题番茄钟视觉资产生成  
目标：做一个低刺激、白噪音感、适合 25 分钟专注的猫猫森林饮品店场景。

## 0. 统一风格说明

所有素材保持同一视觉世界观：

- 主题：森林里的猫猫饮品店 / 猫猫奶茶厅 / 安静吧台。
- 氛围：温暖、安静、陪伴、低刺激、夜晚森林、小屋灯光、自然植物。
- 画风：手绘 2D 插画，童话感，柔和边缘，深绿森林与暖黄色灯光，轻微颗粒质感。
- 参考方向：森林小屋、猫咪后院、温柔游戏 UI 背景、低饱和深绿、木质吧台、植物环绕。
- 动画原则：慢、少、轻，不吸引注意，不出现强烈闪烁、夸张表情、大幅移动。
- 画面约束：不要文字、不要 logo、不要水印、不要复杂 UI、不要强对比霓虹、不要写实摄影。
- 输出优先：16:9 横屏，适合电脑端番茄钟主画面。

通用负面提示词：

```text
no text, no logo, no watermark, no UI, no subtitles, no realistic photo, no horror, no aggressive expression, no neon cyberpunk, no strong flashing light, no fast motion, no busy composition, no cluttered characters, no human, no school, no brand, no product label, no high contrast, no sharp 3D render
```

## 阶段 1：必须生成的核心素材

这些素材决定番茄钟能不能先跑起来。会员快到期时，优先生成这一阶段。

### A01 主背景：森林猫猫饮品店吧台

用途：番茄钟主场景背景。  
建议格式：PNG/JPG，16:9，1920x1080。  
是否需要透明：不需要。  
优先级：最高。

图片生成提示词：

```text
A quiet forest cat teahouse interior at night, cozy wooden drink bar in the center, lush dark green leaves and oversized plants surrounding the shop, warm soft yellow lamp light, tiny cups and teapot on the counter, magical but calm woodland atmosphere, no characters yet, empty space behind the bar for a cat barista, empty stool silhouettes in front of the counter, hand-drawn 2D illustration, soft rounded shapes, muted deep green and warm amber palette, gentle grain texture, low stimulation, peaceful focus timer background, 16:9 composition, no text, no logo, no watermark
```

中文辅助提示词：

```text
夜晚森林里的猫猫饮品店，中央是木质吧台，周围有深绿色植物和藤蔓，暖黄色小灯，吧台上有杯子和茶壶，画面安静温柔，童话手绘 2D 插画，低饱和深绿和暖黄配色，适合番茄钟专注背景，没有角色，没有文字。
```

### A02 分层前景：吧台与植物遮挡层

用途：放在角色前面，增强“猫在吧台后”的空间感。  
建议格式：透明 PNG，1920x1080。  
是否需要透明：需要。  
优先级：最高。

图片生成提示词：

```text
Transparent foreground layer for a cozy forest cat teahouse, wooden bar counter across the lower middle of the frame, a few cups, small teapot, leaves and vines framing the edges, warm amber highlights, hand-drawn 2D illustration, soft rounded shapes, same muted deep green and warm wooden palette, designed as an overlay layer, empty transparent background above and behind the counter, no characters, no text, no logo, no watermark
```

生成要求：

- 必须透明背景。
- 吧台高度控制在画面下方 35%-45%。
- 中央预留主猫位置。

### A03 主猫猫：吧台后 idle

用途：番茄钟默认陪伴角色。  
建议格式：透明 PNG，1024x1024 或 768x768。  
是否需要透明：需要。  
优先级：最高。

图片生成提示词：

```text
A calm cat barista standing behind a wooden teahouse counter, small rounded body, gentle face, sleepy warm eyes, soft paws resting near a cup, forest teahouse outfit with tiny apron, hand-drawn 2D illustration, cozy woodland game style, muted green and warm cream colors, low stimulation, cute but not overly expressive, transparent background, centered full body upper half, no text, no logo, no watermark
```

建议角色设定：

- 主猫：橘白猫或奶油色猫。
- 表情：平静、轻微困倦、温柔。
- 不要大笑、不要过度卖萌。

### A04 主猫猫 idle 动画

用途：专注中循环动画。  
建议格式：视频 8-12 秒循环，或 8-12 帧透明 PNG 序列。  
优先级：最高。

视频生成提示词：

```text
Looping animation of a calm cat barista behind a wooden forest teahouse counter, the cat barely moves, slow blinking once, tiny ear twitch, tail moves very slightly, one paw gently adjusts a cup, warm soft lamp light, cozy hand-drawn 2D animation, muted forest green and amber palette, very slow motion, low stimulation, seamless loop, no camera movement, no text, no logo, no watermark
```

动画约束：

- 循环时长：8-12 秒。
- 动作幅度：很小。
- 不要频繁眨眼。
- 不要明显跳动。
- 不要镜头推拉。

### A05 主猫猫调饮动画

用途：番茄钟中随机低频播放的小动作。  
建议格式：视频 8-12 秒循环，或透明 PNG 序列。  
优先级：高。

视频生成提示词：

```text
Looping animation of a quiet cat barista slowly preparing a warm drink behind a wooden counter, gentle stirring, tiny steam rising from a cup, the cat keeps a calm focused expression, very small hand movement, cozy forest teahouse background feeling, hand-drawn 2D animation, muted deep green and warm amber colors, slow white-noise-like motion, no attention-grabbing action, no camera movement, seamless loop, no text, no logo, no watermark
```

### A06 点击反馈：主猫抬头看一眼

用途：用户在番茄钟未结束前点击屏幕时触发。  
建议格式：2-3 秒透明 WebM/PNG 序列。  
优先级：高。

视频生成提示词：

```text
A calm cat barista behind a wooden forest teahouse counter slowly raises its head and looks toward the viewer for one gentle second, then softly lowers its gaze back to the drink, no surprise, no exaggerated expression, just a quiet noticing gesture, hand-drawn 2D animation, transparent background, very slow and subtle motion, low stimulation, no text, no logo, no watermark
```

交互约束：

- 只看一眼，不做招手。
- 不要做“被打扰”的负面表情。
- 建议点击后冷却 60 秒以上。

### A07 完成反馈：主猫递出饮品

用途：25 分钟完成后的轻仪式感反馈。  
建议格式：4-6 秒透明 WebM/PNG 序列。  
优先级：最高。

视频生成提示词：

```text
A gentle cat barista behind a wooden forest teahouse counter slowly slides a finished warm drink toward the viewer, the drink has a cute cat smile latte art on top, tiny soft steam, the cat has a calm proud expression, cozy hand-drawn 2D animation, warm amber light, muted forest colors, subtle celebratory feeling but not flashy, no confetti, no strong glow, no text, no logo, no watermark, transparent background
```

### A08 完成饮品：猫猫笑脸拉花

用途：完成状态静态展示，可作为完成卡片或饮品停留画面。  
建议格式：透明 PNG，512x512。  
优先级：最高。

图片生成提示词：

```text
A warm cup of milk tea or latte viewed from slightly above, cute simple cat smile latte art on the foam, small rounded cup, tiny soft steam, cozy forest teahouse style, hand-drawn 2D illustration, warm cream and amber colors, transparent background, no text, no logo, no watermark
```

### A09 客猫背影：15 分钟出现

用途：15 分钟左右进入吧台前，作为温柔的时间流逝提示。  
建议格式：透明 PNG，512x768。  
优先级：高。

图片生成提示词：

```text
Back view of a quiet small cat customer sitting on a stool in front of a wooden teahouse counter, rounded silhouette, soft ears, relaxed posture, no face visible, cozy woodland game style, muted green and warm brown colors, hand-drawn 2D illustration, transparent background, calm and unobtrusive, no text, no logo, no watermark
```

### A10 客猫入座动画

用途：15 分钟左右，客猫慢慢出现并坐下。  
建议格式：5-8 秒透明 WebM/PNG 序列。  
优先级：中高。

视频生成提示词：

```text
A quiet small cat customer enters slowly from the side and sits on a stool in front of a wooden forest teahouse counter, seen mostly from behind, very slow and subtle motion, calm white-noise-like animation, no face close-up, no waving, no attention-grabbing action, hand-drawn 2D animation, transparent background, muted forest green and warm wood colors, no text, no logo, no watermark
```

## 阶段 2：白噪音氛围素材

这些素材能让画面更“活”，但不应该抢注意力。

### B01 暖光呼吸层

用途：让饮品店灯光有轻微呼吸感。  
建议格式：透明 PNG 或 10 秒循环视频，1920x1080。  
优先级：中。

图片生成提示词：

```text
Transparent warm amber light overlay for a cozy forest teahouse, soft lamp glow patches, gentle radial light around counter and small window, very subtle, no hard edges, hand-painted 2D texture, transparent background, no text, no logo, no watermark
```

视频生成提示词：

```text
Seamless looping warm amber light breathing overlay, very subtle brightness change, cozy forest teahouse atmosphere, transparent background, no objects, no camera movement, no flicker, no text, no logo, no watermark
```

### B02 杯中热气循环

用途：吧台杯子或完成饮品上方轻微蒸汽。  
建议格式：透明 WebM 或 PNG 序列，256x256。  
优先级：中。

视频生成提示词：

```text
Tiny soft steam rising slowly from a warm drink, hand-drawn 2D animation, transparent background, very subtle white semi-transparent lines, slow seamless loop, low contrast, no text, no logo, no watermark
```

### B03 植物轻摆动画

用途：边缘叶子极慢摆动，增强森林呼吸感。  
建议格式：透明 WebM，1920x1080，10-20 秒循环。  
优先级：中。

视频生成提示词：

```text
Transparent overlay of forest leaves and vines at the edges of the frame moving very slowly, almost still, gentle night breeze, hand-drawn 2D animation, muted deep green colors, seamless loop, no center movement, no text, no logo, no watermark
```

### B04 远处萤火微光

用途：背景深处低频闪动的小光点。  
建议格式：透明 WebM，1920x1080。  
优先级：低到中。

视频生成提示词：

```text
Very few tiny firefly lights in a dark forest teahouse background, slow dim glow, sparse and subtle, no flashing, no strong brightness, hand-drawn 2D animation overlay, transparent background, seamless loop, no text, no logo, no watermark
```

注意：

- 萤火数量少于 8 个。
- 不要做频繁闪烁。
- 透明度控制低。

### B05 木质吧台小道具

用途：可替换的小杯子、茶壶、点心等静态装饰。  
建议格式：透明 PNG，单个 256x256 或合集 1024x1024。  
优先级：中。

图片生成提示词：

```text
A small set of cozy forest teahouse props: tiny milk tea cup, ceramic teapot, wooden tray, small cookie shaped like a leaf, little spoon, warm cup, hand-drawn 2D illustration, muted green cream amber colors, transparent background, no text, no logo, no watermark
```

## 阶段 3：状态与 UI 配套素材

这些素材用于把番茄钟和产品界面连接起来。

### C01 25 分钟开始状态插图

用途：用户开始专注前的按钮区域或说明卡片。  
建议格式：PNG，1024x768。  
优先级：中。

图片生成提示词：

```text
A calm cat barista preparing a small warm drink before opening the forest teahouse counter, cozy hand-drawn 2D illustration, quiet preparation mood, muted forest green and amber palette, low stimulation, no text, no logo, no watermark
```

### C02 专注进行中状态插图

用途：计时过程中备用静态图。  
建议格式：PNG，1024x768。  
优先级：中。

图片生成提示词：

```text
A quiet forest cat teahouse during focus time, cat barista gently working behind the counter, one warm lamp, deep green plants, peaceful stillness, hand-drawn 2D illustration, low stimulation, no text, no logo, no watermark
```

### C03 中途来客状态插图

用途：15 分钟后或中段状态。  
建议格式：PNG，1024x768。  
优先级：中。

图片生成提示词：

```text
A quiet cat customer seen from behind sitting at the forest teahouse counter while the cat barista calmly prepares a drink, warm lamp light, deep green forest plants, peaceful hand-drawn 2D illustration, subtle time passing feeling, no text, no logo, no watermark
```

### C04 完成状态插图

用途：完成页或完成弹层背景。  
建议格式：PNG，1024x768。  
优先级：高。

图片生成提示词：

```text
A cat barista gently offering a finished warm drink with cute cat smile latte art in a cozy forest teahouse, soft warm light, peaceful completion mood, no celebration confetti, no flashy effects, hand-drawn 2D illustration, muted forest green and amber palette, no text, no logo, no watermark
```

### C05 退出/暂停状态插图

用途：孩子中途退出或暂停时，给温和反馈。  
建议格式：PNG，1024x768。  
优先级：低到中。

图片生成提示词：

```text
A calm cat barista gently covering a warm drink with a small lid on a wooden counter, peaceful forest teahouse, soft expression, message of pausing without failure, hand-drawn 2D illustration, muted green and warm amber, no text, no logo, no watermark
```

### C06 修复/待复盘状态插图

用途：家长选择待复盘时，不给判罚感。  
建议格式：PNG，1024x768。  
优先级：低到中。

图片生成提示词：

```text
Two small cups on a wooden forest teahouse counter, a calm cat barista places them side by side, gentle family conversation mood, no judgment, no conflict, warm soft light, hand-drawn 2D illustration, muted deep green and amber palette, no text, no logo, no watermark
```

## 阶段 4：可选扩展素材

会员时间充裕时再生成。不是 MVP 必需。

### D01 不同主猫皮肤

用途：未来个性化。  
建议格式：透明 PNG，1024x1024。  
优先级：低。

提示词模板：

```text
A calm [cat type] cat barista standing behind a wooden forest teahouse counter, gentle sleepy eyes, tiny apron, hand-drawn 2D illustration, cozy woodland game style, transparent background, low stimulation, no text, no logo, no watermark
```

可替换 cat type：

- orange tabby
- cream white cat
- black cat with warm eyes
- calico cat
- gray fluffy cat

### D02 不同饮品

用途：完成奖励变化。  
建议格式：透明 PNG，512x512。  
优先级：低。

提示词模板：

```text
A cozy hand-drawn cup of [drink type] with simple cat smile latte art, tiny soft steam, warm forest teahouse style, transparent background, no text, no logo, no watermark
```

可替换 drink type：

- warm milk tea
- honey tea
- hot cocoa
- oat milk latte
- flower tea

### D03 季节背景变体

用途：未来主题皮肤。  
建议格式：PNG，1920x1080。  
优先级：低。

提示词模板：

```text
A quiet forest cat teahouse in [season], cozy wooden drink bar, soft warm lamp light, lush plants, hand-drawn 2D illustration, muted colors, low stimulation, no characters, 16:9, no text, no logo, no watermark
```

可替换 season：

- spring rain
- summer night
- autumn leaves
- winter warm window

## 5. 视频生成总规则

给 AI 视频软件时，尽量附加这些统一要求：

```text
very slow subtle loop, no camera movement, no zoom, no cut, no fast motion, no dramatic expression, no flashing, no particle explosion, no confetti, low stimulation, calm white noise visual, seamless loop, stable character shape, stable background
```

建议视频参数：

- 主循环：8-12 秒。
- 环境循环：10-20 秒。
- 点击反馈：2-3 秒。
- 完成反馈：4-6 秒。
- 帧率：12-24fps 均可。
- 构图：固定镜头。
- 输出：优先透明 WebM；如果不支持透明，则输出绿幕/纯色背景，后期抠像。

## 6. 推荐生成顺序

如果时间非常紧，按这个顺序生成：

1. A01 主背景。
2. A03 主猫 idle 静态。
3. A04 主猫 idle 动画。
4. A07 完成递饮品动画。
5. A08 完成饮品静态。
6. A09 客猫背影。
7. A10 客猫入座动画。
8. A06 主猫抬头动画。
9. B02 蒸汽循环。
10. B01 暖光呼吸层。

如果只能生成 5 个：

1. 主背景。
2. 主猫 idle 动画。
3. 主猫抬头动画。
4. 客猫入座动画。
5. 完成递饮品动画。

## 7. 文件命名建议

```text
pomodoro_teahouse_bg_main_16x9.png
pomodoro_teahouse_foreground_counter.png
cat_barista_idle.png
cat_barista_idle_loop.webm
cat_barista_make_drink_loop.webm
cat_barista_look_up.webm
cat_barista_serve_drink.webm
drink_cat_latte_art.png
guest_cat_back.png
guest_cat_enter_sit.webm
overlay_warm_light_loop.webm
overlay_steam_loop.webm
overlay_leaves_sway_loop.webm
```

## 8. 落地到产品时的建议

- 0-15 分钟：背景 + 主猫 idle/调饮 + 蒸汽。
- 15-25 分钟：客猫慢慢入座，随后保持静坐背影。
- 用户中途点击：播放主猫抬头动画一次，然后回 idle。
- 完成：播放递饮品动画，停留在猫猫笑脸拉花饮品。
- 暂停/退出：不要惩罚画面，使用“盖上杯盖，稍后继续”的温和意象。

