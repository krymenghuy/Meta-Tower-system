<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class settings_brand_Test extends TestCase
{
    use WithFaker;
    /***
        $faker->name; // First and second name
        $faker->randomDigit; // A random number
        $faker->word; // A single word
        $faker->sentence; // A sentence
        $faker->unique()->word; // A single unique word
        $faker->text($maxNbChars = 300); // 300 character long text
        $faker->safeEmail; // An email address
        $faker->hexcolor; // Hex color  
     ***/
    const LOGIN_NAME ="admin@gmail.com";
    const USER_CLASS ="admin";
    const PASSWORD="123456";
    protected $token = "";

    /**
     * A basic feature test example.
     *
     * @return void
     */

    public function setUp():void{
        parent::setUp();
        $user =  [
            'login_name'=>self::LOGIN_NAME,
            "full_name"=>"Samsethy",
            "user_class"=>self::USER_CLASS,
            "user_id"=>1,
            "branch_id"=>1,
            "lang"=>"en"
          ];
       $this->token =  \App\Models\UM::createJWT($user,60*60);
    }
 
    // public function test_login(){
    //     $response = $this->json('post', '/api/auth/login', [
    //         'login_name' =>'admin@gmail.com',
    //         'password'=>'123456'
    //     ]);
    //     $this->token = $response['user']['access_token'];
    //     $response->assertStatus(200);

    // }

    public function test_save_brand(){
        // define your $token here
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
        ->json('post', '/api/inventory/save-brand', [
            'name' =>$this->faker->word,
            'name_kh'=>null
        ]);

        //$response->dump();
        $response->assertStatus(200);
         $response->assertJson([
            'status_code' =>200
            //,'error_message'=>null
        ]);
          
    }

    public function test_save_brand_blank_name(){
        // define your $token here
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
        ->json('post', '/api/inventory/save-brand', [
            'name' =>null,
            'name_kh'=>null
        ]);

        //$response->dump();
        $response->assertStatus(200);
        $response->assertJson([
            'status_code' =>405
            //,'error_message'=>null
        ]);
         
    }

    public function test_delete_brand(){
        // define your $token here
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
        ->json('post', '/api/inventory/delete-brand', [
            'id' =>$this->faker->numerify('#####')
        ]);

        //$response->dump();
        $response->assertStatus(200);
        $response->assertJson([
            'status_code' =>405
            //,'error_message'=>null
        ]);

    }

    //Test retrieving brand listing
    public function test_brand_listing(){
        // define your $token here
        $response = $this->withHeader('Authorization', 'Bearer ' . $this->token)
        ->json('post', '/api/inventory/list-brand',[]);

        //$response->dump();
        $response->assertStatus(200);
        $response->assertJson([
            'status_code'=>200,
            'data' =>[]
        ]);
    }


}
