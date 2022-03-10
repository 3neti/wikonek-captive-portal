(()=>{var x=typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},g=function(e,t,r,i,n,a,o,l,s,c){var d=this;d.numeralDecimalMark=e||".",d.numeralIntegerScale=t>0?t:0,d.numeralDecimalScale=r>=0?r:2,d.numeralThousandsGroupStyle=i||g.groupStyle.thousand,d.numeralPositiveOnly=!!n,d.stripLeadingZeroes=a!==!1,d.prefix=o||o===""?o:"",d.signBeforePrefix=!!l,d.tailPrefix=!!s,d.delimiter=c||c===""?c:",",d.delimiterRE=c?new RegExp("\\"+c,"g"):""};g.groupStyle={thousand:"thousand",lakh:"lakh",wan:"wan",none:"none"};g.prototype={getRawValue:function(e){return e.replace(this.delimiterRE,"").replace(this.numeralDecimalMark,".")},format:function(e){var t=this,r,i,n,a,o="";switch(e=e.replace(/[A-Za-z]/g,"").replace(t.numeralDecimalMark,"M").replace(/[^\dM-]/g,"").replace(/^\-/,"N").replace(/\-/g,"").replace("N",t.numeralPositiveOnly?"":"-").replace("M",t.numeralDecimalMark),t.stripLeadingZeroes&&(e=e.replace(/^(-)?0+(?=\d)/,"$1")),i=e.slice(0,1)==="-"?"-":"",typeof t.prefix!="undefined"?t.signBeforePrefix?n=i+t.prefix:n=t.prefix+i:n=i,a=e,e.indexOf(t.numeralDecimalMark)>=0&&(r=e.split(t.numeralDecimalMark),a=r[0],o=t.numeralDecimalMark+r[1].slice(0,t.numeralDecimalScale)),i==="-"&&(a=a.slice(1)),t.numeralIntegerScale>0&&(a=a.slice(0,t.numeralIntegerScale)),t.numeralThousandsGroupStyle){case g.groupStyle.lakh:a=a.replace(/(\d)(?=(\d\d)+\d$)/g,"$1"+t.delimiter);break;case g.groupStyle.wan:a=a.replace(/(\d)(?=(\d{4})+$)/g,"$1"+t.delimiter);break;case g.groupStyle.thousand:a=a.replace(/(\d)(?=(\d{3})+$)/g,"$1"+t.delimiter);break}return t.tailPrefix?i+a.toString()+(t.numeralDecimalScale>0?o.toString():"")+t.prefix:n+a.toString()+(t.numeralDecimalScale>0?o.toString():"")}};var M=g,C=function(e,t,r){var i=this;i.date=[],i.blocks=[],i.datePattern=e,i.dateMin=t.split("-").reverse().map(function(n){return parseInt(n,10)}),i.dateMin.length===2&&i.dateMin.unshift(0),i.dateMax=r.split("-").reverse().map(function(n){return parseInt(n,10)}),i.dateMax.length===2&&i.dateMax.unshift(0),i.initBlocks()};C.prototype={initBlocks:function(){var e=this;e.datePattern.forEach(function(t){t==="Y"?e.blocks.push(4):e.blocks.push(2)})},getISOFormatDate:function(){var e=this,t=e.date;return t[2]?t[2]+"-"+e.addLeadingZero(t[1])+"-"+e.addLeadingZero(t[0]):""},getBlocks:function(){return this.blocks},getValidatedDate:function(e){var t=this,r="";return e=e.replace(/[^\d]/g,""),t.blocks.forEach(function(i,n){if(e.length>0){var a=e.slice(0,i),o=a.slice(0,1),l=e.slice(i);switch(t.datePattern[n]){case"d":a==="00"?a="01":parseInt(o,10)>3?a="0"+o:parseInt(a,10)>31&&(a="31");break;case"m":a==="00"?a="01":parseInt(o,10)>1?a="0"+o:parseInt(a,10)>12&&(a="12");break}r+=a,e=l}}),this.getFixedDateString(r)},getFixedDateString:function(e){var t=this,r=t.datePattern,i=[],n=0,a=0,o=0,l=0,s=0,c=0,d,u,f,p=!1;e.length===4&&r[0].toLowerCase()!=="y"&&r[1].toLowerCase()!=="y"&&(l=r[0]==="d"?0:2,s=2-l,d=parseInt(e.slice(l,l+2),10),u=parseInt(e.slice(s,s+2),10),i=this.getFixedDate(d,u,0)),e.length===8&&(r.forEach(function(w,k){switch(w){case"d":n=k;break;case"m":a=k;break;default:o=k;break}}),c=o*2,l=n<=o?n*2:n*2+2,s=a<=o?a*2:a*2+2,d=parseInt(e.slice(l,l+2),10),u=parseInt(e.slice(s,s+2),10),f=parseInt(e.slice(c,c+4),10),p=e.slice(c,c+4).length===4,i=this.getFixedDate(d,u,f)),e.length===4&&(r[0]==="y"||r[1]==="y")&&(s=r[0]==="m"?0:2,c=2-s,u=parseInt(e.slice(s,s+2),10),f=parseInt(e.slice(c,c+2),10),p=e.slice(c,c+2).length===2,i=[0,u,f]),e.length===6&&(r[0]==="Y"||r[1]==="Y")&&(s=r[0]==="m"?0:4,c=2-.5*s,u=parseInt(e.slice(s,s+2),10),f=parseInt(e.slice(c,c+4),10),p=e.slice(c,c+4).length===4,i=[0,u,f]),i=t.getRangeFixedDate(i),t.date=i;var h=i.length===0?e:r.reduce(function(w,k){switch(k){case"d":return w+(i[0]===0?"":t.addLeadingZero(i[0]));case"m":return w+(i[1]===0?"":t.addLeadingZero(i[1]));case"y":return w+(p?t.addLeadingZeroForYear(i[2],!1):"");case"Y":return w+(p?t.addLeadingZeroForYear(i[2],!0):"")}},"");return h},getRangeFixedDate:function(e){var t=this,r=t.datePattern,i=t.dateMin||[],n=t.dateMax||[];return!e.length||i.length<3&&n.length<3||r.find(function(a){return a.toLowerCase()==="y"})&&e[2]===0?e:n.length&&(n[2]<e[2]||n[2]===e[2]&&(n[1]<e[1]||n[1]===e[1]&&n[0]<e[0]))?n:i.length&&(i[2]>e[2]||i[2]===e[2]&&(i[1]>e[1]||i[1]===e[1]&&i[0]>e[0]))?i:e},getFixedDate:function(e,t,r){return e=Math.min(e,31),t=Math.min(t,12),r=parseInt(r||0,10),(t<7&&t%2==0||t>8&&t%2==1)&&(e=Math.min(e,t===2?this.isLeapYear(r)?29:28:30)),[e,t,r]},isLeapYear:function(e){return e%4==0&&e%100!=0||e%400==0},addLeadingZero:function(e){return(e<10?"0":"")+e},addLeadingZeroForYear:function(e,t){return t?(e<10?"000":e<100?"00":e<1e3?"0":"")+e:(e<10?"0":"")+e}};var V=C,F=function(e,t){var r=this;r.time=[],r.blocks=[],r.timePattern=e,r.timeFormat=t,r.initBlocks()};F.prototype={initBlocks:function(){var e=this;e.timePattern.forEach(function(){e.blocks.push(2)})},getISOFormatTime:function(){var e=this,t=e.time;return t[2]?e.addLeadingZero(t[0])+":"+e.addLeadingZero(t[1])+":"+e.addLeadingZero(t[2]):""},getBlocks:function(){return this.blocks},getTimeFormatOptions:function(){var e=this;return String(e.timeFormat)==="12"?{maxHourFirstDigit:1,maxHours:12,maxMinutesFirstDigit:5,maxMinutes:60}:{maxHourFirstDigit:2,maxHours:23,maxMinutesFirstDigit:5,maxMinutes:60}},getValidatedTime:function(e){var t=this,r="";e=e.replace(/[^\d]/g,"");var i=t.getTimeFormatOptions();return t.blocks.forEach(function(n,a){if(e.length>0){var o=e.slice(0,n),l=o.slice(0,1),s=e.slice(n);switch(t.timePattern[a]){case"h":parseInt(l,10)>i.maxHourFirstDigit?o="0"+l:parseInt(o,10)>i.maxHours&&(o=i.maxHours+"");break;case"m":case"s":parseInt(l,10)>i.maxMinutesFirstDigit?o="0"+l:parseInt(o,10)>i.maxMinutes&&(o=i.maxMinutes+"");break}r+=o,e=s}}),this.getFixedTimeString(r)},getFixedTimeString:function(e){var t=this,r=t.timePattern,i=[],n=0,a=0,o=0,l=0,s=0,c=0,d,u,f;return e.length===6&&(r.forEach(function(p,h){switch(p){case"s":n=h*2;break;case"m":a=h*2;break;case"h":o=h*2;break}}),c=o,s=a,l=n,d=parseInt(e.slice(l,l+2),10),u=parseInt(e.slice(s,s+2),10),f=parseInt(e.slice(c,c+2),10),i=this.getFixedTime(f,u,d)),e.length===4&&t.timePattern.indexOf("s")<0&&(r.forEach(function(p,h){switch(p){case"m":a=h*2;break;case"h":o=h*2;break}}),c=o,s=a,d=0,u=parseInt(e.slice(s,s+2),10),f=parseInt(e.slice(c,c+2),10),i=this.getFixedTime(f,u,d)),t.time=i,i.length===0?e:r.reduce(function(p,h){switch(h){case"s":return p+t.addLeadingZero(i[2]);case"m":return p+t.addLeadingZero(i[1]);case"h":return p+t.addLeadingZero(i[0])}},"")},getFixedTime:function(e,t,r){return r=Math.min(parseInt(r||0,10),60),t=Math.min(t,60),e=Math.min(e,60),[e,t,r]},addLeadingZero:function(e){return(e<10?"0":"")+e}};var T=F,S=function(e,t){var r=this;r.delimiter=t||t===""?t:" ",r.delimiterRE=t?new RegExp("\\"+t,"g"):"",r.formatter=e};S.prototype={setFormatter:function(e){this.formatter=e},format:function(e){var t=this;t.formatter.clear(),e=e.replace(/[^\d+]/g,""),e=e.replace(/^\+/,"B").replace(/\+/g,"").replace("B","+"),e=e.replace(t.delimiterRE,"");for(var r="",i,n=!1,a=0,o=e.length;a<o;a++)i=t.formatter.inputDigit(e.charAt(a)),/[\s()-]/g.test(i)?(r=i,n=!0):n||(r=i);return r=r.replace(/[()]/g,""),r=r.replace(/[\s-]/g,t.delimiter),r}};var E=S,y={blocks:{uatp:[4,5,6],amex:[4,6,5],diners:[4,6,4],discover:[4,4,4,4],mastercard:[4,4,4,4],dankort:[4,4,4,4],instapayment:[4,4,4,4],jcb15:[4,6,5],jcb:[4,4,4,4],maestro:[4,4,4,4],visa:[4,4,4,4],mir:[4,4,4,4],unionPay:[4,4,4,4],general:[4,4,4,4]},re:{uatp:/^(?!1800)1\d{0,14}/,amex:/^3[47]\d{0,13}/,discover:/^(?:6011|65\d{0,2}|64[4-9]\d?)\d{0,12}/,diners:/^3(?:0([0-5]|9)|[689]\d?)\d{0,11}/,mastercard:/^(5[1-5]\d{0,2}|22[2-9]\d{0,1}|2[3-7]\d{0,2})\d{0,12}/,dankort:/^(5019|4175|4571)\d{0,12}/,instapayment:/^63[7-9]\d{0,13}/,jcb15:/^(?:2131|1800)\d{0,11}/,jcb:/^(?:35\d{0,2})\d{0,12}/,maestro:/^(?:5[0678]\d{0,2}|6304|67\d{0,2})\d{0,12}/,mir:/^220[0-4]\d{0,12}/,visa:/^4\d{0,15}/,unionPay:/^(62|81)\d{0,14}/},getStrictBlocks:function(e){var t=e.reduce(function(r,i){return r+i},0);return e.concat(19-t)},getInfo:function(e,t){var r=y.blocks,i=y.re;t=!!t;for(var n in i)if(i[n].test(e)){var a=r[n];return{type:n,blocks:t?this.getStrictBlocks(a):a}}return{type:"unknown",blocks:t?this.getStrictBlocks(r.general):r.general}}},b=y,v={noop:function(){},strip:function(e,t){return e.replace(t,"")},getPostDelimiter:function(e,t,r){if(r.length===0)return e.slice(-t.length)===t?t:"";var i="";return r.forEach(function(n){e.slice(-n.length)===n&&(i=n)}),i},getDelimiterREByDelimiter:function(e){return new RegExp(e.replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1"),"g")},getNextCursorPosition:function(e,t,r,i,n){return t.length===e?r.length:e+this.getPositionOffset(e,t,r,i,n)},getPositionOffset:function(e,t,r,i,n){var a,o,l;return a=this.stripDelimiters(t.slice(0,e),i,n),o=this.stripDelimiters(r.slice(0,e),i,n),l=a.length-o.length,l!==0?l/Math.abs(l):0},stripDelimiters:function(e,t,r){var i=this;if(r.length===0){var n=t?i.getDelimiterREByDelimiter(t):"";return e.replace(n,"")}return r.forEach(function(a){a.split("").forEach(function(o){e=e.replace(i.getDelimiterREByDelimiter(o),"")})}),e},headStr:function(e,t){return e.slice(0,t)},getMaxLength:function(e){return e.reduce(function(t,r){return t+r},0)},getPrefixStrippedValue:function(e,t,r,i,n,a,o,l,s){if(r===0)return e;if(e===t&&e!=="")return"";if(s&&e.slice(0,1)=="-"){var c=i.slice(0,1)=="-"?i.slice(1):i;return"-"+this.getPrefixStrippedValue(e.slice(1),t,r,c,n,a,o,l,s)}if(i.slice(0,r)!==t&&!l)return o&&!i&&e?e:"";if(i.slice(-r)!==t&&l)return o&&!i&&e?e:"";var d=this.stripDelimiters(i,n,a);return e.slice(0,r)!==t&&!l?d.slice(r):e.slice(-r)!==t&&l?d.slice(0,-r-1):l?e.slice(0,-r):e.slice(r)},getFirstDiffIndex:function(e,t){for(var r=0;e.charAt(r)===t.charAt(r);)if(e.charAt(r++)==="")return-1;return r},getFormattedValue:function(e,t,r,i,n,a){var o="",l=n.length>0,s="";return r===0?e:(t.forEach(function(c,d){if(e.length>0){var u=e.slice(0,c),f=e.slice(c);l?s=n[a?d-1:d]||s:s=i,a?(d>0&&(o+=s),o+=u):(o+=u,u.length===c&&d<r-1&&(o+=s)),e=f}}),o)},fixPrefixCursor:function(e,t,r,i){if(!!e){var n=e.value,a=r||i[0]||" ";if(!(!e.setSelectionRange||!t||t.length+a.length<=n.length)){var o=n.length*2;setTimeout(function(){e.setSelectionRange(o,o)},1)}}},checkFullSelection:function(e){try{var t=window.getSelection()||document.getSelection()||{};return t.toString().length===e.length}catch(r){}return!1},setSelection:function(e,t,r){if(e===this.getActiveElement(r)&&!(e&&e.value.length<=t))if(e.createTextRange){var i=e.createTextRange();i.move("character",t),i.select()}else try{e.setSelectionRange(t,t)}catch(n){console.warn("The input element type does not support selection")}},getActiveElement:function(e){var t=e.activeElement;return t&&t.shadowRoot?this.getActiveElement(t.shadowRoot):t},isAndroid:function(){return navigator&&/android/i.test(navigator.userAgent)},isAndroidBackspaceKeydown:function(e,t){return!this.isAndroid()||!e||!t?!1:t===e.slice(0,-1)}},B=v,_={assign:function(e,t){return e=e||{},t=t||{},e.creditCard=!!t.creditCard,e.creditCardStrictMode=!!t.creditCardStrictMode,e.creditCardType="",e.onCreditCardTypeChanged=t.onCreditCardTypeChanged||function(){},e.phone=!!t.phone,e.phoneRegionCode=t.phoneRegionCode||"AU",e.phoneFormatter={},e.time=!!t.time,e.timePattern=t.timePattern||["h","m","s"],e.timeFormat=t.timeFormat||"24",e.timeFormatter={},e.date=!!t.date,e.datePattern=t.datePattern||["d","m","Y"],e.dateMin=t.dateMin||"",e.dateMax=t.dateMax||"",e.dateFormatter={},e.numeral=!!t.numeral,e.numeralIntegerScale=t.numeralIntegerScale>0?t.numeralIntegerScale:0,e.numeralDecimalScale=t.numeralDecimalScale>=0?t.numeralDecimalScale:2,e.numeralDecimalMark=t.numeralDecimalMark||".",e.numeralThousandsGroupStyle=t.numeralThousandsGroupStyle||"thousand",e.numeralPositiveOnly=!!t.numeralPositiveOnly,e.stripLeadingZeroes=t.stripLeadingZeroes!==!1,e.signBeforePrefix=!!t.signBeforePrefix,e.tailPrefix=!!t.tailPrefix,e.swapHiddenInput=!!t.swapHiddenInput,e.numericOnly=e.creditCard||e.date||!!t.numericOnly,e.uppercase=!!t.uppercase,e.lowercase=!!t.lowercase,e.prefix=e.creditCard||e.date?"":t.prefix||"",e.noImmediatePrefix=!!t.noImmediatePrefix,e.prefixLength=e.prefix.length,e.rawValueTrimPrefix=!!t.rawValueTrimPrefix,e.copyDelimiter=!!t.copyDelimiter,e.initValue=t.initValue!==void 0&&t.initValue!==null?t.initValue.toString():"",e.delimiter=t.delimiter||t.delimiter===""?t.delimiter:t.date?"/":t.time?":":t.numeral?",":(t.phone," "),e.delimiterLength=e.delimiter.length,e.delimiterLazyShow=!!t.delimiterLazyShow,e.delimiters=t.delimiters||[],e.blocks=t.blocks||[],e.blocksLength=e.blocks.length,e.root=typeof x=="object"&&x?x:window,e.document=t.document||e.root.document,e.maxLength=0,e.backspace=!1,e.result="",e.onValueChanged=t.onValueChanged||function(){},e}},O=_,m=function(e,t){var r=this,i=!1;if(typeof e=="string"?(r.element=document.querySelector(e),i=document.querySelectorAll(e).length>1):typeof e.length!="undefined"&&e.length>0?(r.element=e[0],i=e.length>1):r.element=e,!r.element)throw new Error("[cleave.js] Please check the element");if(i)try{console.warn("[cleave.js] Multiple input fields matched, cleave.js will only take the first one.")}catch(n){}t.initValue=r.element.value,r.properties=m.DefaultProperties.assign({},t),r.init()};m.prototype={init:function(){var e=this,t=e.properties;if(!t.numeral&&!t.phone&&!t.creditCard&&!t.time&&!t.date&&t.blocksLength===0&&!t.prefix){e.onInput(t.initValue);return}t.maxLength=m.Util.getMaxLength(t.blocks),e.isAndroid=m.Util.isAndroid(),e.lastInputValue="",e.isBackward="",e.onChangeListener=e.onChange.bind(e),e.onKeyDownListener=e.onKeyDown.bind(e),e.onFocusListener=e.onFocus.bind(e),e.onCutListener=e.onCut.bind(e),e.onCopyListener=e.onCopy.bind(e),e.initSwapHiddenInput(),e.element.addEventListener("input",e.onChangeListener),e.element.addEventListener("keydown",e.onKeyDownListener),e.element.addEventListener("focus",e.onFocusListener),e.element.addEventListener("cut",e.onCutListener),e.element.addEventListener("copy",e.onCopyListener),e.initPhoneFormatter(),e.initDateFormatter(),e.initTimeFormatter(),e.initNumeralFormatter(),(t.initValue||t.prefix&&!t.noImmediatePrefix)&&e.onInput(t.initValue)},initSwapHiddenInput:function(){var e=this,t=e.properties;if(!!t.swapHiddenInput){var r=e.element.cloneNode(!0);e.element.parentNode.insertBefore(r,e.element),e.elementSwapHidden=e.element,e.elementSwapHidden.type="hidden",e.element=r,e.element.id=""}},initNumeralFormatter:function(){var e=this,t=e.properties;!t.numeral||(t.numeralFormatter=new m.NumeralFormatter(t.numeralDecimalMark,t.numeralIntegerScale,t.numeralDecimalScale,t.numeralThousandsGroupStyle,t.numeralPositiveOnly,t.stripLeadingZeroes,t.prefix,t.signBeforePrefix,t.tailPrefix,t.delimiter))},initTimeFormatter:function(){var e=this,t=e.properties;!t.time||(t.timeFormatter=new m.TimeFormatter(t.timePattern,t.timeFormat),t.blocks=t.timeFormatter.getBlocks(),t.blocksLength=t.blocks.length,t.maxLength=m.Util.getMaxLength(t.blocks))},initDateFormatter:function(){var e=this,t=e.properties;!t.date||(t.dateFormatter=new m.DateFormatter(t.datePattern,t.dateMin,t.dateMax),t.blocks=t.dateFormatter.getBlocks(),t.blocksLength=t.blocks.length,t.maxLength=m.Util.getMaxLength(t.blocks))},initPhoneFormatter:function(){var e=this,t=e.properties;if(!!t.phone)try{t.phoneFormatter=new m.PhoneFormatter(new t.root.Cleave.AsYouTypeFormatter(t.phoneRegionCode),t.delimiter)}catch(r){throw new Error("[cleave.js] Please include phone-type-formatter.{country}.js lib")}},onKeyDown:function(e){var t=this,r=e.which||e.keyCode;t.lastInputValue=t.element.value,t.isBackward=r===8},onChange:function(e){var t=this,r=t.properties,i=m.Util;t.isBackward=t.isBackward||e.inputType==="deleteContentBackward";var n=i.getPostDelimiter(t.lastInputValue,r.delimiter,r.delimiters);t.isBackward&&n?r.postDelimiterBackspace=n:r.postDelimiterBackspace=!1,this.onInput(this.element.value)},onFocus:function(){var e=this,t=e.properties;e.lastInputValue=e.element.value,t.prefix&&t.noImmediatePrefix&&!e.element.value&&this.onInput(t.prefix),m.Util.fixPrefixCursor(e.element,t.prefix,t.delimiter,t.delimiters)},onCut:function(e){!m.Util.checkFullSelection(this.element.value)||(this.copyClipboardData(e),this.onInput(""))},onCopy:function(e){!m.Util.checkFullSelection(this.element.value)||this.copyClipboardData(e)},copyClipboardData:function(e){var t=this,r=t.properties,i=m.Util,n=t.element.value,a="";r.copyDelimiter?a=n:a=i.stripDelimiters(n,r.delimiter,r.delimiters);try{e.clipboardData?e.clipboardData.setData("Text",a):window.clipboardData.setData("Text",a),e.preventDefault()}catch(o){}},onInput:function(e){var t=this,r=t.properties,i=m.Util,n=i.getPostDelimiter(e,r.delimiter,r.delimiters);if(!r.numeral&&r.postDelimiterBackspace&&!n&&(e=i.headStr(e,e.length-r.postDelimiterBackspace.length)),r.phone){r.prefix&&(!r.noImmediatePrefix||e.length)?r.result=r.prefix+r.phoneFormatter.format(e).slice(r.prefix.length):r.result=r.phoneFormatter.format(e),t.updateValueState();return}if(r.numeral){r.prefix&&r.noImmediatePrefix&&e.length===0?r.result="":r.result=r.numeralFormatter.format(e),t.updateValueState();return}if(r.date&&(e=r.dateFormatter.getValidatedDate(e)),r.time&&(e=r.timeFormatter.getValidatedTime(e)),e=i.stripDelimiters(e,r.delimiter,r.delimiters),e=i.getPrefixStrippedValue(e,r.prefix,r.prefixLength,r.result,r.delimiter,r.delimiters,r.noImmediatePrefix,r.tailPrefix,r.signBeforePrefix),e=r.numericOnly?i.strip(e,/[^\d]/g):e,e=r.uppercase?e.toUpperCase():e,e=r.lowercase?e.toLowerCase():e,r.prefix&&(r.tailPrefix?e=e+r.prefix:e=r.prefix+e,r.blocksLength===0)){r.result=e,t.updateValueState();return}r.creditCard&&t.updateCreditCardPropsByValue(e),e=i.headStr(e,r.maxLength),r.result=i.getFormattedValue(e,r.blocks,r.blocksLength,r.delimiter,r.delimiters,r.delimiterLazyShow),t.updateValueState()},updateCreditCardPropsByValue:function(e){var t=this,r=t.properties,i=m.Util,n;i.headStr(r.result,4)!==i.headStr(e,4)&&(n=m.CreditCardDetector.getInfo(e,r.creditCardStrictMode),r.blocks=n.blocks,r.blocksLength=r.blocks.length,r.maxLength=i.getMaxLength(r.blocks),r.creditCardType!==n.type&&(r.creditCardType=n.type,r.onCreditCardTypeChanged.call(t,r.creditCardType)))},updateValueState:function(){var e=this,t=m.Util,r=e.properties;if(!!e.element){var i=e.element.selectionEnd,n=e.element.value,a=r.result;if(i=t.getNextCursorPosition(i,n,a,r.delimiter,r.delimiters),e.isAndroid){window.setTimeout(function(){e.element.value=a,t.setSelection(e.element,i,r.document,!1),e.callOnValueChanged()},1);return}e.element.value=a,r.swapHiddenInput&&(e.elementSwapHidden.value=e.getRawValue()),t.setSelection(e.element,i,r.document,!1),e.callOnValueChanged()}},callOnValueChanged:function(){var e=this,t=e.properties;t.onValueChanged.call(e,{target:{name:e.element.name,value:t.result,rawValue:e.getRawValue()}})},setPhoneRegionCode:function(e){var t=this,r=t.properties;r.phoneRegionCode=e,t.initPhoneFormatter(),t.onChange()},setRawValue:function(e){var t=this,r=t.properties;e=e!=null?e.toString():"",r.numeral&&(e=e.replace(".",r.numeralDecimalMark)),r.postDelimiterBackspace=!1,t.element.value=e,t.onInput(e)},getRawValue:function(){var e=this,t=e.properties,r=m.Util,i=e.element.value;return t.rawValueTrimPrefix&&(i=r.getPrefixStrippedValue(i,t.prefix,t.prefixLength,t.result,t.delimiter,t.delimiters,t.noImmediatePrefix,t.tailPrefix,t.signBeforePrefix)),t.numeral?i=t.numeralFormatter.getRawValue(i):i=r.stripDelimiters(i,t.delimiter,t.delimiters),i},getISOFormatDate:function(){var e=this,t=e.properties;return t.date?t.dateFormatter.getISOFormatDate():""},getISOFormatTime:function(){var e=this,t=e.properties;return t.time?t.timeFormatter.getISOFormatTime():""},getFormattedValue:function(){return this.element.value},destroy:function(){var e=this;e.element.removeEventListener("input",e.onChangeListener),e.element.removeEventListener("keydown",e.onKeyDownListener),e.element.removeEventListener("focus",e.onFocusListener),e.element.removeEventListener("cut",e.onCutListener),e.element.removeEventListener("copy",e.onCopyListener)},toString:function(){return"[Cleave Object]"}};m.NumeralFormatter=M;m.DateFormatter=V;m.TimeFormatter=T;m.PhoneFormatter=E;m.CreditCardDetector=b;m.Util=B;m.DefaultProperties=O;(typeof x=="object"&&x?x:window).Cleave=m;var R=m,I=R;var D=(e,t,r=1)=>e[e.indexOf(t)+r],U=(e,t,r)=>{let i={};return e.includes("card")?(i.creditCard=!0,i.creditCardStrictMode=e.includes("strict")):e.includes("date")?(i.date=!0,i.datePattern=t?r(t):null):e.includes("time")?(i.time=!0,i.timePattern=t?r(t):null):e.includes("numeral")?(i.numeral=!0,e.includes("thousands")&&(i.numeralThousandsGroupStyle=D(e,"thousands")),e.includes("delimiter")&&(i.delimiter=D(e,"delimiter")==="dot"?".":","),e.includes("decimal")&&(i.numeralDecimalMark=D(e,"decimal")==="comma"?",":"."),e.includes("positive")&&(i.numeralPositiveOnly=!0),e.includes("prefix")&&(i.prefix=D(e,"prefix"))):e.includes("blocks")&&(i.blocks=r(t)),i},P=e=>t=>{!e._x_model||e._x_model.set(t.target.rawValue)};function L(e){e.magic("mask",t=>{if(t.__cleave)return t.__cleave}),e.directive("mask",(t,{modifiers:r,expression:i},{effect:n,evaluate:a})=>{if(t._x_model){let l=e.prefixed("model");Object.keys(t._x_attributeCleanups).forEach(s=>{s.startsWith(l)&&(t._x_attributeCleanups[l][0](),delete t._x_attributeCleanups[l])}),t._x_forceModelUpdate=()=>{}}let o=r.length===0?{...a(i),onValueChanged:P(t)}:{...U(r,i,a),onValueChanged:P(t)};t.__cleave||(t.__cleave=new I(t,o)),t._x_model&&n(()=>{e.mutateDom(()=>t.__cleave.setRawValue(t._x_model.get()))})})}document.addEventListener("alpine:initializing",()=>{L(window.Alpine)});})();
