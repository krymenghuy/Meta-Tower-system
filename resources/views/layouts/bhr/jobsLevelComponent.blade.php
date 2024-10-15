<div id="_main_jobsLevelComponent" style="display:none;padding:20px 0 0">
    <div class="top_level_card">
        <div class="card_title">TOP JOBS</div>
        <div class="top_level_cards">
            <div class="top_level_card1">
                <div class="card_left">
                    <img src="assets/images/skills/software.png" alt="">
                </div>
                <div class="card_right">
                    <h6>Information Technology</h6>
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
                    <h6>Backend Development</h6>
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
                    <h6>Marketing</h6>
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
    <div class="container">
        <button type="button" class="btn" id="_btnAddJobLevel">
            <i class="fas fa-plus"></i>
            <span>Add</span>
        </button>
        <div class="input-group">
            <input class="_job_level_search" type="text" id="_job_level_search" placeholder="Search here.....">
        </div>
    </div>
    <div id="_job_level_list">
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
    .container {
        display: flex;
        gap: 20px;
        margin-top: -100px;
    }

    #_btnAddJobLevel {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    #_btnAddJobLevel i {
        margin-right: 10px;
    }

    #btnAdd:hover {
        background-color: #0056b3;
        color: white;
    }

    ._job_level_search {
        padding: 10px;
        border: 1px solid #e2e0e0;
        border-radius: 50px;
        width: 500px;
        background-color: #f8f9fa;
    }

    /* endform */

    /* top_level_cards */
    .top_level_card {
        display: flex;
        flex-direction: column;
        height: 300px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        padding: 20px;
    }

    .card_title {
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
        /* width: 100px; */
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
        height: 300px;
        padding: 10px 20px 0px 20px;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
    }

    .actions {
        cursor: pointer;
        font-size: 18px;
        margin-left: 10px;
    }

    .action-menu {
        display: flex;
        flex-direction: column;
        background-color: white;
        border: 1px solid #ccc;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
        font-size: 14px;
        border-radius: 4px;
        width: 50px;
        align-items: center;
        padding: 10px;
        margin-left: 10px;
        gap: 1rem;

    }

    .action-menu i:hover {
        color: #007bff;
        cursor: pointer;
        transition: color 0.3s;
        scale: 1.1;
    }
    #_job_level_list_paginator{
        display: flex;
        position: fixed;
        bottom: 0;
    }
</style>
