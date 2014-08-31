

function getPermissions() {
	return AJS.$.ajax({
		url : baseUrl + "/rest/userpermissions/1.0/"
				+ AJS.$("#usernameFrom").attr("value"),
		dataType : "json"
	});
}

function copyPermissions(permissions) {
	AJS.$.ajax({
		url : baseUrl + "/rest/userpermissions/1.0/"
				+ AJS.$("#usernameTo").attr("value"),
		type : "PUT",
		contentType : "application/json",
		data : JSON.stringify(permissions),
		processData : false,
	}).fail(function() {
		var $copyStatus = $("#copyStatus");
		$copyStatus.html('<h2>Copy operation failed</h2>');
		$("#results").html('');
	 }).success(function () {
		var $copyStatus = $("#copyStatus");
		$copyStatus.html('<h2>Copy operation was successful</h2>');
     });
}

function printHeader(permissions) {
	var $permissionResults = $("#results");
	$permissionResults.html("<h2 id='permissionsHeader'>" + AJS.$("#usernameFrom").attr("value") + "'s permissions in " + permissions.spacePermissions.length + " spaces" + "</h2>");

	var html = "";
	var ver5 = versionNumber.substring(0, 1) == "5";
	
	if (ver5) {
		html += '<table class="permissions aui" id="uPermissionsTable" width="100%" cellspacing="0" cellpadding="2" border="0">';
	} else {
		html += '<table id="uPermissionsTable" width="100%" cellspacing="0" cellpadding="2" border="0">';
	}

	html += '<tbody>';
	html += '<tr>';
	html += '<th width="25%" class="permissionHeading">&nbsp;</th>';
		
	
	if (ver5) {
		html += '<th class="permissionHeading">All</th>';
		html += '<th class="permissionSuperTab" colspan="3">Pages</th>';
	} else {
		html += '<th class="permissionHeading">&nbsp;</th>';
		html += '<th class="permissionSuperTab" colspan="4">Pages</th>';
	}
	
	
	html += '<th class="permissionSuperTab" colspan="2">Blog</th>';
	html += '<th class="permissionSuperTab" colspan="2">Comments</th>';
	html += '<th class="permissionSuperTab" colspan="2">Attachments</th>';
	html += '<th class="permissionSuperTab">Mail</th>';
	html += '<th class="permissionSuperTab" colspan="2">Space</th>';
	html += '</tr>';
	html += '<tr>';
	html += '<th class="permissionHeading">Space name</th>';
	html += '<th width="40" class="permissionSuperTab">View</th>';
	
	if (ver5) {
		html += '<th width="40" class="permissions-group-start">Add</th>';
		html += '<th width="40">Restrict</th>';
		html += '<th width="40">Delete</th>';
		html += '<th width="40" class="permissions-group-start">Add</th>';
		html += '<th width="40">Delete</th>';
		html += '<th width="40" class="permissions-group-start">Add</th>';
		html += '<th width="40">Delete</th>';
		html += '<th width="40" class="permissions-group-start">Add</th>';
		html += '<th width="40">Delete</th>';
		html += '<th width="40" class="permissions-group-start">Delete</th>';
		html += '<th width="40" class="permissions-group-start">Export</th>';
		html += '<th width="40">Admin</th>';
	} else {
		html += '<th width="40" class="permissionTab">Add</th>';
		html += '<th width="40" class="permissionTab">Export</th>';
		html += '<th width="40" class="permissionTab">Restrict</th>';
		html += '<th width="40" class="permissionTab">Remove</th>';
		html += '<th width="40" class="permissionTab">Add</th>';
		html += '<th width="40" class="permissionTab">Remove</th>';
		html += '<th width="40" class="permissionTab">Add</th>';
		html += '<th width="40" class="permissionTab">Remove</th>';
		html += '<th width="40" class="permissionTab">Add</th>';
		html += '<th width="40" class="permissionTab">Remove</th>';
		html += '<th width="40" class="permissionTab">Remove</th>';
		html += '<th width="40" class="permissionTab">Export</th>';
		html += '<th width="40" class="permissionTab">Admin</th>';
	}
	
	html += '</tr>';

	return html;
}

