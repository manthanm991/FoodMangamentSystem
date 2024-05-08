module.exports = function Cart(oldCart){
    this.item = oldCart.item || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(item,id){
        var storedItem = this.item[id];
        if(!storedItem){
            storedItem = this.item[id]={item:item, quantity: 0, price: 0}
        }
        storedItem.quantity++;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQuantity++;
        this.totalPrice += storedItem.price;
    }

    this.generateArray = function(){
        var arr =[];
        for(var id in this.item){
            arr.push(this.item[id]);
        }
        return arr;
    };
    this.addGST = function(gstRate) {
        var gstAmount = (this.totalPrice * gstRate) / 100;
        this.totalPrice += gstAmount;
    };
};