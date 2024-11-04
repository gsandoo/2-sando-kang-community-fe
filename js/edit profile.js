// 프로필 드롭다운
const profileImg = document.getElementById('profileImg');
const dropdownMenu = document.getElementById('dropdownMenu');
const updateButton = document.getElementById('updateButton');
const deleteButton = document.getElementById('deleteButton');
const toastMessage = document.getElementById('toastMessage');
const deleteModal = document.getElementById('deleteModal');
const confirmDelete = document.getElementById('confirmDelete');
const cancelDelete = document.getElementById('cancelDelete');
const inputNickname = document.getElementById('nickname');
const nicknameError = document.getElementById('nicknameError');
const emailInput = document.getElementById('email'); // 이메일 입력 요소 추가

// 파일 입력 요소와 이미지 및 버튼 요소 선택
const fileInput = document.getElementById('fileInput');
const profileImage = document.getElementById('profileImage');
const uploadButton = document.getElementById('uploadButton');
const profileImageContainer = document.getElementById('profileImageContainer');
const backButton = document.querySelector('.back-button');

// NOTE: 페이지가 로드될 때 로컬 스토리지에서 데이터 가져오기
window.onload = function() {
    const email = getLocalStorage('email'); 
    const nickname = getLocalStorage('nickname'); 
    const profileImageSrc = getLocalStorage('profile'); 

    if (email) {
        emailInput.value = email; 
    }

    if (nickname) {
        inputNickname.value = nickname; 
    }

    if (profileImageSrc) {
        profileImage.src = profileImageSrc; 
        profileImage.style.display = 'block'; 
    }
};

// 드롭다운 메뉴 표시
profileImg.addEventListener('click', () => {
    dropdownMenu.style.maxHeight = 100;
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// 닉네임 유효성 검사 함수
function validateNickname(nickname) {
    if (!nickname) {
        nicknameError.innerText = '  *닉네임을 입력해주세요.';
        nicknameError.style.display = 'block';
        return false;
    } else if (/\s/.test(nickname)) {
        nicknameError.innerText = '  *띄어쓰기를 없애주세요.';
        nicknameError.style.display = 'block';
        return false;
    } else if (nickname.length > 10) {
        nicknameError.innerText = '  *닉네임 최대 10자까지 가능합니다.';
        nicknameError.style.display = 'block';
        return false;
    } else if (nickname === document.getElementById('nickname').placeholder) {
        nicknameError.innerText = '  *중복된 닉네임 입니다';
        nicknameError.style.display = 'block';
        return false;
    } else {
        nicknameError.style.display = 'none';
        return true;
    }
}

// 수정하기 버튼 클릭
updateButton.addEventListener('click', async () => {
    const nicknameValue = inputNickname.value.trim(); 
    if (validateNickname(nicknameValue)) { 
        try {
            const userId = getLocalStorage('userId');
            const response = await fetch('http://localhost:3000/api/auth/nickname', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId, 
                    nickname: nicknameValue 
                }),
            });
            
            if (response.ok) {
                toastMessage.style.display = 'block'; 
                setTimeout(() => {
                    toastMessage.style.display = 'none';
                }, 2000);
                
                localStorage.setItem('nickname', nicknameValue);
            } else {
                
                const errorData = await response.json();
                nicknameError.innerText = errorData.message || '수정 실패';
                nicknameError.style.display = 'block';
            }
        } catch (error) {
            console.error('Error:', error);
            nicknameError.innerText = '서버와의 통신 오류';
            nicknameError.style.display = 'block';
        }
    }
});


deleteButton.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
});


confirmDelete.addEventListener('click', () => {
    const userId = getLocalStorage('userId'); 

    if (userId) {
        fetch('http://localhost:3000/api/auth/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }), 
        })
        .then(response => response.json()) 
        .then(data => {
            if(data.success){
                alert("회원 탈퇴가 완료되었습니다."); 
                deleteModal.style.display = 'none';
                handleLocation('/html/login.html'); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`오류: ${error.message}`); 
        });
    } else {
        alert('사용자 ID를 찾을 수 없습니다.'); 
    }
});


// 회원 탈퇴 모달 취소 클릭
cancelDelete.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});

// 프로필 이미지 업로드
uploadButton.addEventListener('click', () => {
    fileInput.click(); // 파일 입력 클릭
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImage.src = e.target.result; 
            profileImage.style.display = 'block'; 
            uploadButton.style.visibility = 'hidden'; 
            
            localStorage.setItem('profile', e.target.result);
        };
        reader.readAsDataURL(file); // 파일을 데이터 URL로 읽기
    }
});


function saveLocalStorage(key, value) {
    localStorage.setItem(key, value);
}

function getLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue;
}

function handleLocation(url) {
    window.location.href = url;
}
