import { displayCartItemCount,  displayCartTotalCost ,displayCartItemsDOM, cart, setUpCartFunctionality} from "./funtions.js";

function init(){
    displayCartItemCount();
    displayCartTotalCost();
    displayCartItemsDOM();
    setUpCartFunctionality();
}

if(cart.length > 0){
    init();
}




