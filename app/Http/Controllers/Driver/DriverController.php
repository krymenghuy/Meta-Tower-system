<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Http\Requests\Driver\DriverRequest;

use App\Models\Drivers;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $driver = Drivers::all();
        return view('driver.index', compact('driver'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('driver.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(DriverRequest $request)
    {
        $input = $request->only('name', 'date_of_birth', 'phone_number', 'national_id', 'driver_license_number', 'current_address', 'vehicle_type', 'vehicle_number', 'vehicle_make', 'vehicle_year', 'vehicle_des', 'employment_type', 'salary', 'commission_percent', 'emergency_contact_phone');
        $input['branch_id'] = 1;
        Drivers::create($input);
        return redirect()->route('driver.index')->with('flash_message','Driver successfully inserted!');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $driver = Drivers::findOrFail($id);
        return view('driver.edit', compact('driver'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(DriverRequest $request, $id)
    {
        $driver = Drivers::findOrFail($id);
        Drivers::where('id', $id)->update([
            'name' => $request->name, 
            'date_of_birth' => $request->date_of_birth, 
            'phone_number' => $request->phone_number, 
            'national_id' => $request->national_id, 
            'driver_license_number' => $request->driver_license_number, 
            'current_address' => $request->current_address, 
            'vehicle_type' => $request->vehicle_type, 
            'vehicle_number' => $request->vehicle_number, 
            'vehicle_make' => $request->vehicle_make, 
            'vehicle_year' => $request->vehicle_year, 
            'vehicle_des' => $request->vehicle_des, 
            'employment_type' => $request->employment_type, 
            'salary' => $request->salary, 
            'commission_percent' => $request->commission_percent, 
            'emergency_contact_phone' => $request->emergency_contact_phone
        ]);
        return redirect()->route('driver.index')->with('flash_message','Driver successfully update!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $driver = Drivers::findOrFail($id);
        $driver->delete($driver);
        return redirect()->route('driver.index')->with('flash_message','Driver successfully deleted!');
    }
}
