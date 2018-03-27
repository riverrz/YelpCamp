
    $("#likes").on("click", function(){
        var likeCount = Number(document.querySelector("#likeCounter").textContent);
        var ids= this.dataset.id.split(" ");
        if (ids.length>1) {
            var id=ids[0];
            var userId=ids[1];
            
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/"+userId+"/liked",
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
        } else {
            alert("You need to be logged in first!");
        }
        
    });
    
    $("#dislikes").on("click", function(){
       var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
        var ids= this.dataset.id.split(" ");
        if (ids.length>1) {
            var id=ids[0];
            var userId=ids[1];
            console.log(id,userId)
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/"+userId+"/disliked",
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
        } else {
            alert("You need to be logged in first!");
        }
    });