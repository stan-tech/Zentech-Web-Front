const BASE_API_URL = "https://localhost:44338";

window.addEventListener('load', () => {
    const contentContainer = document.getElementById('content');
    
    const defaultPage = 'zentech';
    const initialPage = location.hash.substring(1) || defaultPage;
    loadPage(contentContainer, initialPage);
    localStorage.setItem('current-page',initialPage);

    window.addEventListener('hashchange', () => {
        const page = location.hash.substring(1);
        loadPage(contentContainer, page || defaultPage);
        localStorage.setItem('current-page',page||defaultPage);
    });
});


const solutionData = {
    'cooling-solution': {
        title: "Cooling Solutions",
        subtitle: "Cooling Solution",
        description: "Cooling solution compressors are specialized components used in refrigeration, air conditioning, and industrial cooling systems. They play a critical role in the thermodynamic cycle by compressing refrigerant gas, which raises its pressure and temperature. This compressed refrigerant is then cooled, condensed, and circulated to absorb and remove heat, achieving the desired cooling effect.",
        image: "./images/cooling.jpg",
        gallery: ["./images/details.png", "./images/cooling detailss.png", "./images/cool1.png"]
    },
    'fixed-speed': {
        title: "Fixed Speed Solution",
        subtitle: "Fixed Speed Solution",
        description: "A fixed speed compressor runs at a constant speed, delivering a consistent output of compressed air. It is well-suited for applications with a steady air demand, offering simplicity and lower upfront costs.",
        image: "./images/fixed.jpg",
        gallery: ["./images/details.png", "./images/cooling detailss.png"]
    },
    'variable-speed': {
        title: "Variable Speed Compressors",
        subtitle: "Variable Speed Compressors",
        description: "A variable speed compressor adjusts its motor speed to match the fluctuating demand for compressed air. This results in optimized energy consumption and reduced wear on the compressor components.",
        image: "./images/variable speed.jpg",
        gallery: ["./images/details.jpg", "./images/cooling details.jpg", "./images/coo1.png"]
    },
    'oil-free': {
        title: "Oil-Free Compressors",
        subtitle: "Oil-Free Compressors",
        description: "An oil-free compressor operates without the use of oil in the compression chamber, ensuring that the compressed air is free from oil contaminants. This makes it ideal for industries where air purity is critical.",
        image: "./images/oil free compressor.jpg",
        gallery: ["./images/details.png", "./images/cooling detailss.png", "./images/cd5f16ea-fbbe-4596-9852-0cf6a4e88314.png"]
    }
};
function loadSolutionDetailsScript(id) {
    if (id && solutionData[id]) {
        const solution = solutionData[id];

        // Update page content
        document.getElementById("solution-title").textContent = solution.title;
        document.getElementById("solution-subtitle").textContent = solution.subtitle;
        document.getElementById("solution-description").textContent = solution.description;
        document.getElementById("solution-image").src = solution.image;

        // Generate image gallery
        const gallery = document.getElementById("solution-gallery");
        if (gallery) {
            gallery.innerHTML = ""; // Clear existing content
            solution.gallery.forEach(image => {
                const imgElement = document.createElement("img");
                imgElement.src = image;
                imgElement.alt = `${solution.title} Gallery`;
                imgElement.style.marginRight = "20px";
                gallery.appendChild(imgElement);
            });
        }
    } else {
        document.getElementById("content").innerHTML = "<h1>Solution Not Found</h1>";
    }
}
let aboutUsScriptLoaded = false;

async function loadPage(contentContainer, pageUrl) {
    try {

        const [basePage, query] = pageUrl.split('?'); 
        
        const response = await fetch(`${basePage}.html`);
        
        if (!response.ok) {
            throw new Error('Page not found');
        }

        const data = await response.text();
        contentContainer.innerHTML = data;

        await handlePageScripts(basePage).then(async () =>{


            if (query) {
                const params = new URLSearchParams(query);
    
    
                switch(basePage){
                    case 'product-details':
                        const productId = params.get('id');
                        if (productId) {
                            await loadProductDetails(productId); 
                        }
                        break;
                    case 'products':
                        const categoryId = params.get('main');
                        if(categoryId){
                            var cat_section = document.getElementById('mpc_'+categoryId); 
                            cat_section.scrollIntoView({ behavior: "smooth", block: "nearest" });
                        }
                        break;
                    
                }
                
                
            }

        });

        const lang = sessionStorage.getItem('language');

        (async () => {
            const { TranslateContent} = await import('./auto-translate.js');
        
            if (lang) {
                await TranslateContent(); 
            } else {
                sessionStorage.setItem('language', 'en'); 
                await TranslateContent(); 
            }
        })();

        
        document.getElementById('content').addEventListener('click', (e) => {
            if (!e.target.classList.contains('nav-menu') && !e.target.classList.contains('nav-menu.visible')) {
                document.querySelector('.nav-menu.visible')?.classList.remove('visible');
            }
        });
        document.getElementById('main-footer').addEventListener('click', (e) => {
            if (!e.target.classList.contains('nav-menu') && !e.target.classList.contains('nav-menu.visible')) {
                 document.querySelector('.nav-menu.visible')?.classList.remove('visible');
            }
        });


    } catch (error) {
        contentContainer.innerHTML = `<p>Error loading page: ${error.message}</p>`;
    }
}

