import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"


import { getElement, allProductsUrl, fetchData, store, setUpStore, displayHTML} from "../utils/funtions.js";

// selections
const featuredProductsDom = getElement('.featured-product-center');


async function init (){
    const data = await fetchData(allProductsUrl, featuredProductsDom);
    setUpStore(data);
    const featuredProducts = store.filter((product) => product.featured === true);
    

    featuredProductsDom.innerHTML = `
    <div class="single-product-container">
        ${displayHTML(featuredProducts, featuredProductsDom)}
    </div>
    `

    
}

window.addEventListener('DOMContentLoaded', init);






