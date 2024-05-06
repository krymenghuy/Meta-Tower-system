<div id="_main_commentsComponent" style="display:none">
    <div class="p-3 mt-4 d-flex flex-column">
        <div class="d-flex flex-row justify-content-between shadow rounded-3 bg-white p-3">
            <div class="d-flex flex-row gap-2" style="min-width:30%">
                <select class="modal-select2" id="_ucl_filter_agent_type">
                    <option value="">All Types</option>
                    <option value="1">Full Time</option>
                    <option value="2">Freelancer</option>
                </select> 
            </div>
            <div class="d-flex flex-row gap-2">
                <button class="btn btn-sm btn-info" id="_ucl_btnPrint"><i class="fa fa-print"></i> Print</button>
            </div>
        </div>
        <div class="shadow rounded-3 p-3 mt-3 w-100">
            <div id="_ucl_comments"></div>  
        </div>
    </div>
</div>

<!-- Modal confirm delete -->
<div class="modal fade" id="confirmDeleteModal" tabindex="-1" role="dialog"
    aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-warning" id="confirmDeleteModalLabel">Confirm Delete</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this item?
            </div>
            <div class="modal-footer">
                <!-- Button to cancel -->
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <!-- Button to confirm delete -->
                <button type="button" class="btn btn-warning" id="confirmDeleteBtn">Delete</button>
            </div>
        </div>
    </div>
</div>