# 笔记

### 双感叹号

双感叹号相当于三元运算符
```js
return !!getSomething()
```
等价于
```js
return getSomething() === null ? true : false
```

### CSS 选择器这个是叠加的，既要有 A，也要有 B

这个是后代选择，A 里的 B
```css
.a .b {
  margin: 0;
}
```
```html
<div class="a">
  <div class="b"></div>
</div>
```
这个是叠加的，既要有 A，也要有 B
```css
.a.b {
  margin: 0;
}
```
```html
<div class="a b"></div>
```

### requestAnimationFrame(cb)

类似 `setTimeout()`，一般用于动画，在浏览器刷新前执行

### bind(this)

将当前 context 绑定到某个将来才要执行的 function，用于确保异步调用时 this 的正确性

### 深/浅拷贝

对象的赋值是浅拷贝
```js
let objOld = { x: 1 }
let objNew = objOld

objNew.x = 3
// objOld.x: 3
```
