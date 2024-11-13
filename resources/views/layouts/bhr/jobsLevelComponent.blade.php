<div id="_main_jobsLevelComponent" style="display:none;padding:20px 0 0">
    <div class="top_level_card">
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
    </div>
    <div class="d-flex justify-content-between w-200 " id="container_jobLevel">
        <div class="d-flex align-items-center w-100 gap-2 ml-4">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_job_level_search" placeholder="Search job level ...">

                <button id="_sdl_btnSearch" role="button" class="btn btn-primary rounded-5">
                    <i class="la la-search"></i>
                </button>
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end gap-2 w-100 mr-4">
            <button type="button" class="btn_add" id="_btnAddJobLevel">
                <i class="fas fa-plus"></i>
                <span>Add Job level </span>
            </button>
        </div>
    </div>
    <div id="_job_level_list" class="m-4">
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
    #container_jobLevel {
        display: flex;
        height: 50px;
    }

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

    #_job_level_list {
        height: 350px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }
    #_job_level_list_paginator{
        bottom: 0;
    }
</style>
