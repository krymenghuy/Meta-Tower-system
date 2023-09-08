<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ReplaceText extends Command
{
    protected $signature = 'replace-text {directory} {search_text} {replace}';

    protected $description = 'Searches and replaces text in all files within the given directory';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $directory = $this->argument('directory');
        $searchText = $this->argument('search_text');
        $replaceText = $this->argument('replace');

        if (!File::isDirectory($directory)) {
            $this->error('The provided directory does not exist.');
            return;
        }

        $files = File::allFiles($directory);

        foreach ($files as $file) {
            $filePath = $file->getPathname();
            $contents = file_get_contents($filePath);

            $updatedContents = str_replace($searchText, $replaceText, $contents);

            if ($contents !== $updatedContents) {
                file_put_contents($filePath, $updatedContents);
                $this->info("Replaced '$searchText' with '$replaceText' in $filePath");
            }
        }

        $this->info('Text replacement completed.');
    }
}
