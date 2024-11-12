<style>

        .table_work_shift {
            width: 100%;
            border-collapse: collapse;
            text-align: center;
            font-family: Arial, sans-serif;
        }
        .work_shift_table{
            height: 480px;
            margin-top: 5px;
            overflow-y: auto;
            overflow-x: hidden;
            scrollbar-width: none;
        }
        .thead_shift th,
        .tbody_shift tr td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .tbody_shift tr td:hover {
            background-color: #10b2ce;
            color: white;
            cursor: pointer;
        }
        .tbody_shift th {
            background-color: #f4f4f4;
        }
        .work { background-color: #b7e1cd; }
        .partial { background-color: #f9e79f; }
        .absence { background-color: #f5b7b1; }
        .holiday { background-color: #fadbd8; }
        .off { background-color: #d6eaf8; }
        .pto { background-color: #fcf3cf; }
        .sick { background-color: #d5d8dc; }
        .vacation { background-color: #f7dc6f; }

        .shift_top{
            display: flex;
            padding: 10px 0;
            background-color: #f4f4f4;
            font-weight: bold;
            flex-direction: column;
        }
        .shift_top_header, .shift_top_body, .shift_row{
            display: flex;
            gap: 3rem;
        }
        .shift_header{
            margin-top: 10px;
        }
    </style>
    <div id="_main_workshiftComponent" style="display:none;padding:20px">
        <div class="shift_header">
            <h4>Monthly Employee Work Shift Timetable</h4>
            <div class="shift_top">
                <div class="shift_top_header">
                    <div class="year">Year</div>
                    <div class="month">Month</div>
                </div>
                <div class="shift_top_body">
                    <div class="body_year">
                        2024
                    </div>
                    <div class="body_month">
                        January
                    </div>
                    <div class="body_shifts">
                        <div class="shift_row" data-id="lc1">
                            <div>
                                <span class="shift_cell work p-2">W</span>
                                work
                            </div>
                            <div>
                                <span class="shift_cell partial p-2">P</span>
                                Partial
                            </div>
                            <div>
                                <span class="shift_cell absence p-2">A</span>
                                Absent
                            </div>
                            <div>
                                <span class="shift_cell holiday p-2">H</span>
                                Holiday
                            </div>
                            <div>
                                <span class="shift_cell off p-2">O</span>
                                Day Off
                            </div>
                            <div>
                                <span class="shift_cell pto p-2">PT</span>
                                PTO
                            </div>
                            <div>
                                <span class="shift_cell sick p-2">S</span>
                                Sick
                            </div>
                            <div>
                                <span class="shift_cell vacation p-2">V</span>
                                Vacation
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="work_shift_table">
            <table class="table_work_shift">
                <thead class="thead_shift">
                    <tr>
                        <th rowspan="2">ID NO.</th>
                        <th rowspan="2">EMP NAME</th>
                        @for ($day = 1; $day <= 31; $day++)
                            <th>{{ $day }}</th>
                        @endfor
                    </tr>
                </thead>
                <tbody class="tbody_shift">
                    @php
                        // Example data, replace with your database data
                        $employees = [
                            ['id' => 'lc01', 'name' => 'Kevin', 'shifts' => ['W', 'O', 'O', 'V', 'H', 'W', 'W', 'W', 'O', 'R', 'W', 'W', 'P', 'W', 'O', 'O', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'V', 'V', 'R', 'A','W', 'O', 'O']],
                            ['id' => 'lc02', 'name' => 'Alice', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc03', 'name' => 'John', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc04', 'name' => 'Emma', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc05', 'name' => 'Mike', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc06', 'name' => 'Sophia', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc07', 'name' => 'Chris', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc08', 'name' => 'Olivia', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc09', 'name' => 'Liam', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc10', 'name' => 'Ava', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'V', 'V', 'V', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc11', 'name' => 'Noah', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc12', 'name' => 'Mia', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'V', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc13', 'name' => 'James', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc14', 'name' => 'Charlotte', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc15', 'name' => 'Amelia', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'V', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc16', 'name' => 'Elijah', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc17', 'name' => 'Isabella', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc18', 'name' => 'Lucas', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'V', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc19', 'name' => 'Mason', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'V', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc20', 'name' => 'Evelyn', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'V', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc21', 'name' => 'Ronaldo', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'V', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc22', 'name' => 'Messi', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc23', 'name' => 'Neyma', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc24', 'name' => 'Bell', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'O', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            ['id' => 'lc25', 'name' => 'Ratanak', 'shifts' => ['O', 'O', 'H', 'W', 'W', 'W', 'O', 'W', 'P', 'W', 'W', 'O', 'V', 'W', 'W', 'O', 'O', 'O', 'W', 'W', 'O', 'V', 'O', 'W', 'S', 'W', 'W', 'O','W', 'O', 'O']],
                            // Add more employees here
                        ];
                        $shiftClasses = [
                            'W' => 'work',
                            'R' => 'partial',
                            'A' => 'absence',
                            'H' => 'holiday',
                            'O' => 'off',
                            'P' => 'pto',
                            'S' => 'sick',
                            'V' => 'vacation',
                        ];
                    @endphp

                    @foreach ($employees as $employee)
                        <tr>
                            <td>{{ $employee['id'] }}</td>
                            <td>{{ $employee['name'] }}</td>
                            @for ($day = 1; $day <= 31; $day++)
                                @php
                                    $shift = $employee['shifts'][$day - 1] ?? '';
                                    $class = $shiftClasses[$shift] ?? '';
                                @endphp
                                <td class="{{ $class }}">{{ $shift }}</td>
                            @endfor
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    <div id="_workshift_list" class="pt-3 px-3"></div>
</div>
