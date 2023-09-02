<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\ScriptManagement\ScriptManager;
use Symfony\Component\Console\Helper\ProgressBar;

class ScriptBundleAll extends Command
{
    protected $signature = 'bundle:script-all';
    protected $description = 'Minifies and bundles all javascript script files into one new javascript file';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $bs = ScriptManager::createAllBundleFiles();
        if ($bs->status === 'OK') {
            $this->info("Bundling in progress...\n");

            $totalBundles = count($bs->files);
            $bar = $this->output->createProgressBar($totalBundles);
            $bar->setFormat("%current%/%max% [%bar%] %percent:3s%%\n");
            $bar->start();

            $i = 0;
            foreach ($bs->files as $f) {
                if ($f) {
                    $i++;
                    $this->info("$i. Bundling $f...");

                    // Process your bundling logic here
                    // For example:
                    // YourExistingBundleLogic($f);

                    // Advance the progress bar
                    $bar->advance();
                }
            }

            $bar->finish();
            $this->info("\nScript bundles have been created successfully.");
        } else {
            $this->error($bs->error_message);
        }
    }
}
