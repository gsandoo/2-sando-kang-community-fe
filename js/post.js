import { handleLocation } from '../util/handleLocation.js';
import { getLocalStorage, saveLocalStorage } from '../util/session.js';
import {getCurrentDate} from '../util/yyyymmdd.js';

const textarea = document.getElementById('text');

const commentModal = document.querySelector('.comment-modal');
const commentDeleteCancel = document.querySelector('#comment-cancel');
const commentDeleteOk = document.querySelector('#comment-ok');

const modal = document.querySelector('.modal');
const btnOpenModal=document.querySelector('.delete');
const deleteCancel = document.querySelector('#cancel');
const deleteOk = document.querySelector('#ok');
const authorName = document.querySelector('.author-name');

const modifyBtn = document.querySelector(".edit");
const commentContainer = document.querySelector('.comments-section');
const submitButton = document.querySelector('.comment-submit');

let selectedCommentId = null;  // 상위 스코프에 선택된 댓글 ID 변수 선언
let commentStatus = 0; // 댓글 등록일 시 

window.addEventListener('DOMContentLoaded', function () {
    applyDataToPage(); // 페이지에 게시물 데이터를 적용합니다.

    
    
});




async function applyDataToPage() {
    try {
        const postId = getLocalStorage("postId");
        console.log(`http://localhost:3000/api/post/${postId} 호출`)
        
        // 전체 게시글 및 댓글 데이터를 가져오는 API 호출
        const response = await fetch(`http://localhost:3000/api/post/${postId}`);
        const responseData = await response.json();
        console.log('Fetched data:', responseData);

        if (!responseData || !responseData.data) {
            console.error('응답 데이터가 유효하지 않습니다:', responseData);
            return;
        }

        const postData = responseData.data.postData;
        if (!postData) {
            console.error('게시글 데이터가 없습니다.');
            return;
        }

        const fields = {
            title: { selector: 'h2', attribute: 'innerText' },
            content: { selector: '.post-article p', attribute: 'innerText' },
            updatePostDate: { selector: '.author-info span:nth-child(2)', attribute: 'innerText' },
            author: { selector: '.author-name', attribute: 'innerText' },
            likesCnt: { selector: '#likesCount', attribute: 'innerText', suffix: ' 좋아요' },
            viewsCnt: { selector: '#viewsCount', attribute: 'innerText', suffix: ' 조회수' },
            commentsCnt: { selector: '#commentsCount', attribute: 'innerText', suffix: ' 댓글' }
        };

        Object.keys(fields).forEach(key => {
            const value = postData[key];
            if (!value) {
                console.log(`value 없음: ${key}`);
                return;
            }

            const field = fields[key];
            const elements = Array.isArray(field) ? field : [field];

            elements.forEach(({ selector, attribute, suffix = '' }) => {
                const element = document.querySelector(selector);
                if (element) {
                    element[attribute] = value + suffix;
                }
            });
        });

        const imageElement = document.querySelector('.post-img img');
        if (postData.profileImg && imageElement) {
            let base64ImageData;

            if (postData.profileImg.type === 'Buffer' && Array.isArray(postData.profileImg.data)) {
                const uInt8Array = new Uint8Array(postData.profileImg.data);
                const binaryString = uInt8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
                base64ImageData = btoa(binaryString);
            } else if (typeof postData.profileImg === 'string') {
                base64ImageData = postData.profileImg;
            } else {
                console.error('Unexpected image data format:', postData.profileImg);
            }

            imageElement.src = `data:image/png;base64,${base64ImageData}`;
        }

        const commentsSection = document.querySelector('.comments-section');
    
        
        if (commentsSection && Array.isArray(postData.comment)) {
            postData.comment.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.setAttribute('data-id', comment.id);

                const formattedDate = getCurrentDate(comment.date);

                commentElement.innerHTML = `
                    <div class="comment-author">
                        <span>${comment.author}</span>
                        <span>${formattedDate}</span>
                    </div>
                    <div class="comment-content">
                        <p>${comment.content}</p>
                    </div>
                    <div class="comment-actions">
                        <div class="comment-edit" id="btnbtn">수정</div>
                        <div class="comment-delete" id="btnbtn">삭제</div>
                    </div>
                `;
                commentElement.style.display = 'none';
                commentsSection.appendChild(commentElement);
                setTimeout(() => {
                    commentElement.style.display = '';
                }, 0);

                const deleteBtn = commentElement.querySelector('.comment-delete');
                
                deleteBtn.addEventListener('click', () => {
                    selectedCommentId = comment.id;  
                    console.log(`selectedCommentId : ${selectedCommentId}`);
                    commentModal.style.display = "flex";
                });

                const editBtn = commentElement.querySelector('.comment-edit');
                editBtn.addEventListener('click', () => {
                    selectedCommentId = comment.id;  
                    console.log(`selectedCommentId : ${selectedCommentId}`);
                });
            
            });
        } else {
            console.error('댓글 데이터가 유효하지 않습니다.');
        }

    } catch (error) {
        console.error('Error fetching post data:', error);
    }
}




