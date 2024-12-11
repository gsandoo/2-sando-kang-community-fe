import { handleLocation } from '../util/handleLocation.js';
import { getLocalStorage, saveLocalStorage } from '../util/session.js';

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
const emailInput = document.getElementById('email'); 
const logoutButton = document.querySelector('.dropdown-menu a:last-child'); 

const fileInput = document.getElementById('fileInput');
const profileImage = document.getElementById('profileImage');
const headerProfile = document.getElementById('profileImg');
const uploadButton = document.getElementById('uploadButton');


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
        profileImage.style.display = 'none'; 
    }
};

profileImg.addEventListener('click', () => {
    dropdownMenu.style.maxHeight = 100;
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

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

function logout(event) {
    event.preventDefault();

    const userId = getLocalStorage('userId'); 

    if (userId) {
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: userId }),
        })
        .then(response => {
            return response.json().then(data => {
                if (response.ok && data.success) {
                    alert("로그아웃이 완료되었습니다."); 
                    localStorage.removeItem('userId'); 
                    handleLocation('/html/login.html'); 
                } else {
                    throw new Error(data.message || '로그아웃 실패'); 
                }
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`오류: ${error.message}`);
        });
    } else {
        alert('사용자 ID를 찾을 수 없습니다.'); 
    }
}



updateButton.addEventListener('click', async () => {
    const nicknameValue = inputNickname.value.trim(); 
    const file = fileInput.files[0]; 

    console.log(nicknameValue);
    if (!validateNickname(nicknameValue)) {
        nicknameError.innerText = '닉네임이 유효하지 않습니다.';
        nicknameError.style.display = 'block';
        return;
    }
    nicknameError.style.display = 'none';

    try {
        const formData = new FormData();
        const userId = getLocalStorage('userId'); 

        formData.append('user_id', userId);
        formData.append('nickname', nicknameValue);
        if (file) {
            formData.append('profile', file);
        }

        const response = await fetch('/api/auth/nickname', {
            method: 'PATCH',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
         
            toastMessage.style.display = 'block';
            setTimeout(() => {
                toastMessage.style.display = 'none';
            }, 2000);

            const { user_id, nickname, profile } = data.data; 
            console.log(`User ID: ${user_id}, Nickname: ${nickname}, Profile: ${profile}`);
            
            saveLocalStorage('profile', profile);
            saveLocalStorage('nickname', nickname); 
            alert('회원정보 수정이 완료되었습니다.');
            handleLocation('/html/Posts.html'); 

        } else {
            alert(`회원정보 수정 문제 발생: ${data.message || '수정 실패'}`);
            nicknameError.innerText = data.message || '수정 실패';
            nicknameError.style.display = 'block';
        }
    } catch (error) {
        // 네트워크 에러 처리
        console.error('Error:', error);
        nicknameError.innerText = '서버와의 통신 오류';
        nicknameError.style.display = 'block';
    }
});



deleteButton.addEventListener('click', () => {
    deleteModal.style.display = 'flex';
});


confirmDelete.addEventListener('click', () => {
    const userId = getLocalStorage('userId'); 

    if (userId) {
        fetch('/api/auth/withdraw', {
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



cancelDelete.addEventListener('click', () => {
    deleteModal.style.display = 'none';
});


uploadButton.addEventListener('click', () => {
    fileInput.click(); 
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImage.src = e.target.result; 
            profileImage.style.display = 'block'; 
            uploadButton.style.visibility = 'hidden'; 
            
            saveLocalStorage('profile', e.target.result);
        };
        reader.readAsDataURL(file); 
    }
});

logoutButton.addEventListener('click', logout); 
