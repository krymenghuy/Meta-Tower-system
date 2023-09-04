<?php

namespace App\Models;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

class Audio //extends Model
{
    // use HasFactory;
    protected $id=null,$ss=null;
    function __construct($id=null,$ss=null){
        $this->id = $id;
        $this->ss = $ss;
    }
    function saveAudio($arr,$ss=null){
        $ss = $ss?$ss:$this->ss;
        $d = (object)$arr;
        $fileString = $d->file;

        return $fileString;
    }

    function getAudio($ss){
        $publicFolderPath = public_path('audio'); // Adjust the folder path as needed
        $fileName = 'audio_file.m4a'; // Change the file name and extension as needed
        $filePath = $publicFolderPath . '/' . $fileName;

        // Check if the file exists
        if (file_exists($filePath)) {
            // Generate the URL to access the file
            $fileUrl = asset('audio/' . $fileName);

            // Output the URL
            return "Audio file URL: " . $fileUrl;
        } else {
            return "Audio file not found.";
        }
    }

    static function saveFileAudio($base64String){
        $audioData = base64_decode($base64String);

        $publicFolderPath = public_path('audio'); // Adjust the folder path as needed
        $fileName = 'audio_file.m4a'; // Change the file name and extension as needed
        $filePath = $publicFolderPath . '/' . $fileName;

        // Create the directory if it doesn't exist
        if (!is_dir($publicFolderPath)) {
            mkdir($publicFolderPath, 0755, true);
        }

        // Write the decoded audio data to the file
        if (file_put_contents($filePath, $audioData) !== false) {
            return "Audio file saved successfully: " . $filePath;
        } else {
            return "Error saving audio file.";
        }

    }
}
