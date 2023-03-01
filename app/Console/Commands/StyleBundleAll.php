<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use StyleManager;

class StyleBundleAll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bundle:style-all';
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Minifies and bundles all css files into one new file';
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
        //$bundle_name = $this->argument('bundle_name');
        //$this->info($bundle_name);
        $res= StyleManager::createAllBundleFiles();
        if($res->status==='OK')
        {
            $this->info("Bundled files created as follows:\n");
            $i =0;
            foreach($res->files as $f){
               
               if ($f) {
                  $i++;
                  $this->info("$i. $f\n");
               }
            }
        }
        else $this->error(" $res->error_message");
    }
}
