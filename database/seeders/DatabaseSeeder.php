<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();

        
        $this->call([
            UmUserSeeder::class,
        ]);
        $this->call([
            SenderTypeSeeder::class,

        ]);
        $this->call([
            SenderStatusesSeeder::class,
        ]);
        $this->call([
            SenderBusinessTypesSeeder::class,

        ]);
      
        $this->call([
            PriceListNameSeeder::class,
        ]);
        $this->call([
            OsShipmentStatusesSeeder::class,
        ]);
        $this->call([
            OsSaleAgentStatusesSeeder::class,

        ]);
        $this->call([
            OsPackageStatusesSeeder::class,

        ]);
        $this->call([
            OsInvoiceTypeSeeder::class,

        ]);
        $this->call([
            OsInvoiceStatusesSeeder::class,

        ]);
        $this->call([
            OsContactPersonTypeSeeder::class,
        ]);
        $this->call([
            OsContactPersonStatusesSeeder::class,

        ]);
        $this->call([
            OsAgentTypeSeeder::class,
        ]);
      
        
        $this->call([
            OSCurrencySeeder::class,
        ]);
        $this->call([
            OSPaymentMethodsSeeder::class,
        ]);
        $this->call([
            OSSupplierPriceListNameSeeder::class,
        ]);

       
       
        
       
      
       
        
        
       
       
    }
}
