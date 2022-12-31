// Class definition

var KTFormControls = function () {
    // Private functions

    var demo1 = function () {
        $("#kt_form_1").validate({
            // define validation rules
            rules: {
                name: {
                    required: true
                },
                display_name: {
                    required: true
                },
                email: {
                    required: true,
                    email: true,
                    unique: true,
                    minlength: 8
                },
                image: {
                    required: true
                },
                password: {
                    required: function (element) {
                        if ($("#edit").val() == 1) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    minlength: 6,
                    maxlength: 12
                },
                password_confirmation: {
                    required: function (element) {
                        if ($("#edit").val() == 1) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    minlength: 6,
                    maxlength: 12,
                    equalTo: "#password"
                },
                "roles[]": {
                    required: true,
                    minlength: 1
                },
                "permissions[]": {
                    required: true,
                    minlength: 1
                },
                author: {
                    required: true
                },
                publisher: {
                    required: true
                },
                language: {
                    required: true
                },
                category: {
                    required: true,
                    minlength: 3,
                },
                subcate: {
                    required: true,
                    minlength: 3,
                },
                subcate_id: {
                    required: true
                },
                slug: {
                    required: true,
                    unique: true,
                    alpha_dash: true,
                },
                title: {
                    required: true,
                    minlength: 3,
                    maxlength: 191
                },
                source_file: {
                    required: true
                },
                description: {
                    required: true,
                    minlength: 15,
                },
                pub_date: {
                    required: true,
                },
                dimension: {
                    required: true,
                },
                length: {
                    required: true,
                },
                isbn: {
                    required: true,
                },
                url: {
                    required: true,
                },
                page: {
                    required: true,
                },
                stu_name: {
                    required: true,
                },
                promotion: {
                    required: true,
                },
                dates: {
                    required: true,
                },
                type_book: {
                    required: true,
                },
                type_sarana: {
                    required: true,
                },
            },
            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                var alert = $('#kt_form_1_msg');
                alert.removeClass('kt--hide').show();
                KTUtil.scrollTop();
            },

            // submitHandler: function (form) {
            //     //form[0].submit(); // submit the form
            // }
        });

        //if we want to change defualt message, we change do as below
        // $('input[name="name"]').rules('add', {
        //     messages: {
        //         required: "new message for field 1"
        //     }
        // });     
    }

    var demo2 = function () {
        $("#kt_form_2").validate({
            // define validation rules
            rules: {
                //= Client Information(step 3)
                // Billing Information
                billing_card_name: {
                    required: true
                },
                billing_card_number: {
                    required: true,
                    creditcard: true
                },
                billing_card_exp_month: {
                    required: true
                },
                billing_card_exp_year: {
                    required: true
                },
                billing_card_cvv: {
                    required: true,
                    minlength: 2,
                    maxlength: 3
                },

                // Billing Address
                billing_address_1: {
                    required: true
                },
                billing_address_2: {

                },
                billing_city: {
                    required: true
                },
                billing_state: {
                    required: true
                },
                billing_zip: {
                    required: true,
                    number: true
                },

                billing_delivery: {
                    required: true
                }
            },

            //display error alert on form submit  
            invalidHandler: function (event, validator) {
                swal.fire({
                    "title": "",
                    "text": "There are some errors in your submission. Please correct them.",
                    "type": "error",
                    "confirmButtonClass": "btn btn-secondary",
                    "onClose": function (e) {
                        console.log('on close event fired!');
                    }
                });

                event.preventDefault();
            },

            submitHandler: function (form) {
                //form[0].submit(); // submit the form
                swal.fire({
                    "title": "",
                    "text": "Form validation passed. All good!",
                    "type": "success",
                    "confirmButtonClass": "btn btn-secondary"
                });

                return false;
            }
        });
    }

    return {
        // public functions
        init: function () {
            demo1();
            demo2();
        }
    };
}();

jQuery(document).ready(function () {
    KTFormControls.init();
});