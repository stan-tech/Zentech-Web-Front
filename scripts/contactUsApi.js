 // API endpoint for submitting contact form data
 const Contact_API_BASE_URL = "http://192.168.0.194:5033/api/contact";

 // Function to submit the contact form
 async function submitContactForm(event) {
  event.preventDefault();
  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const country = document.getElementById('country').value;
  const role = document.getElementById('role').value;
  const message = document.getElementById('message').value;
  const topic = document.getElementById('topic').value;
 
  // Validate required fields
  if (!email || !phoneNumber || !message) {
      alert("Please fill in all required fields.");
      return;
  }
 
  const contactMessage = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumbre: phoneNumber,
      Country: country,
      Role:role,
      Message: message,
      Topic:topic
  };

  try {
      console.log("Sending payload:", contactMessage);
 
      const response = await fetch(Contact_API_BASE_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(contactMessage)
      });
 
      if (response.ok) {
          alert("Message sent successfully!");
          // Clear form after submission
          event.target.reset(); 
         } else {
            alert("Failed to send message. Please try again.");
        }
  } catch (error) {
      console.error('Error submitting contact form:', error);
      alert("An error occurred. Please try again.");
  }
 }
 
 function redirectToSignIn() {
  window.location.href = "sign-in.html";
 }

 
export function loadContactUsScript(){


    const rolesPath = './json/jobRoles.json';
      const countiesPath = './json/countries.json';
  
  fetch(countiesPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      var r  = response.json();
      return r; 
    })
    .then(data => {
        const countries = document.getElementById('country');
        var options = '<option data-key="Country">Country</option>';
  
        data.forEach(country => {

            options+=`<option data-key="${country.name}"> ${country.name}</option>\n`;
  
        });
  
        countries.innerHTML = options;
    })
    .catch(error => {
      console.error('Error fetching or parsing the JSON file:', error);
    });


    fetch(rolesPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); 
    })
    .then(data => {
        const roles = document.getElementById('role');
        var options = '<option data-key="Role">Role</option>';
  
        data.forEach(role => {
            options+=`<option data-key="${role.name}"> ${role.name}</option>\n`;
        });
  
        roles.innerHTML = options;
    })
    .catch(error => {
      console.error('Error fetching or parsing the JSON file:', error);
    });

    document.getElementById('submit-message').addEventListener('click',(event)=>{

      submitContactForm(event);

    });


  
}

 
  