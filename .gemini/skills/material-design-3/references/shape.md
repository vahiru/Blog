# M3 形状与圆角 (Shape)

形状系统用于定义组件的视觉边缘，反映组件的个性和层级。

## 圆角等级表 (Corner Radius)

| 等级 | 数值 (dp) | 典型应用组件 |
| :--- | :--- | :--- |
| **None** | 0 | 全屏容器、直角边缘 |
| **Extra Small** | 4 | 提示框 (Tooltip)、菜单项 (Menu Item) |
| **Small** | 8 | 输入框 (Text Field)、标签 (Chip)、小按钮 |
| **Medium** | 12 | 卡片 (Card)、小对话框 |
| **Large** | 16 | 核心对话框 (Dialog)、标准 FAB |
| **Extra Large** | 28 | 导航抽屉 (Navigation Drawer)、搜索栏、大型 FAB |
| **Full** | 圆形 | 徽章 (Badge)、开关手柄 (Switch Handle)、圆形按钮 |

## 设计原则
- **一致性:** 同类组件应使用相同的圆角等级。
- **层级:** 较大的容器（如对话框）通常使用较大的圆角，以从背景中分离。
