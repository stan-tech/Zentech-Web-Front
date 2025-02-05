let currentIndex = 0;
let intervalId; 

export async function loadHomeData(){

  await GetData();

  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null; 
}

 intervalId = setInterval(() => {

    currentIndex++;
    showSlide(currentIndex);
    localStorage.setItem('currentSlide',currentIndex);

}, 8000);

}
 


// Fermer le menu hamburger après un clic sur un lien
document.querySelectorAll(".nav-menu a").forEach(link => {
  link.addEventListener("click", () => {
    const navMenu = document.getElementById("nav-menu");
    navMenu.classList.remove("visible");
  });
});


function toggleSearch() {
  const searchContainer = document.querySelector('.search-container');
  searchContainer.classList.toggle('active');
}
    function redirectToSignIn() {

    window.location.href = "sign-in.html"; 
  
  }

   


 function showSlide(index) {

  var currentPage =  localStorage.getItem('current-page'); 
  if( currentPage !='zentech'){
    return;
  }
  const slidesContainer = document.querySelector(".slides");
  var slides = slidesContainer.querySelectorAll(".slide");

  if(index> slides.length){

    currentIndex = 0;
    index = 1;
  }
  const targetSlide = slidesContainer.querySelector(`#s${index}`);
  

  const containerWidth = slidesContainer.offsetWidth;
  const slideWidth = targetSlide.offsetWidth;
  const targetLeftOffset = targetSlide.offsetLeft - (containerWidth - slideWidth) / 2;

  slidesContainer.scroll({
    left: targetLeftOffset, 
    behavior: "smooth", 
  });

  // TargetSlide.scrollIntoView({
  //   behavior: 'smooth', 
  //   block: 'nearest',   
  //   inline: 'center'   
  // });

  const dots = document.querySelectorAll(".dot");
  
  try{

    slides.forEach((slide,i)=>{
      slide.classList.toggle("active", i === index - 1);

    });
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === index - 1);
    });
  }catch(error){
    console.log('..'+error);

  }


}
// Dots Control
export function currentSlide(index) {

  try{

    showSlide(index);
    localStorage.setItem('currentSlide',index);

  }catch(error){
    console.log('..'+error);
  }
}


//Modified by Aymen, changed the interval duration from 5 to 8 seconds 17/12/2024 16:05

   
    // Toggle Password Visibility
    // const togglePassword = document.getElementById('togglePassword');
    // const passwordInput = document.getElementById('password');
    //     try{

    //       togglePassword.addEventListener('click', () => {
    //         // Toggle the type attribute
    //         const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    //         passwordInput.setAttribute('type', type);
                
    //         // Toggle the icon
    //         togglePassword.classList.toggle('fa-eye-slash');
    //          });

    //     } catch (error){
    //       console.log('..'+error);
    //     }   
        

//#region Load data 

   async function GetData() {
    const apiUrl = 'https://localhost:44338';
    const url = `${apiUrl}/api/Slides`;

    var resp = await fetch(url);
    if (!resp.ok) {
        console.log('Error: ' + resp.status);
        return;
    }

    var data = await resp.json();
    var slidesContainer = document.querySelector('.slides');
    var dotsContainer = document.querySelector('.dots-container');

    slidesContainer.innerHTML = '';
    dotsContainer.innerHTML = '';

    var i = 1;
    for (var slide of data) {

        if (slide.picturePath) {

            
            var slideContainer = document.createElement('div');
            slideContainer.className = 'slide-container';
            slideContainer.id = 's'+i;

            var slideElement = document.createElement('div');
            slideElement.className = 'slide';
  

            var imgElement = document.createElement('img');
            imgElement.src = apiUrl+slide.picturePath; //
            imgElement.alt = "Slide " + slide.slideID; 

            var descriptionContainer = document.createElement('div');
            descriptionContainer.className = 'description-container';

            var pElement = document.createElement('p');
            pElement.className = 'description-text';
            pElement.setAttribute('data-key', `description${slide.slideID}`);
            pElement.textContent = slide.description;

            descriptionContainer.appendChild(pElement);
            slideElement.appendChild(imgElement);
            slideElement.appendChild(descriptionContainer);

            slideContainer.appendChild(slideElement);

            slidesContainer.appendChild(slideContainer);

            var dotElement = document.createElement('span');
            dotElement.className= 'dot';
            dotElement.id = i;
            dotsContainer.appendChild(dotElement);
            i++;

        }
    }

    var addedSpace = document.createElement('div');
    addedSpace.style='width:2rem;';
    slidesContainer.appendChild(addedSpace);

    document.querySelectorAll(".dot").forEach((dotElement) => {
      dotElement.onclick = function (event) {
          currentSlide(event.target.id); 
          currentIndex = event.target.id;
      };
  });

      if(dotsContainer.innerHTML != ''){

        currentIndex = ((data.length/2)%2==0) ? data.length/2 : parseInt(data.length/2)+1;
        currentSlide(currentIndex);

      }

  }

//#endregion