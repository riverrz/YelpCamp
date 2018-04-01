
    $("#likes").on("click", function(){
        var likeCount = Number(document.querySelector("#likeCounter").textContent);
        var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
        var ids= this.dataset.id.split(" ");
        if (ids.length>1) {
            var id=ids[0];
            var userId=ids[1];
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/"+userId+"/likes"
            }).done(function(count){
                count=JSON.parse(count);
                likeCount=count.likes;
                dislikeCount=count.dislikes
                document.querySelector("#likeCounter").textContent = String(likeCount);
                document.querySelector("#dislikeCounter").textContent = String(dislikeCount);
                if (count.extra===1) {
                    document.querySelector("#likes i").classList.remove("fa-thumbs-up-selected");
                } else {
                    document.querySelector("#likes i").classList.add("fa-thumbs-up-selected");
                    document.querySelector("#dislikes i").classList.remove("fa-thumbs-down-selected");
                }
                
            });
        } else {
            alert("You need to be logged in first!");
        }
        
    });
    
    $("#dislikes").on("click", function(){
        var likeCount = Number(document.querySelector("#likeCounter").textContent);
        var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
        var ids= this.dataset.id.split(" ");
        if (ids.length>1) {
            var id=ids[0];
            var userId=ids[1];
            
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/"+userId+"/dislikes"
            }).done(function(count){
                count=JSON.parse(count);
                likeCount=count.likes;
                dislikeCount=count.dislikes
                document.querySelector("#likeCounter").textContent = String(likeCount);
                document.querySelector("#dislikeCounter").textContent = String(dislikeCount);
                if (count.extra===1) {
                    document.querySelector("#dislikes i").classList.remove("fa-thumbs-down-selected");
                }else {
                    document.querySelector("#dislikes i").classList.add("fa-thumbs-down-selected");
                    document.querySelector("#likes i").classList.remove("fa-thumbs-up-selected");
                }
                
            });
        } else {
            alert("You need to be logged in first!");
        }
    });