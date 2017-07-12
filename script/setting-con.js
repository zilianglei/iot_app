function modifyNick(nickname) {
    nickname = nickname || '';
    api.openWin({
        name: 'modifyNick',
        url: 'modifyNick.html',
        opaque: true,
        pageParam: {
            nickname: nickname
        },
        vScrollBarEnabled: false
    });
}

function modifyPwd() {
    api.openWin({
        name: 'modifyPwd',
        url: 'modifyPwd.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginBtn() {
    api.openWin({
        name: 'userLogin',
        url: 'userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function loginOut() {
    var common_url = 'http://d.apicloud.com/mcm/api';
    var appId = 'A6973666436346';
    var key = '64C65EDE-287E-1229-A9D2-D2FD8D38D9E4';
    var now = Date.now();
    var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
    var logoutUlr = '/User/logout';
    api.showProgress({
        title: '正在注销...',
        modal: false
    });
    
    /* TODO: 下面的代码后续要删除 */
    $api.clearStorage();
    setTimeout(function () {
    	api.closeWin();
    }, 100);
    api.hideProgress();
    return;
   /*
    api.ajax({
        url: common_url + logoutUlr,
        method: 'post',
        cache: false,
        timeout: 20,
        headers: {
            "Content-type": "application/json;charset=UTF-8",
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey,
            "authorization": $api.getStorage('token')
        }
    }, function (ret, err) {
        if (ret) {
            $api.clearStorage();
            api.execScript({
                name: 'root',
                script: 'openTab("main");'
            });
            setTimeout(function () {
                api.closeWin();
            }, 100);
        } else {
            alert(JSON.stringify(err));
        }
        api.hideProgress();
    });*/
}

function toRegister() {
    api.openWin({
        name: 'userLogin',
        url: 'userLogin.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

//清除下载缓存文件、拍照临时文件、网页缓存文件等
function clearData() {
    api.clearCache();

    setTimeout(function () {
        api.alert({
            msg: '缓存已清空!'
        });
    }, 300);
}

function openAbout() {
    api.openWin({
        name: 'about',
        url: './about.html'
    });
}

function ajaxRequestUserInfo(url, method, bodyParam, callBack) {
    var common_url = 'https://d.apicloud.com/mcm/api';
    var appId = 'A6973666436346';
    var key = '64C65EDE-287E-1229-A9D2-D2FD8D38D9E4';
    var now = Date.now();
    var appKey = SHA1(appId + "UZ" + key + "UZ" + now) + "." + now;
    api.ajax({
        url: common_url + url,
        method: method,
        cache: false,
        timeout: 20,
        headers: {
            "X-APICloud-AppId": appId,
            "X-APICloud-AppKey": appKey,
            "authorization": $api.getStorage('token'),
            "Content-type": "application/json"
        }
    }, function (ret, err) {
        callBack(ret, err);
    });
}

function init() {
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var uid = $api.getStorage('uid');
    var getUserById = '/user/' + uid;
    ajaxRequestUserInfo(getUserById, 'get', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('content');
            var tpl = $api.byId('template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret);
      
        } else {
            api.toast({msg: err.msg})
        }
        api.hideProgress();
    })
}

apiready = function () {
    init();
};