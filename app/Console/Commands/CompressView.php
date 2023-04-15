<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Console\Commands\HtmlCompressor;
use Illuminate\Support\Facades\File;

use Symfony\Component\Console\Formatter\OutputFormatter;
use Symfony\Component\Console\Formatter\OutputFormatterStyle;
use Symfony\Component\Console\Output\ConsoleOutput;

class CompressView extends Command
{
    protected $signature = "compress:view
                            {--d|source= : The source directory}
                            {--o|output= : The output directory (optional)}
                            {--c|compressor= : The compressor to use (optional)}
                            ";

    protected $description = 'Compress all PHP or HTML files in the view directory.';

    public function handle()
    {
        $source = $this->option('source');
        //$output = $this->option('output') ?: 'compressed';
        //if output directory is not supplied => save all compressed files in the newly created folder named "compressed" in the source directory. This is done or handled by HtmlCompressor::compressFiles() method
        $output = $this->option('output') ?: null; 
        $compressorName = $this->option('compressor') ?: 'default';

        // // Create the output directory if it doesn't exist
        // if (!File::exists($output)) {
        //     File::makeDirectory($output);
        // }
 
        // Compress the files
        $compressor = $this->getCompressor($compressorName);
        $success_files = $compressor->compressFiles($source,$output);
        $output = new ConsoleOutput();

        $outputFormatter = new OutputFormatter(true);

        // Define the style for green text
        $greenStyle = new OutputFormatterStyle('green');

        // Set the style for the 'info' messages to green
        $outputFormatter->setStyle('info', $greenStyle);

        // Set the output formatter on the console output object
        $output->setFormatter($outputFormatter);

        foreach ($success_files as $file) {
            $output->writeln("<info>File $file created!</info>");
            //$this->info("File $file created!",'green');
        }
    }
 
    /**
     * Get the compressor to use based on the given name.
     *
     * @param  string  $name
     * @return \YourNamespace\HtmlCompressor
     */
    protected function getCompressor($name)
    {
        switch ($name) {
            case 'custom':
                return new CustomCompressor;
            case 'other':
                return new OtherCompressor;
            default:
                return new HtmlCompressor;
        }
    }
 
}
