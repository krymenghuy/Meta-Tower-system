<?php
return [
    'name' => 'English',
    'code' => 'en',
    'validation' => [
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

        'name_required' => '?? is required and must be at most ?? characters. Given value: ??',
        'prefix_required' => 'Prefix is required.',
        'total_floor_required' => 'Total floor is required.',
        'total_area_required' => 'Total area is required.',
        'address_required' => 'Address is required.',

        'select_building' => 'Please select a building.',
        'select_floor' => 'Please select a floor.',
        'select_space_type' => 'Please select a space type.',
        'invalid_size' => 'Please enter a valid number for Size.',
        'invalid_price' => 'Please enter a valid number for Price.',
        'select_price_type' => 'Please select the Charge As.',

        'select_gender' => 'Please select a gender.',
        'date_of_birth_required' => 'Please select a valid date of birth.',
        'legal_name_required' => 'Please enter the legal name.',
        'nationality_required' => 'Please select a nationality.',
        'phone_number_required' => 'Please enter the phone number.',

        'booker_name_required' => 'Booker name is required.',
        'booker_phone_required' => 'Booker phone is required.',
        'booking_date_required' => 'Booking date is required.',
        'expired_booking_date_required' => 'Expired booking date is required.',
        'booking_fee_required' => 'Booking fee is required.',

        'select_space' => 'Please select a unit.',
        'select_amenity' => 'Please select a amenity.',
        'select_type' => 'Please select a type.',
        'required_start_date' => 'Start date is required.',
        'required_end_date' => 'End date is required.',
        'required_start_time' => 'Start time is required.',
        'required_end_time' => 'End time is required.',

        'select_tenant' => 'Please select a tenant.',

        'please_select_a_valid_category' => 'Please select a valid category.',
        'please_select_a_valid_unit' => 'Please select a valid unit.',

        'contact_person_required' => 'Contact person is required.',
        'contact_phone_required' => 'Contact phone is required.',

        'not_found' => 'Data not found.',
        'create_failed' => 'Failed to create data. Please try again.',
        'update_failed' => 'Failed to update data. Please try again.',

        'building_exists' => 'A building with this name already exists.',
        'building_prefix_exists' => 'A building with this prefix already exists.',
        'another_building_already_uses_this_prefix' => 'Another building already uses this prefix.',
        'cannot_delete_building_has_spaces' => 'Cannot delete building because it has associated spaces.',


        'delete_top_floor' => 'Please delete the top floor first.',
        'cannot_delete_floor_has_associated_spaces' => 'Cannot delete this floor because it has associated spaces.',
        'total_floors_limit' => 'Total floors must be less than or equal to 50.',
        'total_floors_greater_than_zero' => 'Total floors must be greater than zero.',
        'total_area_greater_than_zero' => 'Total area must be greater than zero.',


        'unit_code_exists' => 'Unit code already exists.',
        'invalid_floor' => 'Invalid floor selected.',
        'error_saving_building_space' => 'Error saving Building Space ...!',
        'transaction_failed' => 'Transaction failed. Please try again.',
        'price_greater_than_zero' => 'Price must be greater than zero.',
        'size_greater_than_zero' => 'Size must be greater than zero.',
        'floor_number_required' => 'Floor number is required.',
        'floor_number_exceeds_total' => 'Floor number cannot exceed total',
        'floor_name_must_be' => 'Floor name must be',


        'valid_email' => 'Invalid email format.',
        'email_contain' => 'Email must contain @ character.',
        'booking_date_must' => 'Booking date must be today.',
        'expired_date_min_14_days' => 'Expired date must be at least 14 days.',
        'expired_date_cannot_in_past' => 'Expired date cannot be in the past.',
        'booking_duration_max_3_months' => 'Booking duration cannot exceed 3 months.',

        'start_date_cannot_in_past' => 'Start date cannot be in the past.',
        'end_date_cannot_in_past' => 'End date cannot be in the past.',
        'end_after_start' => 'End date/time must be after start date/time.',
        'start_time_cannot_in_past' => 'Start time cannot be in the past.',
        'end_time_cannot_in_past' => 'End time cannot be in the past.',

        'tenant_must_be_18' => 'Tenant must be 18 years or older.',
        'invalid_date_of_birth_age' => 'Invalid date of birth age.',
        'passport_number_required' => 'Passport number is required for foreign nationality.',
        'date_of_birth_cannot_be_in_the_future' => 'Date of birth cannot be in the future.',
        'national_id_required' => 'National ID is required for Khmer nationality.',
        'select_document_type' => 'Please select a document type.',
        'select_file' => 'Please select a file.',
        'select_valid_file' => 'Please select a valid file.',
        'remarks_max_255' => 'Remarks must not exceed 255 characters.',
        'tenant_national_id' => 'A tenant with national ID',
        'exists_in_system' => 'already exists in the system1.',

        'item_name_already_exists' => 'Item name already exists!',
        'end_time_must' => 'End time must be greater than start time.',
        'nid_issue_date' => 'Please Select National ID Issue Date.',




    ],
    'api_body_keys' =>[
        'name' => 'Name',
        'name_kh' => 'Name Khmer',
        'building_id' => 'Building',
    ],
    'titles' => [
        'dashboard' => 'Dashboard - Meta Tower'
    ],
    'menus' => [

        'dashboard' => 'Dashboard',
        'tenant_management' => 'Tenant & Management',
        'payments' => 'Payments & Billings',
        'services' => 'Services & Access',


        'settings' => 'Settings',

        'logout' => 'Log Out',
        // 'logout'=> 'Log Out',
        'Transaction' => 'Transaction',

    ],

    'message_box_default' => [
        'required' => 'Please enter this information.',
        'created' => 'Data has been created successfully.',
        'updated' => 'Data has been updated successfully.',
        'deleted' => 'Data has been deleted successfully.',
        'confirm_cancel' => 'Are you sure you want to cancel this?',
        'cancelled' => 'Cancelled successfully.',
        'confirm_finish' => 'Are you sure you want to mark this as finished?',
        'finished' => 'Marked as finished successfully.',
        'confirm_delete' => 'Are you sure you want to delete this data?',
        'cancel_failed' => 'Cancel failed.',
        'delete_failed' => 'Delete failed.',
        'save_failed' => 'Save failed.',
        'confirm_complete' => 'Complete Service Request?',
        'update_success_status' => 'Status updated successfully.',
        'update_failed_status' => 'Unable to update status',
        'upload_failed_photo' => 'Upload failed. Please try again.',

        'delete_maintenance' => 'Delete Maintenance',
        'confirm_delete_maintenance' => 'Are you sure you want to delete this maintenance?',
        'maintenance_deleted' => 'Maintenance has been deleted successfully.',

        'cancel_maintenance' => 'Cancel Maintenance',
        'confirm_cancel_maintenance' => 'Are you sure you want to cancel this maintenance?',
        'maintenance_cancelled' => 'Maintenance has been cancelled successfully.',

        'finish_maintenance' => 'Finish Maintenance',
        'confirm_finish_maintenance' => 'Are you sure you want to finish this maintenance?',
        'maintenance_finished' => 'Maintenance has been finished successfully.',
        'confirm_authorize' => 'Are you sure you want to authorize this purchase order?',

        'update_success_tenant' => 'Tenant updated successfully.',
        'create_success_tenant' => 'Tenant created successfully.',
        'delete_success_tenant' => 'Tenant deleted successfully.',

        'select_document_type' => 'Please select a document type.',
        'select_file' => 'Please select a file.',
        'select_valid_file' => 'Please select a valid file.',
        'remarks_max_255' => 'Remarks must not exceed 255 characters.',
        'update_success_document' => 'Document updated successfully.',
        'create_success_document' => 'Document created successfully.',
        'delete_success_document' => 'Document deleted successfully.',

        'delete_success_space' => 'Space deleted successfully.',
        'update_success_space' => 'Space updated successfully.',
        'create_success_space' => 'Space created successfully.',

        'create_success_booking' => 'Booking created successfully.',
        'update_success_booking' => 'Booking updated successfully.',
        'cancel_success_booking' => 'Booking has been cancelled.',

        'finish_maintenance_success' => 'Maintenance has been completed.',
        'delete_success_maintenance' => 'Maintenance deleted successfully.',
        'select_building' => 'Please select a building.',
        'select_type' => 'Please select a type.',
        'select_space' => 'Please select a unit.',
        'select_amenity' => 'Please select a amenity.',
        'create_success_maintenance' => 'Maintenance created successfully.',
        'update_success_maintenance' => 'Maintenance updated successfully.',
        
        'create_success_contract' => 'Contract created successfully.',
        'update_success_contract' => 'Contract updated successfully.',
        'delete_success_contract' => 'Contract deleted successfully.',
        'confirm_terminate' => 'Are you sure you want to terminate this contract?',
        'contract_terminated' => 'Contract terminated successfully.',

        'update_success_reservation' => 'Reservation updated successfully.',
        'create_success_reservation' => 'Reservation created successfully.',
        'delete_success_reservation' => 'Reservation deleted successfully.',
        'cancel_success_reservation' => 'Reservation cancelled successfully.',

        'confirm_reset_invoice' => 'Are you sure you want to reset this invoice setting?',
        'delete_success_invoice' => 'Invoice deleted successfully.',
        'reset_success_invoice' => 'Invoice setting reset successfully.',
        'update_success_setting' => 'Settings updated successfully.',
        'reset_failed' => 'Failed to reset setting.',
        'select_tenant' => 'Please select tenant first.',
        'update_success_invoice' => 'Invoice updated successfully.',
        'create_success_invoice' => 'Invoice created successfully.',
        'cancel_success_invoice' => 'Invoice cancelled successfully.',  
        'add_item' => 'Please add at least one item.',
        'tax_required' => 'Tax % is required for this invoice type.',
        'enter_tax' => 'Please enter a valid Tax % value.',
        'missing_unit' => 'Unit Code is missing.',
        'select_service' => 'Please select a service.',
        'input_date' => 'Please input Start and End Date.',
        'input_time' => 'Please input Duration.',
        'service_exist' => 'Service is already in the list.',
        'service_request' => 'Please select a service request.',
        'request_exist' => 'Request is already in the list.',
        'request_invoice' => 'Service request added to invoice',
        'failed_load_invoice' => 'Failed to load invoice details.',
        'no_request' => 'No Requests relate to this space.',
        'receive_success_payment' => 'Payment Received Successfully.',
        'payment_amount' => 'Please enter a payment amount',

        'cancel_receipt' => 'Receipt has been canceled.',
        'complete_success_request' => 'Service Request has been completed!',
        'delete_success_request' => 'Service request deleted successfully.',
        'update_success_request' => 'Service request updated successfully!',
        'create_success_request' => 'Service Request has been created.',

        'delete_success_vendor' => 'Vendor deleted successfully.',
        'update_success_vendor' => 'Vendor updated successfully.',
        'create_success_vendor' => 'Vendor created successfully.',

        'create_success_order' => 'Purchase Order created successfully.',
        'delete_success_order' => 'Purchase Order deleted successfully.',
        'update_success_order' => 'Purchase Order updated successfully.',
        'receive_success_order' => 'Purchase Order received successfully.',
        'reject_success_order' => 'Purchase Order rejected successfully.',
        'authorized_purchase' => 'Purchase Order has been authorized!',
        

        'delete_bill_success' => 'Bill record has been deleted."',
        'update_bill_success' => 'Bill updated successfully.',
        'create_success_bill' => 'Bill created successfully.',
        'delete_bill_photo' => 'Photo deleted successfully.',
        'upload_bill_photo' => 'Bill photo has been uploaded.',

        'delete_payment_success' => 'Payment deleted successfully.',
        'update_payment_success' => 'Payment updated successfully.',
        'create_payment_success' => 'Payment created successfully.',
        'cancel_payment_success' => 'Payment has been canceled.',
        'no_photo' => 'No Photo Found.',

        'delete_success_building' => 'Building deleted successfully.',
        'delete_floor' => 'Floor deleted successfully.',
        'create_success_building' => 'Building created successfully.',
        'update_success_building' => 'Building updated successfully.',
        'create_floor' => 'Floor created successfully.',
        'update_floor' => 'Floor updated successfully.',

        'create_success_amenity' => 'New Amenity has been added successfully.',
        'update_success_amenity' => 'Amenity updated successfully.',
        'delete_success_amenity' => 'Amenity deleted successfully.',

        'update_success_service' => 'Service updated successfully.',
        'create_success_service' => 'Service created successfully.',
        'delete_success_service' => 'Service deleted successfully.',

        'update_success_item' => 'Item updated successfully.',
        'create_success_item' => 'Item created successfully.',
        'delete_success_item' => 'Item deleted successfully.',

        '' => '',
        '' => '',
        '' => '',
        '' => '',
        '' => '',
        '' => '',







        





        


        
        

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

