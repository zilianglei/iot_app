var g_uid="invalid";
var g_romId="invalid";
var g_neighbourhoodId="invalid";
var g_neighbourhoodName="invalid";

function getMonthList() {
	var mySelect = document.getElementById("month");
	var myDate = new Date();
	var year = myDate.getFullYear();
	var month = myDate.getMonth();
	var tempMonth;
	var opp;
	
	mySelect.options.length = 0;
	
	if(month < 3) {
		for(var i=0; i<(3-month); i++) {
			tempMonth = (year-1)*100+10+month+i;
			opp = new Option(tempMonth, tempMonth);
			mySelect.add(opp);
		}
		
		for(var i=0; i<(month+1); i++) {
			tempMonth = year*100+1+i;
			opp = new Option(tempMonth, tempMonth);
			mySelect.add(opp);
		}
	} else {
		for(var i=0; i<4; i++) {
			tempMonth = year*100+month-2+i;
			opp = new Option(tempMonth, tempMonth);
			mySelect.add(opp);
		}
	}
}

/* ================当前地址======================== */
function changeRomId() {
	g_romId = document.getElementById("addressSelect").value;
	getData();
}

/* 获取用户配置的地址列表 */
function getAddress() {
	var mySelect = document.getElementById("addressSelect");
	var getAddressUrl = '/u_l_map?filter=';
    var getAddress_urlParam = {
        where: {
            usrId: g_uid
        },
    };
    
    /* TODO: hard code here */
    changeDistrict();
    mySelect.options.length = 0;
    ajaxRequest(getAddressUrl + JSON.stringify(getAddress_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
        	if(ret.length > 0) {
				for(var i=0; i<ret.length; i++) {
					var opp = new Option(ret[i].fullName, ret[i].id);
					mySelect.add(opp);
					if(i==0) {
						g_romId = ret[i].id;
					}
				}
				getData();
			}
        } else {
            api.toast({msg: err.msg, location: 'middle'});
        }
        api.hideProgress();
    });
}

/* ================增加地址======================== */
function changeDistrict() {
	//var districtId = document.getElementById("district").value;
	var districtId = "57319f800e2fbc374de51b2f";
	getNeighbourhoodList(districtId);
}

/* 获取小区列表 */
function getNeighbourhoodList(districtId) {
	var getNeighbourhoodUrl = '/neighborhood?filter=';
	var mySelect = document.getElementById("neighbourhood");
    var getNeighbourhood_urlParam = {
        where: {
            districtId: districtId
        },
    };
    
    mySelect.options.length = 0;
    ajaxRequest(getNeighbourhoodUrl + JSON.stringify(getNeighbourhood_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
        	if(ret.length > 0) {
				for(var i=0; i<ret.length; i++) {
					var opp = new Option(ret[i].name, ret[i].id);
					mySelect.add(opp);
					if(i==0) {
						g_neighbourhoodId = ret[i].id;
						g_neighbourhoodName = ret[i].name;
					}
				}
			}
        } else {
            api.toast({msg: err.msg, location: 'middle'});
        }
        api.hideProgress();
    });
}

function changeNeighbourhood(myData) {
	g_neighbourhoodId = document.getElementById("neighbourhood").value;
	g_neighbourhoodName = myData.options[myData.options.selectedIndex].text;
}

function doAddAddress() {
	var addAddressUrl = '/u_l_map';
	var romName = document.getElementById("romName").value;
	var addressFullName = g_neighbourhoodName + romName;
	
	if(g_uid=="invalid") {
		api.alert({msg: "请先登录！"});
		return;
	}
	
	if(g_neighbourhoodId=="invalid") {
		alert("请选择您的小区！");
		return;
	}
	
    var addAddressParam = {
	    usrId: g_uid,
	    nbgId: g_neighbourhoodId,
	    romName: romName,
	    fullName: addressFullName
    };
    
    ajaxRequest(addAddressUrl, 'post', JSON.stringify(addAddressParam), function (ret, err) {
        if (ret) {
        	api.toast({title: 'ok ok ok ok', duration: 2000, location: 'middle'});
        	getAddress();
        } else {
            api.alert({msg: err.msg});
        }
        api.hideProgress();
    });
}

