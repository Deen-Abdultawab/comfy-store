const allProductsUrl = 'https://course-api.com/javascript-store-products'

// 'https://course-api.com/javascript-store-single-product?id=rec43w3ipXvP28vog'

const singleProductUrl =
  'https://course-api.com/javascript-store-single-product'

  let store = [];

  function getElement(selection){
    const element = document.querySelector(selection);
    if(element){
        return element
    } else {
        throw new Error(`Please check ${selection} selector, no such element exist`)
    }
}

async function fetchData(source, displayDom){
    displayDom.innerHTML = `
    <div class="section-loading">
        <h3>Loading.....</h3>
    </div>`
    try {
        const response = await fetch(source);
        if(response.status >=200 && response.status <= 299){
            const data = await response.json();
            console.log(data);
            return data;
            
        } else {
            displayDom.innerHTML = `
            <div class=" error">
                <h3>Sorry something went wrong.....</h3>
            </div>
            <a href="index.html" class="btn">Back</a>
            `
        }
        
    } catch (error) {
        displayDom.innerHTML = `
            <div class="section-loading">
                <h3>Sorry, There was an error.....</h3>
            </div>
            `
    }
}

function setUpStore(products){
    store = products.map((product)=> {
        const {id, fields:{featured, company, name, price, image:img},} = product;
        const imageSrc = img[0].thumbnails.large.url;

        return {
            id, 
            featured, 
            company, 
            name, 
            price, 
            imageSrc
        }
    });
}

function formatPrice(price) {
    let formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format((price / 100).toFixed(2))
    return formattedPrice
  }

  function displayHTML(products, element){
    const productHTML = products.map((product) => {

        const {id, name, price, imageSrc} = product
        
        return `
        <article class="single-product">
        <div class="top">
            <img src="${imageSrc}" alt="${name}" class="product-img">
            <div class="product-icons">
                <a href="product.html?id=${id}" class="product-icon">
                    <i class="fas fa-search"></i>
                </a>
                <button class="product-cart-btn product-icon" data-id="${id}">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
        
        <div class="footer">
            <h3 class="product-name">${name}</h3>
            <p class="product-price">${formatPrice(price)}</p>
        </div>
    </article>
        `
    }).join('');

    element.addEventListener('click', (e)=>{
        const parent = e.target.parentElement;
        if(parent.classList.contains('product-cart-btn') || e.target.classList.contains('product-cart-btn')){
            console.log(`it works`);
        }
    })

    return productHTML;
   
}

export {getElement, fetchData, allProductsUrl, singleProductUrl, setUpStore, formatPrice, store, displayHTML}