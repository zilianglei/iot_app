var g_devId;
//创建一个连接，这里的参数是服务端的链接

var ws = new WebSocket('ws://'+iotGetServerAddr()+':3009/');

//向客户端发送消息，这里定义了一些参数用来设置消息的颜色字体，不过暂时没用到有兴趣的可以自己实现
function sendMsgToServer(msg) {
    //向服务端发送消息
    ws.send(msg);
}

//打开连接时触发
ws.onopen = function() {
	getDeviceData();
};

//收到消息时触发
ws.onmessage = function(e) {
	var msg = JSON.parse(e.data);
	
	if (msg.ret != 0) {
		alert(msg.msgType+": ["+msg.ret+"] "+msg.data);
		return;
	}
	
	if(msg.msgType == "dev_get_one") {
		showCtls(msg.data);
	} else if (msg.msgType == "dev_ctl") {
		alert(msg.data);
	}
}

//关闭连接时触发
ws.onclose = function(e) {
}
//连接错误时触发
ws.onerror = function(e) {
}


function devCtlChangeSwitch(obj) {
	var uid = $api.getStorage('uid');
	var urlParam = {
		msgType: "dev_ctl",
    	userId: uid,
        devId: g_devId,
        controls: {
        },
    }
    
    if(obj.checked) {
    	urlParam.controls[obj.id] = "1";
    } else {
    	urlParam.controls[obj.id] = "0";
    }
    
    sendMsgToServer(JSON.stringify(urlParam));
}

function ensure() {
    var uid = $api.getStorage('uid');
    var nickname = $api.byId('nickname').value;

    var updateNickNameUrl = '/user/' + uid;
    var bodyParam = {
    	
        nickname: nickname
    }
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
    })
}

function showCtls (devData) {
	var arrayObj = new Array();
	var content = $api.byId('ctl-content');
	var tpl = $api.byId('ctl-template').text;
	var tempFn = doT.template(tpl);
	
	arrayObj.push(devData.dataModel.controls, devData.devData);
	
	$api.byId('devctl-header').innerHTML = devData.devData.name;
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
	content.innerHTML = tempFn(arrayObj);
}

function getDeviceData() {
	var uid = $api.getStorage('uid');
	var urlParam = {
		msgType: "dev_get_one",
    	userId: uid,
        devId: g_devId,
    }
    ws.send(JSON.stringify(urlParam));
}

function closeDevCtlPage() {
	api.closeWin();
}

apiready = function () {
	g_devId = api.pageParam.devId;
		
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
    	getDeviceData();
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
        getDeviceData();
    });
};