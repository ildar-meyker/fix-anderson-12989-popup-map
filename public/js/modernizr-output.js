/*! modernizr 3.11.8 (Custom Build) | MIT *
 * https://modernizr.com/download/?-backgroundblendmode-hiddenscroll-setclasses !*/
!function(e,n,t,r){function o(e,n){return typeof e===n}function i(e,n){return!!~(""+e).indexOf(n)}function s(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):x?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function l(){var e=t.body;return e||(e=s(x?"svg":"body"),e.fake=!0),e}function a(e,n,r,o){var i,a,f,u,d="modernizr",c=s("div"),p=l();if(parseInt(r,10))for(;r--;)f=s("div"),f.id=o?o[r]:d+(r+1),c.appendChild(f);return i=s("style"),i.type="text/css",i.id="s"+d,(p.fake?p:c).appendChild(i),p.appendChild(c),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(t.createTextNode(e)),c.id=d,p.fake&&(p.style.background="",p.style.overflow="hidden",u=w.style.overflow,w.style.overflow="hidden",w.appendChild(p)),a=n(c,e),p.fake&&p.parentNode?(p.parentNode.removeChild(p),w.style.overflow=u,w.offsetHeight):c.parentNode.removeChild(c),!!a}function f(e){return e.replace(/([A-Z])/g,function(e,n){return"-"+n.toLowerCase()}).replace(/^ms-/,"-ms-")}function u(e,t,r){var o;if("getComputedStyle"in n){o=getComputedStyle.call(n,e,t);var i=n.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(i){var s=i.error?"error":"log";i[s].call(i,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!t&&e.currentStyle&&e.currentStyle[r];return o}function d(e,t){var o=e.length;if("CSS"in n&&"supports"in n.CSS){for(;o--;)if(n.CSS.supports(f(e[o]),t))return!0;return!1}if("CSSSupportsRule"in n){for(var i=[];o--;)i.push("("+f(e[o])+":"+t+")");return i=i.join(" or "),a("@supports ("+i+") { #modernizr { position: absolute; } }",function(e){return"absolute"===u(e,null,"position")})}return r}function c(e){return e.replace(/([a-z])-([a-z])/g,function(e,n,t){return n+t.toUpperCase()}).replace(/^-/,"")}function p(e,n,t,l){function a(){u&&(delete z.style,delete z.modElem)}if(l=!o(l,"undefined")&&l,!o(t,"undefined")){var f=d(e,t);if(!o(f,"undefined"))return f}for(var u,p,m,v,h,y=["modernizr","tspan","samp"];!z.style&&y.length;)u=!0,z.modElem=s(y.shift()),z.style=z.modElem.style;for(m=e.length,p=0;p<m;p++)if(v=e[p],h=z.style[v],i(v,"-")&&(v=c(v)),z.style[v]!==r){if(l||o(t,"undefined"))return a(),"pfx"!==n||v;try{z.style[v]=t}catch(e){}if(z.style[v]!==h)return a(),"pfx"!==n||v}return a(),!1}function m(e,n){return function(){return e.apply(n,arguments)}}function v(e,n,t){var r;for(var i in e)if(e[i]in n)return!1===t?e[i]:(r=n[e[i]],o(r,"function")?m(r,t||n):r);return!1}function h(e,n,t,r,i){var s=e.charAt(0).toUpperCase()+e.slice(1),l=(e+" "+_.join(s+" ")+s).split(" ");return o(n,"string")||o(n,"undefined")?p(l,n,r,i):(l=(e+" "+E.join(s+" ")+s).split(" "),v(l,n,t))}var y=[],g={_version:"3.11.8",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){y.push({name:e,fn:n,options:t})},addAsyncTest:function(e){y.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=g,Modernizr=new Modernizr;var C=[],w=t.documentElement,x="svg"===w.nodeName.toLowerCase(),S="Moz O ms Webkit",_=g._config.usePrefixes?S.split(" "):[];g._cssomPrefixes=_;var b={elem:s("modernizr")};Modernizr._q.push(function(){delete b.elem});var z={style:b.elem.style};Modernizr._q.unshift(function(){delete z.style});var E=g._config.usePrefixes?S.toLowerCase().split(" "):[];g._domPrefixes=E,g.testAllProps=h;var N=function(e){var t,o=prefixes.length,i=n.CSSRule;if(void 0===i)return r;if(!e)return!1;if(e=e.replace(/^@/,""),(t=e.replace(/-/g,"_").toUpperCase()+"_RULE")in i)return"@"+e;for(var s=0;s<o;s++){var l=prefixes[s];if(l.toUpperCase()+"_"+t in i)return"@-"+l.toLowerCase()+"-"+e}return!1};g.atRule=N;var P=g.prefixed=function(e,n,t){return 0===e.indexOf("@")?N(e):(-1!==e.indexOf("-")&&(e=c(e)),n?h(e,n,t):h(e,"pfx"))};Modernizr.addTest("backgroundblendmode",P("backgroundBlendMode","text"));var T=g.testStyles=a;Modernizr.addTest("hiddenscroll",function(){return T("#modernizr {width:100px;height:100px;overflow:scroll}",function(e){return e.offsetWidth===e.clientWidth})}),function(){var e,n,t,r,i,s,l;for(var a in y)if(y.hasOwnProperty(a)){if(e=[],n=y[a],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(r=o(n.fn,"function")?n.fn():n.fn,i=0;i<e.length;i++)s=e[i],l=s.split("."),1===l.length?Modernizr[l[0]]=r:(Modernizr[l[0]]&&(!Modernizr[l[0]]||Modernizr[l[0]]instanceof Boolean)||(Modernizr[l[0]]=new Boolean(Modernizr[l[0]])),Modernizr[l[0]][l[1]]=r),C.push((r?"":"no-")+l.join("-"))}}(),function(e){var n=w.className,t=Modernizr._config.classPrefix||"";if(x&&(n=n.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(r,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(e.length>0&&(n+=" "+t+e.join(" "+t)),x?w.className.baseVal=n:w.className=n)}(C),delete g.addTest,delete g.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,window,document);