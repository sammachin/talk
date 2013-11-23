"use strict";

// Set up the vars 
Parse.initialize("N6DgygkEcCZkA6Jvr95yxXaUqJ43UOafmsckRESA", "PBsq8QXRbrDeeiXgh3pyCHRlUuNN6aGgeCcFLmpO");
var host = window.location.hostname;
var user = null;
var count = null;
var address = null;

// functions I'll need
function phono(){
	$.phono({
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
		address = this.sessionId
		set(address);
  	},
  	phone: {
	    	onIncomingCall: function(event) {
	      		var call = event.call;
		  		$("#status").html("Incomming Call");
	      		$("#call").bind("click", function() { return answer(call); });
		  		$("#call").removeClass("disabled").addClass("btn-success");		
		  		$("#call").html("Answer");
				call.bind({
					onHangup: function() {
						$("#call").unbind()
						$("#call").removeClass("btn-danger").addClass("disabled");
						$("#call").removeClass("btn-sucess").addClass("disabled");
			        	$("#call").html("");
			           	$("#status").html("Hungup");
						$("#callerinfo").hide();
						setTimeout(clearStatus,3000);
			        }
				})
	   		},
		},
	messaging: {
	    onMessage: function(event) {
	      var message = event.message;
		  console.log("Message Recieved:" + message.body);
	      incomminginfo(message.body);
	    }
	  }
	});
}

function set(data){
     var Address = Parse.Object.extend("Addresses");
     var query = new Parse.Query(Address);
     query.equalTo("address", host);
     query.first({
       success: function(obj) {
		   obj.set("sipuri", data);
		   obj.save(null, {
     		 success: function(object) {
		 		 console.log("Data Stored");
				 console.log(data); 
			 }
   	  });
	}
	})
}

function answer(call){
	call.answer();
	$("#status").html("Answered");
	$("#call").unbind()
	$("#call").bind("click", function() { return hangup(call); });
	$("#call").removeClass("btn-success").addClass("btn-danger");		
	$("#call").html("Hangup");;
}
function hangup(call){
	call.hangup();
	$("#call").unbind()
	$("#status").html("Ready");
	$("#call").html("");;
	$("#callerinfo").hide();
	$("#call").removeClass("btn-danger").addClass("disabled");
}
function clearStatus(){
	$("#status").html("Ready");
}

function incomminginfo(string){
	var data = $.parseJSON(string);
	console.log("alert from:" + data.email)
	var imgurl="http://gravatar.com/avatar/"+hex_md5(data.email)
	$("#callerimage").attr("src",imgurl);
	$("#calleremail").html(data.email);
	$("#callersubject").html(data.subject);
	$("#callerinfo").show();
	jQuery("#calleremail").fitText(1.5, { minFontSize: '12px', maxFontSize: '40px' });
	console.log("step");
	jQuery("#about").fitText(1.5, { minFontSize: '8px', maxFontSize: '20px' });
	console.log("step");
	jQuery("#callersubject").fitText(1.5, { minFontSize: '12px', maxFontSize: '40px' });
	console.log("step");
	
	
}



function signup(){
	// Register New User
	user = new Parse.User();
	user.set("username", $("#reguser").val());
	user.set("password", $("#regpass").val());
	user.set("email", $("#regemail").val());
	user.set("address", host);
	user.signUp(null, {
  		success: function(user) {
    		console.log("Registered");
			var Address = Parse.Object.extend("Addresses");
			var address = new Address();
			address.set("address", host);
			address.set("sipuri", 'none');
			var addressACL = new Parse.ACL(Parse.User.current());
			addressACL.setPublicReadAccess(true);
			address.setACL(addressACL);
			address.save(null, {
			  success: function(address) {
			    // Execute any logic that should take place after the object is saved.
			    console.log('New object created with objectId: ' + address.id);
				$("#loginview").hide();
				$("#rxview").show();
				phono();
			  },
			  error: function(address, error) {
			    console.log('Failed to create new object, with error code: ' + error.description);
			  }
			});
  		},
  		error: function(user, error) {
    		alert("Error: " + error.code + " " + error.message);
  		}
	});
}

function login(){
	//Login
	Parse.User.logIn($("#loginuser").val(), $("#loginpass").val(), {
	  success: function(user) {
	    console.log("logged in")
		$("#loginview").hide();
		$("#rxview").show();
		phono();
	  },
	  error: function(user, error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
	user = Parse.User.current();
}

// Main section for when the DOM is ready
$( document ).ready(function() {
		var Address = Parse.Object.extend("Addresses");
		var query = new Parse.Query(Address);
		query.equalTo("address", host);
		query.count({
			success: function(count) {
				if (count == 0){
					$("#regview").show();
					$("#register").click(function () { 
					    signup();
					});
				}
				if (count == 1 && user == null){
					$("#loginview").show();
					$("#login").click(function () { 
					    login();
					});
				}
				if (count == 1 && user != null){
					$("#rxview").show();
					phono();
				}
				},
			error: function(error) { console.log("Error: " + error.code + " " + error.message);}
		});
});

// This needs to be fixed so if they cancle the close and stay on the page it doesn't remove the sip address
//window.onbeforeunload = function() {
//		window.setTimeout(set('offline'), 1);
//		window.setTimeout(set(address), 3000); // this doesn't work
//		return "Are you sure you wish to leave the page?";
//}
