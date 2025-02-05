const API_BASE_URL = "https://localhost:44338";

export async function loadSolutionsData(){
    await GetSolutions();
}

async function GetSolutions() {
    try {
        const solutionsResponse = await fetch(`${API_BASE_URL}/api/Solutions`);
        if (!solutionsResponse.ok) {
            throw new Error(`Error fetching solutions: ${solutionsResponse.statusText}`);
        }

        const solutions = await solutionsResponse.json();
        const featuresSection = document.querySelector('.features-section');
        featuresSection.innerHTML = ''; 


        solutions.forEach(solution => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';

            const featureImage = document.createElement('img');
            featureImage.src = `${API_BASE_URL}${solution.mainPicture}`; // Adjusting to your image path
            featureImage.alt = `${solution.name} solution`;

            const featureItemContent = document.createElement('div');
            featureItemContent.className = 'feature-item-content';

            const featureTitle = document.createElement('h3');
            featureTitle.textContent = solution.name;


            const regex = /<p\s*[^>]*>(.*?)<\/p>/g;
            const paragraphs = [];
            let match;
            const supportedLength = 275;
            const normalizedContent = solution.description.replace(/\s+/g, ' ').trim();

            while ((match = regex.exec(normalizedContent)) !== null) {
                paragraphs.push(match[1]); 
            }
            const overview = paragraphs[0] || ''; 

            const featureDescription = document.createElement('p');
            

            if (overview.length > supportedLength) {
                let index = supportedLength;
    
                while (index > 0 && overview[index] !== ' ') {
                    index--;
                }

                try{
                    featureDescription.textContent = overview.substring(0, index) + '...';

                }catch{
                    featureDescription.textContent = overview;

                }
                featureDescription.setAttribute('data-key',overview.substring(0, index) + '...');
            } else {
                featureDescription.textContent = overview;
            }


            const learnMoreLink = document.createElement('a');
            learnMoreLink.href = `#solution details?id=${solution.solutionID}`;
            learnMoreLink.textContent = 'Learn More →';
            learnMoreLink.setAttribute('data-id', solution.solutionID);


            featureItemContent.appendChild(featureTitle);
            featureItemContent.appendChild(featureDescription);
            featureItemContent.appendChild(learnMoreLink);
            featureItem.appendChild(featureImage);
            featureItem.appendChild(featureItemContent);
            featuresSection.appendChild(featureItem);
        });
    } catch (error) {
        console.error('Error fetching and displaying solutions:', error);
    }
}