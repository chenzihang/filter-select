# filter-select
针对大数据量的select优化，支持单选，多选，模糊搜索，多关键词搜索 <br/>
vue等工程内使用需手动包装，通过getSelected获取value，update更新数据<br/>
const _select = new Select({ <br/>
&nbsp;&nbsp;&nbsp;&nbsp;cancel : false, // //再次选中是否可以取消, <br/>
&nbsp;&nbsp;&nbsp;&nbsp;dom : null,// 传入的dom，容器，占位元素<br/>
&nbsp;&nbsp;&nbsp;&nbsp;limit : 10, //  最大同时存在的数量<br/>
&nbsp;&nbsp;&nbsp;&nbsp;speed : 2, // 一次滚动下标的增量 可以改为增量值，以此计算下标更流畅些<br/>
&nbsp;&nbsp;&nbsp;&nbsp;option : [], // 总数据<br/>
&nbsp;&nbsp;&nbsp;&nbsp;focus : null,// 获取焦点回调 <br/>
&nbsp;&nbsp;&nbsp;&nbsp;change : null, // 选中回调, 有4个入参，当前点击数据对象，当前value，当前点击的dom，当前select对象<br/>
&nbsp;&nbsp;&nbsp;&nbsp;miul : false, // 多关键词无序模糊匹配 空格间隔关键词<br/>
&nbsp;&nbsp;&nbsp;&nbsp;ic : false, // 是否区分大小写 <br/>
&nbsp;&nbsp;&nbsp;&nbsp;key : 'name', // 显示键<br/>
&nbsp;&nbsp;&nbsp;&nbsp;val : 'value',// value键<br/>
&nbsp;&nbsp;&nbsp;&nbsp;placeholder : '请选择', <br/>
&nbsp;&nbsp;&nbsp;&nbsp;selected : new Map(), <br/>
&nbsp;&nbsp;&nbsp;&nbsp;multiple : false, // 多选 <br/>
})<br/>
<br/>
_select.getSelected() // 获取value<br/>
_select.update(value) // 更新value<br/>
