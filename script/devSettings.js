var g_devId;
var g_fwVersion='N/A';

function showSettings(devData) {
	var arrayObj = new Array();
	var content = $api.byId('settings-content');
	var tpl = $api.byId('settings-template').text;
	var tempFn = doT.template(tpl);
	arrayObj.push(devData.dataModel.settings, devData.devData);
	
	content.innerHTML = tempFn(arrayObj);
}

function showInfos (devData) {
	var arrayObj = new Array();
	var content = $api.byId('info-content');
	var tpl = $api.byId('info-template').text;
	var tempFn = doT.template(tpl);
		
	arrayObj.push(devData.dataModel.info, devData.devData);
	
	content.innerHTML = tempFn(arrayObj);
}

function modifyTextSettings(name, display, value) {
    api.openWin({
        name: 'modifyTextSettings',
        url: 'modifyTextSettings.html',
        opaque: true,
        pageParam: {
        	devId: g_devId,
            pName: name,
            pDisplay: display,
            pValue: value,
        },
        vScrollBarEnabled: false
    });
}

function getDeviceData(devId) {
	iotGetDeviceData(devId, function(ret){
		g_fwVersion = ret.devData.softwareVersion;
		showSettings(ret);
    	showInfos(ret);
    });
}

function openFirmwareUpgrade() {   
    api.openWin({
        name: 'firmwareUpgrade',
        url: 'firmwareUpgrade.html',
        opaque: true,
        pageParam: {
            devId: g_devId,
            cVersion: g_fwVersion
        },
        vScrollBarEnabled: false
    });
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    g_devId = api.pageParam.devId; 

	getDeviceData(g_devId);

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
    	getDeviceData(g_devId);
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    	getDeviceData(g_devId);
    });

};

function openPluginMgmt() {   
    api.openWin({
        name: 'pluginMgmt',
        url: 'pluginMgmt.html',
        opaque: true,
        pageParam: {
            devId: g_devId
        },
        vScrollBarEnabled: false
    });
}