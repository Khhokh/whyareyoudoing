  
// import { signup } from '../../controllers/authController.js';
// import User from '../../models/userModel.js';
import { showAlert, hideAlert } from './alerts.js';
import { updateSettings } from './updateSettings.js';

const login =async (email, password) => {
    // console.log(email,password);
    try{
        const res = await axios({
        method:'POST',
        url:'http://127.0.0.1:3001/api/v1/users/login',
        data:{
            email,
            password
        },
        withCredentials: true
    });
    if(res.data.status == 'success'){
        showAlert('success','Logged in successfully!');
        window.setTimeout(()=>{
            location.assign('/medicat');
        },1500);
    }
    }catch(err){
        showAlert('error',err.response.data.message);
    }

};

export const logOut = async() =>{
    try{
        const res = await axios({
            method:'GET',
            url:'http://127.0.0.1:3001/api/v1/users/logOut'
        });
        if((res.data.status='success')) location.assign('/'); 
    }catch(err){
        showAlert('error','Error logging out ! Try again');
    }
}

export const signUp = async(name,email,password,passwordConfirm ) =>{
        console.log(name,email,password);
        try{
            const res = await axios({
            method:'POST',
            url:'http://127.0.0.1:3001/api/v1/users/signup',
            data:{
                name,
                email,
                password,
                passwordConfirm 
            },
            withCredentials: true
        });
        if(res.data.status == 'success'){
            showAlert('success','Signin successfully!');
            window.setTimeout(()=>{
                location.assign('/medicat');
            },1500);
        }
        }catch(err){
            showAlert('error',err.response.data.message);
        }
    
};















// Async function to send the appointment data to the server
export const bookAppointment = async (doctor,name, email, phone, dateOfBirth, patientType, insurance, appointmentType, appointmentDate, appointmentTime, notes,user,tour) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:3001/api/v1/appointments/appoint',
            data: {
                doctor,
                name,
                email,
                phone,
                dateOfBirth,
                patientType,
                insurance,
                appointmentType,
                appointmentDate,
                appointmentTime,
                notes,
                user,
                tour
            },
            withCredentials: true
        });
        // console.log("i am in the bookingAppointment Section");
        if (res.data) console.log(res.data); 
        if (res.data.status === 'success') {
            // console.log('you are here')
            showAlert('success','Appointment booked successfully!');
            window.setTimeout(() => {
                location.assign('/alldoc');
            }, 1500);
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};





document.addEventListener('DOMContentLoaded', () => {
    const appointmentForm = document.querySelector('.appointment-form');
    if (appointmentForm) {
        const nextBtn = document.getElementById('nextBtn');
        const totalSteps = 3;
        
        // Attach the submission handler to the next button's click event
        nextBtn.addEventListener('click', e => {
            const currentStep = document.querySelector('.step.active');
            const currentStepNumber = parseInt(currentStep.id.replace('step', ''));
            
            // Only submit when on the final step
            if (currentStepNumber === totalSteps) {
                // Gather all form data
                // const doctor = document.getElementById('doctor').value;
                const doctor = document.getElementById('summaryTour').innerText;
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                const dateOfBirth = document.getElementById('dob').value;
                
                // Get patient type from radio buttons
                const patientTypeRadios = document.getElementsByName('patientType');
                let patientType;
                for (const radio of patientTypeRadios) {
                    if (radio.checked) {
                        patientType = radio.value;
                        break;
                    }
                }
                
                const insurance = document.getElementById('insurance').value;
                const appointmentType = document.getElementById('appointmentType').value;
                
                // Get selected date
                const selectedDay = document.querySelector('.calendar-day.selected');
                const dayNumber = selectedDay.textContent;
                const monthYear = document.querySelector('.calendar-month h4').textContent;
                const appointmentDate = new Date(`${monthYear} ${dayNumber}, ${new Date().getFullYear()}`);
                
                // Get selected time
                const selectedTime = document.querySelector('.time-slot.selected').textContent;
                
                const notes = document.getElementById('notes').value;
                
                
                console.log('Appointment data:', {
                    doctor,
                    name,
                    email,
                    phone,
                    dateOfBirth,
                    patientType,
                    insurance,
                    appointmentType,
                    appointmentDate,
                    appointmentTime: selectedTime,
                    notes
                });
                
                // Submit the appointment
                bookAppointment(
                    doctor,
                    name,
                    email,
                    phone,
                    dateOfBirth,
                    patientType,
                    insurance,
                    appointmentType,
                    appointmentDate,
                    selectedTime,
                    notes
                );
            }
        });
    }
});














/////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form--login');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const email = document.getElementById('email1').value;
            const password = document.getElementById('password1').value;
            login(email, password);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.sign-up-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            console.log(name,email,password);
            signUp(name,email,password,passwordConfirm);
        });
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const logOutBtn = document.querySelector('.nav_el--logout');
    if (logOutBtn) logOutBtn.addEventListener('click', logOut);
});

document.addEventListener('DOMContentLoaded', () => {
    const userDataForm = document.querySelector('.form-user-data');
    if (userDataForm) {
        userDataForm.addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            updateData(name,email);
        });
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const userPasswordForm = document.querySelector('.form-user-password');
    if (userPasswordForm)
        userPasswordForm.addEventListener('submit', async e => {
          e.preventDefault();
          document.querySelector('.btn--save-password').textContent = 'Updating...';
      
          const passwordCurrent = document.getElementById('password-current').value;
          const password = document.getElementById('password').value;
          const passwordConfirm = document.getElementById('password-confirm').value;
          await updateSettings(
            { passwordCurrent, password, passwordConfirm },
            'password'
          );
      
          document.querySelector('.btn--save-password').textContent = 'Save password';
          document.getElementById('password-current').value = '';
          document.getElementById('password').value = '';
          document.getElementById('password-confirm').value = '';
    });
});




/////////////////////////// buttton for book appointment ///////////////////////////////
// document.querySelector('.btn--green').addEventListener('click', function () {
//     window.location.href = '/appointment'; 
//   });


document.querySelector('.btn--green').addEventListener('click', function () {
    // Get the tour name from the page (can be dynamically fetched)
    const tourName = document.querySelector('.heading-primary span').innerText;
  
    // Redirect to the /appointment page with the tour name as a query parameter
    window.location.href = `/appointment?tour=${encodeURIComponent(tourName)}`;
  });