<div id="_main_payrollListComponent" style="display:none;padding:20px 0 0">
    <div id="sub_content" class="p-0">
        <div class="d-flex justify-content-between w-100 p-2" id="_divFilter">
            <div class="d-flex align-items-center w-50 gap-2">
                <div class="d-flex align-items-center justify-content-end gap-2 w-50 pl-2">
                    <select type="id" id="el_filter_payrollList" class="data-input filter-field"></select>
                </div>
                <div class="d-flex align-items-center justify-content-end gap-2 w-25 pl-2">
                    <select type="id" id="el_filter_branch" class="data-input filter-field"></select>
                </div>
                <div class="d-flex align-items-center justify-content-end gap-2 w-25 pl-2">
                    <select type="id" id="el_sort_by" class="data-input filter-field"></select>
                </div>
            </div>

            <div class="d-flex align-items-center justify-content-end w-50 gap-2 pr-3">
                <button type="button" class="btn btn-primary" id="_btnImport" title="Import">
                    <i class="fa-solid fa-file-import" style="color: white;"></i>
                    <span></span>
                </button>
                <button type="button" class="btn btn-primary" id="_btnCalculate" title="Calculate">
                    <i class="fas fa-calculator"></i>
                    <span></span>
                </button>
                <button type="button" class="btn btn-primary" id="_btnDisburse" title="Disburse">
                    <i class="fa-solid fa-square-check"></i>
                    <span></span>
                </button>
            </div>
        </div>
        <div id="_payrollList_list" class="m-4"></div>
    </div>

    <div class="d-none" id="payment_slip">
        <div class="d-flex px-3 pt-3" id="btn_back">
            <button id="_btn_backTo_payrollList" style="background-color:#2b3991; width:100px;"
                class="btn text-white shadow rounded-4 m-2 p-2" type="button">
                <i class="fa-solid fa-angles-left "></i>
                <span class="" vslang="buttons.Back">Back</span>
            </button>
        </div>
        <div id="payment_info" class="payment_info">
            <div class="payment_card">
                <div class="payment-header">
                    <div class="payment-logo">
                        <img src="{{ asset('assets/images/logo/lc_logo.svg') }}" alt="Company Logo">
                    </div>
                    <div class="payment-title">
                        <h3>Payment Slip</h3>
                    </div>
                </div>


                <div class="payment_profile">
                    <div class="row cols-2 mb-0">
                        <div class="col-2">
                            <div class="payment_img" data-id="" data-imageurl="">
                                <img src="../uploads/public/1_data/default/images/mr.avif" alt="Profile Image">
                            </div>
                        </div>
                        <div class="col-5 p_profile_left">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee Name</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize data-get">Sok San</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Sex</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">Male</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Employee ID</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap">LC100015</p>
                            </div>
                        </div>
                        <div class="col-5 p_profile_right">
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Branch</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">BTB</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Position</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">Web-developer</p>
                            </div>
                            <div class="d-flex">
                                <p class="text-nowrap text-muted width-p">Join Date</p>
                                <p class="px-2">:</p>
                                <p class="text-nowrap text-capitalize">01 Oct 2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="payment_table row">
                    <table class="table left-table col-6">
                        <thead>
                            <tr>
                                <th>Catagory</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Bese Salary</td>
                                <td>$500</td>
                            </tr>
                            <tr>
                                <td>Base Allowance</td>
                                <td>$100</td>
                            </tr>
                            <tr>
                                <td>Base Bias</td>
                                <td>$20</td>
                            </tr>
                            <tr>
                                <td>Benefit</td>
                                <td>$20</td>
                            </tr>
                            <tr>
                                <td>Deduction</td>
                                <td>$10</td>
                            </tr>

                        </tbody>
                    </table>


                    <table class="table right-table col-6">
                        <thead>
                            <tr>
                                <th>Catagory</th>
                                <th>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td> Salary </td>
                                <td>$500</td>
                            </tr>
                            <tr>
                                <td>Allowance</td>
                                <td>$10</td>
                            </tr>
                            <tr>
                                <td>Bias</td>
                                <td>$10</td>
                            </tr>
                            <tr>
                                <td>Tax Base</td>
                                <td>$10</td>
                            </tr>
                            <tr>
                                <td>Tax Benefit</td>
                                <td>$10</td>
                            </tr>
                            <tr>
                                <td>Total Salary</td>
                                <td class="total_salary">$450</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Footer Buttons -->
                <div class="payment_footer">
                    <button class="pay-btn">Pay</button>
                    <button class="print-btn">Print</button>
                </div>
            </div>
        </div>


    </div>
</div>

<style>
    #_payrollList_list {
        height: 480px;
        padding-bottom: 80px;
        overflow-y: scroll;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    #_payrollList_list_paginator {
        bottom: 0;
        display: flex;
        position: fixed;
    }
    .payment_card {

        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        padding: 10px;
        width: 1000px;


    }
    .payment_info {
        display: flex;
        justify-content: center;
        height: 480px;
        gap: 10px;
        padding: 10px;
    }

    .payment-header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 10px;
    padding-bottom: 20px;
    }
    .payment-logo {
        position: absolute;
        left: 0;
    }

    .payment-title {
        text-align: center;
        flex-grow: 1;
    }
    .payment_profile {
        gap: 10px;
        justify-content: center;
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
    }

    .payment_img {
        display: flex;
        justify-content: start;
        width: 80px;
        height: 80px;
        overflow: hidden;
        border-radius: 50%;

    }
    .p_profile_left{
        display: flex;
        flex-direction: column;
        justify-content: start;
    }
    .payment_table{
        display: flex;
        gap: 10px;
        padding: 10px;
    }
    .payment_footer{
        display: flex;
        justify-content: right;
        gap: 10px;
        padding: 10px;
    }
    .pay-btn{
        background-color: #B6FFA1;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .print-btn{
        background-color: #87A2FF;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .total_salary{
        color: #00FF9C;
    }
</style>
