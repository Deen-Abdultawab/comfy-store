import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"

import { companyFilter, priceFilter, searchFilter } from "../utils/filter.js"

import { getElement, allProductsUrl, fetchData, store, setUpStore, displayHTML, addToCart} from "../utils/funtions.js"

const companyDOM = getElement('.company-btns');
const productsDOM = getElement('.products');
const priceForm = getElement('.price-form');


async function init(){
    const data = await fetchData(allProductsUrl, productsDOM);
    setUpStore(data);
    productsDOM.innerHTML = `
        ${displayHTML(store, productsDOM)}
    `;

    priceFilter();
    companyFilter();
    searchFilter();
}



init();

if(companyDOM.classList.contains('active') || priceForm.classList.contains('active')){
    console.log('it contains');
} else {
    console.log('it contains not');
    // let eventPresent = companyDOM.addEventListener('click', addToCart);

    companyDOM.addEventListener('click', addToCart);
    
   
}