// window.onload = function () {
//     const interval = setInterval(() => {
//         const select = document.querySelector('#language-selector');
//         if (select) {
//             clearInterval(interval); 
//             select.addEventListener('change', function () {
//                 TranslatePage(select.value);
//             });
//         }
//     }, 100); 
// };

// async function TranslatePage(language) {
//     const elements = document.querySelectorAll("[data-key]");

//     for (const element of elements) {
//         const textToTranslate = element.textContent.trim();
//         try {
//             const translatedText = await TranslateText(textToTranslate, language); 
//             element.textContent = translatedText;
//         } catch (error) {
//             console.error("Error translating text:", error);
//         }
//     }
// }

// async function TranslateText(text, target) {
//     try {
//         const response = await fetch("http://localhost:8000/translate", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//                 text: text, 
//                 to: target  
//             })
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         return (data.translatedText === 'Maison')?'Acceuil':data.translatedText; 
//     } catch (error) {
//         console.error("Error translating text:", error);
//         return text; 
//     }
// }


export async function TranslateContent(){


        const lang = sessionStorage.getItem('language');
        const loadingOverlay = document.createElement("div");
        loadingOverlay.id = "loading-overlay";
        loadingOverlay.innerHTML = `
            <div class="loading-animation">
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
                <div class="loading-dot"></div>
            </div>
        `;
        var mainContainer = document.getElementById('content');
        mainContainer.appendChild(loadingOverlay);
       
        const interval = setInterval(async () => {
            const select = document.querySelector('#language-selector');
            if (select) {
    
                clearInterval(interval);
    
                try {
                    await TranslatePage((lang)?lang:select.value);
                } catch (error) {
                    console.error("Error during initial translation:", error);
                } finally {
                    mainContainer.removeChild(loadingOverlay);
                }
    
                select.addEventListener('change', async function () {
    
                    mainContainer.appendChild(loadingOverlay);
                    try {
                        await TranslatePage(select.value);
                        sessionStorage.setItem('language',select.value)
                    } catch (error) {
                        console.error("Error during translation:", error);
                    } finally {
                        mainContainer.removeChild(loadingOverlay);
                    }
                });
            }
        }, 1000); 

    TranslatePage(lang);
}


async function TranslatePage(language) {
    document.getElementById('language-selector').value=language;
    const elements = document.querySelectorAll("[data-key]");
    const placeHolderElements = document.querySelectorAll("[data-placeholder-key]");

    const translations = [];

    for (const element of elements) {
        const textToTranslate = element.textContent.trim();
        translations.push(
            TranslateText(textToTranslate, language)
                .then((translatedText) => {
                    element.textContent = translatedText;
                })
                .catch((error) => {
                    console.error("Error translating text:", error);
                })
        );
    }

    if(placeHolderElements.length>0){
        for (const element of placeHolderElements) {
            const textToTranslate = element.getAttribute("placeholder");
            translations.push(
                TranslateText(textToTranslate, language)
                    .then((translatedText) => {
                        element.placeholder = translatedText;
                    })
                    .catch((error) => {
                        console.error("Error translating text:", error);
                    })
            );
        }
    }

    await Promise.all(translations);
}

async function TranslateText(text, targetLanguage, sourceLanguage = "auto") {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();


        var translatedText = data[0][0][0];
        text = text.toLowerCase();

        switch(text){
            case 'acceuil': 
            
            translatedText = 'Home';
                break;
                case 'home': 
                if(targetLanguage=='fr')
            translatedText = 'Acceuil';
                break;
            case 'documentation technique':
                translatedText = 'Technical Documentation';
                break;
            case 'service et support':
                translatedText = 'Service & Support';
                break;

            case 'recherche...':
                    translatedText = 'Search...';
                    break;
            case 'welcome':
                translatedText = 'Bienvenue';
                break;
            case 'request credentials':
                translatedText = 'Demander des identifiants';
                break;
            case "nouvelles de l'entreprise":
                if(targetLanguage=='en')
                    translatedText = 'Company news';
                break;
            case "se connecter":
                if(targetLanguage=='en')
                    translatedText = 'Sign in';
                break;
        }
        return translatedText;
    } catch (error) {
         console.error("Error during translation:", error);
        return text; 
    }
}


