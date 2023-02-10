<style type="text/css">
</style>

<div class="d-block px-3">
    <div class="d-flex align-items-center w-100">
        <div class="d-flex align-items-center">
            <div style="width: 120px; height: 120px">
                <img class="img-thumbnail" src="<?php echo isset($branch->logo_url) ? $branch->logo_url:null; ?>"/>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100">
            <div class="px-2">
                <h4 class="fw-bold">
                    <?php echo isset($title) ? $title:null; ?>
                </h4>
            </div>
        </div>
    </div>
    <div class="d-flex align-items-center w-100 mt-5">
        <div class="d-block w-100 px-2">
            <p class="fw-bold fs-5">King Koko</p>
            <p>
                <span>5623</span>
                <span>King Koko</span>
            </p>
            <p>King Koko</p>
        </div>
    </div>
    <div class="d-flex align-items-center w-100 mt-4">
        <div class="d-block w-25 px-2">
            <p class="fw-bold">BILL TO</p>
            <p>King Koko</p>
            <p>
                <span>7361</span>
                <span>King Kong</span>
            </p>
            <p>King Kong</p>
        </div>
        <div class="d-block w-25 px-2">
            <p class="fw-bold">SHIP TO</p>
            <p>King Kong</p>
            <p>
                <span>3090</span>
                <span>King Kong</span>
            </p>
            <p>Test Blood</p>
        </div>
        <div class="d-flex w-50 px-2">
            <div class="d-block w-50 fw-bold">
                <p>INVOICE#</p>
                <p>INVOICE DATE</p>
                <p>P.O.#</p>
                <p>DUE DATE</p>
            </div>
            <div class="d-block w-50">
                <p>US-015</p>
                <p>18/08/2025</p>
                <p>636/6354</p>
                <p>12/05/2025</p>
            </div>
        </div>
    </div>
    <div class="table-responsive border rounded mt-5">
        <table class="table">
            <thead>
                <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th>UNIT PRICE</th>
                    <th>AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                <!--apply with loop-->
                <tr>
                    <td>t</td>
                    <td>t</td>
                    <td>t</td>
                    <td>t</td>
                </tr>
                <!--end::loop-->
                <tr>
                    <td colspan="2" style="border:none"></td>
                    <td>T</td>
                    <td>T</td>
                </tr>
                <tr>
                    <td colspan="2" style="border:none"></td>
                    <td>T</td>
                    <td>T</td>
                </tr>
                <tr class="border-bottom border border-0">
                    <td colspan="2" style="border:none"></td>
                    <td>T</td>
                    <td>T</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="d-block mt-5">
        <div class="d-flex align-items-end justify-content-end">
            <div class="d-block">
                <p class="fw-bold">TERMS & CONDITIONS</p>
                <p>Payment is due within 8 days</p>
                <p>Please make checks payable to: East Repair Inc.</p>
            </div>
        </div>
    </div>
</div>