async function handlePageScripts(page) {
    page = decodeURIComponent(page);
    switch (page) {
        case 'zentech':
            const { loadHomeData } = await import('./script.js');
            await loadHomeData();
            break;

        case 'products':
            const { loadProductsData } = await import('./productsApi.js');
            await loadProductsData();
            break;

        case 'solution':
            const { loadSolutionsData } = await import('./solution.js');
            loadSolutionsData();
            break;

        case 'about us':
            await initializeAboutUs();
            break;

        case 'contact us':
            const { loadContactUsScript } = await import('./contactUsApi.js');
            await loadContactUsScript();
            break;

        case 'company-news':
            const { loadNewsData } = await import('./company-news.js');
            await loadNewsData();
            break;

        case 'service&support':

            break;

        case 'sign in':
            // Handle sign-in specific logic here, if needed
            break;

        case 'product-details':
            var hash = location.hash;

            if (hash.startsWith('#product-details')) {
           const params = new URLSearchParams(hash.substring(1).split('?')[1]); 
           const productId = params.get('id');
                if (productId) {
                            await loadProductDetails(productId); 
                        }
                        return;
                    }
            break;

        case 'company-news-detail':
                var hash = location.hash;
                if (hash.startsWith('#company-news-detail')) {
                        await loadNewsDetails(); 
                    return;
                 }
            break;
        case 'solution details':
            var hash = location.hash;
            if (hash.startsWith('#solution')) {
                const params = new URLSearchParams(hash.substring(1).split('?')[1]); 
                const solutionID = params.get('id');

                    await loadSolutionsDetails(solutionID); 
                return;
                }
           break;


        default:
            console.warn(`No specific script handling for page: ${page}`);
            break;
    }

}


function initializeAboutUs() {  
    const showDetails = () => {  
        const detailsPanel = document.getElementById('country-details');
    
        detailsPanel.style.display = 'block'; // Show the element first
        setTimeout(() => {
            detailsPanel.classList.add('show'); // Add the show class for animation
        }, 10);
    
    };  

    const hideDetails = () => {  
        const detailsPanel = document.getElementById('country-details');
    
    detailsPanel.classList.remove('show'); // Remove the show class to trigger the animation
    setTimeout(() => {
        detailsPanel.style.display = 'none'; // Hide after the animation
    }, 500);
    
    };  

    const mapPin = document.getElementById('map-pin');  
    const closeButton = document.getElementById('close-btn');  

    if (mapPin) {  
        mapPin.addEventListener('click', showDetails);  
    }  

    if (closeButton) {  
        closeButton.addEventListener('click', hideDetails);  
    }  
} 

/* Product Details Code */

