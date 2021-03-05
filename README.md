# filter-select
针对大数据量的select优化，支持单选，多选，模糊搜索，多关键词搜索
vue等工程内使用需手动包装，通过getSelected获取value，update更新数据
const _select = new Select({
    cancel : false, // //再次选中是否可以取消,
    dom : null,// 传入的dom，容器，占位元素
    limit : 10, //  最大同时存在的数量
    speed : 2, // 一次滚动下标的增量 可以改为增量值，以此计算下标更流畅些
    option : [], // 总数据
    focus : null,// 获取焦点回调 
    change : null, // 选中回调, 有4个入参，当前点击数据对象，当前value，当前点击的dom，当前select对象
    miul : false, // 多关键词无序模糊匹配 空格间隔关键词
    ic : false, // 是否区分大小写 
    key : 'name', // 显示键
    val : 'value',// value键
    placeholder : '请选择',
    selected : new Map(),
    multiple : false, // 多选
})

_select.getSelected() // 获取value
_select.update(value) // 更新value
