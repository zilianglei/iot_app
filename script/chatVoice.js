var speechRecognizer = 0;
var messageGlobal = "欢迎使用语音客服";
var g_uid=123456;
var ws;
var g_to="robot";

//发送消息
function sendMessage(mes){
	
			var urlParam = {
				msgType: "QAsession",
    			from: g_uid,
    			to:   g_to,
        		msg: { 
        			type: "txt",
        			data: mes
        		}
    	};
    		sendMsgToServer(JSON.stringify(urlParam));

}
function getVoice(){
	console.log("录音");
	speechRecognizer.record({
    vadbos: 5000,
    vadeos: 5000,
    rate: 16000,
    asrptt: 1,
   
}, function(ret, err) {
    if (ret.status) {
          //api.alert({ msg: ret.wordStr });
        //发送消息
      
       var str = ret.wordStr;
       var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
        if(ret.wordStr != "" && reg.test(str.charAt(str.length - 1)) ){
        	  	   console.log(JSON.stringify(ret));
        	       sendMessage(ret.wordStr);
        }
 

    } else {
        //api.alert({ msg: err.msg });
    }
});


speechRecognizer.addRecordHUD({
//  centerX: 160,
    centerY: 350,
    radius: 100,
    transparentR: 50,
    bg: '#FFA500',
    fixed: false
}, function(ret, err) {
    var volume = ret.volume;
});
speechRecognizer.showRecordHUD();

}
//设置长按录音
function setVoice(){
	$(".voice").on("touchstart",function(e){
		speechRecognizer.stopRead();
		$(".read").removeClass("readAnimation");
		$(this).addClass("yellow");
		$(this).text("正在录音");
		getVoice();
		e.preventDefault();
	});
	$(".voice").on("touchend",function(){
//		toast("取消录音");
		speechRecognizer.stopRecord();
		speechRecognizer.hideRecordHUD();
		$(this).removeClass("yellow");
		$(this).text("语音");
	});
}
//文字转换语音
function voiceToText(message,callback1){
	speechRecognizer.read({
    readStr: message,
    speed: 60,
    volume: 60,
    voice: 0,
    rate: 16000,
//  audioPath: 'fs://speechRecogniser/read.mp3'
}, function(ret, err) {
    if (ret.status) {
        ret.speakProgress;
        callback1();
    } else {
        api.alert({ msg: err.msg });
    }
});

}
function setReadVoice(){
	$(".read").on("click",function(){
		if($(this).hasClass("readAnimation")){
			$(this).removeClass("readAnimation");
			speechRecognizer.stopRead();
		}else{
			$(this).addClass("readAnimation");
		    voiceToText(messageGlobal,function(){
		    	$(".read").removeClass("readAnimation");
		    });
		}

	});
}

function getMessage(callback){
	callback();
}
function toast(message){
	var progress = '<div style="position: fixed;font-size:12px; background: rgba(0,0,0,0.2); top: 40%; padding: 10px 20px; border-radius: 5px; color: white; left: 35%; width: 30%;text-align: center;">asdfa</div>';
	var pro = $(progress);
	pro.text(message);
	$("body").append(pro);
	setTimeout(function(){
		//$("body").remove(pro);
		pro.remove();
	},500);
}


//向客户端发送消息，这里定义了一些参数用来设置消息的颜色字体，不过暂时没用到有兴趣的可以自己实现
function sendMsgToServer(msg) {
    //向服务端发送消息
    ws.send(msg);
}

apiready = function () {
	var header = $api.byId('header');
    $api.fixIos7Bar(header);
    
	speechRecognizer = api.require('speechRecognizer');
//添加录音与读取的事件

	setVoice();
	setReadVoice();
	g_uid = $api.getStorage('uid');
//	g_uid="robot";
	
	//创建一个连接，这里的参数是服务端的链接
	ws = new WebSocket('ws://'+iotGetServerAddr()+':3009/');

	//打开连接时触发
	ws.onopen = function() {
		var urlParam = {
			msgType: "login",
    		userId: g_uid,
    	};
    
    	sendMsgToServer(JSON.stringify(urlParam));
	};

	//收到消息时触发
	ws.onmessage = function(e) {
		var msg = JSON.parse(e.data);
		
		if(msg.msgType == "QAsession") {
			//alert(JSON.stringify(msg));
			
		//收到消息读取
			messageGlobal = msg.msg.data;
		
			$(".read").trigger("click");


			g_to = msg.from;
		}
	}

	//关闭连接时触发
	ws.onclose = function(e) {
	}
	//连接错误时触发
	ws.onerror = function(e) {
	}
}