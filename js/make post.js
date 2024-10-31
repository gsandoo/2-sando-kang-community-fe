// TODO: 요구사항에 맞춘 추가 작업 필요
// 게시글 작성 버튼 클릭 시 게시글 작성 페이지로 이동
const modifyBtn = document.querySelector(".back");
const title = document.getElementById('title');
const content = document.getElementById('content');
const submit = document.getElementById('submit-button');


function validateForm() {
    let titleCheck = false
    let contentCheck = false

    if(title.value.trim()){
        titleCheck = true;
    }else titleCheck = false;

    if(content.value.trim()){
        contentCheck = true;
    }else contentCheck = false;

    if (titleCheck && contentCheck ) {
        submit.style.backgroundColor = '#7f6aee'
        submit.style.cursor = 'pointer'
        return true
    }else{
        submit.style.backgroundColor = '#ACA0EB'
    }
}

title.addEventListener('input', validateForm)
content.addEventListener('input', validateForm);

function handleLocation(url) {
    window.location.href = url
}
