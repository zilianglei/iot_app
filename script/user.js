function openNewDetail(type, did) {
    var name = ''
    switch (type) {
        case 't':
            name = 'news-text';
            break;
        case 'v':
            name = 'news-video';
            break;
    }
    api.openWin({
        name: name,
        url: name + '.html',
        pageParam: {newsId: did}
    });
}

//init personal center
function initPersonalCenter(json) {
	return;
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    json = json || {};
    if (!json.nickname) {
        return;
    }

    var uid = $api.getStorage('uid');
    var getUserAct_favUrl = '/user?filter=';
    var act_urlParam = {
        include: ["news_fav"],
        where: {
            id: uid
        }
    };
    return;
    ajaxRequest(getUserAct_favUrl + JSON.stringify(act_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
            var pc = api.require('personalCenter');
            var headerH = api.pageParam.headerHeight;
            var photo = json.photo || 'widget://image/userTitle.png';
            var point = json.point || 0;
            var newsFav = ret[0].news_fav.length || 0;

            for (var i in ret[0].news_fav) {
                newsFavArr[i] = ret[0].news_fav[i].news;
            }
            localStorage.setItem('newsFavArr', newsFavArr);
            pc.open({
                y: 0,
                height: 200,
                fixedOn: 'user',
                fixed: true,
                imgPath: photo,
                placeHoldImg: photo,
                showLeftBtn: false,
                showRightBtn: false,
                username: json.nickname,
                count: point,
                modButton: {
                    bgImg: 'widget://image/edit.png',
                    lightImg: 'widget://image/edit.png'
                },
                btnArray: [
                    {
                        bgImg: 'widget://image/personal_btn_nor.png',
                        lightImg: 'widget://image/personal_btn_light.png',
                        selectedImg: 'widget://image/personal_btn_sele.png',
                        title: '新闻收藏',
                        count: newsFav,
                        titleColor: '#ffffff',
                        titleLightColor: '#55abce',
                        countColor: '#ffffff',
                        countLightColor: '#55abce'
                    }
                ]
            }, function (ret, err) {
                $api.byId('activity').innerHTML = '';
                if (ret.click === 0) {
                    getFavData('news', localStorage.getItem('newsFavArr'));
                }
            });
            api.hideProgress();
        } else {
            api.toast({msg: err.msg, location: 'middle'})
            api.hideProgress();
        }

    })
}


function getFavData(type, ids) {
    var getUserFavUrl = '/' + type + '?filter=';
    var arr = ids.split(',');
    var urlParam = {
        where: {
            id: {
                inq: arr
            }
        }
    };
    ajaxRequest(getUserFavUrl + JSON.stringify(urlParam), 'get', '', function (ret, err) {
        switch (type) {
            case 'news':
                newsCallBack(ret, err)
                break;
        }
    })
}


function newsCallBack(ret, err) {
    if (ret) {
        var data = {};
        data.favType = 'news';
        data.ret = ret;
        var content = $api.byId('activity');
        var tpl = $api.byId('template').text;
        var tempFn = doT.template(tpl);
        $api.byId('activity').innerHTML = '';
        $api.append(content, tempFn(data));
    } else {
        alert(JSON.stringify(err))
    }
}


function init() {
    var photoUrl = 'http://file.apicloud.com/mcm/A6965864070945/91f4a5f93b962c7c0f4e83effc4973fd.png';
    initPersonalCenter({
        nickname: 'APICloud',
        photo: photoUrl,
        point: 0
    });
}

function updateInfo() {
    var pc = api.require('personalCenter');
    pc.close();
    init();
}

apiready = function () {
    init();
};