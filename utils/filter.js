import { getElement, displayHTML, store } from "./funtions.js";

const companyDOM = getElement('.company-btns');
const productsDOM = getElement('.products');
const priceForm = getElement('.price-form');
const priceInput = getElement('.price-filter');
const priceValueDOM = getElement('.price-value');
const searchForm = getElement('.input-form');
const searchInput = getElement('.search-input');
let newStore = [];
let target;

function priceFilter(){

    let maxPrice = store.map((product) => product.price);
    maxPrice = Math.max(...maxPrice);
    maxPrice = Math.ceil(maxPrice / 100);
    priceInput.value = maxPrice;
    priceInput.max = maxPrice;
    priceInput.min = 0;
    priceValueDOM.textContent = `Value : $${maxPrice}`;


    priceForm.addEventListener('input', ()=>{
        if(!priceForm.classList.contains('active')){
            priceForm.classList.add('active');
        }
        
        const value = Number(priceInput.value);
        priceValueDOM.textContent = `Value : $${value}`;
        
        newStore = [...store];
        newStore = newStore.filter((storeItem)=> storeItem.price / 100 <= value);
        checkFilter();
        if(newStore.length < 1){
            checkStore();
            newStore = newStore.filter((storeItem)=> storeItem.price / 100 <= value);
        }
        productsDOM.innerHTML = `
                    ${displayHTML(newStore, productsDOM, true)}
                `;

        if(newStore.length < 1){
            productsDOM.innerHTML = `
            <div class="section-loading">
                <h3>Sorry, There was no result for this search.....</h3>
            </div>
            
            `
        }

    })
}

function companyFilter(){
    let companyBtns = ['all', ...new Set(store.map((storeItem)=>storeItem.company))];
    companyDOM.innerHTML = companyBtns.map((companyBtn)=>{
        return `
        <li class="company-btn">${companyBtn}</li>
        `
    }).join('');

    companyDOM.addEventListener('click', (e)=>{
        target = e.target;
        newStore = [...store]; 
        if(target.classList.contains('company-btn')){
            if(!companyDOM.classList.contains('active')){
                companyDOM.classList.add('active');
            }
            if(target.textContent === 'all'){
                let maxPrice = store.map((product) => product.price);
                maxPrice = Math.max(...maxPrice);
                maxPrice = Math.ceil(maxPrice / 100);
                priceInput.value = maxPrice;
                priceInput.max = maxPrice;
                priceInput.min = 0;
                priceValueDOM.textContent = `Value : $${maxPrice}`;
                searchInput.value = '';


                newStore = [...store]; 
                console.log(newStore);
                
            } else {
                filterCompany(target);
                checkFilter();                
            }
            
            productsDOM.innerHTML = `
                    ${displayHTML(newStore, productsDOM, true)}
                `;

            if(newStore.length < 1){
                productsDOM.innerHTML = `
                <div class="section-loading">
                    <h3>Sorry, There was no result for this search.....</h3>
                </div>
                
                `
            }
        }  
    })
}

function searchFilter(){
    searchForm.addEventListener('input', ()=>{
        const inputValue = searchInput.value;
        newStore = [...store]; 
        if(inputValue){
            newStore = newStore.filter((storeItem)=> {
                let {name} = storeItem;
                name = name.toLowerCase();
                if(name.startsWith(inputValue)){
                    return storeItem;
                }
            });
            checkFilter();
            if(newStore.length < 1){
                checkStore();
                newStore = newStore.filter((storeItem)=> {
                    let {name} = storeItem;
                    name = name.toLowerCase();
                    if(name.startsWith(inputValue)){
                        return storeItem;
                    }
                });

            }

            console.log(newStore);
            productsDOM.innerHTML = `
            ${displayHTML(newStore, productsDOM, true)}
            `;

            if(newStore.length < 1){
                productsDOM.innerHTML = `
                <div class="section-loading">
                    <h3>Sorry, There was no result for this search.....</h3>
                </div>
                
                `
            }
        } else {
            let maxPrice = store.map((product) => product.price);
            maxPrice = Math.max(...maxPrice);
            maxPrice = Math.ceil(maxPrice / 100);
            priceInput.value = maxPrice;
            priceInput.max = maxPrice;
            priceInput.min = 0;
            priceValueDOM.textContent = `Value : $${maxPrice}`;


            productsDOM.innerHTML = `
            ${displayHTML(store, productsDOM, true)}
            `;
        }
    })

}

function checkFilter(){
    if(searchInput.value){
        const inputValue = searchInput.value;
        newStore = newStore.filter((storeItem)=> {
            let {name} = storeItem;
            name = name.toLowerCase();
            if(name.startsWith(inputValue)){
                return storeItem;
            }
        }); 
        console.log('search')
    };
    if(companyDOM.classList.contains('active')){
        newStore = newStore.filter((storeItem)=> storeItem.company === target.textContent);
        console.log('company')
    };

    if(priceForm.classList.contains('active')){
        const value = Number(priceInput.value);
        newStore = newStore.filter((storeItem)=> storeItem.price / 100 <= value);
        console.log('price')
    }
    
}

function checkStore(){
    if(newStore.length < 1){
        newStore = [...store];
    } else {
        newStore = [...newStore];
    }
}

function filterCompany(target){
    newStore = newStore.filter((storeItem)=> storeItem.company === target.textContent);
}

export {companyFilter, priceFilter, searchFilter}
