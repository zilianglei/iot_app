function openSecFlowChart(devId) {   
    api.openWin({
        name: 'secFlow',
        url: 'secFlow.html',
        opaque: true,
        pageParam: {
            devId: devId
        },
        vScrollBarEnabled: false
    });
}

function deviceBind(){
	var FNScanner = api.require('FNScanner');
	FNScanner.openScanner({
    	autorotation: true
	}, function(ret, err){        
    if( ret ){
    	if(ret.eventType == "success") {
    		var uid = $api.getStorage('uid');
    	    var content = JSON.parse(ret.content);
    		var bindParam = {
    			msgType: "dev_bind", 
    			userId: uid,
    			manufacture: content.manufacture,
    			serialNumber: content.serialNumber,
    			key: content.key
    		};
    		
        	iotServerRequest("/app", 'POST', JSON.stringify(bindParam), function (ret, err) {
        		if (ret) {
        			if(ret.ret == "0") {
        				api.alert({msg: "绑定成功！"});
        			} else {
        				api.alert({msg: "绑定失败，Ret: "+ret.ret});
        			}
        		} else {
            		api.alert({msg: err.msg});
        		}
    		});
    	} else {
    		//api.alert({msg: "读取二维码失败：  "+ret.eventType});
    	}
    }else{
        //alert( JSON.stringify( err ) );
    }
	});
}

function ensure() {
	var iotServer = $api.byId('iotServer').value;
	$api.setStorage('iotServer', iotServer);
}

apiready = function () {
	var iotServer = $api.getStorage('iotServer');
	if(typeof(iotServer) == "undefined") {
		iotServer = 'http://115.29.49.52';
	}
	$api.byId('iotServer').value = iotServer;
};