//NOTE: 댓글 작성
async function addComment() {
    console.log('hello');
    const newComment = textarea.value.trim(); 
    const userId = getLocalStorage('userId');
    const postId = getLocalStorage('postId');
    const currentDate = getCurrentDate();

    console.log(userId);
    await fetch('http://localhost:3000/api/comment', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id: userId,
            post_id: postId,
            comment: newComment,
            date: currentDate
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('댓글 작성이 완료되었습니다!');
            location.reload();  // 새로고침하여 댓글 업데이트
        } else {
            console.error('댓글 작성 실패:', data.message);
            alert('댓글 작성에 실패했습니다.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('서버 오류가 발생했습니다.');
    });
}

async function modifyComment(event) {
    if (commentStatus == 1 && selectedCommentId) {
        const updatedContent = textarea.value.trim(); // 수정된 댓글 내용

        try {
            // PUT 요청으로 댓글 수정
            
            console.log(`comment_id  : ${selectedCommentId}`);
            console.log(`content  : ${updatedContent}`);
            const response =  await fetch(`http://localhost:3000/api/comment`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: selectedCommentId,
                    content: updatedContent,
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('댓글 수정이 완료되었습니다!');
                location.reload(); 
            } else {
                console.error('댓글 수정 실패:', data.message);
                alert('댓글 수정에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다.');
        }
        
        // 상태 초기화
        commentStatus = 0;
        selectedCommentId = null;
        submitButton.innerText = '댓글 등록'; // 버튼 텍스트 원래대로 되돌리기
        textarea.value = ''; // 입력 필드 초기화
    } else {
        // 댓글 등록 코드 (기존에 있는 등록 코드 유지)
        alert('수정 요청시 에러: 선택된 댓글이 없습니다.');
    } 
}


function modifyHandler(){
    const title = document.querySelector('h2').innerText;
    const content = document.querySelector('.post-article p').innerText;
    localStorage.setItem('editTitle', title);
    localStorage.setItem('editContent', content);
    handleLocation("/html/edit post.html");
}

function formatNumber(num) {
    if (num >= 100000) {
        return Math.floor(num / 1000) + 'k'; 
    } else if (num >= 10000) {
        return (num / 1000).toFixed(0) + 'k'; 
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    } else {
        return num.toString(); 
    }
}

//NOTE: 댓글 좋아요 누를 시
function updatePostStats() {
    
    fetch('') 
        .then(response => response.json())
        .then(data => {
            document.getElementById('likesCount').innerText = `${formatNumber(data.likes)} 좋아요수`;
            document.getElementById('viewsCount').innerText = `${formatNumber(data.views)} 조회수`;
            document.getElementById('commentsCount').innerText = `${formatNumber(data.comments)} 댓글`;
        })
        .catch(error => console.error('Error fetching post stats:', error));
}


textarea.addEventListener('input', function() {
    if (textarea.value.trim() !== '') {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = '#7F6AEE'; // 글자가 있을 때 색상 변경
        submitButton.style.color= '#fff';
    } else {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = '#ACA0EB'; // 글자가 없을 때 원래 색상으로
    }
});


// 댓글 수정 버튼에 대한 이벤트 리스너 추가 (이벤트 위임 방식)
commentContainer.addEventListener('click', (event) => {
    const button = event.target.closest('.comment-edit');
    if (!button) return;  // 클릭된 대상이 수정 버튼이 아니면 무시

    commentStatus = 1; // 댓글 수정일 시 

    console.log(`commentStatus : ${commentStatus}`)
    const commentDiv = button.closest('.comment'); 
    const commentContent = commentDiv.querySelector('.comment-content p').innerText; 
    
    textarea.value = commentContent;

    submitButton.innerText = '댓글 수정';  // 버튼 텍스트 수정
});

// 댓글 삭제 확인 버튼 이벤트 리스너 (중복 등록 방지)
commentDeleteOk.addEventListener("click", () => {
    const postId = getLocalStorage("postId");

    if (selectedCommentId) {
        fetch(`http://localhost:3000/api/comment`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: selectedCommentId,
                post_id: postId,
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('댓글 삭제가 완료되었습니다!');
                selectedCommentId = null; // 삭제 완료 후 ID 초기화
                location.reload(); // 새로고침하여 댓글 업데이트
            } else {
                console.error('댓글 삭제 실패:', data.message);
                alert('댓글 삭제에 실패했습니다.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('서버 오류가 발생했습니다.');
        });
    }
});



modifyBtn.addEventListener("click", modifyHandler);

submitButton.addEventListener("click", (event) =>{
    if(commentStatus == 0) {
        addComment(event);
    }else if(commentStatus == 1) {
        modifyComment(event);
    }

});

btnOpenModal.addEventListener("click", ()=>{
    modal.style.display="flex";
}); 

deleteCancel.addEventListener("click", ()=>{
    modal.style.display="none";
})

deleteOk.addEventListener("click", ()=>{
    alert(authorName.innerText+"의 글이 삭제 되었습니다.")
    modal.style.display="none";
})

commentDeleteCancel.addEventListener("click", () => {
    commentModal.style.display = "none";
    console.log(`remove selectedCommentId : ${selectedCommentId}`);

    selectedCommentId = null; // ID 초기화
});





