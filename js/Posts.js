// 게시글 작성 버튼 클릭 시 게시글 작성 페이지로 이동
const modifyBtn = document.querySelector(".write-post");

// 게시글 컨테이너와 로딩 표시 요소
const postContainer = document.getElementById('posts');
const loading = document.getElementById('loading');

// 현재 페이지 번호 (초기값 1)
let page = 1;
let isLoading = false; // 중복 요청 방지

modifyBtn.addEventListener("click",  clickHandler);


function clickHandler(){
    handleLocation("/html/make post.html");
}

// TODO: 인피니티 스크롤링
// 게시글을 불러와서 DOM에 추가하는 함수
// async function loadPosts() {
//     if (isLoading) return;
//     isLoading = true;
    
//     // 로딩 표시
//     loading.style.display = 'block';
  
//     try {
//       // 서버에서 게시글 데이터를 가져오는 API 호출 (예시)
//       const response = await fetch(`/api/posts?page=${page}`);
//       const data = await response.json();
  
//       // 받아온 데이터가 비어있으면 더 이상 로드하지 않음
//       if (data.length === 0) {
//         loading.innerText = '더 이상 게시글이 없습니다.';
//         return;
//       }
  
//       // 받아온 데이터를 반복문으로 순회하면서 HTML을 생성하고 추가
//       data.forEach(post => {
//         const postDiv = document.createElement('div');
//         postDiv.classList.add('post');
  
//         postDiv.innerHTML = `
//           <div class="post-header">
//               <h2>${truncateTitle(post.title)}</h2>
//               <span class="date">${post.date}</span>
//           </div>
//           <div class="post-info">
//               <span>좋아요 ${formatCount(post.likes)}</span>
//               <span>댓글 ${formatCount(post.comments)}</span>
//               <span>조회수 ${formatCount(post.views)}</span>
//           </div>
//           <div class="author">
//               <div class="avatar">
//                   <img src="${post.avatarUrl}" alt="">
//               </div>
//               <span>${post.author}</span>
//           </div>
//         `;
  
//         postContainer.appendChild(postDiv);
//       });
  
//       // 페이지 증가
//       page++;
//     } catch (error) {
//       console.error('Error fetching posts:', error);
//     } finally {
//       // 로딩 표시 숨김
//       loading.style.display = 'none';
//       isLoading = false;
//     }
//   }

//   // 스크롤 이벤트 리스너
// window.addEventListener('scroll', () => {
//     if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading) {
//       loadPosts();
//     }
//   });

function handleLocation(url) {
    window.location.href = url
}