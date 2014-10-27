/**
 * Created by Riter on 19/05/14.
 */

function setStorage(key,value){
    var type=typeof value;
    if(type=='number'){
        value=value+'';
    }else if(type=='object'){
        value=JSON.stringify(value);
    }
    var stObject={otype:type,ovalue:value};
    localStorage[key] = JSON.stringify(stObject);
}

function getStorage(v,def){
    try {
        var stObject = JSON.parse(localStorage[v]);
        if(stObject.otype=="string"){
            return stObject.ovalue;
        }else if(stObject.otype=="number"){
            return parseFloat(stObject.ovalue);
        }else if(stObject.otype=="object"){
            return JSON.parse(stObject.ovalue);
        }
        return null;
    }
    catch(err) {
        return def;
    }
}

function clearStorage(){
    try{
        var  splash = getStorage('splash',null);
        localStorage.clear();
        setStorage('splash',splash);
    }catch(err) {
    }
}