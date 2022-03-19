                        <hr class="my-2">
                        <?php
                          function create_category_id($item,$cols) {
                              $cat = null;
                              $data = (array)$item; 
                              foreach($cols as $col) {
                                 $cat .= $data[$col];
                              }
                              return $cat;
                          }
                          function createDetailList($items, $cat_cols = [],$cat_names){
                              $prev_cat = null;
                              foreach($items as $item){
                                $this_cat = create_category_id($item,$cat_cols); 
                              }  
                          }
                          
                        ?>
                        
                        <table class="table">
                                <thead>
                                    <tr>
                                        <th class="border-0 text-uppercase small font-weight-bold">Date</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Tracking#</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Delivery Type</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Driver Name</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Vehicle Type</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Packages</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">COD</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Base Fee</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Delivery Fee</th>
                                        <th class="border-0 text-uppercase small font-weight-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                       <?php
                                       foreach($items as $c){
                                          echo '<tr>
                                          <td>'.$c->depart_date.'</td>
                                          <td>'.$c->fleet_tracking_number.'</td>
                                          <td>'.$c->delivery_type.'</td>
                                          <td>'.$c->driver_name.'</td>
                                          <td>'.$c->vehicle_type.'</td>
                                          <td>'.$c->package_count.'</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>0</td>
                                          <td>'.$c->status.'</td>
                                          </tr>'; 
                                       }
                                       ?>                              
                                </tbody>
                            </table>