<div id="_main_jobsLevelComponent">
    <div class="top_level_card">
        <div class="card_title">TOP JOBS</div>
        <div class="cards">
            <div class="card1">
                <div class="card_left">
                    <img src="assets/images/skills/software.png" alt="">
                </div>
                <div class="card_right">
                    <h6>Information Technology</h6>
                    <p>Level: Pro</p>
                    <div class="rating">Rating:
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
            </div>
            <div class="card2">
                <div class="card_left">
                    <img src="assets/images/skills/backend.png" alt="">
                </div>
                <div class="card_right">
                    <h6>Backend Development</h6>
                    <p>Level: Pro</p>
                    <div class="rating">Rating:
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                    </div>
                </div>
            </div>
            <div class="card3">
                <div class="card_left">
                    <img src="assets/images/skills/maketing.png" alt="">
                </div>
                <div class="card_right">
                    <h6>Marketing</h6>
                    <p>Level: Pro</p>
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
        <button type="button" class="btn" id="btnAdd">
            <i class="fas fa-plus"></i>
            <span>Add</span>
        </button>
        <div class="input-group">
            <input class="searchJobLevel" type="text" id="searchJobLevel" placeholder="Search here.....">
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
        margin-top: 0px;
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

    .searchJobLevel{
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

    /* cards */
    .top_level_card {
        display: flex;
        flex-direction: column;
        height: 300px;
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: none;
        margin-top: 15px;
    }

    .card_title {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 20px;
        margin-left: 20px;
    }

    .cards {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 10px;
        margin: 0px 20px 0px 20px;

    }

    .card1,
    .card2,
    .card3 {
        background-color: #9be3df85;
        padding: 20px;
        border-radius: 10px;
        gap: 2rem;
        width: 350px;
        height: 200px;
        display: flex;
        position: relative;
        justify-content: center;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
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
        width: 120px;
        height: 120px;
    }

    .card_right {
        width: 65%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
    }

    #_job_level_list {
        height: 330px;
        margin-top: 10px;
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
</style>
