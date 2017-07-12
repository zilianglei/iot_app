function displayDevices(deviceData) {
	var content = $api.byId('content');
	var tpl = $api.byId('template').text;
	var tempFn = doT.template(tpl);
	content.innerHTML = tempFn(deviceData.deviceList);
}

function openDeviceCtl(devId) {   
    api.openWin({
        name: 'devCtl',
        url: 'devCtl.html',
        opaque: true,
        pageParam: {
            devId: devId
        },
        vScrollBarEnabled: false
    });
}

function openDeviceSettings(devId) {      
    api.openWin({
        name: 'devSettings',
        url: 'devSettings.html',
        opaque: true,
        pageParam: {
            devId: devId
        },
        vScrollBarEnabled: false
    });
}

function showDevices() {
	var uid = $api.getStorage('uid');
	
	if(typeof(uid) == "undefined") {
		var content = $api.byId('content');
		content.innerHTML = "<p align='center'>请登录后,查看我的设备！</p>";
		return;
	}
	
	var urlParam = {
	    msgType: "dev_get",
    	userId: uid,
        devType: "all",
    };
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            displayDevices(ret);
        } else {
            api.alert({
                msg: err.msg
            });
        }
    })
}

apiready = function () {
    showDevices();
    //pull to refresh
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        showDevices();
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
       showDevices();
    });
};