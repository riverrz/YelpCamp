

$("#likes").on("click", function(){
    var likeCount = Number(document.querySelector("#likes").textContent);
    var id= this.dataset.id;
    $.ajax({
        type: 'POST',
        url: "/campgrounds/"+id+"/count/liked",
        data: {
            count:1
        },
        success: function() {
            likeCount+=1;
            document.querySelector("#likes").textContent = String(likeCount);
        },
        error: function() {
            alert("Failed");
        }
    });
    
});

$("#dislikes").on("click", function(){
   var dislikeCount = Number(document.querySelector("#dislikes").textContent);
    var id= this.dataset.id;
    $.ajax({
        type: 'POST',
        url: "/campgrounds/"+id+"/count/disliked",
        success: function() {
            dislikeCount+=1;
            document.querySelector("#dislikes").textContent = String(dislikeCount);
        },
        error: function() {
            alert("Failed");
        }
    });
});