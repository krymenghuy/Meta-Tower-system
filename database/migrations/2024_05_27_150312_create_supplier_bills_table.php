<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSupplierBillsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('supplier_bills', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('supplier_id')->nullable();
            $table->string('supplier_email',100)->nullable();
            $table->string('supplier_address')->nullable();
            $table->string('bill_type',20)->nullable()->default(1)->comment('1=informal,2=commercial,3=tax');
            $table->decimal('amount',10,2)->nullable()->default(0.00);
            $table->decimal('discount_percent',10,2)->nullable()->default(0.00);
            $table->decimal('discount_amount',10,2)->nullable()->default(0.00);
            $table->string('discount_type',35)->nullable();
            $table->decimal('amount_due',10,2)->nullable()->default(0.00);
            $table->timestamp('issue_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('due_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('pmt_terms',25)->nullable();
            $table->string('remarks',255)->nullable();
            $table->decimal('paid_amount',10,2)->nullable()->default(0.00);


            

            
            
            


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('supplier_bills');
    }
}
