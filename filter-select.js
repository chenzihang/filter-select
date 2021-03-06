
class Select{
    cancel = false;//再次选中是否可以取消
    dom = null;// 传入的dom，容器，占位元素
    limit = 10; //  最大同时存在的数量
    speed = 2; // 一次滚动下标的增量 可以改为增量值，以此计算下标更流畅些
    option = []; // 总数据
    suppose = null;// 下拉框显示与隐藏前执行的callback，接收state参数，true为显示，false为隐藏,支持通过promise异步操作 
    change = null; // 选中回调, 返回值为false则当前选中行为无效，回调有3个入参，当前选择的数据对象，当前点击的dom，当前select对象
    miul = false; // 多关键词无序模糊匹配 空格间隔关键词
    ic = false; // 是否区分大小写 
    focus_clear = false; // 获取焦点时是否清空输入框
    key = 'name'; // option显示值
    val = 'value';// option具体值 也会是form_input的value
    placeholder = '请选择';
    selected = new Map();// 对外暴露的已选内容
    multiple = false;
    // 禁用 全局禁用和指定选项禁用，全局禁用时外壳与内部选项都置灰，可点开box，选项无法选择
    // 是否开启清空按钮
    // 键盘操作上下 
    //  根据select当前位置向上或向下显示box 动态添加calss，内容为 top: 0px; transform: translate(0px, -100%);
    constructor(o) {
        Object.assign(this, o);
        this.option = JSON.parse(JSON.stringify(this.option));
        this.ev_listener = {}; // document事件列表
        this.p = 0; // 起始下标
        this.init();
    }
    init() {
        this.dom.parentElement.replaceChild(this.create(), this.dom)
        this.data = this.option;
        this.add();
        this.input.oninput()
    }
    create(dom) {//添加基础内容dom // 滚动条不可以直接放到ul同一层，因为select-option-container还是借用了部分系统滚动，放同一层会导致滚动条被滚出去
        let div = dom || document.createElement('div');
        div.innerHTML = `<div class="select-container"><div class="select-input-container"><div class="selected-content"></div><input class="select-input" style="border: none;background: rgba(0,0,0,0);outline: none;flex: 1;width: 0px;"type="text"placeholder="${this.placeholder}"/><span class="select-arrow"></span></div><div class="select-box"><ul class="select-box-content"></ul><div class="select-scroll"><div class="select-scroll-bar"></div></div></div>`;
        let style = document.createElement('style');
        style.id = "select-style";
        style.innerHTML =  `
            .el-icon-close {
                background-color: #c0c4cc;
                top: 0;
                display: inline-block;
                border-radius: 50%;
                text-align: center;
                position: relative;
                cursor: pointer;
                font-size: 12px;
                height: 16px;
                width: 16px;
                line-height: 16px;
                vertical-align: middle;
                margin: -2px 2px 0 2px;
                transform: scale(.8);
            }

            .el-icon-close:before{
                display: block;
                content: "x";
                font-style: normal;
                margin-top: -1px;
            }

            .selected-content {
                display: contents;
            }
            
            .test-span {
                background-color: #f4f4f5;
                border: 1px solid #e9e9eb;
                color: #909399;
                display: inline-block;
                border-radius: 4px;
                // margin: 2px;
                // padding: 2px;
                vertical-align: middle;
                font-size: 12px;
                padding: 2px 0px 2px 8px;
                margin: 2px 5px 2px 0px;
            }
            .selected-content .test-span:nth-last-child(1){
                margin-right:10px;
            }
            .test-span>span{
                margin-right: 5px;
            }
            .select-container {
                color: #333;
                font-size: 14px;
                position: relative;
                width: 100%;
                min-width: 250px;
                background: #fff;
            }
            
            .select-input-container {
                display: flex;
                flex-flow: wrap;
                width: 100%;
                padding: 5px 20px 5px 12px;
                color: #555;
                background-image: none;
                border: 1px solid#ccc;
                border-radius: 4px;
                min-height: 40px;
                box-sizing: border-box;
            }
            
            .select-input-container:hover {
                color: #333;
                background-color: #ebebeb;
                border-color: #adadad
            }
            
            .select-box {
                position: absolute;
                margin-top: 1px;
                width: 100%;
                top: 100%;
                overflow: hidden;
                user-select: none;
                background: #fff;
                z-index: 1000;
                animation:  .1s 1 forwards;
                transform-origin: 0px 0px;
                display:flex;
                transform: scaleY(0)
            }
            
            @keyframes box-block {
                from {
                    transform: scaleY(0)
                }
            
                to {
                    transform: scaleY(1)
                }
            }
            
            @keyframes box-none {
                from {
                    transform: scaleY(1)
                }
            
                to {
                    transform: scaleY(0)
                }
            }
            
            .select-box-content {
                width: 0px;
                flex: 1;
                padding: 0px;
                margin: 0px;
                border: 1px solid;
                border-top: none;
                border: 1px solid rgba(0,0,0,0.15);
                border-radius: 4px;
                text-align: left
            }
            
            .select-box-content li {
                padding: 3px 20px;
                cursor: pointer;
                white-space: nowrap;
                transition: .5s;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            
            .select-box-content li:hover {
                color: #262626;
                text-decoration: none;
                background: #428bca
            }
            
            .select-li-active {
                color: #428bca;
                font-weight: bold;
                position: relative;
            }
            
            .select-li-active:before {
                content: '√';
                position: absolute;
                right: 5px;
                font-family: 黑体;
            }
            
            .select-arrow {
                width: 0;
                height: 0;
                border-width: 5px;
                border-style: solid;
                border-color: #000 transparent transparent transparent;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translate(0px,-25%)
            }
            
            .select-scroll {
                display: none;
                background: #F1F1F1;
                width: 10px;
            }
            
            .select-scroll-bar {
                transition: .2s;
                margin: 0;
                position: absolute;
                right: 0px;
                background: #C1C1C1;
                width: 10px
            }
        `;
        !document.querySelector('#select-style') && document.querySelector('head').appendChild(style);
        this.container = dom || div.querySelector('.select-container');
        this.selected_content = dom || div.querySelector('.selected-content');
        this.input = div.querySelector('.select-input');
        this.scroll = div.querySelector('.select-scroll');
        this.bar = div.querySelector('.select-scroll-bar');
        this.box_content = div.querySelector('.select-box-content');
        this.select_box = div.querySelector('.select-box');
        return this.container;
    }
    details(o) { // 计算li的样式，后续加入禁用、action等状态
        return o.map((item, i) => {
            return `<li ${this.selected.has(item[this.val])? 'class="select-li-active"' : ''} title="${item[this.key]}">${item[this.key]}</li>`
        });
    }
    calcIndex(arr, o) {
        for (let i = 0; i < arr.length; i++)
            if (arr[i] === o) return i;
    }
    calcBar() { // 小于30条的时候加上过度动画
        this.bar.style.height = `${(this.limit / this.data.length * this.box_content.clientHeight).toFixed(2)}px `;
        this.bar.style.minHeight = `5px`;
    }
    calcBarOffset() { // 计算滚动条位置
        this.bar.style.top =
            (this.p / (this.base_num || this.base_num + 1)) * (this.box_content.clientHeight - parseInt(this.bar.style.height))
            + 'px';
        this.scroll.style.display = this.data.length <= this.limit ? 'none' : 'block';
    }
    calcBase() { // 计算基础值
        this.base_max_num = this.data.length - this.limit;
        this.base_num = this.data.length > this.limit ? this.base_max_num : 0;
        this.bar_offset = this.box_content.clientHeight - (parseInt(this.bar.style.height) < 5 ? 5 : parseInt(this.bar.style.height));
    }
    on() {
        // document的绑定事件，对于元素被其他行为移除之类的情况 处理掉全局事件防止干扰,例如v-if、 路由切换之类的
        this.ev_listener[arguments[0]] = ev => {
            let all = document.querySelectorAll('.select-container');
            if ([].find.call(all, item => item === this.container))
                arguments[1](ev);
            else
                document.removeEventListener(arguments[0], this.ev_listener[arguments[0]], false);
        }
        document.addEventListener(arguments[0], this.ev_listener[arguments[0]], false);
    }
    placeSelected(){
        this.selected_content.innerHTML = this.getSelected().map(item => {
            return `<span class="test-span"><span>${item[this.key]}</span><i class="el-tag__close el-icon-close" style="border-radius: 50%;"></i></span>`
        }).join('')
    }
    changetValue(o){
        const selected = this.selected.get(o[this.val])
        if( selected != o && !this.multiple ) this.selected.clear();
        if( selected ){
            this.cancel && this.selected.delete(o[this.val])
        }else{
            this.selected.set(o[this.val],o)
        }
    }
    getSelected(){
        return Array.from(this.selected.values())
    }
    filterData(val) {
        let data = this.option;
        val.map(v => data = data.filter(item => (this.ic ? item[this.key] : (item[this.key]+'').toLowerCase()).includes(v)))
        return data;
    }
    placeDetails(){
        this.p = this.p > this.base_max_num ? this.base_num : (this.p < 0 ? 0 : this.p);
        this.box_content.innerHTML = this.details(this.data.slice(this.p, this.p + this.limit)).join('');
    }
    update(val = [],option = this.option){
        this.option = JSON.parse(JSON.stringify(option));
        this.selected.clear();
        [].concat(val).map(vals => {
            const res = this.option.find(item => item[this.val] == vals); // 后续以key对option建个查询表
            res && this.changetValue(res)
        })
        // this.placeDetails()
        if(this.multiple)
        this.placeSelected()
        else
            this.setInputVal()
    }
    relationBox(){ // 处理下关联的 box
        let box_all = document.querySelectorAll('.select-box');  
        [].map.call(box_all,item => item != this.select_box && (item.style.animationName = 'box-none'));
    }
    setInputVal(){
        const selected = this.getSelected();
        this.input.value = selected[0]?selected[0][this.key]:''
    }
    copyText(txt) {//文本复制
        const $textarea = document.createElement('textarea');
        $textarea.value = txt;
        document.body.appendChild($textarea);
        $textarea.select(); 
        document.execCommand("Copy"); 
        $textarea.remove()
    }
    async toggle(state){
        if(this.suppose && (await this.suppose(state,this) === false)) return ;
        const style = this.select_box.style
        if(state){
            style.animationName = 'box-block';
            this.input.value = '';
        }else{
            style.animationName = 'box-none';
            !this.multiple && this.setInputVal()
        }
    }
    add() { // 绑定事件
        this.input.oninput = (p,focus) => { // 输入搜索触发
            let val = this.input.value.trim();
            val = this.ic ? [val] : [(val+'').toLowerCase()];
            this.miul && (val = val[0].replace(/\s+/g, ' ').split(' '));
            this.data = this.filterData(val);
            this.p = this.calcIndex(this.option, this.getSelected()[0] || this.option[0]);
            
            this.placeDetails()
            this.calcBar();
            this.calcBase();
            this.calcBarOffset();
        }
        this.input.onclick = ev => ev.stopPropagation()
        this.input.onfocus = async (ev) => {
            await this.toggle(true)
            this.input.oninput(this.p,true)
            this.relationBox()
        }
        this.box_content.onmousewheel = ev => { //滚轮
            this.bar.style.transition = '';
            this.p += parseInt(ev.wheelDelta > 0 ? -this.speed : this.speed);
            this.placeDetails();
            this.calcBarOffset()
            return false;
        };
        this.scroll.onmousedown = ev => {
            let sy = ev.offsetY > this.bar_offset ? this.bar_offset : ev.offsetY;
            this.bar.style.top = sy + 'px';
            this.p = (ev.offsetY / this.bar_offset * this.base_max_num).toFixed() - 0;
            this.placeDetails();
        }
        this.bar.onmousedown = e => { // 滚动条拖拽
            let base_y = e.y;
            this.bar.style.transition = 'none';
            this.scroll_ing = true;
            e.stopPropagation()
            this.on('mousemove', ev => {
                let sy = parseInt(this.bar.style.top || 0) + (ev.y - base_y);
                sy = sy > this.bar_offset ? this.bar_offset : (sy < 0 ? 0 : sy);
                this.bar.style.top = sy + 'px';
                base_y = ev.y;

                this.p = (sy / this.bar_offset * this.base_max_num).toFixed() - 0;
                this.placeDetails();
            })
            this.on('mouseup', ev => {
                this.bar.style.transition = '';
                ev.path.find(item => item.className === 'select-container') && (this.scroll_ing = false);
                document.removeEventListener('mousemove', this.ev_listener['mousemove'], false)
                document.removeEventListener('mouseup', this.ev_listener['mouseup'], false)
            });
        };
        this.container.oncontextmenu = () => false
        this.container.onmouseup = ev => {
            if (ev.target.localName !== 'li')  return;
            ev.button == 2 && this.copyText(ev.target.innerText)
        }
        this.container.onclick = async ev => {
            if (ev.target.localName === 'li') {
                const index = this.calcIndex(this.box_content.children, ev.target)
                const res = this.data.slice(this.p, this.p + this.limit)[index];
                this.changetValue(res)
                this.placeDetails()
                this.multiple && this.placeSelected()
                this.toggle(false)
                this.change && this.change( res,this.getSelected(), ev.target ,this );
            }
            if (ev.target.className.includes('el-icon-close') ) {
                const list = this.selected_content.querySelectorAll('.el-icon-close');
                let index = this.calcIndex(list, ev.target)
                const res = this.getSelected()[index];
                this.selected.delete(res[this.val])
                this.placeDetails()
                this.placeSelected()
            }
            /* 要注意多个box的情况下，其他box的隐藏处理*/
        }
        this.on('click', async ev => {
            let box = ev.path.find(item => item.className === 'select-box');
            (!box && !this.scroll_ing) && this.select_box.style.animationName == 'box-block' && await this.toggle(false);
            this.scroll_ing = false; // 因拖拽行为会导致误触发，所以使用scroll_ing区分下
        })
    }
};
export default Select