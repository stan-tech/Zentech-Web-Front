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
                    // case 'product-details':
                    //     const productId = params.get('id');
                    //     if (productId) {
                    //         await loadProductDetails(productId); 
                    //     }
                    //     break;
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

        var filterOptionsResponse;

        const response = await fetch(`${BASE_API_URL}/api/products/${productId}`).then(

        );
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération du produit : ${response.statusText}`);
        }

        const product = await response.json();

        if(product){
            localStorage.setItem('current-spec-index', 0);
            localStorage.setItem('first-product-specification', product.specifications[0].key);

            await displayProductDetails(product).then(async () =>
                {
                    var tables = document.querySelectorAll('table');
                    for(let table of tables){
    
                        //await setModelFilter(table.id);
                        document.getElementById(`reset-button-${table.id}`)
                        .addEventListener('click', ()=>{
                                 ResetFilters(table.id);
                        });
                    }
    
                }
    
            ).then(async ()=>{
                var specification = localStorage.getItem('first-product-specification');
                 // API request
                const response = await fetch(`${BASE_API_URL}/api/ProductModel/SpecificationFilterOptions/${productId}?specification=${encodeURIComponent(specification)}`);  
                if (!response.ok) {  
                    throw new Error('Network response was not ok');  
                }  
                const data = await response.json();  

                 await loadTableData(specification , data, productId);
                 await setSelectChangeEvents(specification);
        
            });
        }
     
    } catch (error) {
        console.error("Error :", error);
        document.querySelector(".product-section").innerHTML = "<p>Error : Product not found.</p>";
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

            const containerWidth = imageGallery.clientWidth;
            const imgPosition = imgElement.offsetLeft;
            const imgWidth = imgElement.clientWidth;
    
            imageGallery.scrollTo({
                left: imgPosition - (containerWidth / 2) + (imgWidth / 2),
                behavior: "smooth"

            });

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

            listItem.onclick = async (event) => {


                const isVisible = valueElement.style.display === "block";
                var dataID = listItem.getAttribute('data-id');

                if(isVisible || valueElement.innerHTML == ''){
                    var sections = Array.from(document.querySelectorAll('.selector-section'));
                    var targetSection = sections.filter(
                        specName => specName.getAttribute('data-id') == dataID
                    );
                    
                    if (targetSection.length > 0) {  
                        targetSection[0].scrollIntoView({ behavior: "smooth", block: "nearest" });  

                    }  else{

                        var hash = location.hash;
                        const params = new URLSearchParams(hash.substring(1).split('?')[1]); 
                        const productId = params.get('id');
                        var specification = event.target.textContent;
                        const response = await fetch(`${BASE_API_URL}/api/ProductModel/SpecificationFilterOptions/${productId}?specification=${encodeURIComponent(specification)}`);  
                        if (!response.ok) {  
                            throw new Error('Network response was not ok');  
                        }  
                        const data = await response.json();  
        
                         await loadTableData(specification , data, productId);
                         await setSelectChangeEvents(specification);
                         sections = Array.from(document.querySelectorAll('.selector-section'));
                         targetSection = sections.filter(
                            specName => specName.getAttribute('data-id') == dataID
                        );
                         targetSection[0].scrollIntoView({ behavior: "smooth", block: "nearest" });

                    }
                    return;  
                }
                valueElement.style.display = isVisible ? "none" : "block"; 
                listItem.scrollIntoView({ behavior: "smooth", block: "nearest" });

                
            };

            listItem.appendChild(keyElement);
            listItem.appendChild(valueElement);
            specList.appendChild(listItem);
        });
    } else {
        specList.innerHTML = "<li>Aucune spécification disponible.</li>"; 
    }

   await  SetSepcificationScrollButtons();
    const scrollContainer = document.querySelector('.scroll-container');
    if(specList.children.length<=3){
        scrollContainer.style.display = 'none';
    }

}

async function loadTableData(tableID,data ,productId, pageNumber = 1, limit=10) {

    var section = document.createElement('section');
    section.className = 'selector-section';
    section.name= tableID;
    section.style.marginTop = '1.5rem';
    section.setAttribute('data-id',tableID);
    var selectorContainer = document.createElement('div');
    selectorContainer.className='selector-container';
    
    var selectorTitle = document.createElement('div');
    selectorTitle.className = 'selector-title';
    var selector_h1 = document.createElement('h1');
    selector_h1.innerHTML = tableID;

    selectorTitle.appendChild(selector_h1);

    const filters = [  
        'Displacement',  
        'Cooling Type',  
        'Motor Type',  
        'Voltage / Frequency',  
        'Cooling Cap W',  
        'Cooling Cap BTU/h',  
        'Cooling Cap Kcal',
        'COP W/W',  
        'COP BTU/Wh'  
    ];  
    const IDs = [  
        'displacement-',  
        'cooling-type-',  
        'motor-type-',  
        'voltage-',  
        'W-',  
        'BTU/h-',  
        'Kcal-',
        'W/W-',  
        'BTU/Wh-'  
    ]; 

    const groups = [
        'options',
        'select'
    ];



        for(let f of filters){
            var selectFilterElement = document.createElement('select');
            selectFilterElement.className = `filter-options`;

            

            selectFilterElement.id = `${IDs[filters.indexOf(f)]}options-${tableID}`;
            var selectDefaultOption = document.createElement('option');
            selectDefaultOption.value = "";
            selectDefaultOption.innerHTML= f;
    
            selectFilterElement.appendChild(selectDefaultOption);
            selectorTitle.appendChild(selectFilterElement);

        }
    
    var resetButton = document.createElement('button');
    resetButton.className = 'reset-button';
    resetButton.setAttribute('data-key',"Reset button");
    resetButton.id = `reset-button-${tableID}`;
    resetButton.textContent = 'Reset Filters';

    resetButton.addEventListener('click',()=>
        {
            ResetFilters(tableID);
        });

    selectorTitle.appendChild(resetButton);
    selectorContainer.appendChild(selectorTitle);
    section.appendChild(selectorContainer);

    var containerTable = document.createElement('div');
    containerTable.className= 'container-table100';
    containerTable.id = `container-table100-${tableID}`;
    
    var tableWrapper = document.createElement('div');
    tableWrapper.className= 'wrap-table100';


    var tablelayout = document.createElement('div');
    tablelayout.className = 'table100';

    var table = document.createElement('table');
    table.id = tableID;


    var thead = document.createElement('thead');
    var tr1 = document.createElement('tr');
    tr1.className = 'table100-head';

       //#region Models Header  
       var ModelsHeader = document.createElement('th');  
       ModelsHeader.className = 'column';  
       ModelsHeader.textContent = 'Models';  
       //#endregion  
   
       //#region Displacement Header  
       var DisplacementHeader = document.createElement('th');  
       DisplacementHeader.className = 'column';  
       var DisplacementFilter = document.createElement('select');  
       DisplacementFilter.className = 'filter-select';  
       DisplacementFilter.id = `displacement-filter-${tableID}`;  
       DisplacementHeader.appendChild(DisplacementFilter);  
       //#endregion  
   
       //#region Cooling type header  
       var Cooling_typeHeader = document.createElement('th');  
       Cooling_typeHeader.className = 'column';  
       var Cooling_typeFilter = document.createElement('select');  
       Cooling_typeFilter.className = 'filter-select';  
       Cooling_typeFilter.id = `cooling-type-filter-${tableID}`;  
       Cooling_typeHeader.appendChild(Cooling_typeFilter);  
       //#endregion  
       
       //#region Motor type header  
       var Motor_typeHeader = document.createElement('th');  
       Motor_typeHeader.className = 'column';  
       var Motor_typeFilter = document.createElement('select');  
       Motor_typeFilter.className = 'filter-select';  
       Motor_typeFilter.id = `motor-type-filter-${tableID}`;  
       Motor_typeHeader.appendChild(Motor_typeFilter);  
       //#endregion  
   
       //#region Voltage / Frequency header  
       var VoltageHeader = document.createElement('th');  
       VoltageHeader.className = 'column';  
       var VoltageFilter = document.createElement('select');  
       VoltageFilter.className = 'filter-select';  
       VoltageFilter.id = `voltage-filter-${tableID}`;  
       VoltageHeader.appendChild(VoltageFilter);  
       //#endregion  
   
       //#region Cooling capacity header  
       var CoolingCapHeader  = document.createElement('th');  
       CoolingCapHeader.className = 'column';  
       CoolingCapHeader.colSpan = '3';  
       CoolingCapHeader.innerHTML = 'Cooling Capacity';  
       //#endregion  

       //#region COP header  
       var COP_Header  = document.createElement('th');  
       COP_Header.className = 'column';  
       COP_Header.colSpan = '2';  
       COP_Header.innerHTML = 'COP';  
       //#endregion

        tr1.appendChild(ModelsHeader);
        tr1.appendChild(DisplacementHeader);
        tr1.appendChild(Cooling_typeHeader);
        tr1.appendChild(Motor_typeHeader);
        tr1.appendChild(VoltageHeader);
        tr1.appendChild(CoolingCapHeader);
        tr1.appendChild(COP_Header);
        thead.appendChild(tr1);

        var tr2 = document.createElement('tr');
        tr2.className = 'table100-head';

        for(let i=0;i<5;i++){
            var th = document.createElement('th');
            th.className = 'column';
            tr2.appendChild(th);
        }

        //#region  Cooling Cap W Header
        var W_Header = document.createElement('th');
        W_Header.className = 'column';
        var W_Filter = document.createElement('select');
        W_Filter.className = 'filter-select';
        W_Filter.id = `W-filter-${tableID}`;
        W_Header.appendChild(W_Filter);
        //#endregion
        
        //#region Cooling Cap BTU/h header  
        var BTU_Header = document.createElement('th');  
        BTU_Header.className = 'column';  
        var BTU_Filter = document.createElement('select');  
        BTU_Filter.className = 'filter-select';  
        BTU_Filter.id = `BTU/h-filter-${tableID}`;  
        BTU_Header.appendChild(BTU_Filter);  
        //#endregion  
        
        //#region Cooling Cap Kcal header  
        var KcalHeader = document.createElement('th');  
        KcalHeader.className = 'column';  
        var KcalFilter = document.createElement('select');  
        KcalFilter.className = 'filter-select';  
        KcalFilter.id = `Kcal-filter-${tableID}`;  
        KcalHeader.appendChild(KcalFilter);  
        //#endregion  
    
        //#region COP W/W header  
        var WW_Header = document.createElement('th');  
        WW_Header.className = 'column';  
        var WW_Filter = document.createElement('select');  
        WW_Filter.className = 'filter-select';  
        WW_Filter.id = `W/W-filter-${tableID}`;  
        WW_Header.appendChild(WW_Filter);  
        //#endregion  

        //#region COP BTU/Wh header  
        var BTUWh_Header = document.createElement('th');  
        BTUWh_Header.className = 'column';  
        var BTUWh_Filter = document.createElement('select');  
        BTUWh_Filter.className = 'filter-select';  
        BTUWh_Filter.id = `BTU/Wh-filter-${tableID}`;  
        BTUWh_Header.appendChild(BTUWh_Filter);  
        //#endregion  

        tr2.appendChild(W_Header);
        tr2.appendChild(BTU_Header);
        tr2.appendChild(KcalHeader);
        tr2.appendChild(WW_Header);
        tr2.appendChild(BTUWh_Header);

        thead.appendChild(tr2);
        table.appendChild(thead);

        tablelayout.appendChild(table);
        tableWrapper.appendChild(tablelayout);
        containerTable.appendChild(tableWrapper);

        section.appendChild(containerTable);

        var mainContainer = document.getElementById('content');
        mainContainer.appendChild(section); 


    await setFilterOptions( tableID,'options',data);
    await setFilterOptions( tableID,'filter',data);

    var offset = (pageNumber - 1) * limit;  
    
    var displacement = document.getElementById(`displacement-options-${tableID}`).display=='none'?document.getElementById(`displacement-filter-${tableID}`).value:
    document.getElementById(`displacement-options-${tableID}`).value;
    var coolingType = document.getElementById(`cooling-type-options-${tableID}`).display=='none'?document.getElementById(`cooling-type-filter-${tableID}`).value:
    document.getElementById(`cooling-type-options-${tableID}`).value;
    var motorType = document.getElementById(`motor-type-options-${tableID}`).display=='none'?document.getElementById(`motor-type-filter-${tableID}`).value:
    document.getElementById(`motor-type-options-${tableID}`).value;
    var voltage = document.getElementById(`voltage-options-${tableID}`).display=='none'?document.getElementById(`voltage-filter-${tableID}`).value:
    document.getElementById(`voltage-options-${tableID}`).value;
    var coolingCapW = document.getElementById(`W-options-${tableID}`).display=='none'?document.getElementById(`W-filter-${tableID}`).value:
    document.getElementById(`W-options-${tableID}`).value;
    var coolingCapBTU = document.getElementById(`BTU/h-options-${tableID}`).display=='none'?document.getElementById(`BTU/h-filter-${tableID}`).value:
    document.getElementById(`BTU/h-options-${tableID}`).value;
    var coolingCapKcal = document.getElementById(`Kcal-options-${tableID}`).display=='none'?document.getElementById(`Kcal-filter-${tableID}`).value:
    document.getElementById(`Kcal-options-${tableID}`).value;
    var COPWW = document.getElementById(`W/W-options-${tableID}`).display=='none'?document.getElementById(`W/W-filter-${tableID}`).value:
    document.getElementById(`W/W-options-${tableID}`).value;
    var COPBTUWh = document.getElementById(`BTU/Wh-options-${tableID}`).display=='none'?document.getElementById(`BTU/Wh-filter-${tableID}`).value:
    document.getElementById(`BTU/Wh-options-${tableID}`).value;

    const params = new URLSearchParams();  
    params.append('specification', tableID);
    params.append('displacement', displacement);  
    params.append('coolingType', coolingType);  
    params.append('motorType', motorType);  
    params.append('volFreq', voltage);  
    params.append('coolingCapW', coolingCapW);  
    params.append('coolingCapBTU', coolingCapBTU);  
    params.append('coolingCapKcal', coolingCapKcal);  
    params.append('COPWW', COPWW);  
    params.append('COPBTUWh', COPBTUWh);  
    params.append('offset', offset);  
    params.append('limit', limit);  

    
    fetch(`${BASE_API_URL}/api/ProductModel/productModelsBySpecification/${productId}?${params.toString()}`)  
      .then(response => {  
        if (!response.ok) {  
          throw new Error(`HTTP error! status: ${response.status}`);  
        }  
        return response.json();  
      })  
      .then(async (data) =>{

           await populateTable(data.models,tableID, pageNumber, data.count);

        
            var pagesNumberContainer =  document.createElement('div');
                pagesNumberContainer.className = 'page-numbers-container';
                pagesNumberContainer.id= `page-numbers-container-${tableID}`;

                var previousButton = document.createElement('button');
                previousButton.className = 'btn-previous';
                previousButton.id = `btn-previous-${tableID}`;

                var nextButton = document.createElement('button');
                nextButton.className = 'btn-next';
                nextButton.id = `btn-next-${tableID}`;

                var page_number = document.createElement('h1');
                page_number.className = 'page-number';
                page_number.id=`page-number-${tableID}`;
                page_number.textContent = 1;

                var page_count = document.createElement('h1');
                page_count.className = 'page-number';
                page_count.id=`total-pages-${tableID}`;

                page_count.textContent = `Of ${data.count}`;
                page_count.setAttribute('data-key',page_count.textContent);

                pagesNumberContainer.appendChild(previousButton);
                pagesNumberContainer.appendChild(page_number);
                pagesNumberContainer.appendChild(page_count);
                pagesNumberContainer.appendChild(nextButton);
                containerTable.appendChild(pagesNumberContainer);
                previousButton.addEventListener('click',(event) => handlePagination(event, "previous",tableID,limit,offset));
                nextButton.addEventListener('click',(event) => handlePagination(event, "next",tableID,limit, offset));
                       

      })
      .catch(error => {  
        console.error("Fetch error:", error);  
      });  
   
}
function handlePagination(event, direction,tableID,limit,offset) {

    var specification = event.target.id.replace(`btn-${direction}-`, '');
    var pageNumberElem = document.getElementById(`page-number-${specification}`);
    const pageCountElem = document.getElementById(`total-pages-${specification}`);
    var pc = parseInt(pageCountElem.textContent.replace('Of', ''));
    var pn = parseInt(pageNumberElem.textContent) + (direction === "next" ? 1 : -1);

    var displacement = document.getElementById(`displacement-options-${tableID}`).display=='none'?document.getElementById(`displacement-filter-${tableID}`).value:
    document.getElementById(`displacement-options-${tableID}`).value;
    var coolingType = document.getElementById(`cooling-type-options-${tableID}`).display=='none'?document.getElementById(`cooling-type-filter-${tableID}`).value:
    document.getElementById(`cooling-type-options-${tableID}`).value;
    var motorType = document.getElementById(`motor-type-options-${tableID}`).display=='none'?document.getElementById(`motor-type-filter-${tableID}`).value:
    document.getElementById(`motor-type-options-${tableID}`).value;
    var voltage = document.getElementById(`voltage-options-${tableID}`).display=='none'?document.getElementById(`voltage-filter-${tableID}`).value:
    document.getElementById(`voltage-options-${tableID}`).value;
    var coolingCapW = document.getElementById(`W-options-${tableID}`).display=='none'?document.getElementById(`W-filter-${tableID}`).value:
    document.getElementById(`W-options-${tableID}`).value;
    var coolingCapBTU = document.getElementById(`BTU/h-options-${tableID}`).display=='none'?document.getElementById(`BTU/h-filter-${tableID}`).value:
    document.getElementById(`BTU/h-options-${tableID}`).value;
    var coolingCapKcal = document.getElementById(`Kcal-options-${tableID}`).display=='none'?document.getElementById(`Kcal-filter-${tableID}`).value:
    document.getElementById(`Kcal-options-${tableID}`).value;
    var COPWW = document.getElementById(`W/W-options-${tableID}`).display=='none'?document.getElementById(`W/W-filter-${tableID}`).value:
    document.getElementById(`W/W-options-${tableID}`).value;
    var COPBTUWh = document.getElementById(`BTU/Wh-options-${tableID}`).display=='none'?document.getElementById(`BTU/Wh-filter-${tableID}`).value:
    document.getElementById(`BTU/Wh-options-${tableID}`).value;

    if (pn < 1 || pn > pc) {
        return; 
    }

    pageNumberElem.textContent = pn;
    offset = (pn - 1) * limit;

    var hash = location.hash;
    const params = new URLSearchParams(hash.substring(1).split('?')[1]);
    const productId = params.get('id');

    const searchParams = new URLSearchParams();
    searchParams.append('specification', tableID);
    searchParams.append('displacement', displacement);
    searchParams.append('coolingType', coolingType);
    searchParams.append('motorType', motorType);
    searchParams.append('volFreq', voltage);
    searchParams.append('coolingCapW', coolingCapW);
    searchParams.append('coolingCapBTU', coolingCapBTU);
    searchParams.append('coolingCapKcal', coolingCapKcal);
    searchParams.append('COPWW', COPWW);
    searchParams.append('COPBTUWh', COPBTUWh);
    searchParams.append('offset', offset);
    searchParams.append('limit', limit);

    var cachedData = JSON.parse(sessionStorage.getItem(`${specification}-${pn}`));

    if (cachedData) {
        const tbody = document.getElementById(specification).querySelector('tbody');
        tbody.innerHTML = cachedData.join(""); 
    } else {

        loadTablePage(specification, productId, searchParams, pn, pc);
    }
}


async function populateTable(models, tableID, pageNumber=1, count) {

    const table = document.getElementById(tableID);
    const tbody = table.querySelector('tbody') || table.appendChild(document.createElement('tbody'));

    const pageNumberElem = document.getElementById(`page-number-${tableID}`);
    const pageCountElem = document.getElementById(`total-pages-${tableID}`);

    if(pageNumberElem&&pageCountElem){
        pageNumberElem.textContent = pageNumber;
        pageCountElem.textContent = `Of ${count}`;
    }

    var rows  = new Array();

   await models.forEach(model => {
        const row = `<tr>
            <td>${model.model}</td>
            <td>${model.displacement}</td>
            <td>${model.coolingType}</td>
            <td>${model.motorType}</td>
            <td>${model.voltageFrequency}</td>
            <td>${model.coolingCapacityW}</td>
            <td>${model.coolingCapacityBTUPerHour}</td>
            <td>${model.coolingCapacityKcal}</td>
            <td>${model.copww}</td>
            <td>${model.copbtuPerWH}</td>
        </tr>`;
         rows.push(row);
    });
    
    for(let row of rows){
        tbody.innerHTML+=row;
    }
    return rows;

}

async function setFilterOptions( tableID,selectGroup, data) {  
    try {  
      

        function populateSelect(selectId, selectGroup,  options) {  
            const selectElement = document.getElementById(selectId);  
            selectElement.innerHTML = ''; // Clear existing options  

            const defaultOption = document.createElement('option');  
            defaultOption.value = '';  
            defaultOption.textContent = `${selectId.replace(`-${selectGroup}-${tableID}`, '').charAt(0).toUpperCase() + selectId.replace(`-${selectGroup}-${tableID}`, '').slice(1)}`;  
            defaultOption.textContent = defaultOption.textContent.replace('-',' ');
            if(defaultOption.textContent == 'Voltage'){
                defaultOption.textContent = 'Voltage / Frequency'
            }

            selectElement.appendChild(defaultOption);  

            // Populate select with options  
            options.forEach(optionValue => {  
                const option = document.createElement('option');  
                option.value = optionValue;  
                option.textContent = optionValue;  
                selectElement.appendChild(option);  
            });  
        }  

        
        populateSelect(`displacement-${selectGroup}-${tableID}`,selectGroup, data.Displacements);  
        populateSelect(`cooling-type-${selectGroup}-${tableID}`,selectGroup, data.CoolingTypes);  
        populateSelect(`motor-type-${selectGroup}-${tableID}`, selectGroup, data.MotorTypes);  
        populateSelect(`voltage-${selectGroup}-${tableID}`,selectGroup, data.VoltageFrequencies);  
        populateSelect(`W-${selectGroup}-${tableID}`,selectGroup, data.CoolingCapacitiesW);  
        populateSelect(`BTU/h-${selectGroup}-${tableID}`,selectGroup, data.CoolingCapacitiesBTU); 
        populateSelect(`Kcal-${selectGroup}-${tableID}`,selectGroup, data.CoolingCapacitiesKcal);  
        populateSelect(`W/W-${selectGroup}-${tableID}`,selectGroup, data.COPWW);  
        populateSelect(`BTU/Wh-${selectGroup}-${tableID}`, selectGroup, data.COPBTU);  

        // const modelInput = document.getElementById(`model-filter-input-${tableID}`);  
        // modelInput.addEventListener('input', function () {  
        //     const autocompleteList = document.getElementById(`model-autocomplete-list-${tableID}`);  
        //     autocompleteList.innerHTML = ''; // Clear previous entries  
        //     const inputValue = this.value.toLowerCase();  

        //     // Filter models based on input  
        //     const filteredModels = data.Models.filter(model => model.toLowerCase().includes(inputValue));  
        //     filteredModels.forEach(model => {  
        //         const item = document.createElement('div'); 
        //         item.classList.add('autocomplete-item'); 
        //         item.textContent = model;  
        //         item.onclick = () => {  
        //             modelInput.value = model; 
        //             autocompleteList.innerHTML = ''; 
        //         };  
        //         autocompleteList.appendChild(item);  
        //     });  
        // });  

    } catch (error) {  
        console.error('Error fetching the data:', error);  
    }  
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

    Displacement.value = '';
    CoolingType.value = '';
    MotorType.value = '';
    VolFreq.value = '';
    CoolingCapW.value = '';
    CoolingCapBTU.value = '';
    CopWW.value = '';
    Kcal.value = '';
    CopBTUWh.value = '';

    await filterTable(tableID);  

}

async function setSelectChangeEvents(tableID){
    const targetTable = document.getElementById(tableID);  
    const selectElements = targetTable.querySelectorAll('select');  

    for (let select of selectElements) {  
        select.addEventListener('change', async () => {  
            await filterTable( tableID);  
        });  
    }  

}

async function filterTable(tableID) {  
    const targetTable = document.getElementById(tableID);  
    var tableBody = targetTable.querySelector('tbody');
    var limit = 10;
   // const rows = targetTable.querySelectorAll('tbody tr'); 
    
    var displacement = document.getElementById(`displacement-options-${tableID}`).style.display==''?document.getElementById(`displacement-filter-${tableID}`).value:
    document.getElementById(`displacement-options-${tableID}`).value;
    var coolingType = document.getElementById(`cooling-type-options-${tableID}`).style.display==''?document.getElementById(`cooling-type-filter-${tableID}`).value:
    document.getElementById(`cooling-type-options-${tableID}`).value;
    var motorType = document.getElementById(`motor-type-options-${tableID}`).style.display==''?document.getElementById(`motor-type-filter-${tableID}`).value:
    document.getElementById(`motor-type-options-${tableID}`).value;
    var voltage = document.getElementById(`voltage-options-${tableID}`).style.display==''?document.getElementById(`voltage-filter-${tableID}`).value:
    document.getElementById(`voltage-options-${tableID}`).value;
    var coolingCapW = document.getElementById(`W-options-${tableID}`).style.display==''?document.getElementById(`W-filter-${tableID}`).value:
    document.getElementById(`W-options-${tableID}`).value;
    var coolingCapBTU = document.getElementById(`BTU/h-options-${tableID}`).style.display==''?document.getElementById(`BTU/h-filter-${tableID}`).value:
    document.getElementById(`BTU/h-options-${tableID}`).value;
    var coolingCapKcal = document.getElementById(`Kcal-options-${tableID}`).style.display==''?document.getElementById(`Kcal-filter-${tableID}`).value:
    document.getElementById(`Kcal-options-${tableID}`).value;
    var COPWW = document.getElementById(`W/W-options-${tableID}`).style.display==''?document.getElementById(`W/W-filter-${tableID}`).value:
    document.getElementById(`W/W-options-${tableID}`).value;
    var COPBTUWh = document.getElementById(`BTU/Wh-options-${tableID}`).style.display==''?document.getElementById(`BTU/Wh-filter-${tableID}`).value:
    document.getElementById(`BTU/Wh-options-${tableID}`).value;

    const params = new URLSearchParams();  
    params.append('specification', tableID);
    params.append('displacement', displacement);  
    params.append('coolingType', coolingType);  
    params.append('motorType', motorType);  
    params.append('volFreq', voltage);  
    params.append('coolingCapW', coolingCapW);  
    params.append('coolingCapBTU', coolingCapBTU);  
    params.append('coolingCapKcal', coolingCapKcal);  
    params.append('COPWW', COPWW);  
    params.append('COPBTUWh', COPBTUWh);  
    params.append('offset', 0);  
    params.append('limit', limit);  
    var hash = location.hash;
    const hash_params = new URLSearchParams(hash.substring(1).split('?')[1]); 
    const productId = hash_params.get('id');

    fetch(`${BASE_API_URL}/api/ProductModel/productModelsBySpecification/${productId}?${params.toString()}`)  
      .then(response => {  
        if (!response.ok) {  
          throw new Error(`HTTP error! status: ${response.status}`);  
        }  
        return response.json();  
      })  
      .then(async (data) =>{
           tableBody.innerHTML = '';
           await populateTable(data.models,tableID, 1, data.count);
      });

    // rows.forEach(row => {  
    //     const displacementCell = row.cells[1].textContent; 
    //     const coolingTypeCell = row.cells[2].textContent;  
    //     const motorTypeCell = row.cells[3].textContent;  
    //     const volFreqCell = row.cells[4].textContent;  
    //     const coolingCapWCell = row.cells[5].textContent;  
    //     const coolingCapBTUCell = row.cells[6].textContent;  
    //     const KcalCell  = row.cells[7].textContent; 
    //     const copWWCell = row.cells[8].textContent;  
    //     const copBTUWhCell = row.cells[9].textContent;  


    //     const displacementMatches = Displacement === '' || displacementCell === Displacement;  
    //     const coolingTypeMatches = CoolingType === '' || coolingTypeCell === CoolingType;  
    //     const motorTypeMatches = MotorType === '' || motorTypeCell === MotorType;  
    //     const volFreqMatches = VolFreq === '' || volFreqCell === VolFreq;  
    //     const coolingCapWMatches = CoolingCapW === '' || coolingCapWCell === CoolingCapW;  
    //     const coolingCapBTUMatches = CoolingCapBTU === '' || coolingCapBTUCell === CoolingCapBTU;  
    //     const copWWMatches = CopWW === '' || copWWCell === CopWW;  
    //     const copBTUWhMatches = CopBTUWh === '' || copBTUWhCell === CopBTUWh;  
    //     const KcalMatches = Kcal ===''|| KcalCell === Kcal;

 
    //     if ( 
    //         displacementMatches &&  
    //         coolingTypeMatches &&  
    //         motorTypeMatches &&  
    //         volFreqMatches &&  
    //         coolingCapWMatches &&  
    //         coolingCapBTUMatches &&  
    //         copWWMatches &&  
    //         KcalMatches &&
    //         copBTUWhMatches) {  
    //         row.style.display = ''; 
    //     } else {  
    //         row.style.display = 'none'; 
    //     }  
    // });  
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

async function loadTablePage(tableID, productId, params, pageNumber, pageCount)
{
    var tableRows;
    var requestURL = `${BASE_API_URL}/api/ProductModel/productModelsBySpecification/${productId}?${params.toString()}`;

    fetch(requestURL)  
    .then(response => {  
      if (!response.ok) {  
        throw new Error(`HTTP error! status: ${response.status}`);  
      }  
      return response.json();  
    })  
    .then(async (data) =>{
        const targetTable =  document.getElementById(tableID);  
        var tableBody = targetTable.querySelector('tbody');
         tableBody.innerHTML = '';
         tableRows =  await populateTable(data.models,tableID, pageNumber,pageCount);
         sessionStorage.setItem(`${tableID}-${pageNumber}`,JSON.stringify(tableRows));
    }).catch((error)=>{
        console.log(`Erro:${error.message}`);
    });
}

