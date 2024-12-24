<div id="_main_jobsLevelComponent" style="display:none;padding:20px;">
    <!-- <div class="top_level_card">
        <div class="top_job_title">TOP JOBS</div>
        <div class="top_level_cards">
            <div class="top_level_card1">
                <div class="card_left">
                    <img src="assets/images/skills/software.png" alt="">
                </div>
                <div class="card_right">
                    <h6 class="card_title">Information Technology</h6>
                    <div class="rating">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
            </div>
            <div class="top_level_card2">
                <div class="card_left">
                    <img src="assets/images/skills/backend.png" alt="">
                </div>
                <div class="card_right">
                    <h6 class="card_title">Backend Development</h6>
                    <div class="rating">
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
            </div>
            <div class="top_level_card3">
                <div class="card_left">
                    <img src="assets/images/skills/maketing.png" alt="">
                </div>
                <div class="card_right">
                    <h6 class="card_title">Marketing</h6>
                    <div class="rating">
                        rating:
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
            </div>
        </div>
    </div> -->
    <div class="d-flex justify-content-between bg-white rounded-3 shadow mt-3 py-3 w-100 " id="container_jobLevel">
        <div class="d-flex align-items-center w-100 px-3">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_job_level_search" placeholder="Search job level ...">
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end px-3 w-100">
            <button type="button" class="btn_add" id="_btnAddJobLevel">
                <span>Create Job Level</span>
            </button>
        </div>
    </div>
    <div id="_job_level_list" class="mt-4">
    </div>
</div>
<style>
    .caption-top {
        margin: 20px;
    }

    .fa-star {
        color: gold
    }

    /* form */
    /* #container_jobLevel {
        display: flex;
        height: 50px;
    } */

    /* endform */

    /* top_level_cards */
    .top_level_card {
        display: flex;
        flex-direction: column;
        height: 190px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        padding: 20px;
    }

    .top_job_title {
        font-size: 24px;
        font-weight: bold;
    }

    .top_level_cards {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;

    }

    .top_level_card1,
    .top_level_card2,
    .top_level_card3 {
        height: 120px;
        width: 300px;
        background-color: #f8f9fa;
        box-shadow: 0 4px 8px 0 rgba(30, 30, 30, 0.149);
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        position: relative;
    }

    .card_left {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 35%;
    }

    .card_left img {
        display: flex;
        position: absolute;
        width: 60px;
        height: 60px;
    }

    .card_right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: nowrap;
        max-width: 180px;
    }

</style>