function getData() {   
    var getDataUrl = '/shuidianmei?filter=';
    var getData_urlParam = {
        where: {
            usrId: g_uid,
            romId: g_romId
        },
        order: "month DESC",
    };
    
    if(g_romId == "invalid") {
    	alert("请点击“添加地址”按钮创建一个地址！");
    	return;
    }
    api.showProgress({title: '加载中...', modal: false});
    
    ajaxRequest(getDataUrl + JSON.stringify(getData_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('homedata-content');
            var tpl = $api.byId('homedata-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret);
            api.parseTapmode();
        } else {
            api.toast({msg: err.msg, location: 'middle'});
        }
        api.hideProgress();
    });
}


apiready = function () {
	var temp_uid = $api.getStorage('uid');
	if(temp_uid) {
		g_uid = temp_uid;
	}
    getAddress();
    getMonthList()

    //pull to refresh
    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
    	getAddress();
    	getMonthList()
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
        //getBanner();
        //getData();
    });
};


/* ================增加数据======================== */
function doAddNewData() {
    var month = $api.byId('month').value;
    var shui = $api.byId('shui').value;
    var dian = $api.byId('dian').value;
    var mei = $api.byId('mei').value;
    var isNew = true;
    var dataId = "invalid";
 
    var getDataUrl = '/shuidianmei?filter=';
    var getData_urlParam = {
        where: {
            usrId: g_uid,
            romId: g_romId,
            month: month
        },
    };
    
    if(g_uid=="invalid") {
		api.alert({msg: "请先登录！"});
		return;
	}
    
    ajaxRequest(getDataUrl + JSON.stringify(getData_urlParam), 'GET', '', function (ret, err) {
        if (ret) {
			if(ret.length==0) {
				isNew = true;
			} else {
				isNew = false;
				dataId = ret[0].id;
				if(shui == 0) { shui = ret[0].shui; }
				if(dian == 0) {	dian = ret[0].dian;	}
				if(mei == 0) { mei = ret[0].mei; }
			}
			
			submitData(isNew, dataId, g_uid, month, shui, dian, mei);
        } else {
            api.toast({msg: err.msg, location: 'middle'});
        }
        api.hideProgress();
    });
}

function submitData(isNew, dataId, uid, month, shui, dian, mei) {
	var updateDataUrl = '/shuidianmei';

    if(isNew) {
        var addDataParam = {
	    	usrId: uid,
	    	romId: g_romId,
	        month: month,
        	shui: shui,
        	dian: dian,
        	mei: mei
    	};
    	ajaxRequest(updateDataUrl, 'post', JSON.stringify(addDataParam), function (ret, err) {
        	if (ret) {
        		api.toast({title: 'ok ok ok ok', duration: 2000, location: 'middle'});
        		getData();
        	} else {
            	api.alert({msg: err.msg});
        	}
        	api.hideProgress();
    	});
    } else {
    	var updateDataParam = {
        	shui: shui,
        	dian: dian,
        	mei: mei
    	};
    	ajaxRequest(updateDataUrl + '/' + dataId, 'put', JSON.stringify(updateDataParam), function (ret, err) {
        	if (ret) {
        		api.toast({title: 'ok ok ok ok', duration: 2000, location: 'middle'});
        		getData();
        	} else {
            	api.alert({msg: err.msg});
        	}
        	api.hideProgress();
    	});
    }
    
    inputReset();
}

function inputReset() {
	document.getElementById("month").value = "";
	document.getElementById("shui").value = "";
	document.getElementById("dian").value = "";
	document.getElementById("mei").value = "";
}