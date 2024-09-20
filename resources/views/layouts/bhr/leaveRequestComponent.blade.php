<div id="_main_leave_request_component">
    <div class="leave_header">
        <button id="_main_leave_request_btn_add" class="addLeave">+ Add</button>
        <input class="searchLeaveRequest" type="text" id="searchLeaveRequest" placeholder="search here............">
    </div>
    <div id="addLeavePopup" class="popup">
        <div class="popup-content">
            <h3>Add Leave Request</h3>
            <label for="employeeImage">Employee Image:</label>
            <input type="file" id="employeeImage" accept="image/*">
            <label for="employeeName">Employee Name:</label>
            <input type="text" id="employeeName" placeholder="Enter employee name">

            <label for="employeePosition">Position:</label>
            <input type="text" id="employeePosition" placeholder="Enter position">

            <label for="leaveDuration">Duration:</label>
            <input type="text" id="leaveDuration" placeholder="Enter duration (e.g., 20-25 September)">

            <label for="permissionDetail">Permission Detail:</label>
            <input type="text" id="permissionDetail" placeholder="Enter permission detail">

            <button id="addLeaveSubmit">Submit</button>
            <button id="closePopup">Cancel</button>
        </div>
    </div>
    <!-- View Leave Popup Modal -->
    <div id="viewLeavePopup" class="popup">
        <div class="popup-content">
            <span id="closeViewPopup" class="close">&times;</span>
            <h2>Leave Request Details</h2>
            <p><strong>Name:</strong> <span id="viewEmployeeName"></span></p>
            <p><strong>Position:</strong> <span id="viewEmployeePosition"></span></p>
            <p><strong>Duration:</strong> <span id="viewLeaveDuration"></span></p>
            <p><strong>Details:</strong> <span id="viewPermissionDetail"></span></p>
        </div>
        <div class="view_img">
            <img id="viewEmployeeImage" src="" alt="Employee Image" width="200" height="200">
        </div>
    </div>


    <div class="leave_footer">
        <div class="table_header">
            <h6>#</h6>
            <h6>Employee</h6>
            <h6>Duration</h6>
            <h6>Permission detail</h6>
            <h6>Status</h6>
            <h6>Action</h6>
        </div>
        <div class="table_footers">
            <div class="table_footer">
                <div class="table_id">AB01</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/maketing.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Ratana Khoeurn</h6>
                        <span>Digital Marketing</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
            <div class="table_footer">
                <div class="table_id">AB02</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/backend.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Ratha Khoeurn</h6>
                        <span>Backend Developer</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
            <div class="table_footer">
                <div class="table_id">AB03</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/software.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Khavy Khoeurn</h6>
                        <span>Sky Bartender</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
            <div class="table_footer">
                <div class="table_id">AB04</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/frontend.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Vicheka Khoeurn</h6>
                        <span>Cooker</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
            <div class="table_footer">
                <div class="table_id">AB05</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/fullstack.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Ratanak Khoeurn</h6>
                        <span>Web Developer</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
            <div class="table_footer">
                <div class="table_id">AB06</div>
                <div class="employee">
                    <div class="em_left">
                        <img src="assets/images/skills/hr.png" alt="User" width="60" height="60">
                    </div>
                    <div class="em_right">
                        <h6>Leakhena Khoeurn</h6>
                        <span>Student</span>
                    </div>
                </div>
                <div class="duration">
                    <span>20-25 September</span>
                </div>
                <div class="permission_detail">Go Hometown</div>
                <div class="status">
                    <button>Pending</button>
                </div>
                <div class="actions">
                    <i class="fa fa-check-circle"></i>
                    <i class="fa fa-times-circle"></i>
                    <i class="fa fa-pencil-square"></i>
                    <i class="fa fa-eye"></i>
                    <i class="fa fa-trash"></i>
                </div>

            </div>
        </div>
    </div>
