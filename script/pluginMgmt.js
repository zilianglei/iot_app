var g_cVersion="N/A";
var g_state="INITIAL";/*INITIAL->UPGRADE->UPGRADING*/
var g_devId="N/A";
var g_firmwareId="N/A";
var g_newestVersion="N/A";

function iotGetPluginInfo(devId) {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "plugin_available",
    	userId: uid,
        devId: devId
    };
    var urlParam1 = {
	    msgType: "plugin_installed",
    	userId: uid,
        devId: devId
    };
    var sts = $api.byId('fwUpgradeStatus');
    var sts1 = $api.byId('fwUpgradeStatus1');
      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            if (ret.ret==0) {
            		sts.innerHTML = "<a>全部插件信息：" + JSON.stringify(ret.pluginList) +"</a>";
            } 
        } else {
            sts.innerHTML = "<a>插件信息信息失败：" + err.msg + "！</a>";
        }
    });
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam1), function (ret, err) {
        if (ret) {
            if (ret.ret==0) {
            		sts1.innerHTML = "<a>已安装插件信息：" + JSON.stringify(ret.pluginList) +"</a>";
            } 
        } else {
            sts1.innerHTML = "<a>插件信息信息失败：" + err.msg + "！</a>";
        }
    });

}

function doPluginInstall() {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "plugin_action",
    	userId: uid,
        devId: g_devId,
        action: "install",
        pluginList: ["11"]
    };

      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
				if (typeof(ret.commandId) != "undefined") {
				    api.showProgress({
        				title: '正在下发命令给设备...',
        				modal: false
    				});
        			setTimeout("iotGetCmdRet("+ret.commandId.toString()+","+g_devId.toString()+")", 1000);
        		} else {
        			api.alert({msg: "操作失败!\nRet:  90010\n原因:cmdId缺失！"});
        		}
        	} else {
        		api.alert({msg: "操作失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
            api.alert({msg: err.msg});
        }
    });
}

function doPluginRemove() {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "plugin_action",
    	userId: uid,
        devId: g_devId,
        action: "remove",
        pluginList: ["11"]
    };

      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
				if (typeof(ret.commandId) != "undefined") {
				    api.showProgress({
        				title: '正在下发命令给设备...',
        				modal: false
    				});
        			setTimeout("iotGetCmdRet("+ret.commandId.toString()+","+g_devId.toString()+")", 1000);
        		} else {
        			api.alert({msg: "操作失败!\nRet:  90010\n原因:cmdId缺失！"});
        		}
        	} else {
        		api.alert({msg: "操作失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
            api.alert({msg: err.msg});
        }
    });
}

function doPluginUpdate() {
	var uid = $api.getStorage('uid');
	var urlParam = {
	    msgType: "plugin_action",
    	userId: uid,
        devId: g_devId,
        action: "update",
        pluginList: ["11"]
    };

      
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
				if (typeof(ret.commandId) != "undefined") {
				    api.showProgress({
        				title: '正在下发命令给设备...',
        				modal: false
    				});
        			setTimeout("iotGetCmdRet("+ret.commandId.toString()+","+g_devId.toString()+")", 1000);
        		} else {
        			api.alert({msg: "操作失败!\nRet:  90010\n原因:cmdId缺失！"});
        		}
        	} else {
        		api.alert({msg: "操作失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
            api.alert({msg: err.msg});
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

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
    g_devId = api.pageParam.devId; 
    
	iotGetPluginInfo(g_devId);

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