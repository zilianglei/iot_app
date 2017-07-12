var ele;
var messageGlobal = "欢迎使用语音客服";
var scrollTop_g = 0;//记录最后一个发出的消息的scrollTop
var voiceFlag = 2;//用于判断录音结束是超时触发的还是点击波纹触发的 2是由超时触发

var g_uid=123456;
var ws;
var g_to="robot";

var myApp =	new Vue({
  			el: '#app',
 		    data: {
 		    	history:[],
    			ok: true,
   		    message: 'RUNOOB',
    			id : 1,
    			i:1
  			},
  			methods:{
  		
  		
  			}
		});
//停止朗读
function stopRead(){
	$(".stopBtn").css("color","yellow");
	speechRecognizer.stopRead();
	setTimeout(function(){
			$(".stopBtn").css("color","white");
	},300);

}

function setvoicebtn(){
	$("#voiceBtn").on("click", function() {

    SW9.start();
    speechRecognizer.stopRead();
	$(".wavecontainer").css("z-index", 1);
	$("#container-ios9-canvas").show();
	$("#voiceBtn").hide();
   getVoice();
});

$(".wavecontainer").on("click", function() {
	
	 voiceFlag = 1;
	//震动

	speechRecognizer.stopRecord();
	SW9.stop();
    speechRecognizer.stopRead();
   
	$(".wavecontainer").css("z-index", -1);
	$("#container-ios9-canvas").hide();
	$("#voiceBtn").show();
	
});



//编辑按钮点击
$(document).on("click",".editmessage",function(){
	var athis = $(this);
    $(this).hide();
    ele = $(this).parent().siblings(".mymessage");
    //设置ele可编辑
    ele.attr("contenteditable",true);
	ele.addClass("select");
	ele.css("background","rgba(220,220,220,0.3)");
	//去除标点
	var mess = ele.text().substring(1,ele.text().length-1);
	ele.text(mess);
	po_Last_Div(ele[0]);
	//滚动到最上面
	$("#chatContainer").scrollTop(scrollTop_g);
	//失去焦点的时候返回编辑前的样式
$(".select").on("blur",function(){
	 //设置ele不可编辑
    ele.attr("contenteditable",false);
	ele.css("background","transparent");
    athis.show();
    var mess2 = '“'+ele.text()+'”';
    ele.text(mess2);
    $(".select").unbind("blur");
    ele.removeClass("select");
    
    
    sendMessage(ele.text());
    
});


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
        if(callback1){
        	  callback1();
        }
      
    } else {
        api.alert({ msg: err.msg });
    }
});

}

//定位div(contenteditable = "true")
function po_Last_Div(obj) {
	if(window.getSelection) { //ie11 10 9 ff safari
		obj.focus(); //解决ff不获取焦点无法定位问题
		var range = window.getSelection(); //创建range
		range.selectAllChildren(obj); //range 选择obj下所有子内容
		range.collapseToEnd(); //光标移至最后
	} else if(document.selection) { //ie10 9 8 7 6 5
		var range = document.selection.createRange(); //创建选择对象
		//var range = document.body.createTextRange();
		range.moveToElementText(obj); //range定位到obj
		range.collapse(false); //光标移至最后
		range.select();
	}
}




function getScrollTop(){
		var containerHeight = $("#chatContainer").get(0).scrollHeight;
		var eleHeight = $(".mymessageContainer:last").height();
		var contentH = $("#chatContainer").height();
		
		scrollTop_g = containerHeight - contentH - eleHeight;
}





var flag = 1;
//显示最后一行编辑按钮
$(".mymessageContainer:last").find(".editmessageContainer").show();
function  sendMessage(message){
	$(".wavecontainer").trigger("click");
	voiceFlag = 2;
	flag = 1;
	var dic = {type:1,message:message};
	myApp.history.push(dic);
	
	
				var urlParam = {
					msgType: "QAsession",
					from: g_uid,
					to: g_to,
					msg: {
						type: "txt",
						data: message
					}
				};
				sendMsgToServer(JSON.stringify(urlParam));
	
	
	
	
}

function getMessage(message){

    message = message.replace(/\n/g,"<br/>");


	flag = 2;
	voiceToText(message);
	var dic = {type:2,message:message};
	myApp.history.push(dic);
	
}






$("#chatContainer").scrollTop(scrollTop_g);
myApp.$watch("history",function(){
	if(flag == 1){
	$(".editmessageContainer").hide();
	$(".mymessageContainer:last").find(".editmessageContainer").show();
	var edit = $(".mymessageContainer:last");
   
    	//发送消息完成记录scrollTop
	getScrollTop();
	$("#chatContainer").scrollTop(scrollTop_g);
		
	}


});

//滑动等时候滚动到第一条消息等高度


//var timeFlag = 2;
//
//	
//	$("#chatContainer").on("scroll",function(){
//	
//
//	if($("#chatContainer").scrollTop() > scrollTop_g){
//		if(timeFlag == 2){
//			timeFlag == 1;
//		setTimeout(function(){
//			$("#chatContainer").scrollTop(scrollTop_g);
//			timeFlag = 2;
//		},300);
//		}
//
//	}
//	
//});



var speechRecognizer = 0;	
	
function getVoice(){
	console.log("录音");
	speechRecognizer.record({
    vadbos: 3000,
    vadeos: 3000,
    rate: 16000, 
    asrptt: 1,
   
}, function(ret, err) {
    if (ret.status) {
//        api.alert({ msg: ret.wordStr });
        //发送消息
 
       var str = ret.wordStr;
       var reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/;
        
       
       
       if(voiceFlag == 1){
       	
       	        	
        	if(ret.wordStr != "" && reg.test(str.charAt(str.length - 1)) ){
        	  	   console.log(JSON.stringify(ret));
//      	       api.alert({ msg: ret.wordStr });
        	       sendMessage("“"+ret.wordStr+"”");
        	       
        }
        	
       	
       }
       //超时触发
        if(voiceFlag == 2){
        	if(ret.wordStr != "" && !reg.test(str.charAt(str.length - 1)) ){
        	  	   console.log(JSON.stringify(ret));
//      	       api.alert({ msg: ret.wordStr });
        	       sendMessage("“"+ret.wordStr+"”");    	       
        } 	
       }
    } else {
         // api.alert({ msg: err.msg });
          //错误处理，返回我不知道你在说什么
          $(".wavecontainer").trigger("click");
          voiceFlag = 2;
          getMessage("我不知道你在说什么。");
        
    }
});

speechRecognizer.addRecordHUD({
    centerX: 160,
    centerY: 120,
    radius: 80,
    transparentR: 40,
    bg: '#AAAAAA',
//  fixedOn: api.frameName,
    fixed: false
}, function(ret, err) {
    var volume = ret.volume;
    //console.log(volume);
    SW9.setAmplitude(volume);
});

speechRecognizer.hideRecordHUD();

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
   setvoicebtn();
     getScrollTop();//初始化滚动高度


 

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
    	
//  	var urlParam2 = {
//			msgType: "send",
//			to: g_to,
//  		userId: g_uid
//  	};
//  
//  	sendMsgToServer(JSON.stringify(urlParam2));
    	
	};
	
	

	//收到消息时触发
	ws.onmessage = function(e) {
		var msg = JSON.parse(e.data);
		
		if(msg.msgType == "QAsession") {
			//alert(JSON.stringify(msg));
			
		//收到消息读取
		messageGlobal = msg.msg.data;
		
		getMessage(messageGlobal);

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



