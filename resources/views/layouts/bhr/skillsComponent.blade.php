
<div id="_main_skillsComponent" style="display:none;padding:20px 0 0">
    <div class="d-flex p-3 justify-content-between bg-white " id="_divFilter_skill">
        <div class="d-flex align-items-center w-100 gap-2">
           <div class="d-flex justify-content-start w-50">
                <button type="button" class="btn_add" style="background-color:#2b3991;" id="_btnAddSkill">
                    <i class="fas fa-plus"></i>
                    <span>Add Skill</span>
                </button>
           </div>
            <div class=" d-flex justify-content-end w-50">
                <div class="d-flex justify-content-end w-50">
                    <input type="text" class="form-control rounded-5 filter-field" placeholder="search skill"  id="_search_skill">
                </div>
            </div>
        </div>
    </div>
    <div id="_skill_list" class="m-4">
    </div>
</div>
<style>
  .card-row-skill{
    display: flex;
    gap: 5px;

  }
  .card-container-skill {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dce5e5;
    padding: 14px;
    border-radius: 8px;
    height: 100%; /* Prevents overflow */

    }
</style>