#### 此项目基于 ElementAdmin

https://panjiachen.github.io/vue-element-admin-site/zh/

## 项目使用 ESLint+Prettier 进行代码格式验证

推荐使用 Webstrom 或者 VSCode 并安装 Prettier 插件  
**请尽量避免由代码格式不同步引起的合并冲突**

---

使用基于 ES6 的代码规范但不完全一致  
Coding 时请注意以下事项：

- JavaScript

  > 使用`let`和`const`进行变量、常量定义操作  
  > 使用箭头函数进行函数定义操作  
  > 请避免`defined but never used`  
  > 请避免复杂的三元判断  
  > 请尽量用`===`代替`==`  
  > 字符串优先使用双引号，变量及变量操作优先使用反引号  
  > 优先使用解构赋值  
  > 多行定义的对象也以逗号结尾
  >
  > ```javascript
  > const a = 10;
  > let panda = {
  >   black: 10,
  >   white: 20,
  >   printA: `print:${a}`
  > };
  > ```
  >
  > 数组操作注意 for-in 和 for-of 的选择  
  > **复杂逻辑请写注释**

* HTML

  > XMLtag 无需闭合，请使用`<... />`直接描述  
  > Int 类型的绑定请使用`v-module.number`  
  > 如果是 Number 类型的`el-input`请注意设置`@mousewheel.native.prevent`  
  > 请避免`defined but not used`  
  > 请注意`v-for`中`:key`的定义  
  > 请尽量用`===`代替`==`

- CSS

  > 请使用`scss`的 css 语言类型  
  > 不要将常用类名直接写入非`scope`的 style 标签，如有需要请进行嵌套使用避免样式污染  
  > 在使用`scope`的情况下请不要过度嵌套，影响可读性

* Version Control

  > `master`对应生产环境  
  > `milestone`对应迭代的版本  
  > 请避免直接操作`milestone`分支  
  > 迭代开发时请在对应的`milestone`分支检出新分支进行 coding  
  > 线上紧急 fix 请在`master`检出新分支，修复后测试完毕并入 master 更新生产环境代码  
  > 请保持和线上代码的进度同步  
  > 请定时提交代码，防止本地代码丢失  
  > 代码提交时请描述清楚更新内容
  >
  > > 更新内容请尽量以下标准描述：  
  > > A(新增) 新增的内容  
  > > U(优化) 优化、修改的内容  
  > > F(修复) 以BUG为基准修复的内容  
  > > ```text
  > > A 新增了下单时的提示
  > > U 优化了google map载入失败的提示
  > > F 修复了禅道的 #39 #40 bug
  > > F 修复了google map载入失败后页面逻辑中断的问题
  > > ```
  > > 其他内容请额外描述
                                                                                                                                                                                                                                                                       >
