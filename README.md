# filter-select
针对大数据量的select优化，支持单选，多选，模糊搜索，多关键词搜索,键盘操作，连选，自定义匹配规则 <br/>
方便拓展使用原生写的，不依赖任何库，vue等工程内使用需手动包装，以下参数皆为默认值，dom & option必传，通过getSelected获取value，update更新数据<br/>
仅支持chrome，后续有需要再加入兼容
```
const _select = new Select({ 
    dom : null,         // 必传 。传入的dom，容器，占位元素
    cancel : false,     // 再次选中是否可以取消, 
    filter: null,       // 筛选回调函数，开启时将覆盖原本的匹配规则，且对miul参数造成一定影响
    limit : 10,         //  最大同时存在的数量
    speed : 2,          // 一次滚动下标的增量 可以改为增量值，以此计算下标更流畅些
    option : [],        // 总数据
    suppose : null,     // 下拉框显示与隐藏前执行的callback，接收type参数，区分show、selected、cancel三种状态，,支持通过promise异步操作 
    change : null,      // 选中回调, 有3个入参，当前value，被操作对象，ev
    miul : false,       // 多关键词无序模糊匹配 空格间隔关键词
    ic : false,         // 是否区分大小写 
    key : 'name',       // 显示键
    val : 'value',      // value键
    placeholder : '请选择', 
    multiple : false,   // 多选 
})

_select.getSelected()   // 获取value
_select.update(value,option)   // 更新value或option


