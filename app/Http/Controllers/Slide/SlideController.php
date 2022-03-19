<?php

namespace App\Http\Controllers\Slide;

use App\Http\Controllers\Controller;
use App\Models\Slides;
use Illuminate\Http\Request;

use Image;
use Auth;
use Exception;
use File;
use Illuminate\Support\Facades\Crypt;

class SlideController extends Controller
{
    //
    public function __construct(){
        // $this->middleware(['auth']);
        // $this->middleware('permission:slides-list');
        // $this->middleware('permission:slides-create', ['only' => ['crete', 'store']]);
        // $this->middleware('permission:slides-edit', ['only' => ['edit', 'update']]);
        // $this->middleware('permission:slide-delete', ['only' => ['delete']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $slide = Slides::all();
        return view('slides.index', ['slide' => $slide]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('slides.create');
        // return "fuck you laravel !";
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request,[
            'name' => 'required',
            'image' => 'required'
        ]);

        try{
            $input = $request->only('name');
            $image = $request->file('image');
            $filename = time().'.'.$image->GetClientOriginalExtension();
            $image_path = public_path('images/slides/'.$filename);
            Image::make($image->getRealPath())->save($image_path);

            $input = $request->all();
            $input['image'] = $filename;
            // $input['user_id'] = Auth::user()->id;
            $input['user_id'] = '1';
            Slides::create($input);
            return redirect()->route('slides.index')->with('flash_message', 'Slide successgully added!');
        } catch(Exception $e) {
            return 'Something went wrong';
        }
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function show($id)
    // {
    //     return redirect('slides');
    // }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {   
        $pid = Crypt::decrypt($id);
        $slide = Slides::findOrFail($pid);
        return view('slides.edit', ['slide' => $slide]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request,[
            'name' => 'required',
            'image' => 'required'
        ]);

        $pid = Crypt::decrypt($id);
        $slide = Slides::findOrFail($pid);

        $input = $request->only('name');
        try{
            if($request->file('image')){
                $image = $request->file('image');
                $filename = time().'.'.$image->GetClientOriginalExtension();
                $image_path = public_path('images/slides/'.$filename);
                Image::make($image->getRealPath())->save($image_path);
    
                if(File::exists(public_path('images/slides/'.$slide->image))){
                    File::delete(public_path('images/slides/'.$slide->image));
                }
            }
            $input['image'] = $filename;
            $input['user_id'] = '1';
            $slide->update($input);
            return redirect()->route('slides.index')->with('flash_message', 'Slide successgully edited!');
        } catch(Exception $e){
            return 'Something went wrong';
        }
                
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try{
            $pid = Crypt::decrypt($id);
            $slide = Slides::findOrFail($pid);
            $slide->delete();

            if(File::exists(public_path('images/slides/'.$slide->image))){
                File::delete(public_path('images/slides/'.$slide->image));
            }
            return redirect()->route('slides.index')->with('flash_message', 'Slide successgully deleted!');
        } catch(Exception $e) {
            return 'Something went wrong';
        }
        
    }
}
