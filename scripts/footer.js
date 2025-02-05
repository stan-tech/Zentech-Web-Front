const basefooterURL = "http://localhost:5033/api";
async function GetNewsFooterCategories(){

    const category_resp = await fetch(basefooterURL+"/News/CategoriesNews");
  
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
  
        categoryHTML.push(`<li><a href="company-news.html?category=${categ.categoryID}">${categ.name}</a></li>`);
  
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
  
        categoryHTML.push(`<li><a href="products.html#${categ.categoryID}">${categ.name}</a></li>`.trim());
  
    }
  
    return categoryHTML;
  }

class Zentech_footer extends HTMLElement {
    async connectedCallback() {
        const newsCategories = await GetNewsFooterCategories();
        const productCategories = await GetProductFooterCategories();
      this.innerHTML = `
   <footer class="footer">
    <div class="footer-column">
        <h4 data-key="product">Products</h4>
        <ul>
            <li><a href="#" data-key="compressor">Compressors</a></li>
           <!-- <li><a href="#">Accessories</a></li>
            <li><a href="#">Custom Solutions</a></li>
            <li><a href="#">Software Integration</a></li>-->
        </ul>
    </div>

    <div class="footer-column">
        <h4 data-key="solution">Solutions</h4>
       <ul>
            <li><a href="solution.html">Solution</a></li>
        </ul>
    </div>

    <div class="footer-column">
        <h4 data-key="service&support">Service & Support</h4>
        <ul>
        <li><a href="#" data-key="technicaldoc">Technical Documentation</a></li>
          <!--<li><a href="#">Maintenance Plans</a></li>
            <li><a href="#">Technical Documentation</a></li>
            <li><a href="#">Training Sessions</a></li>
            <li><a href="#">Troubleshooting</a></li>-->
        </ul>
    </div>

    <div class="footer-column">
        <h4 data-key="company">Company News</h4>
        <ul>
            <li><a href="#" data-key="Latest">Latest Announcements</a></li>
        </ul>
    </div>

    <div class="footer-column">
        <h4 data-key="contact">Contact Us</h4>
        <ul>
            <li><a href="contact-us.html" data-key="customer">Contact Us</a></li>
        </ul>
    </div>

    <!-- Contact Information on the Right -->
    <div class="footer-contact">
      <p><img src="./images/watch.svg"/ style="margin-right: 10px; font-weight: bold;"><strong data-key="date">Monday to Friday 8:30-17:30</strong></p>
      <p><img src="./images/phone.svg"/ style="margin-right: 6px; font-weight: bold;"> <strong data-key="tel">Business Consulting Telephone:</strong> <a href="tel:8607572280961">86-0757-2280961</a></p>
      <p><img src="./images/mail.svg"/ style="margin-right: 10px; font-weight: bold;"> <strong>Email:</strong> <a href="mailto:gmccweling@chinagmcc.com">gmccweling@chinagmcc.com</a></p>
        <p data-key="media">Official all-media account</p>
                <div class="social-icons">
                    <a href="https://www.facebook.com" target="_blank" aria-label="Facebook">
                      <img src="./images/icons/facebook.svg" style="margin-right: 2px;margin-bottom: 2px; height: 1rem; width: 1rem;">
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" aria-label="LinkedIn">
                        <img src="./images/icons/linkedin.svg" style="margin-right: 2px;margin-bottom: 2px; height: 1rem; width: 1rem;">                        
                    </a>
                </div>
    </div>
</footer>
      `;

      var categories = '';
    var productCats = '';

    for(var cat of newsCategories){
      categories+=cat;
    }

    for(var cat of productCategories){
      productCats+=cat;
    }

    
    this.innerHTML = this.innerHTML.replace(`<li><a href="#" data-key="Latest">Latest Announcements</a></li>`, 
      categories);
      this.innerHTML = this.innerHTML.replace('<li><a href="#" data-key="compressor">Compressors</a></li>',
        productCats);
    }
  
}
  // Define the custom element
  customElements.define('zentech-footer', Zentech_footer);