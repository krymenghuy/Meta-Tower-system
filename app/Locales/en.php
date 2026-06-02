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
                    'default' => 'Invalid ??.',

                    'building_name_is_required' => 'Name is required.',
                    'building_prefix_is_required' => 'Prefix is required.',
                    'building_total_floor_is_required' => 'Total floor is required.',
                    'building_total_area_is_required' => 'Total area is required.',
                    'building_address_is_required' => 'Address is required.',

                    'gender_not_correct' => 'Please select a valid gender.',

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

            'message_box_default' => [
                'Confirm' => 'Confirm',
                "Log Out" => "Log Out",
                "Cancel" => "Cancel",
                "OK" => "OK",
                "Remove" => "Remove",
                "Delete" => "Delete",
                "Dont Delete" => "Don't Delete",
                "Dont Remove" => "Don't Remove",
                "Create" => "Create",
                "Yes" => "Yes",
                "No" => "No",
                "Finish" => "Finish",

                'building_created' => 'Building has been created successfully.',
                'building_updated' => 'Building has been updated successfully.',
                'save_building_failed' => 'Failed to save building.',
                'confirm_delete_building' => 'Are you sure you want to delete this building?',
                'delete_building' => 'Delete Building',
                'building_deleted' => 'Building has been deleted successfully.',

                'floor_created' => 'Floor has been created successfully.',
                'floor_updated' => 'Floor has been updated successfully.',
                'save_floor_failed' => 'Failed to save floor.',
                'delete_floor' => 'Delete Floor',
                'confirm_delete_floor' => 'Are you sure you want to delete this floor?',    
                'floor_deleted' => 'Floor has been deleted successfully.',

 
                'delete_maintenance' => 'Delete Maintenance',
                'confirm_delete_maintenance' => 'Are you sure you want to delete this maintenance?',
                'maintenance_deleted' => 'Maintenance has been deleted successfully.',

                'cancel_maintenance' => 'Cancel Maintenance',
                'confirm_cancel_maintenance' => 'Are you sure you want to cancel this maintenance?',
                'maintenance_cancelled' => 'Maintenance has been cancelled successfully.',

                'finish_maintenance' => 'Finish Maintenance',
                'confirm_finish_maintenance' => 'Are you sure you want to finish this maintenance?',
                'maintenance_finished' => 'Maintenance has been finished successfully.',
            ],
    ];
