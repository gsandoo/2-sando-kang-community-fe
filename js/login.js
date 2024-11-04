
  
  const signInTxt = document.querySelector('.signin-button')
  const inputEmail = document.getElementById('email')
  const inputPassword = document.getElementById('password')
  const submit = document.querySelector('.login-button')
  let emailError = document.getElementById('emailError')
  let pwError = document.getElementById('passwordError')

  function validateForm() {
    let emailCheck = false
    let pwCheck = false

    if (!inputEmail.value.trim() || !emailValidCheck(inputEmail.value.trim())) {
      emailError.innerText = '  *올바른 이메일 주소 형식을 입력해주세요.'
      emailError.style.visibility = 'visible'
    } else {
      emailCheck = true
      emailError.style.visibility = 'hidden'
    }

    if (!inputPassword.value.trim()) {
      pwError.style.visibility = 'visible'
      pwError.innerText = '* 비밀번호를 입력해주세요.'
    } else if (!pwValidCheck(inputPassword.value.trim())) {
      pwError.innerText =
        '  *비밀번호는 8자 이상, 20자 이하이며, \n 대문자, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.'
        pwError.style.visibility = 'visible'
    } else {
      pwCheck = true
      pwError.style.visibility = 'hidden'
    }

    if (emailCheck && pwCheck) {
      submit.style.backgroundColor = '#7f6aee'
      submit.style.cursor = 'pointer'
      
      saveLocalStorage('email', inputEmail.value.trim());
      saveLocalStorage('pw', inputPassword.value.trim());
     
      return true
    }else{
      submit.style.backgroundColor = '#ACA0EB'
    }
  }

  // TODO: 로그인 api 연동 추가
 
submit.addEventListener('click', (event) => {
    event.preventDefault()
    if (validateForm()) {
      
      const email = getLocalStorage('email');
      const pw = getLocalStorage('pw');
     
      fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pw,
        }),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const userId = data.user_id; // `user_id` 값만 추출
        localStorage.setItem("userId", userId); 
        handleLocation("/html/Posts.html");
      })
      .catch(error => console.error("Error:", error));
    }    
  });

  
  
   

  // TODO: 회원가입 api 연동 추가
  if (signInTxt) {
    signInTxt.addEventListener('click', () =>
    handleLocation('/html/signin.html'),
    )
  }

  function emailValidCheck(email) {
    const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/
    return pattern.test(email)
  }

  function pwValidCheck(value) {
    return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(
      value,
    )
  }

  inputEmail.addEventListener('input', validateForm)
  inputPassword.addEventListener('input', validateForm)


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