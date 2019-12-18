;window.$$3digit_separator = (function(){
  var __event = function(target, mode, func){
		if (target.addEventListener){target.addEventListener(mode, func, false)}
		else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
	};
  var __construct = function(){
    switch(document.readyState){
      case "complete"    : new $$;break;
      case "interactive" : __event(window , "DOMContentLoaded" , function(){new $$});break;
      default            : __event(window , "load" , function(){new $$});break;
		}
  };

  var __options = {
    input_selector        : "input[data-type='number']",
    hook_selector         : [],
    interlocking_selector : ""
  };

  var $$ = function(options){
    if(!options){return;}
    this.options = this.initOptions(options);
    this.setForm();
  };

  $$.prototype.initOptions = function(options){
    if(!options){return __options}
    var res = {};
    for(var i in __options){
      res[i] = __options[i];
    }
    for(var i in options){
      res[i] = options[i];
    }
    return res;
  };

  $$.prototype.setForm = function(){
    this.forms = [];
    var inputs = document.querySelectorAll(this.options.input_selector);
    for(var i=0; i<inputs.length; i++){
      if(inputs[i].getAttribute("data-flg-3digitSeparator-blur") === "1"){continue;}
      inputs[i].setAttribute("data-flg-3digitSeparator-blur","1");
      this.setDigitSeparator(inputs[i]);
      // __event(inputs[i] , "focus" , (function(e){this.eventFocus(e.currentTarget)}).bind(this));
      // __event(inputs[i] , "keyup" , (function(e){this.setDigitSeparator_keyup(e.currentTarget,e.keyCode)}).bind(this));
      __event(inputs[i] , "blur"  , (function(e){this.setDigitSeparator(e.currentTarget)}).bind(this));
      if(inputs[i].form){this.forms.push(inputs[i].form)}
    }

    if(this.options.hook_selector && this.options.hook_selector.length){
      for(var i=0; i<this.options.hook_selector.length; i++){
        if(!this.options.hook_selector[i].selector
        || !this.options.hook_selector[i].event_key){continue;}
        
        var hooks = document.querySelectorAll(this.options.hook_selector[i].selector);
        for(var j=0; j<hooks.length; j++){
          if(hooks[j].getAttribute("data-flg-3digitSeparator-hook") === "1"){continue;}
          hooks[j].setAttribute("data-flg-3digitSeparator-hook","1");

          __event(hooks[j] , this.options.hook_selector[i].event_key , (function(e){this.setInterlocking(e)}).bind(this));
          if(hooks[j].form){this.forms.push(hooks[j].form)}
        }
      }
    }
    
    // form-submit
    this.forms = this.forms.filter(function (x, i, self) {
      return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    });

    if(Object.keys(this.forms).length){
      for(var i=0; i<this.forms.length; i++){
        __event(this.forms[i] , "submit" , (function(e){this.submitProc(e)}).bind(this));
      }
    }
    
  };

//   // 3桁毎に","(カンマ)を付ける
//   $$.prototype.setDigitSeparator_keyup = function(target,keyCode){
//     if(keyCode == 37 ){return;}
//     if(!target){return}
//     var value = target.value;
//     if(value === ""){return}
//     var cursor_num = this.getCursor(target);
// console.log(target.selectionStart +"/"+ cursor_num);
//     target.value = this.stringNumberFormat(target.value);
//     // this.setCursor(target,cursor_num);
//   }
  $$.prototype.setDigitSeparator = function(target){
    if(!target){return}
    var value = target.value;
    if(value === ""){return}
    // target.value = Number(target.value.replace(/,/g,"")).toLocaleString();
    target.value = this.stringNumberFormat(target.value);
  };
  $$.prototype.setInterlocking = function(e){
    if(!this.options.interlocking_selector){return;}
    var interlocking_elements = document.querySelectorAll(this.options.interlocking_selector);
    for(var i=0; i<interlocking_elements.length; i++){
      this.setDigitSeparator(interlocking_elements[i]);
    }
  };


//   $$.prototype.getCursor = function(target){
//     if(!target){return null}
//     if(target.value === ""){return 0;}
//     // var num = this.getNumberValue(target);
//     var current_num = target.selectionStart;
//     // 不要文字列を取り除いた位置を取得
//     var num = 0;
//     for(var i=0; i<target.value.length; i++){
//       var reg = new RegExp(/[\d\-\.]/);
//       if(target.value.charAt(i).match(reg) === null){continue;}
//       if(i >= current_num){break;}
//       num++;
//     }
//     return num;
//   }
//   $$.prototype.setCursor = function(target,num){
//     if(!target){return}
//     var value = String(target.value);
//     if(value === ""){return}

// //     total_count = target.value.length;
// //     cursor_pos  = target.selectionStart;
// // console.log(total_count , cursor_pos);
    
//     target.value = Number(target.value.replace(/,/g,"")).toLocaleString();

//     // カーソル位置
    
//     // target.setSelectionRange(cursor_pos , 0);
//   };
//   $$.prototype.getNumberValue = function(target){

//   };

  // ","（カンマ）を削除する
  $$.prototype.eventFocus = function(target){
    if(!target){return}
    var value = target.value;
    if(value === ""){return}
    target.value = Number(target.value.replace(/,/g,""));
  };

  // 入力された数値フォーマットを整形する。(半角数値-.)3桁ごとに","カンマを入れる。(全角を半角に変換、不要スペースや記号は排除)
  $$.prototype.stringNumberFormat = function(str){

    // 文字列変換
    str = String(str);

    // 全角->半角変換
    str = str.replace(/。/g , ".");
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 65248);
    });

    // マイナス判定
    var minus = (str[0] === "-") ? true : false;

    // 数値 .(ピリオド) -(マイナス)以外の文字列を削除
    str = str.replace(/[^0-9\.]/g,"");
    
    // マイナス処理
    str = (minus) ? "-" + str : str;

    // 整数値と少数値の分離
    var sp = str.split(".");
    var int = sp[0];
    var dic = (sp[1]) ? sp[1] : "";

    // 整数 : 3桁ごとにカンマを入れる
    int = this.numberFormat3_integer(int);
    // int = Number(int.replace(/,/g,"")).toLocaleString();

    // 小数 : 3桁ごとにスペースを入れる
    dic = this.numberFormat3_decimal(dic);

    // 返り値
    var num = int + ((dic) ? "."+dic : "");
    return num;
  };

  // 整数 : 数値の3桁ごとにカンマを入れる
  $$.prototype.numberFormat3_integer = function(num){
    num = String(num);
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){num = tmpStr;}
    return num;
  };

  // 小数 : 数値の3桁ごとにスペースを入れる
  $$.prototype.numberFormat3_decimal = function(num){
    num = String(num);
    var tmpStr = "";
    while (num != (tmpStr = num.replace(/(\d\d\d)(\d+)$/,"$1 $2"))){num = tmpStr;}
    return num;
  };

  // submit
  $$.prototype.submitProc = function(e){
    var form = e.target;
    var query = this.options.input_selector;
    query += (this.options.interlocking_selector) ? ","+this.options.interlocking_selector : "";
    var elms = form.querySelectorAll(query);
    for(var i=0; i<elms.length; i++){
      elms[i].value = elms[i].value.replace(/[, ]/g,"");
    }
  };


  // __construct();
  return $$;
})();