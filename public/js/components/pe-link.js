'use strict'

//const { isLinearGradient } = require("html2canvas/dist/types/css/types/image");

$(document).ready(()=>{
    // const encryptWithAES = (text) => {
    //     const passphrase = "My Secret Passphrase";
    //     return CryptoJS.AES.encrypt(text, passphrase).toString();
    //   };
 

//    const encrypt = (data)=>{
//             var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
//             var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
//             //var a = "D";
//             //var hex_D = a.charCodeAt(0).toString(16);
//             //var binary_D = a.charCodeAt(0).toString(2);
//             //let data ="string to be encrypted"; 
//             var encrypted = CryptoJS.AES.encrypt(data, key, {iv:iv});
//             return encrypted;
//    }
    

let crypt = {
    // (B1) THE SECRET KEY
    secret : "CIPHERKEY",
   
    // (B2) ENCRYPT
    encrypt : function (clear) {
      var cipher = CryptoJS.AES.encrypt(clear, crypt.secret);
      cipher = cipher.toString();
      return cipher;
    },
   
    // (B3) DECRYPT
    decrypt : function (cipher) {
      var decipher = CryptoJS.AES.decrypt(cipher, crypt.secret);
      decipher = decipher.toString(CryptoJS.enc.Utf8);
      return decipher;
    }
  };
 
const decrypt = (data)=>{
    let cipher = crypt.decrypt(data);
    return cipher; 
}
   $('#go-to-pem').on('click',(e)=>{
       e.preventDefault();
       //c_token carries info about login and pwd
       let c_token = window.localStorage.getItem('c_token');
       c_token = decrypt(c_token);
     
       let url = ["http://127.0.0.1:8090/get-enc-data/",c_token].join('');
       $.getJSON(url, null, function(d){
           window.open(['http://127.0.0.1:8000/pem-direct/',d].join(''),'_blank'); 
       });
   })
});