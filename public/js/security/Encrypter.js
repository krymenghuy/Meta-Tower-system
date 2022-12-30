 /**This script depends on javascript library "crypto-js.js" **/
let Encrypter = new function(){
    // this.encrypt1 = (passphrase, text)=>{
    //       //var text = 'US0378331005-USD-US-en';
    //       let key = null; //'11A1764225B11AA1'; //cannot be NULL

    //       // Fix: Use the Utf8 encoder
    //       text = CryptoJS.enc.Utf8.parse(text); 
    //       // Fix: Use the Utf8 encoder (or apply in combination with the hex encoder a 32 hex digit key for AES-128)
    //       key = CryptoJS.enc.Utf8.parse(passphrase); 

    //       // Fix: Apply padding (e.g. Zero padding). Note that PKCS#7 padding is more reliable and that ECB is insecure
    //       let encrypted = CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding }); 
    //       encrypted = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
    //       return encrypted;
    // };
  
      
    // this.Hex2Bin = (n)=>{
    //   if(!checkHex(n)) return 0;
    //   return parseInt(n,16).toString(2);
    // }

    // this.decrypt1 = (passphrase, encryptedText)=>{
    //     let key = null;
    //     // Fix: Use the Utf8 encoder (or apply in combination with the hex encoder a 32 hex digit key for AES-128)
    //     key = CryptoJS.enc.Utf8.parse(passphrase);

    //     // Fix: Pass a CipherParams object (or the Base64 encoded ciphertext)
    //     let decrypted =  CryptoJS.AES.decrypt({ciphertext: CryptoJS.enc.Hex.parse(encryptedText)}, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.ZeroPadding }); 

    //     // Fix: Utf8 decode the decrypted data
    //     return decrypted.toString(CryptoJS.enc.Utf8);
    // }


        //aes_encrypt()
        this.encrypt = (str_to_encrypt,iv=null,key=null)=>{
            if(str_to_encrypt==null) return "";
            if (!iv) iv="abcdef9876543210abcdef9876543210";
            if (!key) key ="0123456789abcdef0123456789abcdef";

            let key1 = CryptoJS.enc.Hex.parse(key);
            let iv1 = CryptoJS.enc.Hex.parse(iv);
 
            let encrypted = CryptoJS.AES.encrypt(str_to_encrypt,key1, {'mode': CryptoJS.mode.CBC, iv: iv1});
            let encryptedString = encrypted.toString();
            return  encryptedString;
        }
        
        //aes_decrypt()
        this.decrypt = (str_to_decrypt,iv =null,key=null)=>{
            if(!str_to_decrypt) return "";
            if (!iv) iv="abcdef9876543210abcdef9876543210";
            if (!key) key ="0123456789abcdef0123456789abcdef";

            let key1 = CryptoJS.enc.Hex.parse(key);
            let iv1 = CryptoJS.enc.Hex.parse(iv);
        
            let decrypted = CryptoJS.AES.decrypt(str_to_decrypt,key1, {'mode': CryptoJS.mode.CBC, iv: iv1 });
            let decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
            return decryptedString;
        }

        //data = {value:'String to be decrypted',iv:'',key:''}
        //return decrypted string
        this.decryptObject = (data=null)=>{
          if(!data) return "";
          let str_to_decrypt = data.value;
          let iv = data.iv?data.iv: "abcdef9876543210abcdef9876543210";
          let key = data.key?data.key:"0123456789abcdef0123456789abcdef";

          let key1 = CryptoJS.enc.Hex.parse(key);
          let iv1 = CryptoJS.enc.Hex.parse(iv);
      
          let decrypted = CryptoJS.AES.decrypt(str_to_decrypt,key1, {'mode': CryptoJS.mode.CBC, iv: iv1 });
          let decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
          return decryptedString;
      }
  
 }