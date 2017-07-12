var g_devId;
var g_pName;
var g_cmdId;

function getCmdRet() {
 	var uid = $api.getStorage('uid');
    var urlParam = {
    	msgType: "get_dev_cmd_ret",
    	userId: uid,
    	devId: g_devId,
    	commandId: g_cmdId
    };
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
        		api.hideProgress();
        		api.alert({msg: "设置成功！"});
        	} else if(ret.ret == 90011) {
        		setTimeout("getCmdRet()", 2000);
        	} else {
        		api.hideProgress();
        		api.alert({msg: "设置失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
        	api.hideProgress();
            api.alert({msg: err.msg});
        }
    });
}

function ensure() {
    var uid = $api.getStorage('uid');
    var newPVlaue = $api.byId('pvalue').value;
    var urlParam = {
    	msgType: "dev_set_dev",
    	userId: uid,
    	devId: g_devId,
    	settings: {
    	},
    }   
    urlParam.settings[g_pName] = newPVlaue;
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
        	if(ret.ret == 0) {
        		if (typeof(ret.commandId) != "undefined") {
        			api.showProgress({
        				title: '正在下发配置给设备...',
        				modal: false
    				});
        			g_cmdId = ret.commandId;
        			setTimeout("getCmdRet()", 2000);
        		} else {
        			api.alert({msg: "设置失败!\nRet:  90010\n原因:cmdId缺失！"});
        		}
        	} else {
        		api.alert({msg: "设置失败!\nRet:  "+ret.ret+"\n原因:"+ret.errStr});
        	}
        } else {
            api.alert({msg: err.msg});
        }
    });
    /*
    ajaxRequest(updateNickNameUrl, 'put', JSON.stringify(bodyParam), function (ret, err) {
        if (ret) {
            //update personal center
            api.execScript({
                name: 'setting',
                frameName: 'setting-con',
                script: 'init();'
            });

            api.execScript({
                name: 'root',
                frameName: 'user',
                script: 'updateInfo();'
            });

            setTimeout(function () {
                api.alert({
                    msg: '修改成功'
                }, function (ret, err) {
                    api.closeWin();
                });
            }, 200);

        } else {
            api.toast({msg: err.msg})
        }
    })*/
}

apiready = function () {
    var header = $api.byId('header'); 
    g_pName = api.pageParam.pName;
    var pdisplay = api.pageParam.pDisplay || '修改设置';
    var pvalue = api.pageParam.pValue || '';
    g_devId = api.pageParam.devId;
    
    $api.byId('pname').innerHTML = pdisplay;
    $api.fixIos7Bar(header);
    $api.byId('pvalue').value = pvalue;
};