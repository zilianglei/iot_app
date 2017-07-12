var g_cVersion="N/A";
var g_state="INITIAL";/*INITIAL->UPGRADE->UPGRADING*/
var g_devId="N/A";
var g_firmwareId="N/A";
var g_newestVersion="N/A";


function iotCheckUpdate(devId) {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "firmware_query",
    	userId: uid,
        devId: devId
    };
    var sts = $api.byId('fwUpgradeStatus');
    var btn = $api.byId('fwUpgradeBtn');
      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            if (ret.ret==0) {
            	if(ret.newestVersion == g_cVersion) {     	
            		sts.innerHTML = "<a>当前固件版本：" + g_cVersion + "，已经是最新版本</a>";
            		btn.innerHTML = "<button type='button' id='fwUpgradeBtn' onclick='fwUpgrade()'>检查更新</button>";;
            		g_state="INITIAL";
            	} else {
            		sts.innerHTML = "<a>当前固件版本：" + g_cVersion + "，可以升级到：" + ret.newestVersion +"</a>";
            		btn.innerHTML = "<button type='button' id='fwUpgradeBtn' onclick='fwUpgrade()'>升级</button>";;
            		g_firmwareId = ret.firmwareId;
            		g_newestVersion = ret.newestVersion;
            		g_state="UPGRADE";
            	}
            } 
        } else {
            sts.innerHTML = "<a>获取新版本信息失败：" + err.msg + "！</a>";
            btn.innerHTML = "<button type='button' id='fwUpgradeBtn' onclick='fwUpgrade()'>检查更新</button>";;
            g_state="INITIAL";
        }
    });
}

function iotDoUpgrade() {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "firmware_upgrade",
    	userId: uid,
        devId: g_devId,
        firmwareId: g_firmwareId,
        version: g_newestVersion
    };
    var sts = $api.byId('fwUpgradeStatus');
    var btn = $api.byId('fwUpgradeBtn');
      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            if (ret.ret==0) {
            	if(ret.newestVersion == g_cVersion) {     	
            		sts.innerHTML = "<a>正在最新版本,设备会自动重启，请退出该界面！</a>";
            		btn.innerHTML = "<button type='button' id='fwUpgradeBtn' onclick='fwUpgrade()'>退出界面</button>";;
            		g_state="UPGRADING";
            	} else {
            		sts.innerHTML = "<a>请求升级失败，请重试！</a>";
            	}
            } 
        } else {
            api.alert({
                msg: err.msg
            });
        }
    });
}
 
function fwUpgrade() {
	if (g_state=="INITIAL") {
		iotCheckUpdate(g_devId);
	} else if (g_state=="UPGRADE") {
		iotDoUpgrade();
	} else if (g_state=="UPGRADING") {
		/* TODO: */
	}
}

function initContent() {
    var sts = $api.byId('fwUpgradeStatus');
    var btn = $api.byId('fwUpgradeBtn');
    
    sts.innerHTML="<a>当前固件版本：" + g_cVersion + "</a>";
    btn.innerHTML="<button type='button' id='fwUpgradeBtn' onclick='fwUpgrade()'>检查更新</button>";
    
    g_state="INITIAL";
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    g_devId = api.pageParam.devId; 
    g_cVersion = api.pageParam.cVersion;
    
	initContent();

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
    	initContent();
    	
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    	initContent();
    });

};