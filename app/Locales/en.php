<?php
        return [
            'name'=>'English',
            'code'=>'en',
            'validation'=>[
                    'required' => 'Please enter ??.',
                    'missing' => '?? is missing',
                    'numeric' => 'Please enter a valid number for ??.',
                    'positive' => '?? must be greater than zero.',
                    'between_length' => 'Please enter between ?? and ?? characters for ??.',
                    'between_value' => '?? must be between ?? and ??.',
                    'exists' => 'The selected ?? is invalid.',
                    'date' => 'Please enter a valid date.',
                    'date_format' => 'Please enter a valid date in ?? format.',
                    'time' => 'Please enter a valid time.',
                    'timestamp' => 'Please enter a valid date and time.',
                    'email' => 'Please enter a valid email address.',
                    'phone' => 'Please enter a valid phone number.',
                    'in' => 'Please select a valid ??.',
                    'json' => '?? format is invalid.',
                    'file_type' => 'This file type is not supported.',
                    'file_size_between' => 'File size must be between ??KB and ??KB.',
                    'default' => 'Invalid ??.'
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
