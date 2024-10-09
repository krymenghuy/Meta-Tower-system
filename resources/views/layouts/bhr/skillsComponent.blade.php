<style>
/* form */

.container {
  display: flex;
  gap: 20px;
  margin: 10px;
}

#btnAdd {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

#btnAdd i {
  margin-right: 10px;
}

#btnAdd:hover {
  background-color: #0056b3;
  color: white;
}

.searchSkill {
  padding: 10px;
  border: 1px solid #e2e0e0;
  border-radius: 50px;
  width: 500px;
  background-color: #f8f9fa;
}

.table-container {
  margin-top: 50px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* endform */
.card_header {
  display: flex;
  justify-content: space-between;
}

.card_header h3 {
  width: 70%;
  height: 55px;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.card_header img {
  border-radius: 10px;
  width: 100px;
  height: 100px;
  right: 20px;
  top: 20px;
  position: absolute;
}

.default p
{
  display: flex;
  margin-top: 10px;
  height: 80px;
  width: 70%;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
}

.default
{
  padding: 20px;
  width: 370px;
  height: 250px;
  position: relative;
  border: none;
  border-radius: 20px;
  border-radius: 20px;
  color: white;
}

.default:hover
{
  background-color: rgb(205, 131, 255);
  cursor: pointer;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.564);
  scale: 1.02;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  justify-content: space-between;
  gap: 2rem;

}
.default {
  background-color: rgb(227, 127, 4);
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.564);
}

    .marketing {
        background-color: rgb(227, 205, 4);
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.564);
    }

    .HR {
        background-color: rgb(234, 109, 7);
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.564);
    }

    .DB {
        background-color: rgb(31, 125, 213);
        box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.564);
    }



.count_staff {
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
  font-size: 16px;
}

.count {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.action {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}
    .action {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }
    .action i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        transition: color 0.3s ease;
    }

.action .fa-pen:hover {
  cursor: pointer;
  transition: color 0.3s ease;
  color: rgb(0, 89, 255);
  scale: 1.2;
}

.action .fa-trash:hover {
  cursor: pointer;
  transition: color 0.3s ease;
  color: red;
  scale: 1.2;
}

</style>
<div id="_main_skillsComponent"  style="display:none;padding:20px 0 0">
    <div class="d-flex  p-3 justify-content-between w-100 " id="_divFilter_skill">
        <div class="d-flex align-items-center w-50 gap-2">
            <div class="w-50">
                <input type="text" class="form-control filter-field" id="_sdl_search_skill"
                    placeholder="Search Skill">
            </div>
            <button id="_sdl_btnSearch" role="button" class="btn btn-primary">
                <i class="la la-search"></i>
            </button>
            <button type="button" class="btn btn-primary" id="_btnAddSkill">
                <i class="fas fa-plus"></i>
                <span>Add Skill</span>
            </button>
        </div>


    </div>

    <div class="p-3">
        <div id="_skill_list" class="bg-white _skills"></div>
    </div>
</div>
