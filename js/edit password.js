const inputPassword = document.getElementById('password');
const confirmPassword = document.getElementById('confirm-password');
let pwError = document.getElementById('passwordError');
let cfPwError = document.getElementById('confirmPasswordError');
const submit = document.getElementById('modify-button');



function validateForm() {

    let pwCheck = false
    let cfPwCheck = false

    // 비밀번호 유효성 검사
    if (!inputPassword.value.trim()) {
        pwError.style.display = 'block'
        pwError.innerText = '  *비밀번호를 입력해주세요.'
    } else if (!pwValidCheck(inputPassword.value.trim())) {
        pwError.innerText = '  *비밀번호는 8자 이상, 20자 이하이며, \n 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        pwError.style.display = 'block'
    } else {
        pwCheck = true
        pwError.style.display = 'none'
    }

    // 비밀번호 확인 유효성 검사
    if(!confirmPassword.value.trim()) {
        cfPwError.style.display = 'block'
        cfPwError.innerText = '  *비밀번호를 한번 더 입력해주세요.'
    } else if(!confirmPwValidCheck(confirmPassword.value.trim())) {
        cfPwError.style.display = 'block'
        cfPwError.innerText = '  *비밀번호가 다릅니다.';
    }else{
        cfPwCheck = true
        cfPwError.style.display = 'none'
    }

    if (pwCheck && cfPwCheck) {
        submit.style.backgroundColor = '#7f6aee'
        submit.style.cursor = 'pointer'
        return true
    }else{
        submit.style.backgroundColor = '#ACA0EB'
    }
  }

 // TODO: 회원가입 api 연동 추가
 if (submit) {
    submit.addEventListener('click', (event) => {
      event.preventDefault();

      if (validateForm()) {
        const userId = getLocalStorage('userId');
        const password = inputPassword.value.trim();
          
        if (userId) {
          fetch('http://localhost:3000/api/auth/withdraw', {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                user_id: userId,
                password : password 
              }), 
          })
          .then(response => response.json()) 
          .then(data => {
              if(data.success){
                  alert("비밀번호가 수정되었습니다.");
                  localStorage.removeItem('password');
                  saveLocalStorage('password', password);
                  handleLocation('/html/Posts.html'); 
              }
          })
          .catch(error => {
              console.error('Error:', error);
              alert(`오류: ${error.message}`); 
          });
        } else {
          alert('사용자 ID를 찾을 수 없습니다.'); 
        }
      }
    })
  }

  inputPassword.addEventListener('input', validateForm)
  confirmPassword.addEventListener('input', validateForm);

  function pwValidCheck(value) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(
      value,
    )
  }

  function confirmPwValidCheck(value) {
    return value === inputPassword.value.trim();
  }


  function saveLocalStorage(key, value) {
    localStorage.setItem(key, value);
  }

  function getLocalStorage(key) {
    const storedValue = localStorage.getItem(key);
    return storedValue;
  }

  function handleLocation(url) {
    window.location.href = url
  }