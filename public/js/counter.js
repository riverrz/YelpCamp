

$("#likes").on("click", function(){
    var likeCount = Number(document.querySelector("#likeCounter").textContent);
    var id= this.dataset.id;
    $.ajax({
        type: 'POST',
        url: "/campgrounds/"+id+"/count/liked",
        data: {
            count:1
        },
        success: function() {
            likeCount+=1;
            document.querySelector("#likeCounter").textContent = String(likeCount);
            document.querySelector("#likes i").classList.add("fa-selected");
            document.querySelector("#dislikes i").classList.remove("fa-selected");
        },
        error: function() {
            alert("Failed");
        }
    });
    
});

$("#dislikes").on("click", function(){
   var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
    var id= this.dataset.id;
    $.ajax({
        type: 'POST',
        url: "/campgrounds/"+id+"/count/disliked",
        success: function() {
            dislikeCount+=1;
            document.querySelector("#dislikeCounter").textContent = String(dislikeCount);
            document.querySelector("#dislikes i").classList.add("fa-selected");
            document.querySelector("#likes i").classList.remove("fa-selected");
        },
        error: function() {
            alert("Failed");
        }
    });
});