// 게시글 작성 버튼 클릭 시 게시글 작성 페이지로 이동
const backBtn = document.querySelector(".back");
const modifyBtn = document.querySelector('.submit-button');

window.addEventListener('DOMContentLoaded', function () {
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');

    // localStorage에서 기존 제목과 내용 가져오기
    const editTitle = localStorage.getItem('editTitle');
    const editContent = localStorage.getItem('editContent');

    // 가져온 데이터를 폼에 채움
    if (editTitle) {
        titleInput.value = editTitle;
    }
    if (editContent) {
        contentTextarea.value = editContent;
    }
});

function clickHandler(){
    handleLocation("/html/post.html"); 
}


function handleLocation(url) {
    window.location.href = url
}

function modifyData(e) {
    e.preventDefault();

    const updatedTitle = document.getElementById('title').value;
    const updatedContent = document.getElementById('content').value;

    localStorage.setItem('updatedTitle', updatedTitle);
    localStorage.setItem('updatedContent', updatedContent);

    handleLocation("/html/post.html"); 
}

modifyBtn.addEventListener("click", modifyData);
backBtn.addEventListener("click", clickHandler);