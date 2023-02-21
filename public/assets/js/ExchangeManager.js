"use strict";
let ExchangeManager = new function(){
    let mThis = this;
    this.currencies = {
        'USD':{
            'code':'USD',
            'name':'American Dollar',
            'symbol':'$'
        },
        'KHR':{
            'code':'KHR',
            'name':'Khmer Riel',
            'symbol':'៛'
        }
    }

    this.convert =(amount,fromCurrency, toCurrency,date=null)=>{
      return amount;
    }

}