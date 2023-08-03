<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class Audio //extends Model
{
    // use HasFactory;
    static function saveAudio($arr){
        $d = (object)$arr;
        if ($d->hasFile('audio_file')) {
            $file = $d->file('audio_file');

            // Get the original file name
            $fileName = $file->getClientOriginalName();

            // Get the base64 encoded content of the file
            $base64Data = base64_encode(file_get_contents($file->path()));

            // Save the base64 data to a folder
            $destinationPath = 'path/to/destination/folder/';
            file_put_contents($destinationPath . $fileName . '.txt', $base64Data);

            // Save the file path in the database or do any other necessary processing
            // For example, you can save the file path in the 'audio' column of a database table

            return redirect()->back()->with('success', 'Audio file uploaded and saved as base64.');
        }

        return redirect()->back()->with('error', 'Failed to upload audio file.');

    }
}
