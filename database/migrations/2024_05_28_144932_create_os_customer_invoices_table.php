<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOsCustomerInvoicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('os_customer_invoices', function (Blueprint $table) {
            $table->increments('id');
            $table->string('code',15)->nullable();
            $table->integer('sender_id')->nullable();
            $table->integer('shipment_count')->nullable()->default(0);
            $table->integer('invoice_type_id',)->default(2)->comment('	invoice_type = {informal, commercial, tax}');
            $table->decimal('amount',10,2)->default(0.00);
            $table->decimal('discount_percent',10,2)->default(0.00);
            $table->decimal('discount_amount',10,2)->default(0.00);
            $table->string('discount_type',35)->nullable();
            $table->decimal('amount_due',10,2)->default(0.00);
            $table->timestamp('issue_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('due_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('pmt_terms',35)->nullable();
            $table->string('public_remarks',255)->nullable();
            $table->string('private_remarks',255)->nullable();
            $table->integer('status_id')->nullable();
            $table->integer('branch_id');
            $table->integer('create_uid')->nullable();
            $table->integer('update_uid')->nullable();
            $table->timestamp('update_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('create_date')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->string('create_user',50)->nullable();;
            $table->string('update_user',50)->nullable();
            $table->decimal('amount_paid',10,2)->default(0);

            


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('os_customer_invoices');
    }
}
