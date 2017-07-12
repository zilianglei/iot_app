function showChart() {
var UILineChart = api.require('UILineChart');

	var uid = $api.getStorage('uid');
	var chartData;
	
	if(typeof(uid) == "undefined") {
		var content = $api.byId('content');
		content.innerHTML = "<p align='center'>请登录后,查看我的设备！</p>";
		return;
	}
	
	var urlParam = {
	    msgType: "upstream_flow_sts",
    	userId: uid,
        devType: "all",
    };
    

    
    var upStreamFlow = {
        rect: {
        x: 0,
        y: 164,
        w: 320,
        h: 300
        },
        xAxis: {
        indexs: ['', '', '', '', '', '1:00', '', '', '', '', '', '2:00', '', '', '', '', '', '3:00','', '', '', '', '', '4:00'],
        screenXcount: 24
        },
        yAxis: {
        max: 5000,
        min: 0,
        step: 500,
        base: 0
        },
        datas: [
        [200, 500, 100, 0, 50, 1000, 200, 400, 2000, 2000, 100, 100, 60, 900, 800, 3000, 4000, 5000, 100]
        ],
        styles: {
        	xAxis: {
            bg: '#b2dfee',
            markColor: '#888',
            markSize: 12
        	},
        	yAxis: {
            bg: '#b2dfee',
            markColor: '#888',
            markSize: 12
        	},
        	coordinate: {
            bg: '#fcfcfc',
            color: '#cacaca',
            baseColor: 'bbb',
        	},
        	colors: ['#800080', '#7FFFAA']
    	},
    	fixedOn: api.frameName,
    	fixed: false
	};
    
    iotServerRequest("/app", 'POST', JSON.stringify(urlParam), function (ret, err) {
        if (ret) {
            //alert(JSON.stringify(ret));
            chartData = ret.monitorList[0].bw;
            //alert(JSON.stringify(chartData));
            upStreamFlow.datas[0] = chartData;
	
			UILineChart.open(upStreamFlow, function(ret, err) {
    			if (ret) {
        			//alert(JSON.stringify(ret));
    			} else {
        			//alert(JSON.stringify(err));
    			}
			});
        } else {
            api.alert({
                msg: err.msg
            });
            return;
        }
    });
    

}

apiready = function () {
    showChart();
    api.setRefreshHeaderInfo({
        visible: true,
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        showChart();
        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
       //showDevices();
    });
};