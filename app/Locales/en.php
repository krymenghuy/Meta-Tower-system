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

                'required' => 'Please enter this information.',
                'created' => 'Data has been created successfully.',
                'updated' => 'Data has been updated successfully.',
                'deleted' => 'Data has been deleted successfully.',
                'confirm_cancel' => 'Are you sure you want to cancel this?',
                'cancelled' => 'Cancelled successfully.',
                'confirm_finished' => 'Are you sure you want to mark this as finished?',
                'finished' => 'Marked as finished successfully.',
                'confirm_deleted' => 'Are you sure you want to delete this data?',
                'not_found' => 'Data not found.',
                'create_failed' => 'Failed to create data. Please try again.',
                'update_failed' => 'Failed to update data. Please try again.',

                'building_exists' => 'A building with this name already exists.',
                'building_prefix_exists' => 'A building with this prefix already exists.',

                'delete_top_floor' => 'Please delete the top floor first.',
                'cannot_delete_floor_has_associated_spaces' => 'Cannot delete this floor because it has associated spaces.',
                'total_floors_limit' => 'Total floors must be less than or equal to 50.',
                'total_floors_greater_than_zero' => 'Total floors must be greater than zero.',
                'total_area_greater_than_zero' => 'Total area must be greater than zero.',

                'select_building' => 'Please select a building.',
                'select_floor' => 'Please select a floor.',
                'select_space_type' => 'Please select a space type.',
                'invalid_size' => 'Please enter a valid number for Size.',
                'select_price_type' => 'Please select the Charge As.',
                'invalid_price' => 'Please enter a valid number for Price.',
                'unit_code_exists' => 'Unit code already exists.',
                'invalid_floor' => 'Invalid floor selected.',
                'error_saving_building_space' => 'Error saving Building Space ...!',
                'transaction_failed' => 'Transaction failed. Please try again.',
                'price_greater_than_zero' => 'Price must be greater than zero.',
                'size_greater_than_zero' => 'Size must be greater than zero.',
                'floor_number_required' => 'Floor number is required.',
                'floor_number_exceeds_total' => 'Floor number cannot exceed total',
                'floor_name_must_be' => 'Floor name must be',

                'booker_name_required' => 'Booker name is required.',
                'booker_phone_required' => 'Booker phone is required.',
                'booking_date_required' => 'Booking date is required.',
                'expired_booking_date_required' => 'Expired booking date is required.',
                'booking_fee_required' => 'Booking fee is required.',
                'valid_email' => 'Invalid email format.',
                'email_contain' => 'Email must contain @ character.',
                'booking_date_must' => 'Booking date must be today.',

                'select_space' => 'Please select a space.',
                'select_amenity' => 'Please select a amenity.',
                'select_type' => 'Please select a type.',
                'required_start_date' => 'Start date is required.',
                'required_end_date' => 'End date is required.',   
                'required_start_time' => 'Start time is required.',
                'required_end_time' => 'End time is required.',
                'start_date_cannot_in_past' => 'Start date cannot be in the past.',
                'end_date_cannot_in_past' => 'End date cannot be in the past.',
                'end_after_start' => 'End date/time must be after start date/time.',
                'start_time_cannot_in_past' => 'Start time cannot be in the past.',
                'end_time_cannot_in_past' => 'End time cannot be in the past.',
                                

                'delete_maintenance' => 'Delete Maintenance',
                'confirm_delete_maintenance' => 'Are you sure you want to delete this maintenance?',
                'maintenance_deleted' => 'Maintenance has been deleted successfully.',

                'cancel_maintenance' => 'Cancel Maintenance',
                'confirm_cancel_maintenance' => 'Are you sure you want to cancel this maintenance?',
                'maintenance_cancelled' => 'Maintenance has been cancelled successfully.',

                'finish_maintenance' => 'Finish Maintenance',
                'confirm_finish_maintenance' => 'Are you sure you want to finish this maintenance?',
                'maintenance_finished' => 'Maintenance has been finished successfully.',


                "Confirm" => 'Confirm',
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
            ],
    ];
