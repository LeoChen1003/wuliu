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
  > 数组操作注意for-in和for-of的选择
  > **复杂逻辑请写注释**

- HTML
  > XMLtag无需闭合，请使用`<... />`直接描述  
  > Int类型的绑定请使用`v-module.number`  
  > 如果是Number类型的`el-input`请注意设置`@mousewheel.native.prevent`   
  > 请避免`defined but not used`  
  > 请注意`v-for`中`:key`的定义  
  > 请尽量用`===`代替`==`

- CSS
  > 请使用`scss`的css语言类型  
  > 不要将常用类名直接写入非`scope`的style标签，如有需要请进行嵌套使用避免样式污染  
  > 在使用`scope`的情况下请不要过度嵌套，影响可读性  
      
