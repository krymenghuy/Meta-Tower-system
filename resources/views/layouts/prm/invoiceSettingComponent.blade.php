<div id="_main_invoiceSetting_component" class="mobile-padding p-3" style="display:none;">
    <div class="rounded-2 p-4 bg-white shadow-sm" style="max-width: 600px;">
        <h5 class="mb-4 text-primary-custom border-bottom pb-2">Electricity Utility Settings</h5>
        
        <div class="row g-3 align-items-center mb-3">
            <div class="col-12 col-md-4">
                <label for="exchange_rate_khr" class="form-label fw-semibold mb-0">Exchange Rate (KHR)</label>
                <div class="small text-muted">1 USD = ? KHR</div>
            </div>
            <div class="col-12 col-md-8">
                <div class="input-group">
                    <span class="input-group-text">៛</span>
                    <input type="number" class="form-control data-input" id="exchange_rate_khr" placeholder="e.g. 4000" min="1" step="any">
                </div>
            </div>
        </div>

        <div class="mt-4 text-end">
            <button type="button" class="btnAddNewPrm" id="_btnSaveSettings">
                <i class="fa-solid fa-save me-2"></i>
                <span vslang="buttons.Save Settings">Save Settings</span>
            </button>
        </div>
    </div>
</div>
