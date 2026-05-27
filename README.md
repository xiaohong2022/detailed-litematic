# Detailed Litematic
更详细的 Litematic 材料列表，从此告别材料集不全的痛苦！

### 灵感来源
我最近玩上了 Minecraft 的生电玩法，投影（Litematica）是我几乎用得最多的一个工具。
然而，它自带的材料列表仅仅只有需要用到的方块。
有一个刷怪塔需要用到 24 个矿车，没错，它是实体不是方块。我当时就漏了收集，导致我搭建时又要跑回家做矿车（（（
有没有什么方法能解决上面的痛苦呢？Detailed Litematic 因此而生。
此外，我还加了部分方块状态需要用到的材料。这属于是锦上添花了，让这个工具有了更丰富的功能）

### 功能介绍
1. 方块状态智能提示
含水方块、堆肥桶填充、植物种植、下界岩点火等

![方块状态智能提示](/images/items-block-state.png)

> 堆肥桶：至少需要用 7 小麦种子来预填充堆肥桶
> 打火石：至少需要打 45 个火
> 发光浆果：有 8 个洞穴藤曼需要用 剪刀 截断；需要用 7 骨粉来催熟以附上 发光浆果
> 橡树树叶：有 10 橡树树叶需要含水

2. 容器填充
加号下展示了该容器可能需要填充的物品：
![容器填充](/images/items-container.png)

> 一些投掷器需要填满箭，一些需要填满潜影盒，一些需要填满漏斗矿车，以及一些需要填充一些盔甲架

3. 物品总计
智能总计所有物品，不用担心箱子不够装不下！

![物品总计](/images/items-total.png)

> 使用无限水：只准备 2 个水桶以制取无限水
> 忽略填充：不计算容器填充的物品（堆肥桶、炼药锅等不是容器）
> 忽略管理员物品：不计算如屏障、结构方块等物品

### 说明
1. 目前仅支持原版，参考版本 1.21.11
2. 目前刚完成基础部分，但仍可能存在部分方块或实体无法解析

若您遇到了问题 或 想参与贡献，欢迎您提交 Issue 或 PR！

### 项目组成
- Vite + Vue + TypeScript
- 组件库：[Arco Design](https://arco.design) 
- `.nbt` 文件解析：[nbtify](https://github.com/Offroaders123/NBTify)

### 特别说明
- 参考了 [EndingCredits/litematic-viewer](https://github.com/EndingCredits/litematic-viewer) 的 [投影区域方块解析代码](https://github.com/EndingCredits/litematic-viewer/blob/main/src/litematic-utils.js#L45)
- 使用了 [中文 Minecraft Wiki](https://zh.minecraft.wiki/) 的 物品图片资源
