<?php

namespace App\Http\Requests\Driver;

use Illuminate\Foundation\Http\FormRequest;

class DriverRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required',
            'date_of_birth' => 'required',
            'phone_number' => 'required',
            'national_id' => 'required',
            'driver_license_number' => 'required',
            'current_address' => 'required',
            'vehicle_type' => 'required',
            'vehicle_number' => 'required',
            'vehicle_make' => 'required',
            'vehicle_year' => 'required|integer',
            'vehicle_des' => 'required',
            'employment_type' => 'required',
            'salary' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'commission_percent' => 'required|regex:/^\d+(\.\d{1,2})?$/',
            'emergency_contact_phone' => 'required'
        ];
    }
}
