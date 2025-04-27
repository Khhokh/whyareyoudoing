import { showAlert, hideAlert } from './alerts.js';

document.addEventListener('DOMContentLoaded', function() {
    // Variables to track the current step
    let currentStep = 1;
    const totalSteps = 3; // Changed from 4 to 3
    
    // Get buttons and step elements
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    
    // Function to update form display based on current step
    function updateFormStep() {
      // Hide all form steps
      formSteps.forEach(step => step.classList.remove('active'));
      
      // Show the current step
      document.getElementById(`step${currentStep}-content`).classList.add('active');
      
      // Update step indicators
      steps.forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum < currentStep) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else if (stepNum === currentStep) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active', 'completed');
        }
      });
      
      // Show/hide prev button based on current step
      if (currentStep === 1) {
        prevBtn.style.display = 'none';
      } else {
        prevBtn.style.display = 'block';
      }
      
      // Update next button text on last step
      if (currentStep === totalSteps) {
        nextBtn.textContent = 'Confirm Appointment';
      } else {
        nextBtn.textContent = 'Next';
      }
    }
    
    // Next button click handler
    nextBtn.addEventListener('click', function() {
      if (currentStep < totalSteps) {
        currentStep++;
        updateFormStep();
      } else {
        // This is where you'd submit the form
        showAlert('Appointment confirmed! A confirmation email has been sent.');
      }
    });
    
    // Previous button click handler
    prevBtn.addEventListener('click', function() {
      if (currentStep > 1) {
        currentStep--;
        updateFormStep();
      }
    });
    
    // Calendar day selection
    const calendarDays = document.querySelectorAll('.calendar-day:not(.unavailable)');
    calendarDays.forEach(day => {
      day.addEventListener('click', function() {
        calendarDays.forEach(d => d.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update summary
        const monthName = document.querySelector('.calendar-month h4').textContent;
        const dayNumber = this.textContent;
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayIndex = Array.from(this.parentNode.children).indexOf(this);
        const dayName = dayNames[dayIndex % 7];
        document.getElementById('summaryDate').textContent = `${dayName}, ${monthName} ${dayNumber}`;
      });
    });
    
    // Time slot selection
    const timeSlots = document.querySelectorAll('.time-slot:not(.unavailable)');
    timeSlots.forEach(slot => {
      slot.addEventListener('click', function() {
        timeSlots.forEach(s => s.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update the summary
        document.getElementById('summaryTime').textContent = this.textContent;
      });
    });
    
    // Form field listeners for summary updates
    document.getElementById('name').addEventListener('input', function() {
      document.getElementById('summaryPatient').textContent = this.value;
    });
    
    document.getElementById('email').addEventListener('input', function() {
      document.getElementById('summaryEmail').textContent = this.value;
    });
    
    document.getElementById('appointmentType').addEventListener('change', function() {
      const typeText = this.options[this.selectedIndex].text;
      document.getElementById('summaryType').textContent = typeText;
    });
  });