

export async function GetNewsById(id){

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