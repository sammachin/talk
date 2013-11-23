var address = "sip:echo@sip.vipadia.com";
var phono = $.phono({
  apiKey: "test",
  audio : {
    type: "jsep",
    media: {
      audio: true,
      video: false
    },
    localContainerId: "localVideo",
    remoteContainerId: "remoteVideo"
  },
  onReady: function() {
     	$("#status").html("Ready");
        $("#call").html("Test Call");
		$("#call").bind("click", callme);
		$("#call").removeClass("disabled").addClass("btn-success");
		}
});
function callme() {
	$("#status").html("Connecting");
	$("#call").unbind()
	$("#call").bind("click", function() { call.hangup(); });
	document.getElementById("call").value="Cancel";
    var call = phono.phone.dial(address, {
    	onRing: function() {
        	$("#status").html("Ringing");
			$("#call").bind("click", function() { call.hangup(); });
			$("#call").removeClass("btn-success").addClass("btn-danger");		
			$("#call").html("Hangup");
        },
        onAnswer: function() {
        	$("#status").html("Answered");
        },
        onHangup: function() {
			$("#call").unbind()
			$("#call").bind("click", callme);
			$("#call").removeClass("btn-danger").addClass("btn-success");
        	$("#call").html("Call Me");
           	$("#status").html("Hungup");
			setTimeout(clearStatus,3000);
        } 
    });
}
function clearStatus(){
	$("#status").html("");
}

