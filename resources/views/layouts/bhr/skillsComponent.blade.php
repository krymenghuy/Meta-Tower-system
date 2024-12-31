
<div id="_main_skillsComponent" style="display:none;padding:20px 0 0;">
    <div class="d-flex justify-content-between p-3 mt-2 shadow rounded-2" id="_divFilter_skill">
        <div class="d-flex align-items-center w-100 gap-2">
           <div class="d-flex justify-content-start w-50">
                <button type="button" class="btn_add" style="background-color:#2b3991;" id="_btnAddSkill">
                    <i class="fas fa-plus"></i>
                    <span>Add Skill</span>
                </button>
           </div>
            <div class=" d-flex justify-content-end w-50">
                <div class="d-flex justify-content-end w-50">
                    <input type="text" class="form-control rounded-5 filter-field" placeholder="Search"  id="_search_skill">
                </div>
            </div>
        </div>
    </div>
    <div id="_skill_list" class="mt-3 px-3"></div>
    <div id="skill_container_pagination" style="background:#f5f5f5" class="px-3 d-flex justify-content-start"></div>

</div>
<style>
  .card-row-skill{
    display: flex;
    gap: 5px;

  }
  .card-container-skill:hover .action-buttons {
    display: flex !important; 
}

  .card-container-skill {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #dce5e5;
    padding: 10px;
    border-radius: 8px;
    height: 100%; /* Prevents overflow */

    }
    .card-skill-hover {
    transition: transform 0.3s ease,
    box-shadow 0.3s ease;
}
.card-skill-hover:hover {
    transform: scale(1.10);
    cursor: pointer;
    border:1px solid #2b3991 !important;
}
</style>