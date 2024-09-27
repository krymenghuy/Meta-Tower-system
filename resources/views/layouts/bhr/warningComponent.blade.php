<div id="_main_warningComponent" style="display:none;padding:20px 0 0">
    <div class="warning_top">
        <h4>Report</h4>
        <div class="search">
            <input type="text" id="_warning_search" placeholder="Search Warning Here ........">
        </div>
        <div class="top_actions">
            <div class="btnAddWarning"><i class="fa fa-plus"></i>Add Warning</div>
            <div class="btnExportWarning"><i class="fa fa-download"></i>Export Warning</div>
        </div>
        <!-- Modal for Adding New Warning -->
        <div class="modal fade" id="addWarningModal" tabindex="-1" aria-labelledby="addWarningModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="addWarningModalLabel">Add New Warning</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="warningForm">
                            <div class="mb-3">
                                <label for="employeeName" class="form-label">Employee Name</label>
                                <input type="text" class="form-control" id="employeeNames" required>
                            </div>
                            <div class="mb-3">
                                <label for="employeeEmail" class="form-label">Employee Email</label>
                                <input type="email" class="form-control" id="employeeEmails" required>
                            </div>
                            <div class="mb-3">
                                <label for="employeePosition" class="form-label">Position</label>
                                <input type="text" class="form-control" id="employeePositions" required>
                            </div>
                            <div class="mb-3">
                                <label for="warningIssues" class="form-label">Issues</label>
                                <textarea class="form-control" id="warningIssues" rows="2" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="warningPromises" class="form-label">Promises</label>
                                <textarea class="form-control" id="warningPromises" rows="2" required></textarea>
                            </div>
                            <div class="warning">
                                <select class="form-select" id="warningSelect1" aria-label="Warning select">
                                    <!-- Changed ID here -->
                                    <option selected>Warnings</option>
                                    <option value="1">Warning 1</option>
                                    <option value="2">Warning 2</option>
                                    <option value="3">Warning 3</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="saveWarningBtn">Save Warning</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <div class="warning_center">
        <div class="warning_header">
            <div class="name">Name</div>
            <div class="position">Position</div>
            <div class="issues">Issues</div>
            <div class="promises">Promises</div>
            <div class="warning">Warning</div>
            <div class="actions"></div>
        </div>
        <div class="warning_body">
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
            <div class="warning_item">
                <div class="info">
                    <div class="info_left">
                        <img src="assets/images/skills/maketing.png" alt="User">
                    </div>
                    <div class="info_right">
                        <h6>Ratana Khoeurn</h6>
                        <span class="email">ratanak.khoeurn@student.passerellesnumeriques.org</span>
                    </div>
                </div>
                <div class="position">Software Engineer</div>
                <div class="issues">Listening music during working time, and make noise disturb to other people around
                    him</div>
                <div class="promises">Don't do like this again</div>
                <div class="warning">
                    <select class="form-select" id="warningSelect" aria-label="Warning select">
                        <option selected>Warnings</option>
                        <option value="1">Warning 1</option>
                        <option value="2">Warning 2</option>
                        <option value="3">Warning 3</option>
                    </select>
                </div>
                <div class="action">
                    <i class="fa fa-ellipsis-v"></i>
                </div>
            </div>
        </div>
    </div>
</div>
<style>
    #_main_warningComponent {
        padding: 40px 20px;
    }

    .warning_center {
        max-width: 100%;
        margin: 0 auto;
    }

    .warning_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    #_warning_search {
        width: 500px;
        padding: 10px 20px;
        border-radius: 20px;
        border: 1px solid #ccc;
        background-color: #fff;
        display: flex;
        align-items: center;
        outline: none;
        gap: 10px;
    }

    .top_actions {
        display: flex;
        align-items: center;
        margin-right: 5px;
        gap: 20px;
    }

    .btnAddWarning,
    .btnExportWarning {
        padding: 10px 20px;
        background-color: #2b5f92;
        color: #fff;
        border: none;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }

    .btnAddWarning:hover,
    .btnExportWarning:hover {
        background-color: #2989b8;
    }

    .warning_header {
        display: grid;
        grid-template-columns: 1.5fr 1fr 2fr 1fr 1fr 50px;
        padding: 10px 20px;
        margin-top: 10px;
        border-bottom: 1px solid #ccc;
        background-color: #2B3992;
        border-radius: 10px;
        color: #fff;
    }

    .warning_header .name {
        margin-left: 0px;
    }

    .warning_header .position {
        margin-left: 5px;
    }

    .warning_header .promises {
        margin-left: -5px;
    }

    .warning_header .date {
        margin-left: -10px;
    }

    .warning_header .name:hover,
    .warning_header .position:hover,
    .warning_header .issues:hover,
    .warning_header .promises:hover,
    .warning_header .warning:hover {
        color: rgb(243, 219, 0);
        text-decoration: underline;
        transition: color 0.3s ease-in-out;
        cursor: pointer;
    }

    .warning_item {
        display: grid;
        grid-template-columns: 1.5fr 1fr 2fr 1fr 1fr 50px;
        height: 80px;
        padding: 0px 25px;
        border-bottom: 1px solid #ccc;
        background-color: #250384;
        border-radius: 10px;
        align-items: center;
        color: #fff;
    }

    .warning_item:hover {
        background-color: #2b5f92;
        cursor: pointer;

    }

    .info {
        display: flex;
        align-items: center;
        gap: 5px;
        justify-content: flex-start;
    }

    .info_left {
        background-color: rgb(119, 223, 249);
        border-radius: 100%;
        width: 60px;
        height: 50px;
    }

    .info_left img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
    }

    .info_right {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .email {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
    }

    .warning_body {
        display: flex;
        margin-top: 10px;
        height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        flex-direction: column;
    }

    .warning_header div,
    .warning_item div {
        padding: 10px;
        text-align: left;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .warning_item .position,
    .warning_item .issues {
        text-overflow: ellipsis;
    }

    .warning_item .action {
        display: flex;
        justify-content: flex-end;
        text-align: center;
        margin-left: 40px;
    }

    .action i {
        cursor: pointer;
        font-size: 1.5em;
        color: #ffffff;
    }
</style>
