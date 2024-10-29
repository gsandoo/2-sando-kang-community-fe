// 게시글 작성 버튼 클릭 시 게시글 작성 페이지로 이동
const modifyBtn = document.querySelector(".back");
modifyBtn.addEventListener("click", clickHandler);

function clickHandler(){
    handleLocation("/html/post.html"); 
}


function handleLocation(url) {
    window.location.href = url
}

