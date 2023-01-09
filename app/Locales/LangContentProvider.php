<?php
namespace App\Locales;
//This class only provides array of lanaguage data
//BEGIN:: LangContentprovider class
class LangContentProvider {
    //Khmer language
    static function km(){
        return [
            'name'=>'ខ្មែរ',
            'code'=>'km',
            'validation'=>[
                 'national id is required'=>'លេខអត្តសញ្ណាណបណមិនត្រឹមត្រូវ '  ,
                 'first name is required'=>'ឈ្មោះមិនទាន់ត្រឹមត្រួ', 
                 'last name is required'=>'ឈ្មោះមិនទាន់ត្រឹមត្រួ',
                 'phone number is required'=>'លេខទូរសព្ទ័មិនត្រឹមត្រូវ',
                 'sex is not correct'=>'Sex is must be Male or Female',
                 'number between'=>'number must be between ? and ?',
                 'date of birth is required'=>'ថ្ងៃខែឆ្នាំកំនើតមិនទាន់ត្រូវ . ត្រូវការទំរង `?` ',
                 'value cannot be empty'=>'ឈ្មោះមិនទាន់ត្រឹមត្រួវ លាលាល',
                 'sex is not correct'=>'ភេទត្រូវតែជា Male or Female',
                 'number between'=>'លេខត្រូវនៅចន្លោះពី ? ទៅ ?',
                 'text length must be between'=>'text ត្រូវនៅចន្លោះពី ? ទៅ ?',
                 'Start date should be earlier than first payment date'=>'ថ្ងៃចាប់ផ្តើមគួរតែមុនថ្ងៃបង់ប្រាក់តំបូង',
                 "Contact channel is not valid"=>"Contact channel is not valid",
                 "Department name is required"=>"Department name is required" 
                 ]
            ];
    }
    
    //English Language
    static function en(){
        return [
            'name'=>'English',
            'code'=>'en',
            'validation'=>[ 
                'national id is required'=>'National ID is required',  
                'first name is required'=>'First Name is required and less then 50 characters', 
                'last name is required'=>'Last name is required and less than 50 characters',
                 'date of birth is required'=>'Date of birth is required. Date format `?` is expected',
                'phone number is required'=>'Phone number is required.Date format ? is expected',
                'value cannot be empty'=>'First Name is required and less than 50 characters',
                'sex is not correct'=>'Sex is must be Male or Female',
                'number between'=>'number must be between ? and ?',
                'text length must be between'=>'text length must be between ? and ?',
                'Start date should be earlier than first payment date'=>'Start date should be earlier than first payment date' 
              ]
           ];
    }

    static function langContents(){
        return [
            'en'=>self::en(),
            'km'=>self::km()
        ];
    }
 }
 //END:: LangContentProvider
?>