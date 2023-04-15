<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Console\Commands\HtmlCompressor;
use Illuminate\Support\Facades\File;

use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Output\ConsoleOutput;

class BuildMaster extends Command
{
    protected $signature = "build:master {--o|output= : The output directory (optional)}";

    // protected $signature = "build:master
    //                         {--d|source= : The source directory}
    //                         {--o|output= : The output directory (optional)}
    //                         {--c|compressor= : The compressor to use (optional)}
    //                         ";

    protected $description = 'Comined contents of all included files into master.blade.php and then compress the master.blade ans save it in /views/dist folder';

    public function handle()
    {
        $output_dir = $this->option('output') ?: null;
        if($output_dir){
            if(substr($output_dir, 0, 1) != "/") {
                $output_dir = "/" . $output_dir;
            }
        } 
       
        // Compress the files
        $compressor = new HtmlCompressor(); 
        $res = $compressor->buildMasterView($output_dir);

        // $output = new ConsoleOutput();
        // $outputFormatter = new OutputFormatter(true);
        // // Define the style for green text
        // $greenStyle = new OutputFormatterStyle('green');
        // // Set the style for the 'info' messages to green
        // $outputFormatter->setStyle('info', $greenStyle);

        // // Set the output formatter on the console output object
        // $output->setFormatter($outputFormatter);
        if($res->status =='OK'){
            $this->info(" Output file $res->file was created successfully!");
            foreach($res->error_files as $error_file){
                $output->writeln("<info>=================================================</info>");
                $output->writeln("<info>$error_file</info>");
            }
        }else $this->error($res->error_message);
         
    }
 
    /**
     * Get the compressor to use based on the given name.
     *
     * @param  string  $name
     * @return \YourNamespace\HTMCompressor
     */

    // protected function getCompressor($name)
    // {
    //     switch ($name) {
    //         case 'custom':
    //             return new CustomCompressor;
    //         case 'other':
    //             return new OtherCompressor;
    //         default:
    //             return new HTMCompressor;
    //     }
    // }
 
}
