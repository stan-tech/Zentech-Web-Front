const Prod_API_BASE_URL = "https://localhost:44338"; // API Base URL

// Extract product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

console.log("Paramètre ID récupéré :", productId);

if (productId) {


    // Add a loading spinner or skeleton loader to prevent UI deformation
    document.getElementById("productTitle").textContent = "Chargement...";
    document.getElementById("productDescription").textContent = "Chargement de la description...";
    const specList = document.getElementById("productSpecifications");
    specList.innerHTML = "<li class='spec-item'>Chargement des spécifications...</li>";
    const mainImage = document.getElementById("mainImage");
    mainImage.src = "./images/zentech-logo.svg"; 
    mainImage.alt = "Chargement...";

    fetch(`${Prod_API_BASE_URL}/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération du produit : ${response.statusText}`);
            }
            return response.json();
        })
        .then(product => {
            console.log("Données du produit récupérées :", product);

            // Update main image
            mainImage.src = `${Prod_API_BASE_URL}${product.photos[0]}`;
            mainImage.alt = product.name;

            // Update image gallery
            const imageGallery = document.getElementById("imageGallery");
            imageGallery.innerHTML = ""; // Clear previous content
            product.photos.forEach(photo => {
                const imgElement = document.createElement("img");
                imgElement.className= 'image-gallery img';
                imgElement.src = `${Prod_API_BASE_URL}${photo}`;
                imgElement.alt = product.name;
                imgElement.onclick = () => {
                
                    mainImage.src = imgElement.src;

                };
                imageGallery.appendChild(imgElement);
            });

            // Update product title and description
            document.getElementById("productTitle").textContent = product.name;
            document.getElementById("productDescription").textContent = product.description;
            document.getElementById("productDescription").setAttribute('data-key',product.description);


            // Update specifications
            if (product.specifications && product.specifications.length > 0) {
                specList.innerHTML = ""; // Clear placeholders
                product.specifications.forEach(spec => {
                    const listItem = document.createElement("li");
                    listItem.classList.add("spec-item");

                    const keyElement = document.createElement("span");
                    keyElement.classList.add("spec-key");
                    keyElement.textContent = `${spec.key} `;
                    keyElement.setAttribute('data-key',spec.key);

                    var  valueElement;
                    if(spec.value!=''){
                        valueElement = document.createElement("span");
                        valueElement.classList.add("spec-value");
                        valueElement.textContent = spec.value;
                        valueElement.setAttribute('data-key',spec.value);
    
                        valueElement.style.display = "none";
                    }
                 

                    listItem.onclick = () => {

                        const isVisible = valueElement.style.display === "block";
                        valueElement.style.display = isVisible ? "none" : "block";
                        listItem.scrollIntoView({ behavior: "smooth", block: "center" });
                    };

                    listItem.appendChild(keyElement);
                    if(valueElement){
                        listItem.appendChild(valueElement);
                    }
                    specList.appendChild(listItem);
                });
            } else {
                specList.innerHTML = "<li>Aucune spécification disponible.</li>";
            }

            SetSepcificationScrollButtons();
        })
        .catch(error => {
            console.error("Erreur lors de la récupération des données :", error);
            document.querySelector(".product-section").innerHTML = "<p>Erreur : Produit non trouvé.</p>";
        });
} else {
    console.error("Aucun ID de produit fourni.");
    document.querySelector(".product-section").innerHTML = "<p>Erreur : Aucun produit spécifié.</p>";
}

async function SetSepcificationScrollButtons() {
 
    //const wrapper  = document.querySelector('product-details-wrapper'); 
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



