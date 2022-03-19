<?php

namespace App\Http\Requests\Merchant;

use Illuminate\Foundation\Http\FormRequest;

class MerchantRequest extends FormRequest
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
            'sender_type_id' => 'required',
            'name' => 'required',
            'name_kh' => 'required',
            'phone_number' => 'required',
            'email' => 'required',
            'country_id' => 'required',
            'adr_city_id' => 'required',
            'adr_district_id' => 'required',
            'adr_commune_id' => 'required',
            'address' => 'required',
            'business_type' => 'required',
            'sender_type' => 'required'
        ];
    }
}
