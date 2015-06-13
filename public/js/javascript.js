//Variable to check if page is ready for the next query.
var ready = true;

//JS for Manual Query Tool
function errorMessage(urlAddress, formID, errorDivID, action){
	$.ajax({     
		url: urlAddress,
		type:action,
		data:$(formID).serialize(),
		success:function(rows){  
		
			//Checks if the table isn't empty.
			if (rows.length > 0) {
				var res = '<hr/><br/><div><div><h4>Query response</h4></div><br/>';
				
				res += "<table class=\"table table-hover\"><thead><tr>";
				
				//Gets every column name and creates a table header for them.
				for (i=0; i < Object.keys(rows[0]).length; i++) {
					res += "<th>" + Object.keys(rows[0])[i] + "</th>";
				}
				
				res += "</tr></thead><tbody>";
				
				//For every row.
				$.each(rows , function(i, item) {
					res += "<tr>";
					
					//For every column in that row.
					for(var key in item) {
						res += "<td>" + item[key] + "</td>";
					}

					res += "</tr>";
				});
				
				res += "</tbody></table></div>";
			} else {
				//Table returned empty.
				var res = '<br/><br/><div class=\"text-center\"><h2>No results found.</h2></div>';
			}
			
			//Hide spinner and show result.
			$("#queryLoading").hide();
			$(".query-response-area").html(res).fadeIn(325);
			
			ready = true;
			
			return;
		},
		
		error:function(xhr, status, error){
			console.log(xhr.responseText);
			
			var err = '<div class="alert alert-danger">';
			
			//Get DB2's error message
			$.each(JSON.parse(xhr.responseText) , function(i, item) {
				 err +='<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+item.msg;
				 err += '</br>'
			});
			
			err += '</div>';
			
			//Show the error, hide the table result & spinner.
			$(".query-err-area").html(err).show(325);    
            $(".query-response-area").fadeOut(325).html("");
			$("#queryLoading").hide();
			
			ready = true;
			
			return;
		}
   });
}

function submitQuery(formID, errorDivID){
	
	if (ready) {
		ready = false;
		
		//Show spinner and hide previous results.
		$("#queryLoading").show();	
		$(".query-err-area").hide(325).innerHTML = "";
		$(".query-response-area").hide().innerHTML = "";
		
		//POST location.
		urlAddress = '/query/manual/submit';
		
		//Run AJAX function.
		errorMessage(urlAddress, formID, errorDivID, "post");
	}
}

function clearQuery() {
    document.getElementById("query-text").value = "";	
	$(".query-err-area").hide(325).innerHTML = "";
	$(".query-response-area").fadeOut(325).innerHTML = "";
	$(".spinner").hide();

}

//JS for Automatic Query Tool
function chooseOperation(operation) {
    if (ready) {
        
        ready = false;
        
        $('document').ready(function () {
            var operations = ['selectBtn', 'insertBtn', 'updateBtn', 'deleteBtn'];

            var count = 0;

            $('.operationChoices').children().each(function() {
               if ($(this).is(":visible")) {
                   count++;
               }
            });

            $('#' + operation).blur();

            if (count == 1) {

                $('#' + operation).fadeOut(325, function() {
                    $(this).css('box-shadow', '');
                });

                for (i = 0; i < operations.length; i++) {
                    if (operations[i] != operation) {
                        $('#' + operations[i]).delay(325).fadeIn(500); 
                    } else {
                        $('#' + operations[i]).fadeIn(500, function() {
                            $('#' + operation).blur();
                            $('.query-err-area').html("");
                            $('.selectSchemas').fadeOut(325, function() {
                               ready = true; 
                            });
                        }); 
                    }
                }

            } else {

                for (var i = 0; i < operations.length; i++) {
                    if (operations[i] != operation) {
                        $('#' + operations[i]).fadeOut(500); 
                    } else {
                        $('#' + operations[i]).fadeOut(500, function() {
                            $(this).css('box-shadow', '0px 0px 2px #000099');
                        }); 
                    }
                }

                $('#' + operation).fadeIn(325, function() {
                    $('#' + operation).blur();
                    $('.selectSchemas').css('display', 'inline');
                    $('.query-err-area').html("");
                    
                    if (operation == 'selectBtn')
                        submitSchemaQuery('select');
                    else if (operation == 'insertBtn')
                        submitSchemaQuery('insert');
                    else if (operation == 'updateBtn')
                        submitSchemaQuery('update');
                    else if (operation == 'deleteBtn')
                        submitSchemaQuery('delete');
                });

            }
        });
    }
    
}

    
//Automatic tools ajax
function getSchemas(type){
	$.ajax({     
		url: '/query/auto/schemas',
		type: 'post',
		success:function(rows){   
            
            if (type == 'select')
                var res = '<div><div><h4>Choose which tables to select data from</h4></div><br/>';
            else if (type == 'insert')
                var res = '<div><div><h4>Choose a table to perform updates for</h4></div><br/>';
            else if (type == 'update')
                var res = '<div><div><h4>update op</h4></div><br/>';
            else if (type == 'delete')
                var res = '<div><div><h4>delete op</h4></div><br/>';
            else
                var res = '<div><div><h4>Operation not supported</h4></div><br/>';
                
            res += "<div class=\"schemaTable\"><table><tr><td>Schema</td><td>Tables</td></tr>";
            
            $.each(rows , function(i, item) {
                //console.log(item);
                
                var schemaName = item['name'];
                
                res += "<tr><td>" + item['name'] + "</td><td>";
                
                if (item['tables'].length == 0) {
                    res += "<p class=\"noTable\">No tables in this schema</p>";
                } else {
                    var cellCount = 0;
                    $.each(item['tables'], function(i, item) {
                        if (cellCount == 3){
                            res += "<br/><br/>";
                            cellCount = 0;
                        }
                        res += "<a href=\"#\" class=\"schemaButton\" onclick=\"\" id=\"" + schemaName + "." + item + "\">" + item + "</a>";
                        cellCount++;
                     
                    });
                }

                res += "</td></tr>";
			});
            
            
            //res += 
			res += "</table></div></div>";
            $('.spinner').hide();
            $(".query-response-area-schema").html(res);   
            $(".query-response-area-schema").fadeIn(325);
			
            ready = true;
			return false;
		},
		
		error:function(xhr, status, error){
			console.log(xhr.responseText);
            
			var err = '<div class="alert alert-danger">';
            
			$.each(JSON.parse(xhr.responseText) , function(i, item) {
				 err +='<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>'+item.msg;
				 err += '</br>';
			});
            
			err += '</div>';
            
			$(".query-err-area").html(err);    
            
            $(".query-response-area-schema").html("");
            $('.spinner').hide();
            ready = true;
			return false;
		}
   });
}

function submitSchemaQuery(type){
    $('.spinner').fadeIn(325);
    $('#err-area').fadeOut(325).delay(325).html("");
    $('#res-area-schema').fadeOut(325).delay(325).html("");
    
	window.setTimeout(getSchemas(type), 325);
}
