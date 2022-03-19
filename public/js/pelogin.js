'use strict'
  window.addEventListener('load', (event) => {        
        const elEmail = document.getElementById('email');  
        const elPwd = document.getElementById('password');
 
        if(!elEmail || !elPwd) {
            console.log('Problem => cannot find element with id "email" and "password"');
        }else {
            
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

             const encrypt = (data)=>{
                  let cipher = crypt.encrypt(data);
                  return cipher;
             }

            // const encrypt = (data)=>{
            //     var key = CryptoJS.enc.Hex.parse("0123456789abcdef0123456789abcdef");
            //     var iv =  CryptoJS.enc.Hex.parse("abcdef9876543210abcdef9876543210");
            //     //var a = "D";
            //     //var hex_D = a.charCodeAt(0).toString(16);
            //     //var binary_D = a.charCodeAt(0).toString(2);
            //     //let data ="string to be encrypted"; 
            //     var encrypted = CryptoJS.AES.encrypt(data, key, {iv:iv});
            //     return encrypted.toString();
            // }

            const decrypt = (data)=>{
                let cipher = crypt.decrypt(data);
                return cipher; 
            }

            const setToken = ()=>{
                let email = elEmail.value;
                let pwd = elPwd.value;
                let c_token = ['login=',email,'&pwd=',pwd].join('');
                c_token = encrypt(c_token);
                window.localStorage.setItem('c_token',c_token);
            }
            elEmail.addEventListener('input',function(e){
                setToken();
            });
    
            elPwd.addEventListener('input',function(e){
                setToken();
            });
        }       
        //another way is to set these data in cookie
  });