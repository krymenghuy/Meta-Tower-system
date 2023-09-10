<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use ScriptManager;

class ScriptBundle extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bundle:script {bundle_name : Name of the script bundle, from which to retrieve files} {--ob : Enable obfuscation} {--min : Enable simple minification}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Minifies and bundles JavaScript scripts and creates one new JavaScript file';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Retrieve command line arguments and options
        $bundleName = $this->argument('bundle_name');
        $obfuscate = $this->option('ob');

        // Determine the optimization option
        $option = $obfuscate ? 'ob' : 'min';

        // Call the ScriptManager to create the bundle file
        $res = ScriptManager::createBundleFile($bundleName, $option);

        // Handle the result
        if ($res->status === 'OK') {
            foreach ($res->files as $file) {
                $this->info("Optimized file $file was created");
            }
        } else {
            $this->error($res->error_message);
        }
    }
}