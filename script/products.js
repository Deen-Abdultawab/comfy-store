import "../script/cartToggle.js"
import "../script/navToggle.js"
import "../utils/setUpCart.js"

import { companyFilter } from "../utils/filter.js"

import { getElement, allProductsUrl, fetchData, store, setUpStore, displayHTML} from "../utils/funtions.js"

const productsDOM = getElement('.products');

async function init(){
    const data = await fetchData(allProductsUrl, productsDOM);
    setUpStore(data);
    productsDOM.innerHTML = `
        ${displayHTML(store, productsDOM)}
    `;

    companyFilter();
}

init();