function printPermissions(permissions) {
	var html = "";
	var ver5 = versionNumber.substring(0, 1) == "5";
	
	for (i = 0; i < permissions.spacePermissions.length; i++) {
		if (i > 0 && i % 2 == 1) {
			html += '<tr style=" background: #f0f0f0; " class="space-permission-row">';
		} else {
			html += '<tr class="space-permission-row">';
		}
		html += '<td> <a title="' + permissions.spacePermissions[i].spaceName
			+ '" href="/confluence/spaces/spacepermissions.action?key='
			+ permissions.spacePermissions[i].spaceKey + '">' 
			+ permissions.spacePermissions[i].spaceName + '</a>' + '</td>';

		//TODO: Add a symbol if the permission is not user permission
		
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[0].permissionGranted, "viewspace");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[1].permissionGranted, "createpage");
		if (!ver5) {
			html += printPermissionStatus(permissions.spacePermissions[i].permissions[2].permissionGranted, "exportpage");
		}
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[3].permissionGranted, "setpagepermissions");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[4].permissionGranted, "removepage");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[5].permissionGranted, "createblogpost");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[6].permissionGranted, "removeblog");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[7].permissionGranted, "comment");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[8].permissionGranted, "removecomment");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[9].permissionGranted, "createattachment");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[10].permissionGranted, "removeattachment");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[11].permissionGranted, "removemail");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[12].permissionGranted, "exportspace");
		html += printPermissionStatus(permissions.spacePermissions[i].permissions[13].permissionGranted, "editspace");
		html += '</tr>';
	}
	
	
	html += '</tbody>';
	html += '</table>';
	
	return html;
}

function printPermissionStatus(status, permissionName) {
	var ver5 = versionNumber.substring(0, 1) == "5";

	var html = "";
	
	if (permissionName == "exportPage" && ver5) {
		html = "";
	} else {
		html += '<td valign="middle" align="center" data-permission-set="' + status + '"';
		html += 'data-permission-group="" data-permission="' + permissionName + '"';
		html += 'class="permissionCell ';
		
		if (permissionName == "createpage" 
			|| permissionName == "createblogpost" 
				|| permissionName == "comment" 
					|| permissionName == "createattachment" 
						|| permissionName == "removemail" 
							|| permissionName == "exportspace") {
			html += 'permissions-group-start';
		}

		html += '"><img width="16" height="16" align="absmiddle" border="0" ';
		
		if (status == true) {
			html += 'src="' + AJS.params.staticResourceUrlPrefix + '/images/icons/emoticons/check.png">';
		} else {
			html += 'src="' + AJS.params.staticResourceUrlPrefix + '/images/icons/emoticons/error.png">';
		}
		
		html += '</td>';
	}

	return html;
}

function showSpinner() {
	killSpinner = Raphael.spinner("throbber", 60, "#666");
	$("#throbber").removeClass("hidden");
}

AJS.toInit(function() {
	AJS.$("#usernameTo").live('input paste',function() {
		if (AJS.$("#viewButton").is(":visible") && AJS.$("#usernameTo").attr("value").length > 0 && AJS.$("#usernameFrom").attr("value").length > 0 ) {
			AJS.$("#viewButton").hide();
			AJS.$("#copyButton").show();
		} else if (AJS.$("#copyButton").is(":visible") && (AJS.$("#usernameTo").attr("value").length == 0 || AJS.$("#usernameFrom").attr("value").length == 0 )) {
			AJS.$("#copyButton").hide();
			AJS.$("#viewButton").show();
		}});
	
	AJS.$("#usernameFrom").live('input paste',function() {
		if (AJS.$("#viewButton").is(":visible") && AJS.$("#usernameTo").attr("value").length > 0 && AJS.$("#usernameFrom").attr("value").length > 0 ) {
			AJS.$("#viewButton").hide();
			AJS.$("#copyButton").show();
		} else if (AJS.$("#copyButton").is(":visible") && (AJS.$("#usernameTo").attr("value").length == 0 || AJS.$("#usernameFrom").attr("value").length == 0 )) {
			AJS.$("#copyButton").hide();
			AJS.$("#viewButton").show();
		}});

	AJS.$("#admin").submit(
			function(e) {
				e.preventDefault();
				
				var $permissionResults = $("#results");
				$permissionResults.html('');
				if (AJS.$("#usernameFrom").attr("value").length == 0) {
					var $copyStatus = $("#copyStatus");
					$copyStatus.html('<h2>Operation failed. From username is empty.</h2>');
				} else if (AJS.$("#usernameFrom").attr("value") == AJS.$("#usernameTo").attr("value") ) {
					var $copyStatus = $("#copyStatus");
					$copyStatus.html('<h2>Operation failed. Same usernames.</h2>');	
				} else if (AJS.$("#usernameFrom").attr("value").length > 0) {
					$("#throbber").html('');
					var t = setTimeout("showSpinner()", 100);
					
					var promise = getPermissions();
					promise.success(function(permissions) {
						if (AJS.$("#usernameTo").attr("value").length > 0) {
							copyPermissions(permissions);
						} else {
							var $copyStatus= $("#copyStatus");
							$copyStatus.html('');
						}
						var html = printHeader(permissions);
						html += printPermissions(permissions);
						
						var $permissionResults = $("#results");
						$permissionResults.append(html);
						
					});
					promise.fail(function(permissions) {
						var $copyStatus = $("#copyStatus");
						$copyStatus.html('<h2>Operation failed. User not found?</h2>');
					});
					promise.complete(function() {
						clearTimeout(t);
						killSpinner();
						$throbber.addClass("hidden");
					});
				}
			});
});