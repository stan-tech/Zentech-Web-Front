import CONFIG from './config.js';
window.addEventListener('load',GetService_SupportData);

async function GetService_SupportData(){

    const limit = 10; 
    const apiUrl = CONFIG.BASE_API_URL;
    const url = `${apiUrl}/api/TechnicalDoc/WithCategories/${limit}`;

    var resp = await fetch(url);
    if (!resp.ok) {
        console.log('Error: ' + resp.status);
        return;
    }

    var data = await resp.json();

    var Categories = [...new Set(data.map(c => c.tD_CategoryName))];
    var Docs = data.map(d => ({ name: d.name , filePath: d.filePath , ID: d.tD_ID, category: d.tD_CategoryName }));

    var container = document.querySelector('.container');
        container.innerHTML = '';

try{


    for(var category of Categories){

            var sectionElement = document.createElement('div');
                sectionElement.className = 'section-title';
            var sectionTitle = document.createElement('h1');
                sectionTitle.setAttribute('data-key',category);
                sectionTitle.textContent = category;

            var sectionLine = document.createElement('hr');
                sectionLine.className = 'horizontal-line';

                sectionElement.appendChild(sectionTitle);
                sectionElement.appendChild(sectionLine);

               
                 container.appendChild(sectionElement);
            

                var verticalSeperator = document.createElement('div');
                    verticalSeperator.className = 'vertical-separator';

                container.appendChild(verticalSeperator);

                var filteredDocs = Docs.filter(cat => cat.category == category);
                for(var doc of filteredDocs ){

                    var documentElement = document.createElement('div');
                        documentElement.className = 'document-item';
                    var icon = document.createElement('i');
                        icon.className = 'fas fa-file-pdf pdf-icon';

                     var line = document.createElement('div');
                        line.className = 'vertical-line';
                    var docLink = document.createElement('a');
                        docLink.className = 'document-link';
                        docLink.href = apiUrl+ doc.filePath;
                        docLink.innerHTML = doc.name;

                    documentElement.appendChild(icon);
                    documentElement.appendChild(line);
                    documentElement.appendChild(docLink);

                    container.appendChild(documentElement);


                }


    }
    
}catch(error){
            console.log('Error'+error);
}

}