(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5a46bb88"],{"317c":function(t,e,a){"use strict";var s=a("f38b"),r=a.n(s);r.a},"7cdf":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"study page"},[a("div",{staticClass:"study-header"},t._l(t.navs,function(e){return a("span",{key:e,class:t.current===e?"active":"",on:{click:function(a){return t.selectNav(e)}}},[t._v("\n      "+t._s(e)+"\n    ")])}),0),a("div",{staticClass:"study-album"},t._l(t.album,function(e){return a("div",{key:e.title,staticClass:"study-album-item",attrs:{"data-href":"https://"+t.keyword+".org/"+e.href},on:{click:function(a){return t.toDetail(e.href,e.title)}}},[a("div",{staticClass:"study-album-item-cover"},[a("img",{attrs:{src:"https://"+t.keyword+"/"+e.cover,alt:""}})]),a("span",{staticClass:"study-album-item-title"},[t._v(t._s(e.title))])])}),0),a("div",{staticClass:"study-pagination"},[a("span",{directives:[{name:"show",rawName:"v-show",value:this.currentPage<this.totalPages,expression:"this.currentPage < this.totalPages"}],attrs:{ontouchstart:""},on:{click:t.loadMore}},[t._v("Load more...")])])])},r=[],n=(a("96cf"),a("3b8d")),i=a("c0d6"),o="https://jrainlau.com/api/study/imgs",c={data:function(){return{current:"kt",navs:["kt","wm","mt","jq","yz","zp","om","yd","mx","sm","ga"],keyword:"",album:[],currentPage:1}},computed:{totalPages:function(){var t=this.album[0],e=0;return t&&(e=t.totalPages),e}},mounted:function(){document.body.querySelector("header").style.display="none",document.title="Study hard",this.keyword=localStorage.getItem("study_keyword"),this.keyword?this.getAlbum():(this.keyword=prompt("Set the keyword"),this.keyword&&localStorage.setItem("study_keyword",this.keyword)&&this.getAlbum())},methods:{selectNav:function(t){this.current!==t&&(this.current=t,this.getAlbum())},getAlbum:function(){var t=Object(n["a"])(regeneratorRuntime.mark(function t(){var e,a,s=arguments;return regeneratorRuntime.wrap(function(t){while(1)switch(t.prev=t.next){case 0:return e=s.length>0&&void 0!==s[0]?s[0]:1,t.next=3,Object(i["a"])({url:o,method:"post",data:{domain:this.keyword,index:e,cate:"art"+this.current}}).catch(function(t){return t.response});case 3:a=t.sent,this.album=this.album.concat(a.data);case 5:case"end":return t.stop()}},t,this)}));function e(){return t.apply(this,arguments)}return e}(),loadMore:function(){this.currentPage++,this.currentPage<=this.totalPages&&(console.log(this.currentPage,this.totalPages),this.getAlbum(this.currentPage))},toDetail:function(t,e){var a=this.$router.resolve({path:"/study-img/detail?href=".concat(t,"&title=").concat(e)});window.open(a.href,"_blank")}}},u=c,l=(a("317c"),a("2877")),d=Object(l["a"])(u,s,r,!1,null,"45acd6ac",null);e["default"]=d.exports},f38b:function(t,e,a){}}]);
//# sourceMappingURL=chunk-5a46bb88.4d6b5b3b.js.map