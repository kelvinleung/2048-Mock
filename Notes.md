双感叹号相当于三元运算符

css 中：

```css
.a .b {
  margin: 0;
}
```
这个是后代选择，A 里的 B
```html
<div class="a">
  <div class="b"></div>
</div>
```

```css
.a.b {
  margin: 0;
}
```
这个是叠加的，既要有 A，也要有 B
```html
<div class="a b"></div>
```
