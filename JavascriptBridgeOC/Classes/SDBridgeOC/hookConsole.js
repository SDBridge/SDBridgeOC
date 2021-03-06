;(function(window) {
    if(window.hookConsole){
        console.log("hook Console have already finished.");
        return ;
    }
    let printObject = function (obj) {
        let output = "";
        if (typeof obj ==='object'){
            output+="{";
            for(let key in obj){
                let value = obj[key];
                output+= "\""+key+"\""+":"+"\""+value+"\""+",";
            }
            output = output.substr(0, output.length - 1);
            output+="}";
        }
        else {
            output = "" + obj;
        }
        return output;
    };
    console.log("start hook Console.");
    window.console.log = (function (oriLogFunc,printObject) {
        window.hookConsole = 1;
        return function (str) {
            for (let i = 0; i < arguments.length; i++) {
                const obj = arguments[i];
                oriLogFunc.call(window.console, obj);
                if (obj === null) {
                    const nullString = "null";
                    window.webkit.messageHandlers.console.postMessage(nullString);
                }
                else  if (typeof(obj) == "undefined") {
                    const undefinedString = "undefined";
                    window.webkit.messageHandlers.console.postMessage(undefinedString);
                }
                else if (obj instanceof Promise){
                    const promiseString = "This is a javascript Promise.";
                    window.webkit.messageHandlers.console.postMessage(promiseString);
                } else if(obj instanceof Date){
                    const dateString =  obj.getTime().toString();
                    window.webkit.messageHandlers.console.postMessage(dateString);
                } else if(obj instanceof Array){
                    let arrayString = '[' + obj.toString() + ']';
                    window.webkit.messageHandlers.console.postMessage(arrayString);
                }
                else {
                    const objs = printObject(obj);
                    window.webkit.messageHandlers.console.postMessage(objs);
                }
            }
        }
    })(window.console.log,printObject);
    console.log("end hook Console.");
})(window);
