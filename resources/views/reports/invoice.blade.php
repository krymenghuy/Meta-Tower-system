<!DOCTYPE html>
<html>
<head>
    <link href="{{ base_url('assets/css/bootstrap.min.css') }}" rel="stylesheet" type="text/css" id="bootstrap-css" />
    <script src="{{ base_url('assets/vendors/general/jquery/dist/jquery.js') }}" type="text/javascript"></script>
    <script defer src="{{ base_url('assets/vendors/general/bootstrap/dist/js/bootstrap.min.js') }}" type="text/javascript"></script>
    <style>
        body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }
        .rpt-body {
            font-family: 'Khmer OS Content', 'DaunPenh', 'Francois One', 'Bayon', 'Verdana', 'Arial Black (sans-serif)', 'Arial (sans-serif)', 'Tahoma (sans-serif)';
        }
        @media print{
            @page{
                margin: 0;
                size: A4 portrait;
            }
            
            body{
                width: 100%;
                height: 100%;
                zoom: 97%;
                font-size: 16px;
            }
        }
    </style>
</head>

<body>
    <?php 
      if ($invoice->currency_code === 'USD') $cur_symbol ='$';
      else if ($invoice->currency_code == 'KHR') $cur_symbol ='រ';
     ?>
    <div class="border border-1 border-success rounded m-2">
        <div class="rpt-body">
            <div class="d-block px-3">
                <div class="d-flex align-items-center w-100 py-2">
                    <div class="d-flex align-items-center">
                        <div>
                            <img style="width: 120px" class="img-thumbnail" src="<?php echo isset($branch->logo_url) ? $branch->logo_url : null ?>"/>
                        </div>
                    </div>
                    <div class="d-flex align-items-center justify-content-end w-100">
                        <div class="px-2">
                            <h4 class="fw-bold fs-2 pr-2">
                                <?php echo isset($title) ? $title:null; ?>
                            </h4>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center w-100 mt-2">
                    <div class="d-block w-100 px-2">
                        <p class="fw-bold h3">
                            <?php echo isset($branch->name_kh) ? $branch->name_kh : null ?>
                        </p>
                        <p>
                            <span class="d-block text-left" style="font-size:0.9em">
                                <?php echo isset($branch->address_kh) ? $branch->address_kh : null ?>
                            </span>
                            <span class="d-block text-left text-secondary" style="font-size:0.9em">
                                <?php echo "Tel: ".isset($branch->phone_number)." Website: ". (isset($branch->website)? $branch->website: null);?>
                            </span>
                            <span class="d-block text-left" style="font-size:0.9em">
                                <?php echo "លេខអត្តសញ្ញាណ អតប: ".(isset($branch->tax_number)? $branch->tax_number: 'គ្មាន'); ?>
                            </span>
                        </p>
                    </div>
                </div>
                <div class="d-flex align-items-center w-100 mt-1">
                    <div class="d-block w-25 px-2">
                        <p class="fw-bold">BILL TO</p>
                        <p>
                            <span class="d-block">
                                <?php echo isset($invoice->billing_address) ? $invoice->billing_address : '(អសយដ្ឋានអតិថិជន)' ?>
                            </span>
                            <span class="d-block">
                                <?php echo 'Tel: '.(isset($invoice->customer_phone)?$invoice->customer_phone:'គ្មាន'); ?>
                            </span>
                        </p>
                        <p>
                            <?php echo 'លេខអត្តសញ្ញាណ អតប: '.(isset($invoice->customer_tax_number)?$invoice->customer_tax_number:'ក្មាន'); ?>
                        </p>
                    </div>
                    <div class="d-flex w-75 px-2">
                        <div class="d-block w-100 fw-bold">
                            <p>INVOICE</p>
                            <p>INVOICE DATE</p>
                            <p>DUE DATE</p>
                        </div>
                        <div class="d-block w-50">
                            <p>
                                <?php echo isset($invoice->id) ? $invoice->ref_number : null ?>
                            </p>
                            <p>
                                <?php echo isset($invoice->issue_date) ? $invoice->issue_date : null ?>
                            </p>
                            <p>
                                <?php echo isset($invoice->due) ? $invoice->due_date : null ?>
                            </p>
                        </div>

                        <div class="d-block w-50 fw-bold pe-3">
                            <p>TERMS</p>
                            <p>DESCRIPTION</p>
                        </div>
                        <div class="d-block w-50">
                            <p>
                                <?php echo isset($invoice->terms) ? $invoice->terms : 'គ្មាន' ?>
                            </p>
                            <p>
                                <?php echo isset($invoice->invoice_notes) ? $invoice->invoice_notes : 'គ្នាន' ?>
                            </p>
                        </div>

                    </div>
                </div>
                <div class="table-responsive border rounded mt-5">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>CODE</th>
                                <th>DESCRIPTION</th>
                                <th>QTY</th>
                                <th>UNIT PRICE</th>
                                <th>DISCOUNT</th>
                                <th>TAX</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($invoice->items as $item)
                                <tr>
                                    <td>{{ $item->item_code}}</td> 
                                    <td>{{ $item->item_name }}</td>
                                    <td><?php echo number_format((float)$item->qty,0); ?></td>
                                    <td>{{$cur_symbol}} {{$item->price }}</td>
                                    <td>{{$item->discount_percent}}%</td>
                                    <td>{{$item->tax_rate}}%</td>
                                    <td>{{$cur_symbol}}{{ $item->line_total }}</td>
                                </tr>
                            @endforeach
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Subtotal</td>
                                <td>{{$cur_symbol}}{{$invoice->amount}}</td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Discount</td>
                                <td><?php echo $invoice->discount_percent."%"; ?></td>
                            </tr>
                            <tr>
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Sales Tax</td>
                                <td><?php echo $cur_symbol.$invoice->tax_amount; ?></td>
                            </tr>
                            <tr class="border-bottom border border-0">
                                <td colspan="5" style="border:none"></td>
                                <td class="fw-semibold">Total</td>
                                <td><?php echo $cur_symbol.$invoice->amount_due; ?></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="d-block mt-5">
                    <div class="d-flex align-items-end justify-content-end">
                        <div class="d-block">
                            <p class="fw-bold">PAYMENT INFORMATION</p>
                            <p><?php echo "Terms: ".$invoice->terms; ?></p>
                            <p>PAYMENT TO: </p>
                            <p>
                                <span class="d-block"><?php echo "Account number: ".$invoice->pmt_account_number; ?></span>
                                <span class="d-block"><?php echo "Holder name: ".$invoice->pmt_account_name; ?></span>
                                <span class="d-block"><?php echo "Bank Name: ".$invoice->pmt_bank_name; ?></span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>