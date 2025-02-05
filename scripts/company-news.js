const key = "FecoIT";
const baseUrl = 'http://192.168.0.194:5033';
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


export async function loadNewsData(){

    var catExists = await SetNavbar();
    
    
    if(catExists.length>0){

        var CategoryId = location.hash.substring(1).split('?')[1];
        
        if(CategoryId){
            CategoryId = CategoryId.replace('category=','');
        }else{
            CategoryId = null;
        }

        if(CategoryId!=null){
            
             await document.getElementById('news_cat'+CategoryId).click();

        }else{
            await document.getElementById('news_cat'+catExists[0].categoryID).click();
        }
          
    }
}


async function SetNavbar(){
    const category_resp = await fetch(API_BASE_URL+"/News/CategoriesNews");

    if(!category_resp.ok){

            console.log(`Error : 
                ${category_resp.status}`);
                return;
    }
    category_data = await category_resp.json();

    var categoryNav = document.getElementById('category-navbar'); 
    categoryNav.innerHTML = '';
    var  categoryHTML='';
    for(var categ of category_data){
        //var encodedID = CryptoJS.AES.encrypt(categ.categoryID.toString(), key).toString();
        var new_cat =  document.createElement(`a`);
        new_cat.href = `#company-news?category=${categ.categoryID}`;
        new_cat.id = `news_cat${categ.categoryID}`;
        new_cat.setAttribute('data-key',categ.name);
        new_cat.textContent = `${categ.name}`;

        categoryNav.appendChild(new_cat);

    }
    var linkItems = categoryNav.querySelectorAll('#category-navbar a');

    linkItems.forEach((link,index)=>{
            
        link.addEventListener('click',async function(){

            await GetNewsByCategoryID(link.id.replace('news_cat',''));
            linkItems.forEach(link=>link.classList.remove("selected"));
            document.getElementById(link.id).classList.add("selected");

        });

    });

return category_data;
}



async function GetNewsByCategoryID(category_id){
    

    var pictures=[];

    try{

        const resp = await fetch(API_BASE_URL+`/News/newsByCategory/${category_id}`);

        if(!resp.ok){
            console.log(`Error : 
                ${resp.status}`);

        }
        const data = await resp.json();

        const newsItems = document.querySelectorAll('.item');
        const grid = document.querySelectorAll('.grid')[0];
        if(grid){
                grid.innerHTML = '';
        }else{
            console.log("Erro with grid");
        }
    
        data.forEach((newsData, index) => {
            let newItem;
        
            if (index < newsItems.length) {
                newItem = newsItems[index].cloneNode(true);
            } else {
                newItem = newsItems[0].cloneNode(true);
            }
        
            var ID = newsData.newsID;
            newItem.id = `newsItem${ID}`;
 
            const newsTitle = newItem.querySelector('.news-text-element h1');
            if (newsTitle) {
                newsTitle.textContent = newsData.title;
                newsTitle.setAttribute('data-key',newsData.title);
            }
        
            const regex = /<p\s*[^>]*>(.*?)<\/p>/g;
            const paragraphs = [];
            let match;
            const normalizedContent = newsData.content.replace(/\s+/g, ' ').trim();

            while ((match = regex.exec(normalizedContent)) !== null) {
                paragraphs.push(match[1]); 
            }
        
            const newsParagraph = newItem.querySelector('.news-text-element p');
            const supportedLength = 275;
            if (newsParagraph) {
                const overview = paragraphs[0] || ''; 
        
                if (overview.length > supportedLength) {
                    let index = supportedLength;
        
                    while (index > 0 && overview[index] !== ' ') {
                        index--;
                    }

                    try{
                        newsParagraph.textContent = overview.substring(0, index) + '...';

                    }catch{
                        newsParagraph.textContent = overview;

                    }
                    newsParagraph.setAttribute('data-key',overview.substring(0, index) + '...');
                } else {
                    newsParagraph.textContent = overview;
                }
            }
        
            const newsImage = newItem.querySelector('.img-wrapper img');


            if (newsImage) {
                newsImage.src = baseUrl+newsData.mainPicture;
                      
                newsImage.alt = newsData.title || 'News Image'; 
                pictures.push(`url('${baseUrl}${newsData.mainPicture}'),${ID}`);

            }

            
            
            // newItem.addEventListener('click',function(){

            //      var encoded  = CryptoJS.AES.encrypt(newItem.id, key).toString(); 
            //      window.location.href = 'company-news-detail.html?id='+encodeURIComponent(encoded);
                    
            // });

            newItem.addEventListener('click', function() {  
                var newsId = newItem.id; 
                loadNewsDetails(newsId); 

            });  
            if (grid) {
                newItem.style.opacity = '0'; 
                newItem.style.transform = 'scale(0.9) translateX(10%)'; 

              

                
                grid.appendChild(newItem); 

                
       
                setTimeout(() => {
                    newItem.style.opacity = '1';
                    newItem.style.transform = 'scale(1) translateX(0%)';

                     if(data.length>1){


                        let index = Array.from(grid.children).indexOf(newItem);
                        if( index >= 1 && window.innerWidth > 768){
                            newItem.style.transform = 'scale(1) translateX(-6%)';
                        }
    
                    }
                    newItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; 
                }, 50);     
           }
        });
        

        for(var picture of  pictures){
            var id = picture.split(',')[1];
            const itemNode = document.getElementById('newsItem'+id);
            var backgroundStr = `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)),`+picture.split(',')[0];
            itemNode.style.background = backgroundStr;  
            itemNode.style.backgroundRepeat = 'no-repeat';  
            itemNode.style.backgroundSize = 'cover';
        }

    
    }catch(error){
        console.log('Error fetching data',error.message);
    
    }
     
}

function loadNewsDetails(newsId){
    var encodedID = encodeURIComponent(newsId);
    window.location.hash = `#company-news-detail?id=${encodedID}`;  

}

