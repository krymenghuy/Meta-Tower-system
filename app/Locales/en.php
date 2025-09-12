<?php
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
                'Start date should be earlier than first payment date'=>'Start date should be earlier than first payment date',
                'Please enter the details of each item'=>'Please enter the details of each item' 
            ],
            'titles'=>[
                'dashboard' => 'Dashboard - Meta Tower'
            ],
             'menus'=>[

                   'dashboard' => 'Dashboard',
                   'tenant_management' => 'Tenant & Management',
                   'payments' => 'Payments & Billings',
                   'services' => 'Services & Access',


                   'settings' => 'Settings',

                   'logout'=> 'Log Out',

             ],
    ];