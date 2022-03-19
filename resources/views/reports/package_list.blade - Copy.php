              <style>
    div.rpt-section-divider{
       display:block;
       width:50%;
       padding:10px;
       margin-top:7px;
       border-bottom:1.5px double green; 
    }
    div.rpt-section-divider span{
       display:block;
       padding:2px;
       font-size:1em;
       font-weight:bold;
       color:green;
    }
    table.rpt-package-list{
        margin-bottom:-7px;
    }
    table.rpt-package-list>thead th {
        color:grey;
        font-size:0.8em;
        text-transform:uppercase;
        font-weight:normal;
    }
    table.rpt-package-list>tbody td{
        font-size:0.8em;
        fontsize:normal; 
    }         
    </style> 
                <?php
                    function createPackageRow_html($row,$numero) {
                        return '<tr>'.
                        '<td>'.$numero.'</td>'.
                        '<td>'.$row->barcode.'</td>'.
                        '<td>'.$row->sender_name.'</td>'.
                        '<td>'.$row->sender_phone.'</td>'.
                        '<td>'.(empty($row->product_type)?'Generic':$row->product_type).'</td>'.
                        '<td>'.$row->receiver_phone.'</td>'.
                        '<td>'.$row->zone_name.'</td>'.
                        '<td>'.$row->driver_name.'</td>'.
                        '<td>'.(isset($row->cod_amount)?$row->cod_amount:0).'</td>'.
                        '<td>'.(isset($row->fees)?$row->fees:0).'</td>'.
                        '<td>'.$row->status.'</td>'.
                        '<td>'.(isset($row->notes)?$row->notes:null).'</td>'.
                        '</tr>';
                    }

                    $prev_cat = null;
                    $numero =0;
                    foreach($items as $row){
                        $this_cat = $row->date." (".$row->delivery_type.")";
                        $numero++;
                        if ($this_cat != $prev_cat) {
                             //close previous table tag if there is previous records or items being displayed
                             if ($prev_cat != null) { 
                               echo'</tbody></table>';
                             }

                             echo '<div class="rpt-section-divider"><span>'.$this_cat.'</span></div>';
                             echo '<table class="table rpt-package-list">
                             <thead>
                                 <tr>
                                     <th class="border-0  small font-weight-bold">No</th>
                                     <th class="border-0  small font-weight-bold">Barcode</th>
                                     <th class="border-0  small font-weight-bold">Merchant</th>
                                     <th class="border-0  small font-weight-bold">Merchant Phone</th>
                                     <th class="border-0  small font-weight-bold">Product Type</th>
                                     <th class="border-0  small font-weight-bold">Receiver Phone</th>
                                     <th class="border-0  small font-weight-bold">Destination</th>
                                     <th class="border-0  small font-weight-bold">Driver</th>
                                     <th class="border-0  small font-weight-bold">COD</th>
                                     <th class="border-0  small font-weight-bold">Fees</th>
                                     <th class="border-0 small font-weight-bold">Status</th>
                                     <th class="border-0 small font-weight-bold">Notes</th>
                                 </tr>
                             </thead><tbody>';
                             echo createPackageRow_html($row,$numero);
                             $prev_cat = $this_cat;
                        }else {
                            echo createPackageRow_html($row,$numero);
                        }
                    }
                 ?>
                        