</div>
<style>
    #_main_leave_request_component {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    #_main_leave_request_btn_add {
        display: flex;
        border: none;
        align-items: center;
        justify-content: center;
        background-color: #007bff;
        color: #fff;
        padding: 10px 20px;
        width: 100px;
        border-radius: 5px;
        cursor: pointer;
    }

    .searchLeaveRequest {
        padding: 10px;
        border: 1px solid #e2e0e0;
        border-radius: 50px;
        width: 500px;
        background-color: #f8f9fa;
    }

    #_main_leave_request_btn_add:hover {
        background-color: #00e1ff;
    }

    .leave_header {
        display: flex;
        margin: 20px;
        gap: 2rem;
    }

    .leave_footer {
        display: grid;
        grid-template-columns: 1fr;
        margin-top: 20px;
    }

    .table_footers {
        display: grid;
        margin: 0 20px;
        height: 550px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .table_header,
    .table_footer {
        display: grid;
        grid-template-columns: 0.5fr 2fr 1.5fr 2fr 1fr 1fr;
        align-items: center;
        gap: 20px;
        padding: 10px;
    }

    .table_header {
        background-color: #E1ECF7;
        color: #000;
        margin: 0px 20px;
        border-radius: 10px 10px 0px 0px
    }

    .table_footer {
        background-color: #ffffff;
        height: 90px;
        border-bottom: 1px solid #000;
    }

    .table_footer:hover {
        background-color: #00ddff30;
    }

    .employee {
        display: grid;
        grid-template-columns: 70px 1fr;
        align-items: center;
        gap: 10px;
    }

    .em_left {
        width: 60px;
        height: 60px;
        background-color: #ffffffa4;
        border-radius: 50%;
    }

    .em_left img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 50%;
    }

    .em_right {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .status button {
        padding: 5px 10px;
        border: none;
        width: 100px;
        border-radius: 20px;
        cursor: pointer;
        background-color: rgba(232, 183, 35, 0.984);
        color: white;
    }

    .status button:hover {
        background-color: rgb(192, 236, 33);
    }

    .actions {
        display: flex;
        gap: 10px;
        margin-left: 0;
    }

    .actions i {
        cursor: pointer;
    }

    .fa-check-circle {
        color: rgb(104, 216, 104);
    }

    .fa-times-circle {
        color: rgb(224, 4, 4);
    }

    .fa-pencil-square {
        color: rgb(255, 153, 0);
    }

    .fa-eye {
        color: rgb(153, 153, 255);
    }

    .fa-trash {
        color: rgb(238, 86, 86);
    }

    .fa-check-circle:hover {
        color: rgb(2, 77, 2);
    }

    .fa-pencil-square:hover {
        color: rgb(255, 102, 0);
    }

    .fa-eye:hover {
        color: rgb(0, 153, 255);
    }

    .fa-trash:hover {
        color: rgb(238, 0, 0);
    }

    .popup {
        display: none;
        position: fixed;
        width: 50%;
        height: 65%;
        top: 52%;
        left: 43.5%;
        border-radius: 20px;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .popup-content h3 {
        margin-top: 0;
    }

    .popup-content input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid rgba(155, 155, 155, 0.73);
        border-radius: 5px;
        outline: none;
    }

    #addLeaveSubmit {
        margin-right: 10px;
        padding: 10px 20px;
        border: none;
        background-color: #007bff;
        color: #fff;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 10px;
    }

    #addLeaveSubmit:hover {
        background-color: #00e1ff;
    }

    #closePopup {
        margin-left: 10px;
        padding: 10px 20px;
        border: none;
        background-color: #f92f2f;
        color: #fff;
        border-radius: 20px;
        cursor: pointer;
        margin-top: 10px;
    }

    .popup.show {
        display: block;
    }

    button.approved {
        background-color: #4CAF50;
        color: white;
        padding: 5px 10px;
        border: none;
        width: 100px;
        cursor: default;
    }

    button.rejected {
        background-color: #ff0000;
        color: white;
        padding: 5px 10px;
        border: none;
        width: 100px;
        cursor: default;
    }

    .popup-modal {
        display: none;
        /* Hidden by default */
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
        /* Black background with opacity */
    }

    /* Modal content */
    .popup-contents {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        gap: 20px;
        border: 1px solid #888;
        width: 50%;
        height: 40%;
        border-radius: 8px;
    }

    .popup-contents p {
        margin-top: 40px;
    }
    .view_img{
        width: 200px;
        height: 200px;
        margin-left: 50%;
        margin-top: -25%;
    }
    /* Close button */
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    /* Show the popup when the 'show' class is added */
    .popup-modal.show {
        display: block;
    }
</style>
