var $knI9B$axios = require("axios");


function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}

const $70af9284e599e604$export$596d806903d1f59e = async (email, password)=>{
    // console.log(email,password);
    try {
        const res = await (0, ($parcel$interopDefault($knI9B$axios)))({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email: email,
                password: password
            },
            withCredentials: true
        });
        if (res.data.status == 'success') {
            alert('Logged in successfully!');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1500);
        }
    } catch (err) {
        console.log(err.response.data.message);
    }
}; // login.js
 // export const login = async (email, password) => {
 //     try {
 //       const res = await axios({
 //         method: 'POST',
 //         url: 'http://127.0.0.1:3000/api/v1/users/login',
 //         data: {
 //           email,
 //           password
 //         },
 //         withCredentials: true
 //       });
 //       if (res.data.status === 'success') {
 //         alert('Logged in successfully!');
 //         window.setTimeout(() => {
 //           location.assign('/');
 //         }, 1500);
 //       }
 //     } catch (err) {
 //       console.log(err?.response?.data?.message || 'Something went wrong');
 //     }
 //   };
 // export const login = async (email, password) => {
 //     try {
 //       const res = await axios({
 //         method: 'POST',
 //         url: 'http://127.0.0.1:3000/api/v1/users/login',
 //         data: { email, password },
 //         withCredentials: true
 //       });
 //       if (res.data.status === 'success') {
 //         alert('Logged in successfully!');
 //         window.setTimeout(() => {
 //           location.assign('/');
 //         }, 1500);
 //       }
 //     } catch (err) {
 //       console.error(err?.response?.data?.message || 'Login failed');
 //     }
 //   };
 // document.querySelector('.form').addEventListener('submit', e => {
 //     e.preventDefault();
 //     const email = document.getElementById('email').value;
 //     const password = document.getElementById('password').value;
 //     // Pass arguments separately
 //     login(email, password);
 // });


const $d0f7ce18c37ad6f6$var$loginForm = document.querySelector('.form');
if ($d0f7ce18c37ad6f6$var$loginForm) $d0f7ce18c37ad6f6$var$loginForm.addEventListener('submit', (e)=>{
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // Pass arguments separately
    (0, $70af9284e599e604$export$596d806903d1f59e)(email, password);
});


//# sourceMappingURL=index.js.map
