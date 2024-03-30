<style>
  span.vs-underlined-title{
    font-weight:bold;
    display:inline-block;
    padding:5px;
    border-bottom:2.5px solid orange;
  }

  div.border-left:before{
    content:'';
    width:2px;
    height:350px;
    background:red;
  }
</style>

<div id="_main_generalSettingsComponent" style="display:none;width:100%;background:#fff">
  <ul class="nav nav-tabs nav-tabs-line nav-semi-bold mb-5">
    <li class="nav-item">
      <a class="nav-link active" data-toggle="tab" href="#kt_tab_pane_1">
        <span class="nav-icon">
          <i class="flaticon2-chat-1"></i>
        </span>
        <span class="nav-text">Active</span>
      </a>
    </li>
      <li class="nav-item">
        <a class="nav-link" data-toggle="tab" href="#kt_tab_pane_2" aria-disabled="false">
          <span class="nav-icon">
            <i class="flaticon2-pie-chart-4"></i>
          </span>
          <span class="nav-text">Link</span>
        </a>
      </li>
  </ul>
  <div style="margin:auto;width:90%">
    <div style="border:1.2px solid green;padding:15px;border-radius:3px;margin-top:35px">
      <div class="row">
        <div style="width:50%;float:left">
          <span class="vs-underlined-title">BUSINESS TYPES</span>
          &nbsp;
          <a href="javascript:void(0)">
            <i class="fa fa-plus" style="color:green"></i>
          </a>
          <div style="padding:15px 0px 15px 15px">
            <table class="fixed-body-table" id="_gsttn_tblBusinessTypes">
              <tbody style="height:350px">
                <tr>
                  <td>Cosmetics</td>
                </tr>
                <tr>
                  <td>Clothing</td>
                </tr>
              </tbody>
            </table>      
          </div>        
        </div>
        <div class="broder-left" style="width:50%;float:right">
            <span class="vs-underlined-title">PRODUCT TYPES</span>
            &nbsp;
            <a href="javascript:void(0)">
              <i class="fa fa-plus" style="color:green"></i>
            </a>
            <div style="padding:15px 0px 15px 15px">
              <table class="fixed-body-table" id="_gsttn_tblProductTypes">
                <tbody style="height:350px">
                  <tr>
                    <td>Cosmetics</td>
                  </tr>
                  <tr>
                    <td>Clothing</td>
                  </tr>
                </tbody>
              </table>     
            </div>     
        </div>
      </div>
      <button id="btnSendMessage" class="btn btn-default">Send Message</button> 
      <div class="ck_editor" style="width:90%">
        <textarea id="_textEditor" class="ckeditor form-control" name="wysiwyg-editor"></textarea>
      </div>
      <div style="margin-top:15px">
        <button id="_rc_filter_btnSaveChanges" class="btn btn-primary">
          <i class="fa fa-list-alt"></i>
          Save Changes
        </button>
      </div>               
    </div>
  </div>
</div>