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
    protected $signature = 'bundle:script  {bundle_name : name of the script bundle, from which to retrieve files}';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Minifies and bundles javascript scripts and create one new javascript file';
    protected $arguments =[];
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
        // Retrieve a specific option...
        //$queueName = $this->option('queue');
        
        // Retrieve all options...
        //$options = $this->options();
        
        //$this->arguments = $this->arguments();
        $bundle_name = $this->argument('bundle_name');
        //$this->info($bundle_name);
        $res= ScriptManager::createBundleFile($bundle_name);
        if($res->status==='OK')
         $this->info("Bundled file $res->file_name created");
        else $this->error($res->error_message);
    }
}
