//github link: https://punchyface.github.io/simple-restDB/

//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
  //what kind of interface we want at the start 
  const APIKEY = "61d662beccd0211b32089770";
  getStudents();
  $("#update-student-container").hide();
  $("#add-update-msg").hide();

  //[STEP 1]: Create our submit form listener
  $("#student-submit").on("click", function (e) {
    //prevent default action of the button 
    e.preventDefault();
    tocheck("student-id", "add-error");
    tocheck("student-name", "add-error");
    tocheck("student-email", "add-error");
    tocheck("student-class", "add-error");
    tocheck("mentorName", "add-error");

    //[STEP 2]: let's retrieve form data
    //for now we assume all information is valid
    //you are to do your own data validation
    let studentName = $("#student-name").val();
    let studentEmail = $("#student-email").val();
    let mentorName = $("#mentorName").val();
    let studentClass = $("#student-class").val();
    let studentId = $("#student-id").val();

    //[STEP 3]: get form values when user clicks on send
    //Adapted from restdb api
    let jsondata = {
      "ID": studentId,
      "name": studentName,
      "email": studentEmail,
      "class": studentClass,
      "mentorName": mentorName
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://interactivedev-8bc3.restdb.io/rest/student",
      "method": "POST", //[cher] we will use post to send info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      "beforeSend": function(){
        //@TODO use loading bar instead
        $("div#loadingbar.container").show();
        //disable our button or show loading bar
        $("#student-submit").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $("#add-student-form").trigger("reset");
        $("div#loadingbar.container").fadeOut(1500);
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function (response) {
      console.log(response);
      
      $("#student-submit").prop( "disabled", false);
      //@TODO update frontend UI 
      document.querySelector("#add-error").textContent = null;
      $("#add-update-msg").show().fadeOut(3000);
      $("div#loadingbar.container").fadeOut(1000);
      

      //update our table 
      getStudents();
    });
  });//end click 


  //[STEP] 6
  //let's create a function to allow you to retrieve all the information in your students
  //by default we only retrieve 10 results
  function getStudents(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://interactivedev-8bc3.restdb.io/rest/student",
      "method": "GET", //[cher] we will use GET to retrieve info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
    //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
    $.ajax(settings).done(function (response) {
      
      let content = "";

      for (var i = 0; i < response.length && i < limit; i++) {
        //console.log(response[i]);
        //[METHOD 1]
        //let's run our loop and slowly append content
        //we can use the normal string append += method
        /*
        content += "<tr><td>" + response[i].name + "</td>" +
          "<td>" + response[i].email + "</td>" +
          "<td>" + response[i].mentorName + "</td>
          "<td>Del</td><td>Update</td</tr>";
        */

        //[METHOD 2]
        //using our template literal method using backticks
        //take note that we can't use += for template literal strings
        //we use ${content} because -> content += content 
        //we want to add on previous content at the same time
        content = `${content}<tr id='${response[i]._id}'><td>${response[i].ID}</td>
        <td>${response[i].name}</td>
        <td>${response[i].email}</td>
        <td>${response[i].class}</td>
        <td>${response[i].mentorName}</td>
        <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-student-container' class='update' data-id='${response[i]._id}' data-studentid='${response[i].ID}' data-name='${response[i].name}' data-email='${response[i].email}' data-class='${response[i].class}' data-mentorName='${response[i].mentorName}'>Update</a></td></tr>`;

      }

      //[STEP 9]: Update our HTML content
      //let's dump the content into our table body
      $("#student-list tbody").html(content);

      $("#total-students").html(response.length);
    });


  }

  //[STEP 10]: Create our update listener
  //here we tap onto our previous table when we click on update
  //this is a delegation feature of jquery
  //because our content is dynamic in nature, we listen in on the main container which is "#student-list". For each row we have a class .update to help us
  $("#student-list").on("click", ".update", function (e) {
    e.preventDefault();
    //update our update form values
    let studentId = $(this).data("studentid");
    let studentName = $(this).data("name");
    let studentEmail = $(this).data("email");
    let studentClass = $(this).data("class");
    let mentorName = $(this).data("mentorname");
    let sysId = $(this).data("id");

    //[STEP 11]: Load in our data from the selected row and add it to our update student form 
    
    $("#update-student-id").val(studentId);
    $("#update-student-name").val(studentName);
    $("#update-student-email").val(studentEmail);
    $("#update-student-class").val(studentClass);
    $("#update-mentorName").val(mentorName);
    $("#update-sys-id").val(sysId);

    $("#update-student-container").show();

  });//end student-list listener for update function

  //[STEP 12]: Here we load in our student form data
  //Update form listener
  $("#update-student-submit").on("click", function (e) {
    e.preventDefault();
    //retrieve all my update form values
    let studentName = $("#update-student-name").val();
    let studentEmail = $("#update-student-email").val();
    let mentorName = $("#update-mentorName").val();
    let sysId = $("#update-sys-id").val();
    let studentId = $("#update-student-id").val();
    let studentClass = $("#update-student-class").val();

    //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
    updateForm(sysId,  studentId, studentName, studentEmail, studentClass, mentorName);
  });//end updatestudentform listener

  //[STEP 13]: function that makes an AJAX call and process it 
  //UPDATE Based on the ID chosen
  function updateForm(sysId, studentId, studentName, studentEmail, studentClass, mentorName) {
    //@TODO create validation methods for id etc. 
    
    tocheck("update-student-id", "update-error");
    tocheck("update-student-name", "update-error");
    tocheck("update-student-email", "update-error");
    tocheck("update-student-class", "update-error");
    tocheck("update-mentorName", "update-error");
    
    
    
    var jsondata = {
      "ID": studentId,
      "name": studentName,
      "email": studentEmail,
      "class": studentClass,
      "mentorName": mentorName
    };
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://interactivedev-8bc3.restdb.io/rest/student/${sysId}`,//update based on the ID
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      "beforeSend": function(){
        $("#update-student-submit").prop( "disabled", true);
      }
    }

    //[STEP 13a]: send our AJAX request and hide the update student form
    $.ajax(settings).done(function (response) {
      console.log(response);
      
      document.querySelector("#update-error").textContent = null;
      
      $("#update-student-submit").prop( "disabled", false);
      $("#update-student-container").fadeOut(1000);
      //update our students table
      getStudents();
      
    });
  }//end updateform function


  $("#student-list").on("click", ".delete", function () {
    let idtobedeleted = $(this).data("id");
    deleteForm(idtobedeleted);
  })
    

  function deleteForm(sysId) {
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://interactivedev-8bc3.restdb.io/rest/student/${sysId}`,
      "method": "DELETE",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "beforeSend": function(){
        $("div#loadingbar.container").show();
      }
    }
         
    $.ajax(settings).done(function (response) {
      console.log(response);
      $("div#loadingbar.container").fadeOut(1500); 
      getStudents();
      
    }); 
  }

})

//validator
function tocheck(idcheck, area) {
  const inpObj = document.getElementById(idcheck);
  if (!inpObj.checkValidity()) {
    document.getElementById(area).innerHTML = `${inpObj.validationMessage} Located in (${idcheck})`;
    throw new Error();
  } 
} 
