const BASE_API_URL = 'https://localhost:44338';

/* async function fetchAndDisplayProductsByCategory() {
    const API_BASE_URL = "http://localhost:5033/api";
    try {
        const categoriesResponse = await fetch(`${API_BASE_URL}/Category`);
        if (!categoriesResponse.ok) {
            throw new Error(`Erreur lors de la récupération des catégories : ${categoriesResponse.statusText}`);
        }
        const categories = await categoriesResponse.json();

        const productsResponse = await fetch(`${API_BASE_URL}/products`);
        if (!productsResponse.ok) {
            throw new Error(`Erreur lors de la récupération des produits : ${productsResponse.statusText}`);
        }
        const products = await productsResponse.json();

        const categoryElements = document.querySelectorAll('.category');
        categoryElements.forEach((categoryElement, index) => {
            const categoryName = categoryElement.querySelector('h2').textContent.trim();
            const category = categories.find(cat => cat.name === categoryName);

            if (category) {
                const categoryProducts = products.filter(
                    product => product.categoryID === category.categoryID
                );

                const productElements = categoryElement.querySelectorAll('.product');
                categoryProducts.forEach((product, idx) => {
                    if (productElements[idx]) {
                        const productElement = productElements[idx];
                        const img = productElement.querySelector('img');
                        const link = productElement.querySelector('a');
                        const name = productElement.querySelector('p');

                        img.src = `http://localhost:5033${product.photos[0]}`;
                        img.alt = product.name;
                        name.textContent = product.name;
                        link.href = `product-details.html?id=${product.productID}`;
                    }
                });
            }
        });

    } catch (error) {
        console.error(error);
    }
}
 */

export async function loadProductsData(){
    await GetProductsWithCategories();
}

document.addEventListener('DOMContentLoaded', GetProductsWithCategories);

async function GetProductsWithCategories(){
    const limit = 15;
    try{

        const resp = await fetch(`${API_BASE_URL}/Products/ByCategories/${limit}`);

        if (!resp.ok){
            console.log('Error with response: '+resp.status);
            return ;

        }

        var products_container = document.getElementById('products-container');
        products_container.innerHTML = '';

        var data = await resp.json();

        var MainCategories = 
        [
            ...data.reduce((map, c) => {
                const key = `${c.mainCategoryName}-${c.mainCategoryID}`;
                if (!map.has(key)) {
                    map.set(key, {name: c.mainCategoryName, id: c.mainCategoryID });
                }
                return map;
            }, new Map()).values()
        ];
        const SubCategories = [
            ...data.reduce((map, c) => {
                const key = `${c.categoryName}-${c.mainCategoryName}`;
                if (!map.has(key)) {
                    map.set(key, { name: c.categoryName, mainCategoryName: c.mainCategoryName });
                }
                return map;
            }, new Map()).values()
        ];

        var Products = data.map(p => ({ photos: p.photos , name: p.name , ID: p.productID, mainCategoryName:p.mainCategoryName, subCategoryName:p.categoryName}));

        for(var mainCategory of MainCategories){

            
            var mainElement = document.createElement('section');
            mainElement.id = 'mpc_'+mainCategory.id;

            var sectionTitle = document.createElement('div');
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = mainCategory.name;
            sectionTitle.setAttribute('data-key',mainCategory.name);

            mainElement.appendChild(sectionTitle);
            products_container.appendChild(mainElement);
            var productsList;

            for(var subCategory of SubCategories){
  
                if(subCategory.mainCategoryName == mainCategory.name){

                    productsList =  await fillProducts(mainElement,mainCategory.name,subCategory,Products);
                   
                }

            }

            const productElements = (productsList)? productsList.querySelectorAll('.product'):[];
            if (productElements.length > 0) {
                const totalWidth = (21 * 4)+1.5; 
                productsWrapper.style.width = `${totalWidth}rem`;
            }
          

        }

        const productWrappers = document.querySelectorAll('.products-wrapper');

        productWrappers.forEach(wrapper => {
            const leftButton = wrapper.querySelector('.scroll-left');
            const rightButton = wrapper.querySelector('.scroll-right');
            const products = wrapper.querySelector('.products');
    
            if (!products || !products.children.length) {
                console.warn("No products found in the wrapper.");
                return;
            }
    
            var productWidth = getElementWidth(products.children[0]);

            var numElements = getVisibleElementCount(products); 


            window.addEventListener('resize',()=>{


             productWidth = getElementWidth(products.children[0]);

             numElements = getVisibleElementCount(products); 

             scrollAmount = productWidth * numElements;


            });
        
            var scrollAmount = productWidth * numElements;

    
            if (leftButton) {
                leftButton.addEventListener('click', function () {
                    products.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                });
            }
    
            if (rightButton) {
                rightButton.addEventListener('click', function () {
                    products.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                });
            }
        });


    }catch(error){
        console.log('Error ferching GetProductsWithCategories: '+error.message);
    }
}

async function fillProducts(mainElement,mainCategory,subCategory,Products){

        


    var categoryElement = document.createElement('div');
    categoryElement.className = 'category';

    var categorTitle = document.createElement('h1');
    categorTitle.setAttribute('data-key',subCategory.name);

    categorTitle.innerHTML = subCategory.name;
    categoryElement.appendChild(categorTitle);

    mainElement.appendChild(categoryElement);

    var productsWrapper = document.createElement('div');
    productsWrapper.className= 'products-wrapper';

    var scrollLeft = document.createElement('button');
    var scrollRight = document.createElement('button');

    var productsList = document.createElement('div');
    productsList.className = 'products';


    scrollLeft.className = 'scroll-left';
    scrollRight.className =  'scroll-right';

    productsWrapper.appendChild(scrollLeft);



    for(var product of Products){
        
        if(product.mainCategoryName == mainCategory && product.subCategoryName == subCategory.name){

            var productElement = document.createElement('div');
            var  productLink = document.createElement('a');
            var  productImage = document.createElement('img');
            var productName = document.createElement('p');

            productElement.className='product';
            productLink.href =`#product-details?id=${product.ID}`;
            productImage.src =  `${BASE_API_URL}${product.photos[0]}`;
            productLink.appendChild(productImage);
            productName.textContent = product.name;

            productElement.appendChild(productLink);
            productElement.appendChild(productName);
            
            productsList.appendChild(productElement);
        }

      

    }

    if(productsList.children.length<=4){
        productsList.style.justifyContent = 'center'; 
        scrollLeft.style.display = 'none';
        scrollRight.style.display='none';
    }else{
        productsList.style.justifyContent = 'flex-start'; 

    }

    productsWrapper.appendChild(productsList);
    productsWrapper.appendChild(scrollRight);

    

    mainElement.appendChild(productsWrapper);

}

function getElementWidth(element) {
    const computedStyle = getComputedStyle(element);
    const width = element.getBoundingClientRect().width;
    return width + parseFloat(computedStyle.marginLeft) + 5;
}

function getVisibleElementCount(container) {
    const containerWidth = container.getBoundingClientRect().width;
    if (container.children.length > 0) {
        const elementWidth = getElementWidth(container.children[0]);
        return Math.floor(containerWidth / elementWidth);
    }
    return 0;
}