<div id="_main_consultationQueueComponent" style="display:none;padding-top:15px">
    <div class="vs-contianer-custom">
        <div class="d-flex justify-content-between" style="padding:10px">
            <div class="d-flex col-md-6">
                <button class="btn btn-outline-primary border border-primary rounded-pill" id="_csq_btnNewAppointment">
                    <i class="fa fa-calendar-check"></i>
                    &nbsp;
                    <span class="trans-text" data-langprop="buttons.Add Ticket">Add Ticket</span>
                </button>
                <input id="_csq_search_ticket" style="width:50%;margin-right:10px;margin-left:10px" type="text" class="form-control" placeholder="Search ticket"/>
                <a id="_csq_btnFindTicket" class="btn btn-outline-success" href="javascript:void(0)">
                    <i class="fas fa-sync-alt"></i>
                </a>
            </div>
            <div class="d-flex justify-content-end col-md-4">
                <input data-select="datepicker" class="input-sm form-control" placeholder="Filter date" id="_csq_filter_date" autocomplete="off"/>
                &nbsp;
                <select class="input-sm" placeholder="Status" id="_csq_filter_status"></select>
            </div>
        </div>
        <div class="flat-box" style="margin:17px;padding:15px;overflow:auto;border-color:#A0DFF3;min-height:350px">
            <table class="table header-light-blue header-uppercase" id="_csq_tblTickets" style="margin-top:-25px !important"></table>
        </div>
    </div>
</div>