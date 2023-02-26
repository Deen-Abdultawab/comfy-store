import { getElement, displayHTML, store } from "./funtions.js";

const companyDOM = getElement('.company-btns');
const productsDOM = getElement('.products');
let newStore = [];

function companyFilter(){
    let companyBtns = ['all', ...new Set(store.map((storeItem)=>storeItem.company))];
    companyDOM.innerHTML = companyBtns.map((companyBtn)=>{
        return `
        <li class="company-btn">${companyBtn}</li>
        `
    }).join('');
    // console.log(newStore);

    companyDOM.addEventListener('click', (e)=>{
        let target = e.target;
        checkStore();
        if(target.classList.contains('company-btn')){
            if(target.textContent === 'all'){
                newStore = [...newStore];
            } else {
                newStore = newStore.filter((storeItem)=> storeItem.company === target.textContent);
                checkStore()
                newStore = newStore.filter((storeItem)=> storeItem.company === target.textContent);
                console.log(newStore);
                
                
            }
            
            productsDOM.innerHTML = `
                    ${displayHTML(newStore, productsDOM)}
                `;
        }  
    })
}

function checkStore(){
    if(newStore.length < 1){
        newStore = [...store];
    } else {
        newStore = [...newStore];
    }
}

// function filterStore(searchItem, comparision){
//     newStore = newStore.filter((storeItem)=> `${storeItem}.searchItem` === `${target}.${comparision}`);
// }

export {companyFilter}
