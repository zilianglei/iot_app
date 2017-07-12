var chatDom1 = null;
var chatDom2 = null;
var g_uid=123456;
var ws;
var g_to=10;
function sendMessage(callback){
	
	callback();
}

function getMessage(callback){
	callback();
}

function addMessage(){
	
}
function scrollToBottom(ele){
		var containerHeight = $(ele).get(0).scrollHeight;
		var windowHeight = $(ele).height();
		scrollTop = containerHeight - windowHeight;
		$(ele).scrollTop(scrollTop);
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

function getChatdata(){
	
	if(typeof localStorage.chatdata == "undefined"){
	localStorage.chatdata = '{"data":[]}';
}
	try{
		var chatdata = JSON.parse(localStorage.chatdata);
	}catch(e){
		
	}
	return chatdata;
}

function storageChatdata(dic){
	var chatdata = getChatdata();
	chatdata.data.push(dic);
	localStorage.chatdata = JSON.stringify(chatdata);
}

function emptyMessage(){
	localStorage.removeItem("chatdata");
	$("#chatContainer").empty();
}



//var chatdata = [{"type":"1","message":"这是聊天记录","time":"今天 10:50"},{"type":"1","message":"这是聊天记录","time":"今天 10:50"},{"type":"2","message":"这是聊天记录","time":"今天 10:50"}];


function getDefaultData(){
	

chatDom1 = '<li><div class="time"></div><div class="headerImgContainer"><div class="name">'+g_to+':</div></div><div class="message"></div></li>';

chatDom2 = '<li><div class="time"></div><div class="rigth-Margin"></div><div class="messageContainer"><div class="message">了了弗撒了水电费水电费了了弗xvfasfdsaf撒了水电费水电费了了弗撒了水电费水电费了了弗撒了水电费水电费了了弗撒了水电费水电费。</div></div><div class="headerImgContainer"><div class="name">:'+"我"+'</div></div></li>';

var chatdata = getChatdata();

	for(var i = 0; i < chatdata.data.length; i++){
	
	if(chatdata.data[i].type == "1"){
		var dom = $(chatDom1);
		dom.find(".message").html(chatdata.data[i].message);
		$("#chatContainer").append(dom);
	}
	if(chatdata.data[i].type == "2"){
		var dom = $(chatDom2);
		dom.find(".message").html(chatdata.data[i].message);
		$("#chatContainer").append(dom);
	}
}
	
}

$(".sendBtn").on("click",function(){
	var message = $(".messageInput").val();
	
	if(message.length == 0){
		toast("不能发送空消息!");
	}else{	
		sendMessage(function(){	
			var dic = {};
			dic.type = "2";
			dic.message = message;
	    	storageChatdata(dic);
			var dom = $(chatDom2);
			dom.find(".message").text(message);
			$("#chatContainer").append(dom);
			$(".messageInput").val("");
			scrollToBottom("#chatContainer");
			
			var urlParam = {
				msgType: "QAsession",
    			from: g_uid,
    			to:   g_to,
        		msg: { 
        			type: "txt",
        			data: message
        		}
    		};
    
    		sendMsgToServer(JSON.stringify(urlParam));
		});
	}
		
});

$(".emptyBtn").on("click",function(){
	emptyMessage();
});





//向客户端发送消息，这里定义了一些参数用来设置消息的颜色字体，不过暂时没用到有兴趣的可以自己实现
function sendMsgToServer(msg) {
    //向服务端发送消息
    ws.send(msg);
}
    
apiready = function () {
	console.log(localStorage.getItem("chatdata"));
	
	var header = $api.byId('header');
    $api.fixIos7Bar(header);
	
	
	g_uid = $api.getStorage('uid');
//	g_uid="robot";
    getDefaultData();
    
 
	
	//创建一个连接，这里的参数是服务端的链接
	ws = new WebSocket('ws://'+iotGetServerAddr()+':3009/');

	//打开连接时触发
	ws.onopen = function() {
		var urlParam = {
			msgType: "login",
    		userId: g_uid,
    	};
    
    	sendMsgToServer(JSON.stringify(urlParam));
    	
//  	    	var urlParam2 = {
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
			var messageT = msg.msg.data.replace(/\n/g,"<br/>");
			
			var dic = {};
			dic.type = "1";
//			dic.message = msg.msg.data;
			dic.message = messageT;
			
	    	storageChatdata(dic);
			var dom = $(chatDom1);
//			dom.find(".message").text(dic.message);
			dom.find(".message").html(dic.message);
			
			$("#chatContainer").append(dom);
			$(".messageInput").val("");
			scrollToBottom("#chatContainer");
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