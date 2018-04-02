
    $("#likes").on("click", function(){
        var likeCount = Number(document.querySelector("#likeCounter").textContent);
        var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
        var id= this.dataset.id;
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/likes"
            }).done(function(count){
                if (count==='0') {
                    window.location.href = "/login";
                    return;
                }
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
        
    });
    
    $("#dislikes").on("click", function(){
        var likeCount = Number(document.querySelector("#likeCounter").textContent);
        var dislikeCount = Number(document.querySelector("#dislikeCounter").textContent);
        var id= this.dataset.id;
            $.ajax({
                type: 'POST',
                url: "/campgrounds/"+id+"/count/dislikes"
            }).done(function(count){
                if (count==='0') {
                    window.location.href = "/login";
                    return;
                }
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
    });