<?php

namespace App\Models\Umt\Data;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class DataConvertor //extends Model
{
    //use HasFactory;

    // $data is associative array
    static function prepare(array $binary_columns, array $rows): array
    {
        if (empty($binary_columns)) {
            return $rows;
        }
    
        // Convert binary columns to a flipped array for O(1) lookup
        $binary_column_keys = array_flip($binary_columns);
    
        // Check if $rows is an associative array
        $is_assoc = array_keys($rows) !== range(0, count($rows) - 1);
    
        if ($is_assoc) {
            // Process single associative array
            foreach ($rows as $col => &$value) {
                if (isset($binary_column_keys[$col])) {
                  try{
                    $value = hex2bin($value);
                  } catch(\Exception $e){
                     \Log::info('Error converting value '.($value === null? 'NULL': $value). ' in column ' .$col.' to binary(16)');
                     \Log::error($e->getMessage());
                     \Log::error($e->getTraceAsString());
                  } 
                }
            }
            unset($value); // Break the reference with the last element
        } else {
            // Process array of associative arrays
            $rows = array_map(function($row) use ($binary_column_keys) {
                foreach ($row as $col => &$value) {
                    if (isset($binary_column_keys[$col])) {
                          try{
                            $value = hex2bin($value);
                          } catch(\Exception $e){
                             \Log::info('Error converting value '.($value === null?  'NULL': $value). ' in column ' .$col.' to binary(16)');
                             \Log::error($e->getMessage());
                             \Log::error($e->getTraceAsString());
                          }
                    }
                }
                unset($value); // Break the reference with the last element
                return $row;
            }, $rows);
        }
    
        return $rows;
    }
    
}
