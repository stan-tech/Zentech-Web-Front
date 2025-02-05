let aboutUsEventListeners = [];

export function loadAboutUsData() {

    console.log('Loading About Us data...');
    const closebtn = document.getElementById('close-btn');
    const expandbtn = document.getElementById('map-pin');

    const observer = new MutationObserver((mutationsList, observer) => {
        if (closebtn && expandbtn) {
            console.log('Buttons found, attaching event listeners...');
            closebtn.addEventListener('click', showDetails);
            expandbtn.addEventListener('click', hideDetails);

            observer.disconnect();
        }else{
            console.log('Buttons not found');
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

export function cleanupAboutUsData() {
    aboutUsEventListeners.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
    });
    aboutUsEventListeners = []; 
}

function showDetails() {
    const detailsPanel = document.getElementById('country-details');
    
    detailsPanel.classList.remove('animate');
    setTimeout(() => {
        detailsPanel.classList.add('animate');
        detailsPanel.style.display = 'block';
    }, 10);
}

function hideDetails() {
    const detailsPanel = document.getElementById('country-details');
    
    detailsPanel.style.display = 'none';
    setTimeout(() => {
        detailsPanel.classList.remove('animate');
        detailsPanel.style.display = '';
    }, 500);
}