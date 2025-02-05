const API_BASE_URL = "https://localhost:44338/api";

function toggleMenu() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.toggle("visible");
}
function redirectToHome(){
  window.location.href = 'zentech.html';
}
function redirectToSignIn(){
  window.location.href = 'sign-in.html';
}

async function GetNewsCategories(){

  const category_resp = await fetch(API_BASE_URL+"/News/CategoriesNews");

  if(!category_resp.ok){
      console.log(`Error : 
          ${category_resp.status}`);
              return;
  }
  category_data = await category_resp.json();
  var  categoryHTML=[];
  for(var categ of category_data){

      categoryHTML.push(`<a href="#company-news?category=${categ.categoryID}" id="hn_${categ.categoryID}" data-key="${categ.name}">${categ.name}</a>`);

  }

  return categoryHTML;
}

async function GetProductCategories(){

  const resp = await fetch(API_BASE_URL+"/Category/main");

  if(!resp.ok){
      console.log(`Error : 
          ${resp.status}`);
          console.log(`Error : 
              ${resp.status}`);
              return;
  }
  data = await resp.json();
  var  categoryHTML=[];
  for(var categ of data){

      categoryHTML.push(`<a href="#products?main=${categ.categoryID}"  id="hp_${categ.categoryID}" data-key="${categ.name}">${categ.name}</a>`);

  }

  return categoryHTML;
}


  window.addEventListener('load',async ()=>{

    const newsCategories = await GetNewsCategories();
    const productCategories = await GetProductCategories();
    const footer_newsCategories = await GetNewsFooterCategories();
    const footer_productCategories = await GetProductFooterCategories();

    const  sign_in = document.getElementsByClassName('sign-in')[0];
    sign_in.addEventListener('click',()=>{

      window.location.hash = "#sign-in";

    }); 


    var prod_cats_element = document.getElementById('product-categories');
    var news_cats_element  = document.getElementById('news-categories');
    var f_prod_cats_element = document.getElementById('footer-product-categories');
    var f_news_cats_element  = document.getElementById('footer-news-categories');

    var header_categories = '';
    var header_productCats = '';

    var footer_categories = '';
    var footer_productCats = '';

    for(var cat of footer_newsCategories){
      footer_categories+=cat;
    }

    for(var cat of footer_productCategories){
      footer_productCats+=cat;
    }

    for(var cat of newsCategories){
      header_categories+=cat;
    }

    for(var cat of productCategories){
      header_productCats+=cat;
    }

    
    news_cats_element.innerHTML = header_categories;
      prod_cats_element.innerHTML = header_productCats;

        f_news_cats_element.innerHTML = footer_categories;
      f_prod_cats_element.innerHTML = footer_productCats;

  });


  async function GetNewsFooterCategories(){

    const category_resp = await fetch(API_BASE_URL+"/News/CategoriesNews");
  
    if(!category_resp.ok){
        console.log(`Error : 
            ${resp.status}`);
            console.log(`Error : 
                ${category_resp.status}`);
                return;
    }
    category_data = await category_resp.json();
    var  categoryHTML=[];
    for(var categ of category_data){
  
        categoryHTML.push(`<li><a href="#company-news?category=${categ.categoryID}" id="fn_${categ.categoryID}">${categ.name}</a></li>`);
  
    }
  
    return categoryHTML;

  }
  async function GetProductFooterCategories(){

    const resp = await fetch(API_BASE_URL+"/Category/main");
  
    if(!resp.ok){
        console.log(`Error : 
            ${resp.status}`);
            console.log(`Error : 
                ${resp.status}`);
                return;
    }
    data = await resp.json();
    var  categoryHTML=[];
    for(var categ of data){
  
        categoryHTML.push(`<li><a href="#products?main=${categ.categoryID}" id="fp_${categ.categoryID}">${categ.name}</a></li>`.trim());
  
    }
  
    return categoryHTML;
  }

  async function fetchContent(page,category) {
      

    fetch(`/${page}?category=${category}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
        return response.text();
      })
      .then(data => {

        document.getElementById('content').innerHTML = data;

        
      })
      .catch(error => {
        console.error('Error fetching content:', error);
      });

      var loadData;
      switch(page){
        case 'products.html':
          loadData = await import('./productsApi.js');
          loadData.loadProductsData();
          break;
          case 'company-news.html':
            loadData = await import('./company-news.js');
            loadData.loadNewsData();
            break;
      }
  }


