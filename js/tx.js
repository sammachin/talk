
"use strict";

// Set up the app once the DOM is loaded
var host = window.location.hostname;

Parse.initialize("N6DgygkEcCZkA6Jvr95yxXaUqJ43UOafmsckRESA", "PBsq8QXRbrDeeiXgh3pyCHRlUuNN6aGgeCcFLmpO");
var address = null;
var phono = $.phono({
  apiKey: "d22bad9eddf90467f2572be8d8b26a9b",
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
        $("#call").html("Talk to Me");
		$("#call").bind("click", callme);
		$("#call").removeClass("disabled").addClass("btn-success");
		}
});
function callme() {
	$("#status").html("Connecting");
	$("#call").unbind()
	document.getElementById("call").value="Cancel";
	var Address = Parse.Object.extend("Addresses");
	   var query = new Parse.Query(Address);
	   query.equalTo("address", host);
	   query.first({
	     success: function(object) {
	         address = object.get('sipuri');
			 console.log(address);
			 var infoObject = new Object();
			 infoObject.email = $("#email").val();
			 infoObject.subject = $("#subject").val();
			 var infoString = JSON.stringify(infoObject)
			 console.log("sent " + infoString)
			 phono.messaging.send(address, infoString);
			 var call = phono.phone.dial("xmpp:" + address, {
		    	onRing: function() {
					stage = "ringing";
		        	$("#status").html("Ringing");
					$("#call").bind("click", function() { call.hangup(); });
					$("#call").removeClass("btn-success").addClass("btn-danger");		
					$("#call").html("Hangup");
		        },
		        onAnswer: function() {
					stage = "answered";
		        	$("#status").html("Answered");
		        },
		        onHangup: function() {
					console.log(stage);
					$("#call").unbind();
					$("#call").bind("click", callme);
					$("#call").removeClass("btn-danger").addClass("btn-success");
		        	$("#call").html("Talk to Me");
		           	$("#status").html("Hungup");
					setTimeout(clearStatus,3000);
		        } 
		    });
			var stage = "trying";
		    $("#call").bind("click", function() { call.hangup(); });
	     },
	     error: function(error) {
	       alert("Error: " + error.code + " " + error.message);
	     }
	   });
    
}



function clearStatus(){
	$("#status").html("");
}
function get(){
   var Address = Parse.Object.extend("Addresses");
   var query = new Parse.Query(Address);
   query.equalTo("address", host);
   query.first({
     success: function(object) {
         address = object.get('sipuri');
		 console.log(sipurl);
     },
     error: function(error) {
       alert("Error: " + error.code + " " + error.message);
     }
   });
}


