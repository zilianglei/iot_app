var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var uname = $api.byId('userName').value;
    var pwd = $api.byId('userPwd').value;
    var pwd2 = $api.byId('userPwd2').value;
    if (pwd !== pwd2) {
        api.alert({
            msg: '两次密码不一致'
        }, function (ret, err) {
            api.hideProgress();
        });
        return;
    }
    var registerUrl = '/user';
    var bodyParam = {
        username: uname,
        password: pwd2
    }
    
    var checkUserUrl = '/user?filter=';
    var checkUser_urlParam = {
        where: {
            username: uname,
        },
    };
    
    iotServerRequest(registerUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
    	if (ret) {
    		if(ret.ret == 0) {
        		api.alert({
            		msg: '注册成功！'
            	}, function () {
            		api.closeWin();
            	});
            } else {
            	api.alert({
            	msg: ret.errStr
            	});
            }
        } else {
        	api.alert({msg: err.msg});
        }
        	api.hideProgress();
    });
    /*			
    ajaxRequest(checkUserUrl + JSON.stringify(checkUser_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
			if(ret.length == 0) {
    			ajaxRequest(registerUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
        			if (ret) {
            			api.alert({
                			msg: '注册成功！'
            			}, function () {
                			api.closeWin();
            			});
        			} else {
            			api.alert({msg: err.msg});
        			}
        			api.hideProgress();
    			});
			} else {
				api.hideProgress();
				alert("用户名已存在！");
				return;
			}
        } else {
        	api.hideProgress();
        	alert("访问服务器出错，请重试！");
        	return;
        }
    });*/

}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};