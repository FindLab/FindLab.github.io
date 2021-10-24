(function(e){function t(t){for(var a,o,r=t[0],l=t[1],c=t[2],f=0,u=[];f<r.length;f++)o=r[f],Object.prototype.hasOwnProperty.call(s,o)&&s[o]&&u.push(s[o][0]),s[o]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);p&&p(t);while(u.length)u.shift()();return n.push.apply(n,c||[]),i()}function i(){for(var e,t=0;t<n.length;t++){for(var i=n[t],a=!0,r=1;r<i.length;r++){var l=i[r];0!==s[l]&&(a=!1)}a&&(n.splice(t--,1),e=o(o.s=i[0]))}return e}var a={},s={"midi-pitches-mask":0},n=[];function o(t){if(a[t])return a[t].exports;var i=a[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=a,o.d=function(e,t,i){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},o.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(o.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)o.d(i,a,function(t){return e[t]}.bind(null,a));return i},o.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="/vue/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],l=r.push.bind(r);r.push=t,r=r.slice();for(var c=0;c<r.length;c++)t(r[c]);var p=l;n.push([4,"chunk-vendors"]),i()})({"03ff":function(e,t,i){var a=i("89a8");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var s=i("499e").default;s("06aae0b0",a,!0,{sourceMap:!1,shadowMode:!1})},"0be6":function(e,t,i){"use strict";i("eea4")},3576:function(e,t,i){"use strict";i("9418")},4:function(e,t,i){e.exports=i("b9a6")},"5b77":function(e,t,i){"use strict";var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"midi-player"},[i("MidiRoll",{attrs:{player:e.player,timeScale:e.timeScale,width:e.width,height:e.height}}),e.player?i("div",{staticClass:"controls"},[i("div",[i("button",{directives:[{name:"show",rawName:"v-show",value:e.player.progressTime>0,expression:"player.progressTime > 0"}],on:{click:e.onReset}},[e._v("⏮")]),i("button",{directives:[{name:"show",rawName:"v-show",value:!e.player.isPlaying,expression:"!player.isPlaying"}],on:{click:e.onPlay}},[e._v("▶")]),i("button",{directives:[{name:"show",rawName:"v-show",value:e.player.isPlaying,expression:"player.isPlaying"}],on:{click:function(t){return e.player.pause()}}},[e._v("⏸")])])]):e._e(),i("Loading",{directives:[{name:"show",rawName:"v-show",value:e.loading,expression:"loading"}]})],1)},s=[],n=i("fb40"),o=function(){var e=this,t=e.$createElement;e._self._c;return e._m(0)},r=[function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"loading"},[i("div",{staticClass:"ellipsis"},[i("div"),i("div"),i("div"),i("div")])])}],l={name:"loading"},c=l,p=(i("0be6"),i("2877")),f=Object(p["a"])(c,o,r,!1,null,"69f5f740",null),u=f.exports;const d=e=>new Promise(t=>setTimeout(t,e));var h={name:"midi-player",props:{url:String,timeScale:{type:Number,default:.004},height:{type:Number,default:180}},components:{MidiRoll:n["d"],Loading:u},data(){return{player:null,width:600,loading:!1}},created(){this.loadPlayer()},mounted(){this.width=this.$el.clientWidth,window.addEventListener("resize",()=>this.width=this.$el.clientWidth)},methods:{async loadPlayer(){this.loading=!0,this.player&&this.player.dispose();const e=await(await fetch(this.url)).arrayBuffer(),t=n["a"].parseMidiData(e);this.player=new n["c"](t,{onMidi:(e,t)=>this.onMidi(e,t),onPlayFinish:()=>this.onFinish()}),this.loading=!1},async onMidi(e,t){if(!n["b"].WebAudio.empty())switch(e.subtype){case"noteOn":n["b"].noteOn(e.channel,e.noteNumber,e.velocity,t);break;case"noteOff":n["b"].noteOff(e.channel,e.noteNumber,t);break}const i=t-performance.now();i>0&&await d(i),this.player&&this.player.isPlaying&&this.$emit("midi",e)},onFinish(){this.$emit("finish")},onReset(){this.player&&(this.player.turnCursor(0),this.player.pause(),this.$emit("reset"))},onPlay(){this.$emit("play",this.player.progressTime),this.player.play()}},watch:{url:"loadPlayer"}},m=h,v=(i("67d6"),Object(p["a"])(m,a,s,!1,null,"0d297748",null));t["a"]=v.exports},"67d6":function(e,t,i){"use strict";i("03ff")},"89a8":function(e,t,i){var a=i("4bad");t=a(!1),t.push([e.i,".midi-player[data-v-0d297748]{position:relative;overflow:hidden}.controls[data-v-0d297748]{position:absolute;top:0;left:0;width:100%;height:100%;transition:opacity .3s;opacity:0;text-align:center;display:flex;flex-direction:column;justify-content:center;background:rgba(0,0,0,.06666666666666667)}.controls[data-v-0d297748]:hover{opacity:1}.controls button[data-v-0d297748]{font-size:30px;width:60px;background:hsla(0,0%,100%,.8);border:0;outline:0;border-radius:50%;cursor:pointer;padding:10px;justify-content:center;box-shadow:0 0 16px #000;margin:0 1em}",""]),e.exports=t},9418:function(e,t,i){var a=i("a653");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var s=i("499e").default;s("941976b0",a,!0,{sourceMap:!1,shadowMode:!1})},a653:function(e,t,i){var a=i("4bad");t=a(!1),t.push([e.i,".plots>*[data-v-4ee13896]{display:inline-block;width:50%;text-align:center}.plots label[data-v-4ee13896]{color:#484}.plots .off label[data-v-4ee13896]{color:#d00}",""]),e.exports=t},adac:function(e,t,i){var a=i("4bad");t=a(!1),t.push([e.i,".loading[data-v-69f5f740]{position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.26666666666666666)}.ellipsis[data-v-69f5f740]{display:inline-block;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:80px;height:80px}.ellipsis div[data-v-69f5f740]{position:absolute;top:33px;width:13px;height:13px;border-radius:50%;background:#fff;-webkit-animation-timing-function:cubic-bezier(0,1,1,0);animation-timing-function:cubic-bezier(0,1,1,0)}.ellipsis div[data-v-69f5f740]:first-child{left:8px;-webkit-animation:ellipsis1-data-v-69f5f740 .6s infinite;animation:ellipsis1-data-v-69f5f740 .6s infinite}.ellipsis div[data-v-69f5f740]:nth-child(2){left:8px}.ellipsis div[data-v-69f5f740]:nth-child(2),.ellipsis div[data-v-69f5f740]:nth-child(3){-webkit-animation:ellipsis2-data-v-69f5f740 .6s infinite;animation:ellipsis2-data-v-69f5f740 .6s infinite}.ellipsis div[data-v-69f5f740]:nth-child(3){left:32px}.ellipsis div[data-v-69f5f740]:nth-child(4){left:56px;-webkit-animation:ellipsis3-data-v-69f5f740 .6s infinite;animation:ellipsis3-data-v-69f5f740 .6s infinite}@-webkit-keyframes ellipsis1-data-v-69f5f740{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes ellipsis1-data-v-69f5f740{0%{transform:scale(0)}to{transform:scale(1)}}@-webkit-keyframes ellipsis3-data-v-69f5f740{0%{transform:scale(1)}to{transform:scale(0)}}@keyframes ellipsis3-data-v-69f5f740{0%{transform:scale(1)}to{transform:scale(0)}}@-webkit-keyframes ellipsis2-data-v-69f5f740{0%{transform:translate(0)}to{transform:translate(24px)}}@keyframes ellipsis2-data-v-69f5f740{0%{transform:translate(0)}to{transform:translate(24px)}}",""]),e.exports=t},b9a6:function(e,t,i){"use strict";i.r(t);var a=i("2b0e"),s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("p",[e._v(" Choose an input song: "),e.sourceUrls?i("select",{directives:[{name:"model",rawName:"v-model",value:e.chosenURL,expression:"chosenURL"}],on:{change:function(t){var i=Array.prototype.filter.call(t.target.options,(function(e){return e.selected})).map((function(e){var t="_value"in e?e._value:e.value;return t}));e.chosenURL=t.target.multiple?i:i[0]}}},e._l(e.sourceUrls,(function(t){return i("option",{key:t,domProps:{value:t}},[e._v(e._s(e.normalizeMidiName(t)))])})),0):e._e()]),e.chosenURL?i("MIDIPlayer",{attrs:{url:e.chosenURL},on:{midi:e.onMidi,reset:e.onReset,play:e.onPlay}}):e._e(),e.pitchSeries?i("div",{staticClass:"plots"},e._l(e.pitchSeries,(function(t,a){return i("div",{key:a,class:{off:e.sieveOffs[a]}},[i("VeHistogram",{attrs:{series:t,width:e.plotCommon.width,height:e.plotCommon.height,xAxis:e.plotCommon.xAxis,yAxis:e.plotCommon.yAxis,grid:e.plotCommon.grid}}),i("label",[e._v(e._s(e.normalizeMidiName(e.sourceUrls[a])))])],1)})),0):e._e()],1)},n=[],o=i("2819"),r=i("fb40"),l=i("5b77");const c=e=>[].concat(...e.tracks).filter(e=>"noteOn"===e.subtype).reduce((e,t)=>(++e[t.noteNumber-21],e),Array(88).fill(0)),p=[32,16,8,4],f=e=>{for(const t of p)if(e>=t)return t;return 0};var u={name:"midi-pitches-mask",components:{MIDIPlayer:l["a"],VeHistogram:o["VeHistogram"]},props:{sourceList:String},data(){return{chosenURL:null,playingColumns:Array(88).fill(0),coarsePitchCount:Array(88).fill(0),pitchSeries:null,sieveOffs:null}},computed:{sourceUrls(){const e=document.querySelector(this.sourceList);return e?[...e.options].map(e=>e.value):null},plotCommon(){return{height:"120px",xAxis:{name:"pitch",type:"category",data:Array(88).fill().map((e,t)=>t+21)},yAxis:{name:"count",type:"value"},grid:{top:16,bottom:0}}}},async created(){if(this.sourceUrls){this.chosenURL=this.sourceUrls[0];const e=await Promise.all(this.sourceUrls.map(async e=>await(await fetch(e)).arrayBuffer())),t=e.map(r["a"].parseMidiData).map(c).map(e=>e.map(f));this.pitchSeries=t.map(e=>this.columnToSeries(e)),this.sieveOffs=Array(t.length).fill(!1),this.pitchColumns=t}},methods:{normalizeMidiName(e){return e.replace(/.*\/([^/]+)\.mid$/,"$1").replace(/_/g," ")},columnToSeries(e){return[{name:"playing",data:this.playingColumns,type:"bar",barGap:-1,barCategoryGap:0},{name:"playing coarse",data:this.coarsePitchCount,type:"bar",itemStyle:{color:"red"}},{name:"candidate",data:e,type:"bar"}]},onMidi(e){if("noteOn"===e.subtype){const t=e.noteNumber-21;a["a"].set(this.playingColumns,t,this.playingColumns[t]+1),a["a"].set(this.coarsePitchCount,t,f(this.playingColumns[t])),this.sieveOffs.forEach((e,i)=>a["a"].set(this.sieveOffs,i,e||this.coarsePitchCount[t]>this.pitchColumns[i][t]))}},onReset(){for(let e=0;e<this.playingColumns.length;++e)this.playingColumns[e]=0,this.coarsePitchCount[e]=0;this.sieveOffs.fill(!1)},onPlay(e){0===e&&this.onReset()}}},d=u,h=(i("3576"),i("2877")),m=Object(h["a"])(d,s,n,!1,null,"4ee13896",null),v=m.exports;for(const y of document.querySelectorAll(".vue-component.midi-pitches-mask"))new a["a"]({render:e=>e(v,{props:{...y.dataset}})}).$mount(y)},eea4:function(e,t,i){var a=i("adac");a.__esModule&&(a=a.default),"string"===typeof a&&(a=[[e.i,a,""]]),a.locals&&(e.exports=a.locals);var s=i("499e").default;s("62340e08",a,!0,{sourceMap:!1,shadowMode:!1})}});
//# sourceMappingURL=midi-pitches-mask.js.map