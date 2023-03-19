<div class="mt-3">
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2">
            <h4>Vital Signs</h4>
        </div>
        <?php
            $i =0; 
            foreach($consult->vital_signs as $item){
                   if($i==0) echo "<div class='row gy-2 py-3'>";
                    echo "<div class=\"col-sm-4\">
                            <span class=\"pe-2 fw-bold\">$item->description</span>
                            <span>$item->vital_sign_value</span>
                        </div>";
                   if ($i==2){
                    echo "</div>";
                    $i=0;
                   }else $i++;
            }
         ?>
   
        <!-- <div class="row gy-2 d-flex py-3">
            <div class="col-sm-4">
                <span class="pe-2 fw-bold">Blood Pressure</span>
                <span></span>
            </div>
            <div class="col-sm-4">
                <span class="pe-2 fw-bold">Body Temperature</span>
                <span></span>
            </div>
            <div class="col-sm-4">
                <span></span>
                <span></span>
            </div>
        </div> -->
    </div>
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2 mt-1">
            <h4>Medical History</h4>
        </div>
        <?php
         $i =0; 
         foreach($consult->medical_history as $key=>$value){
           if($i===0) echo " <div class='row gy-2 py-3'>";
                echo " <div class=\"col-sm-6\">
                <span class=\"pe-2 fw-bold d-block\">$key</span>
                    <span>$value</span>
                </div>";
           if($i===1){
            echo "</div>";
            $i =0;
           }else $i++; 
        
         }
        ?>      
  </div>
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2">
            <h4>Physical Examination</h4>
        </div>
        <div class="row gy-2 py-3">
          <div class='col-sm-12'><?php echo $consult->pe; ?></div>
        </div>
    </div>
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2">
            <h4>Laboratory Tests</h4>
        </div>
        <div class="row gy-2 py-3">
            <div class="col-sm-12">
                <div class="responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Test Name</th>
                                <th>Description</th>
                                <th>Laboratory Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php 
                             foreach($consult->labo_tests as $item) echo "<tr>
                             <td>$item->name</td>
                             <td></td>
                             <td></td>
                             </tr>";
                            ?> 
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2">
            <h4>Diagnosis</h4>
        </div>
        <div class="row gy-2 py-3">
            <div class="col-sm-12"><?php echo $consult->diagnosis; ?></div>
        </div>
    </div>
    <div class="d-block px-2 w-100 border-success border-bottom">
        <div class="py-2">
            <h4>Prescription</h4>
        </div>
        <div class="row gy-2 py-3">
            <div class="col-sm-12">
                <div class="responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Uages</th>
                                <th>Days</th>
                                <th>Reasons</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!--apply with loop-->
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="d-block px-2 w-100">
        <div class="py-2">
            <h4>Recommendations</h4>
        </div>
        <div class="row gy-2 py-3">
            <div class="col-sm-12"></div>
        </div>
    </div>
</div>