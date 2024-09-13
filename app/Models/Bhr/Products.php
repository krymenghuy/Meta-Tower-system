<?php

namespace App\Models\Bhr;

use App\Models\Bhr\GeneralSettings;
use App\Models\DBX;
use App\Models\DV;
use App\Models\PublicStorage;
use DB;
use Illuminate\Pagination\LengthAwarePaginator;

class Products
{
    protected $id = null;
    protected $userInfo = null;
    protected static $img_dir = 'products';

    function __construct($id = null, $userInfo = null)
    {
        $this->id = $id;
        $this->userInfo = $userInfo;
    }

    function save($arr = [], $ss = null)
    {
        $ss = $ss ?? $this->userInfo;
        $branch_id = $ss->branch_id;
        $v_rule = [
            'id' => '0|identity=1',
            'name' => '1|string|0-100',
            'type' => '1|string|0-100',
            'description' => '0|string|0-250',
            'phone' => '0|string|0-100',
            'price' => '1|numeric|',
            'qty' => '1|numeric|',
            'image' => '0|image',
        ];

        $checkUnque = [
            "$branch_id|products|name|id=id|text=Product already exists.",
        ];

        $res = validateObject($arr, $v_rule, true, ['image' => GeneralSettings::$image_chars], $ss->lang, false, isset($arr['id']) ? null : $checkUnque);
        if ($res->error) {
            error_log('Validation error: ' . json_encode($res->error));
            return DV::error($res->error);
        }

        $id = $res->id;
        $inputs = $res->values;
        $inputs['total'] = $inputs['price'] * $inputs['qty'];

        $d = (object) $inputs;
        $image = $d->image;

        $d->phone_nuper = str_replace(' ', '', $inputs['phone']);
        $inputs['phone'] = $d->phone_nuper;
        if (!$d->phone_nuper) {
            error_log('Phone nuper is required for valid  product');
            return DV::error('Phone nuper is required for valid  product');
        }
        unset($inputs['image']);
        $product_created = !$id;
        $delete_prev_image = ($id > 0 && (!$image || isImage($image)));

        error_log('Saving data: ' . json_encode($inputs));
        $id = saveData($ss, 'products', ['id' => $id], $inputs, [], 1);

        if ($id > 0) {
            if ($delete_prev_image) {
                $file_name = DB::table('products')->where('id', $id)->take(1)->value('image_file_name');

                if ($file_name) {
                    PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
                }

                DB::table('products')->where('id', $id)->update(['image_file_name' => null]);
            }

            PublicStorage::saveImage(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], null, $image, null, ['id' => $id, 'store' => 'products.image_file_name']);

            return DV::depends(1, ['products' => $inputs, 'id' => $id]);
        }

        return DV::error('Failed to save product');
    }

    function getProducts($ss)
    {
        return DB::table('products')->selectRaw('id, name, price, qty, total, image_file_name, description, phone, type, created_at')->get();

    }

    function getProductsPaginate($arr, $ss)
    {
        $d = (object) $arr;
        $branch_id = $ss->branch_id;

        $current_page = $d->current_page ?? 1;
        $per_page = $d->per_page ?? 5;
        if (!is_numeric($current_page)) {
            $current_page = 1;
        }

        $skip_rows = ($current_page - 1) * $per_page;

        $search_value = $d->search_value ?? null;
        $search_id = $d->id ?? null;

        $str_search = '1=1';

        $query = DB::table('products as p')
            ->selectRaw('p.id, p.name, p.price, p.qty, p.total, p.image_file_name, p.description, p.phone, p.type, p.created_at')
            ->whereRaw('p.branch_id =' . $branch_id);
        if ($search_id) {
            $query->whereRaw('p.id =' . $search_id);
        }
        if ($search_value) {
            $search_value = escape_like_str($search_value);
            $query->whereRaw("p.name like '%" . $search_value . "%'" . " or p.type like '%" . $search_value . "%'" . " or p.description like '%" . $search_value . "%'" . " or p.phone like '%" . $search_value . "%'");
            $query->whereRaw($str_search);
        }
        $query->orderBy('p.id', 'asc');

        $count_query = clone $query;
        $count = $count_query->count('p.id');
        $rows = $query->skip($skip_rows)->take($per_page)->get();

        foreach ($rows as $row) {
            $row->image_url = '';
            if ($row->image_file_name) {
                $row->image_url = self::getProfilePicture($row->id);
            }
            unset($row->image_file_name);
        }

        return new LengthAwarePaginator($rows, $count, $per_page, $current_page);
    }

    public static function getProfilePicture($id)
    {
        $col_subs_id = DBX::getHex('p.subs_id', 'subs_id');
        $row = DB::table('products as p')->where('id', $id)->selectRaw($col_subs_id . ',p.branch_id,p.image_file_name')->first();
        $url = '';
        if ($row) {
            $url = PublicStorage::getUrl(['subs_id' => $row->subs_id, 'dir' => 'products'], 'images') . $row->image_file_name;
            return validateUrl($url);
        } else {
            return self::defaultImage($row ? $row->subs_id : null);
        }
    }

    function getDetails($id)
    {
        // Fetch the product with the given ID
        $row = DB::table('products')->where('id', $id)->first();

        // If the product exists, update its image URL
        if ($row) {
            $row->image_url = self::getProfilePicture($id);
        }

        // Return the updated product details
        return DB::table('products')
            ->selectRaw('id, name, price, qty, total, description, phone, type, created_at, ? as image_url', [$row->image_url])
            ->where('id', $id)
            ->first();
    }

    function delete($id, $ss)
    {
        // Ensure $id is numeric and valid
        if (!is_numeric($id)) {
            return DV::error('Invalid ID');
        }

        // Ensure $ss contains necessary data
        if (!isset($ss->branch_id) || !isset($ss->subs_id)) {
            return DV::error('Invalid session data');
        }

        // Retrieve the file name associated with the meper
        $file_name = DB::table('products as p')
            ->where('p.id', $id)
            ->take(1)
            ->value('p.image_file_name');
        if ($file_name) {
            PublicStorage::delete(['branch_id' => null, 'subs_id' => $ss->subs_id, 'dir' => self::$img_dir], 'images', $file_name);
        }
        DB::table('products as p')->where('p.id', $id)->update(['image_file_name' => null]);

        // Proceed to delete the meper from the database
        $query = DB::table('products')
            ->where('id', $id)
            ->where('branch_id', $ss->branch_id)
            ->delete();

        // Check if the query was successful
        if (!$query) {
            return DV::error('Product not found or not deleted');
        }

        // Return success response
        return DV::depends(1, ['id' => $id, 'deleted' => $file_name ?? 'No file found']);
    }

}
