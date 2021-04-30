var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var d1 = new Date();
    
    d1 = d1.toLocaleDateString("en-US",options);
    $("input[name='date']").attr("value",d1);
   
    
    
function calc(){
    let sum = 0;
    Array.from($(".size")).forEach(ele =>{
       
        if(ele.value > 0)
        sum+=((+ele.name)*(+ele.value))
    
    });
   
    document.getElementById("tot_cost").innerHTML = sum;
    $("#cost").attr("value",sum);


    var d = new Date();
    var time = "";
    var hrs = d.getHours();
    var min = d.getMinutes();
    hrs = hrs > "9" ? hrs : "0"+hrs;
    min = min > "9" ? min : "0"+min;
    time = hrs + " : " + min;
    console.log(time);
    $("input[name='time']").attr("value",time);
}

function previewFile() {
    // Where you will display your image
    var preview = document.querySelector('img');
    // The button where the user chooses the local image to display
    var file = document.querySelector('input[type=file]').files[0];
    // FileReader instance
    var reader  = new FileReader();

    // When the image is loaded we will set it as source of
    // our img tag
    reader.onloadend = function () {
      preview.src = reader.result;
    }

    
    if (file) {
      // Load image as a base64 encoded URI
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
    }
  }