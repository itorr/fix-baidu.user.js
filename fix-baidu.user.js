// ==UserScript==
// @name        百度结果筛选-去除包含不想看到网站的结果
// @namespace   https://lab.magiconch.com/
// @match       https://www.baidu.com/s*
// @match       https://www.baidu.com/
// @grant       none
// @version     1.1
// @author      itorr
// @description 2022/4/30
// ==/UserScript==

const styleString = `
.o1{opacity:.1}
.o1:hover{opacity:.12}

#con-ar{
    opacity:0;
    pointer-events: none;
}

.o1,
.toindex,
#content_right,
#foot,
#s_wrap,
.s-news-wrapper,

[mu*="csdn.net"],


[title*="csdn"],
[title*="CSDN"],

[data-key*="csdn"],
[data-key*="CSDN"],

div[class^="options_"],



a[href*="wenku.baidu.com/"],
a[href*="https://b2b.baidu.com/"]{
display:none !important;
}

#page{
background:none !important;
}
body{
padding-bottom:300px;}

.wrapper_new #head.s_down{
    box-shadow: none;
}
#head {
    background:rgba(255,255,255,.9);
}

body{
   min-width: auto;
}
#head_wrapper{
   min-width: auto;
   width:auto;
}
#s_wrap,
.s-skin-container,
#s_top_wrap{
   min-width: auto;
}

`;

const styleEl = document.createElement('style');
styleEl.setAttribute('a',1);
styleEl.innerHTML = styleString;


const regex = /百度文库|广告|block !important/i;

const check = _=>{
    document.head.appendChild(styleEl);

    let parentEl = document;
    if(window.container){
        parentEl = window.container;
    }
    [...parentEl.querySelectorAll('.result,#content_left>div')].forEach(el=>{
        if(el.classList.contains('o1')) return;

        const html = el.innerHTML;
        if(regex.test(html)){
            el.classList.add('o1')
        }
    });

    if(window.page)window.page.onclick = pageOnClick;
};

const pageOnClick = e=>{
    e.stopPropagation();
};

const {open,send} = XMLHttpRequest.prototype;

const openReplace = function(){
    //console.log(this,arguments);

    setTimeout(check);
    this.addEventListener('load',_=>{
        // console.log(this)
        setTimeout(check)
    });
    return open.apply(this,arguments);
}
XMLHttpRequest.prototype.open = openReplace;


const createElement = document.createElement;
const unLoadTags = ['SCRIPT','IMG','LINK'];
const createElementReplace = function(){
    const el = createElement.apply(this,arguments);
    //console.log(el);
    if(unLoadTags.includes(el.tagName)){
       Object.defineProperty(el,'src',{set(v){
           console.log(/给你屏蔽了/,v)
       }})
    }
    setTimeout(check);
    el.addEventListener('load',check);
    return el;
}
document.createElement = createElementReplace;

check();
window.addEventListener('popstate',check);

let loading = true;
const run = _=>{
    if(!loading) return check();

    requestAnimationFrame(run);
    check();
}
run();

Image = function(){return {}}


document.addEventListener("DOMContentLoaded",check);

window.addEventListener('load',_=>{
    console.log('onload')
    loading = false;
    check();
    setTimeout(check)
});


