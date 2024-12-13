<div id="_main_exit_form_component" style="display:none;padding:20px 0 0">
    <div class="d-flex justify-content-between bg-white rounded-3 shadow mt-3 w-100 p-4" id="container_exit_form">
        <div class="d-flex align-items-center w-100 gap-2">
            <div class="d-flex align-items-center w-50 gap-2">
                <input type="text" class="form-control filter-field btn_search" id="_exit_form_search"
                    placeholder="Search exit form ...">
            </div>
        </div>
        <div class="d-flex align-items-center justify-content-end w-100 gap-2">
            <button type="button" class="btn_add" id="_btnPrintExitForm">
                <span vslang="titles.Print Exit Form"></span>
            </button>
            <button type="button" class="btn_add" id="_btnAddExitForm">
                <span vslang="titles.Create Exit Form"></span>
            </button>
        </div>

    </div>
    <div id="_exit_form_list" class="mt-4 p-4">
    </div>
    <div class="d-none container mt-4" id="view_exit_form_">
        <h5 class="text-center mb-4">ឯកសារដែលត្រូវនាំមកជូន</h5>

        <div class="row mb-3">
            <div class="col-md-6">
                <label>ឈ្មោះបុគ្គលិក:</label>
                <input type="text" class="form-control">
            </div>
            <div class="col-md-6">
                <label>ផ្នែក:</label>
                <input type="text" class="form-control">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-6">
                <label>តួនាទី/មុខងារ:</label>
                <input type="text" class="form-control">
            </div>
            <div class="col-md-6">
                <label>ប្រចាំទីតាំង:</label>
                <input type="text" class="form-control">
            </div>
        </div>

        <div class="row mb-3">
            <div class="col-md-12">
                <label>គោលបំណង:</label>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="purpose1">
                    <label class="form-check-label" for="purpose1">ការងារថ្មី</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="purpose2">
                    <label class="form-check-label" for="purpose2">ផ្លាស់ប្តូរ</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" type="checkbox" id="purpose3">
                    <label class="form-check-label" for="purpose3">ផ្សេងៗ</label>
                </div>
            </div>
        </div>

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ប្រភេទឯកសារ</th>
                    <th>ឯកសារដែលត្រូវនាំមក</th>
                    <th>ការត្រួតពិនិត្យ</th>
                    <th>ចំណាំ</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td rowspan="2">ឯកសារផ្ទាល់ខ្លួន</td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="doc1">
                            <label class="form-check-label" for="doc1">អត្តសញ្ញាណប័ណ្ណ</label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="doc2">
                            <label class="form-check-label" for="doc2">ប័ណ្ណស្នាក់នៅ</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="doc3">
                            <label class="form-check-label" for="doc3">សៀវភៅគ្រួសារ</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>ឯកសារងារ</td>
                    <td>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="doc4">
                            <label class="form-check-label" for="doc4">កិច្ចសន្យាជួល</label>
                        </div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
