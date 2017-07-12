function iotGetServerAddr() {
	var iotServer = $api.getStorage('iotServer');
	var srvAddr = "192.168.1.1";
	var tIndex=0;
	
	if (typeof(iotServer) != "undefined") {
    	if (iotServer.indexOf("http://") == 0) {
    		srvAddr = iotServer.substr(7);
    		tIndex = srvAddr.indexOf(":", 10);
    		if (tIndex > 0) {
    			srvAddr = srvAddr.substr(0, tIndex);
    		}
    	}
    }
   
   	return srvAddr;
}

function iotGetCmdRet(cmdId, devId) {
 	var uid = $api.getStorage('uid');
    var urlParam = {
    	msgType: "get_dev_cmd_ret",
    	userId: uid,
    	devId: parseInt(devId),
    	commandId: parseInt(cmdId)
    };
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
        		api.hideProgress();
        		api.alert({msg: "操作成功！"});
        	} else if(ret.ret == 90011) {
        		setTimeout("iotGetCmdRet("+cmdId.toString()+","+devId.toString()+")", 2000);
        	} else {
        		api.hideProgress();
        		api.alert({msg: "操作失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
        	api.hideProgress();
            api.alert({msg: err.msg});
        }
    });
}

function iotServerRequest(url, method, bodyParam, callBack) {
	var iotServer = $api.getStorage('iotServer');
	var common_url = 'http://115.29.49.52';
    var appId = 'A6973666436346';
    var key = '64C65EDE-287E-1229-A9D2-D2FD8D38D9E4';
    var now = Date.now();
    var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
    
    if (typeof(iotServer) != "undefined") {
    	common_url = iotServer;
    }
    
    api.ajax({
        url: common_url + url,
        method: method,
        cache: false,
        timeout: 20,
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey
        },
        data: {
            body: bodyParam
        }
    }, function (ret, err) {
        callBack(ret, err);
    });
}

function iotGetDeviceData(devId, callback) {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "dev_get_one",
    	userId: uid,
        devId: devId,
    };
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            callback(ret);
        } else {
            api.alert({
                msg: err.msg
            });
        }
    })
}