async function loadProductDetails(productId) {
    try {
        document.getElementById("productTitle").textContent = "Chargement...";
        document.getElementById("productDescription").textContent = "Chargement de la description...";

        const specList = document.getElementById("productSpecifications");
        specList.innerHTML = "<li class='spec-item'>Chargement des spécifications...</li>";
        const mainImage = document.getElementById("mainImage");
        mainImage.src = "./images/zentech-logo.svg";
        mainImage.alt = "Chargement...";

        const response = await fetch(`${BASE_API_URL}/api/products/${productId}`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du produit : ${response.statusText}`);
        }

        const product = await response.json();
        await displayProductDetails(product).then(async () =>
            {
                var tables = document.querySelectorAll('table');
                for(let table of tables){

                    await setModelFilter(table.id);
                    document.getElementById(`reset-button-${table.id}`)
                    .addEventListener('click', ()=>{
                             ResetFilters(table.id);
                    });
                }

            }
        );
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        document.querySelector(".product-section").innerHTML = "<p>Erreur : Produit non trouvé.</p>";
    }
}
async function displayProductDetails(product) {

    const mainImage = document.getElementById("mainImage");
    mainImage.src = `${BASE_API_URL}${product.photos[0]}`;
    mainImage.alt = product.name;

    const imageGallery = document.getElementById("imageGallery");
    imageGallery.innerHTML = "";
    product.photos.forEach(photo => {
        const imgElement = document.createElement("img");
        imgElement.className = 'image-gallery img';
        imgElement.src = `${BASE_API_URL}${photo}`;
        imgElement.alt = product.name;
        imgElement.onclick = () => {
            mainImage.src = imgElement.src; 
        };
        imageGallery.appendChild(imgElement);
    });

    document.getElementById("productTitle").textContent = product.name;
    document.getElementById("productDescription").textContent = product.description;

    const specList = document.getElementById("productSpecifications");
    specList.innerHTML = ""; 
    if (product.specifications && product.specifications.length > 0) {
        product.specifications.forEach(spec => {
            const listItem = document.createElement("li");
            listItem.classList.add("spec-item");
            listItem.setAttribute('data-id',spec.key);

            const keyElement = document.createElement("span");
            keyElement.classList.add("spec-key");
            keyElement.textContent = `${spec.key} `;
            keyElement.setAttribute('data-key', spec.key);

            const valueElement = document.createElement("span");
            valueElement.classList.add("spec-value");
            valueElement.textContent = spec.value;
            valueElement.setAttribute('data-key', spec.value);
            valueElement.style.display = "none"; 

            listItem.onclick = () => {


                const isVisible = valueElement.style.display === "block";
                var dataID = listItem.getAttribute('data-id');

                if(isVisible || valueElement.innerHTML == ''){
                    var sections = Array.from(document.querySelectorAll('.selector-section'));
                    var targetSection = sections.filter(
                        specName => specName.getAttribute('data-id') == dataID
                    );
                    
                    if (targetSection.length > 0) {  
                        targetSection[0].scrollIntoView({ behavior: "smooth", block: "center" });  
                    }  
                    return;  
                }
                valueElement.style.display = isVisible ? "none" : "block"; 
                listItem.scrollIntoView({ behavior: "smooth", block: "center" });

                
            };

            listItem.appendChild(keyElement);
            listItem.appendChild(valueElement);
            specList.appendChild(listItem);
        });
    } else {
        specList.innerHTML = "<li>Aucune spécification disponible.</li>"; 
    }

   await  SetSepcificationScrollButtons();
}

async function ResetFilters(tableID){

    var Displacement = document.getElementById(`displacement-filter-${tableID}`);  
    var CoolingType = document.getElementById(`cooling-type-filter-${tableID}`); 
    var MotorType = document.getElementById(`motor-type-filter-${tableID}`);  
    var VolFreq = document.getElementById(`voltage-filter-${tableID}`);  
    var CoolingCapW = document.getElementById(`W-filter-${tableID}`);  
    var CoolingCapBTU = document.getElementById(`BTU/h-filter-${tableID}`);  
    var CopWW = document.getElementById(`W/W-filter-${tableID}`);  
    var Kcal = document.getElementById(`Kcal-filter-${tableID}`);  
    var CopBTUWh = document.getElementById(`BTU/Wh-filter-${tableID}`);  
    var selectedModel = document.getElementById(`model-filter-input-${tableID}`);

    Displacement.value = '';
    CoolingType.value = '';
    MotorType.value = '';
    VolFreq.value = '';
    CoolingCapW.value = '';
    CoolingCapBTU.value = '';
    CopWW.value = '';
    Kcal.value = '';
    CopBTUWh.value = '';
    selectedModel.value = ''; 


    await filterTable(selectedModel.value,Displacement.value, CoolingType.value, MotorType.value,
        VolFreq.value, CoolingCapW.value, CoolingCapBTU.value, CopWW.value, Kcal.value, CopBTUWh.value, tableID);  

}
async function setModelFilter(tableID){

    const models = [  
        'Model',
        'Z01A60WB',  
        'Z01A67WB',  
    ];  
    
    const modelInput = document.getElementById(`model-filter-input-${tableID}`);  
    const modelAutocompleteList = document.getElementById(`model-autocomplete-list-${tableID}`);  

    modelInput.addEventListener('focusin', () => {  
       
        const value = modelInput.value;  
        modelInput.select();
        modelAutocompleteList.innerHTML = '';  
        dropAutoCompleteList(models,value,modelInput, modelAutocompleteList,tableID);

    });  
    modelInput.addEventListener('input', () => {  
        const value = modelInput.value; 
        modelAutocompleteList.innerHTML = '';  
        dropAutoCompleteList(models,value,modelInput, modelAutocompleteList,tableID);

    });  

    modelInput.addEventListener('click', (event) => {
        event.stopPropagation(); 
    });

    document.getElementById(tableID).addEventListener('click',()=>{
        modelAutocompleteList.style.display = 'none'; 
    });

    await setSelectChangeEvents(tableID);

}

async function dropAutoCompleteList(models, value, modelInput, modelAutocompleteList, tableID){


    const filteredModels = (value)? models.filter(model =>  
        model.toLowerCase().includes(value.toLowerCase())  
    ):models;  

    if (filteredModels.length > 0) {  
        filteredModels.forEach(model => {  
            const div = document.createElement('div');  
            div.classList.add('autocomplete-item');  
            div.textContent = model;  

            div.addEventListener('click',async () => {  
                modelInput.value = model; 
                modelAutocompleteList.innerHTML = ''; 
                modelAutocompleteList.style.display = 'none'; 

                const Displacement = document.getElementById(`displacement-filter-${tableID}`).value;  
                const CoolingType = document.getElementById(`cooling-type-filter-${tableID}`).value; 
                const MotorType = document.getElementById(`motor-type-filter-${tableID}`).value;  
                const VolFreq = document.getElementById(`voltage-filter-${tableID}`).value;  
                const CoolingCapW = document.getElementById(`W-filter-${tableID}`).value;  
                const CoolingCapBTU = document.getElementById(`BTU/h-filter-${tableID}`).value;  
                const CopWW = document.getElementById(`W/W-filter-${tableID}`).value; 
                const Kcal = document.getElementById(`Kcal-filter-${tableID}`).value;   
                const CopBTUWh = document.getElementById(`BTU/Wh-filter-${tableID}`).value;  

               await filterTable(model,Displacement, CoolingType, MotorType,
                VolFreq, CoolingCapW, CoolingCapBTU, CopWW, Kcal, CopBTUWh, tableID); 
            });  

            modelAutocompleteList.appendChild(div);  
        });  
        modelAutocompleteList.style.display = 'block'; // Show filtered options  
    } else {  
        modelAutocompleteList.style.display = 'none'; // Hide if no matches  
    } 


}

async function setSelectChangeEvents(tableID){
    const targetTable = document.getElementById(tableID);  
    const selectElements = targetTable.querySelectorAll('select');  

    for (let select of selectElements) {  
        select.addEventListener('change', async () => {  
            const Displacement = document.getElementById(`displacement-filter-${tableID}`).value;  
            const CoolingType = document.getElementById(`cooling-type-filter-${tableID}`).value; 
            const MotorType = document.getElementById(`motor-type-filter-${tableID}`).value;  
            const VolFreq = document.getElementById(`voltage-filter-${tableID}`).value;  
            const CoolingCapW = document.getElementById(`W-filter-${tableID}`).value;  
            const CoolingCapBTU = document.getElementById(`BTU/h-filter-${tableID}`).value;  
            const CopWW = document.getElementById(`W/W-filter-${tableID}`).value;  
            const Kcal = document.getElementById(`Kcal-filter-${tableID}`).value;  
            const CopBTUWh = document.getElementById(`BTU/Wh-filter-${tableID}`).value;  

            const selectedModel = document.getElementById(`model-filter-input-${tableID}`).value;

            await filterTable(selectedModel,Displacement, CoolingType, MotorType,
                VolFreq, CoolingCapW, CoolingCapBTU, CopWW, Kcal, CopBTUWh, tableID);  
        });  
    }  

}

async function filterTable(selectedModel,Displacement, CoolingType, MotorType,
     VolFreq, CoolingCapW, CoolingCapBTU, CopWW, Kcal, CopBTUWh, tableID) {  
    const targetTable = document.getElementById(tableID);  

    const rows = targetTable.querySelectorAll('tbody tr');  

    rows.forEach(row => {  
        const modelCell = row.cells[0].textContent;   
        const displacementCell = row.cells[1].textContent; 
        const coolingTypeCell = row.cells[2].textContent;  
        const motorTypeCell = row.cells[3].textContent;  
        const volFreqCell = row.cells[4].textContent;  
        const coolingCapWCell = row.cells[5].textContent;  
        const coolingCapBTUCell = row.cells[6].textContent;  
        const KcalCell  = row.cells[7].textContent; 
        const copWWCell = row.cells[8].textContent;  
        const copBTUWhCell = row.cells[9].textContent;  


        const modelMatches = selectedModel === 'Model' || modelCell === selectedModel || selectedModel === '' ;  
        const displacementMatches = Displacement === '' || displacementCell === Displacement;  
        const coolingTypeMatches = CoolingType === '' || coolingTypeCell === CoolingType;  
        const motorTypeMatches = MotorType === '' || motorTypeCell === MotorType;  
        const volFreqMatches = VolFreq === '' || volFreqCell === VolFreq;  
        const coolingCapWMatches = CoolingCapW === '' || coolingCapWCell === CoolingCapW;  
        const coolingCapBTUMatches = CoolingCapBTU === '' || coolingCapBTUCell === CoolingCapBTU;  
        const copWWMatches = CopWW === '' || copWWCell === CopWW;  
        const copBTUWhMatches = CopBTUWh === '' || copBTUWhCell === CopBTUWh;  
        const KcalMatches = Kcal ===''|| KcalCell === Kcal;

 
        if (modelMatches &&  
            displacementMatches &&  
            coolingTypeMatches &&  
            motorTypeMatches &&  
            volFreqMatches &&  
            coolingCapWMatches &&  
            coolingCapBTUMatches &&  
            copWWMatches &&  
            KcalMatches &&
            copBTUWhMatches) {  
            row.style.display = ''; 
        } else {  
            row.style.display = 'none'; 
        }  
    });  
}

async function SetSepcificationScrollButtons() {
    const upButton = document.querySelector('.scroll-up');
    const downButton = document.querySelector('.scroll-down');
    const specifications = document.querySelector('.product-specifications');

    if (!specifications || !specifications.children.length) {
        console.warn("No products found in the wrapper.");
        return;
    }

    const scrollAmount = specifications.children[0].offsetWidth + 21;

    if (upButton) {
        upButton.addEventListener('click', function () {
            specifications.scrollBy({
                top: -scrollAmount,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn("Scroll-up button not found.");
    }

    if (downButton) {
        downButton.addEventListener('click', function () {
            specifications.scrollBy({
                top: scrollAmount,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn("Scroll-down button not found.");
    }
}

/* Product Details Code */

async function loadNewsDetails(){

    var queryString = location.hash;

     queryString = queryString.split('?')[1];

    let newsId;
    if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        newsId = urlParams.get('id'); 
    }else{
        console.log('queryString is null or empty');
    }

        if (newsId) {
            
            await GetNewsById(newsId.replace('newsItem',''))

        }
}

async function GetNewsById(id){

    try{

        const resp = await fetch(API_BASE_URL + `/News/${id}`);

        if (!resp.ok) {
            console.log(`Error: ${resp.status}`);
            return;
        }
        
        const data = await resp.json();
        const newsContainer = document.getElementsByClassName('news-container')[0];
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, 'text/html');
        const titleData = doc.querySelector('h1');
        
        const titleElement = newsContainer.querySelector('h1');
        var  newcontent='';
        if (titleElement && titleData) {
            newsContainer.innerHTML = data.content;
            return;
        } else {

           newcontent = `<h1 data-key="${data.title}">${data.title}</h1>`;
           newcontent+=data.content.replace(/<h1>.*<\/h1>/, '');
        newsContainer.innerHTML = newcontent;

        }
        
        
          
    }catch(error){
        console.log('Error fetching data',error.message);
    
    }
     

}

async function loadSolutionsDetails(solutionID){

    try {

        var solutionTitle =document.getElementById("solution-title"); 
        var solutionContent = document.getElementById("content-section");
        solutionTitle.textContent = "Chargement...";
        solutionContent.innerHTML = `
            <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        
        `;


        const response = await fetch(`${BASE_API_URL}/api/Solutions/GetSolutionById/${solutionID}`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du produit : ${response.statusText}`);
        }

        const solution = await response.json();


        if(solution){

            solutionTitle.textContent = solution.title;
            solutionContent.innerHTML = solution.description;
            
        }
    
        
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        document.querySelector(".product-section").innerHTML = "<p>Erreur : Produit non trouvé.</p>";
    }

}


