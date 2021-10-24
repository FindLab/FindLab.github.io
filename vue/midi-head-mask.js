(function(t){function e(e){for(var i,r,s=e[0],c=e[1],u=e[2],p=0,d=[];p<s.length;p++)r=s[p],Object.prototype.hasOwnProperty.call(a,r)&&a[r]&&d.push(a[r][0]),a[r]=0;for(i in c)Object.prototype.hasOwnProperty.call(c,i)&&(t[i]=c[i]);l&&l(e);while(d.length)d.shift()();return o.push.apply(o,u||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],i=!0,s=1;s<n.length;s++){var c=n[s];0!==a[c]&&(i=!1)}i&&(o.splice(e--,1),t=r(r.s=n[0]))}return t}var i={},a={"midi-head-mask":0},o=[];function r(e){if(i[e])return i[e].exports;var n=i[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=t,r.c=i,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="/vue/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],c=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var l=c;o.push([5,"chunk-vendors"]),n()})({5:function(t,e,n){t.exports=n("d868")},"6e67":function(t,e,n){"use strict";n("7a5b")},"7a5b":function(t,e,n){var i=n("e713");i.__esModule&&(i=i.default),"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var a=n("499e").default;a("1386c7cf",i,!0,{sourceMap:!1,shadowMode:!1})},d868:function(t,e,n){"use strict";n.r(e);var i=n("2b0e"),a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("MidiRoll",{attrs:{player:t.player,timeScale:t.timeScale,width:t.width,height:t.height}}),n("p",[n("span",{staticClass:"section"},[t._v("N: "),n("em",{staticClass:"N"},[t._v(t._s(t.N))]),t._v(" "),n("input",{directives:[{name:"model",rawName:"v-model",value:t.N,expression:"N"}],attrs:{type:"range",min:"1",max:"10",step:"1"},domProps:{value:t.N},on:{__r:function(e){t.N=e.target.value}}})]),n("span",{staticClass:"section"},[t._v("pitches: "),n("em",t._l(t.pitches,(function(e){return n("span",{key:e},[t._v(t._s(e)+", ")])})),0)])]),n("p",[t._v(" mask: "),n("span",{staticClass:"mask"},[t._v(t._s(t.mask))])])],1)},o=[],r=n("fb40");const s=120;var c={name:"midi-head-mask",props:{notation:Object,height:{type:Number,default:200},timeScale:{type:Number,default:.08}},components:{MidiRoll:r["d"]},data(){return{width:600,N:5,cutTime:0,pitches:[]}},computed:{keyRange(){if(!this.notation||!this.notation.notes)return null;if(this.notation.keyRange)return this.notation.keyRange;const t=this.notation.notes.map(t=>t.pitch);return{high:Math.max(...t),low:Math.min(...t)}},endTime(){if(!this.notation||!this.notation.notes)return 0;const t=this.notation.notes.map(t=>t.start+t.duration);return Math.max(...t)},player(){return{notations:{notes:this.notation.notes,keyRange:this.keyRange,bars:[],endTime:this.endTime},progressTime:this.cutTime,turnCursor(){}}},mask(){return Array(88).fill().map((t,e)=>e+21).map(t=>this.pitches.includes(t)?"1":"_").join("")}},created(){this.notation&&this.notation.notes&&this.notation.notes.forEach((t,e)=>t.index=e),this.updateN()},mounted(){this.width=this.$el.clientWidth,window.addEventListener("resize",()=>this.width=this.$el.clientWidth)},methods:{async updateN(){let t=0;const e=new Set;for(const n of this.notation.notes){if(n.index>=10||e.size>=this.N&&n.start-t>s){this.pitches=Array.from(e).sort(),this.cutTime=t+s;break}e.add(n.pitch),t=n.start}await this.$nextTick(),this.notation.notes.forEach(t=>t.on=t.start<this.cutTime)}},watch:{N:"updateN"}},u=c,l=(n("6e67"),n("2877")),p=Object(l["a"])(u,a,o,!1,null,"fe0f7ca4",null),d=p.exports;for(const h of document.querySelectorAll(".vue-component.midi-head-mask")){const t=h.innerText&&JSON.parse(h.innerText);new i["a"]({render:e=>e(d,{props:{notation:t,...h.dataset}})}).$mount(h)}},e713:function(t,e,n){var i=n("4bad");e=i(!1),e.push([t.i,"p[data-v-fe0f7ca4]{white-space:nowrap}p .N[data-v-fe0f7ca4]{display:inline-block;width:1em}.mask[data-v-fe0f7ca4]{font-size:9px}p .section[data-v-fe0f7ca4]{display:inline-block}p .section+.section[data-v-fe0f7ca4]{margin-left:2em}",""]),t.exports=e}});
//# sourceMappingURL=midi-head-mask.js.map