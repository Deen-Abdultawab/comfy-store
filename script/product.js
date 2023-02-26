import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"

import { getElement, fetchData, singleProductUrl, formatPrice} from "../utils/funtions.js"

const singleProductDOM = getElement('.single-product-container') ;
const pageHeader = getElement('.page-header');

async function init (){
    const params = new URLSearchParams(window.location.search);
    const singleID = params.get('id');

    const data = await fetchData(`${singleProductUrl}?id=${singleID}`, singleProductDOM);

    // image, name, company, price, colors, desc

    const {id, fields:{name, company, price, colors, description:desc, image},} = data;

    const imageSrc = image[0].thumbnails.large.url;

    document.title = `Comfy Store || ${name.toUpperCase()}`
    pageHeader.innerHTML = `<h1>Home / ${name}</h1>`;

    const productColors = colors.map((color)=> {
        return `<span class="product-color" style="background-color: ${color};"></span>`
        
    }).join(' ');

    console.log(productColors)

    console.log(imageSrc, name, company, price, colors, desc, id)

    
    singleProductDOM.innerHTML = `

    <div>
        <img src="${imageSrc}" alt="${name}" class="single-product-img">
    </div>
    <div class="product-info">
        <h1 class="title ">${name}</h1>
        <h2 class="slanted-text product-company">By ${company}</h2>
        <h3 class="product-price">${formatPrice(price)}</h3>

        <div class="product-color-container">
            ${productColors}
        </div>

        <p class="product-desc">
            ${desc}
        </p>

        <button class="btn addToCartBtn" data="${id}">
            add to cart
        </button>
    
    `
    
}

init();