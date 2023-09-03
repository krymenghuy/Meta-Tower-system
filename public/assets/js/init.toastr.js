let KTAppOptions = {
    "colors": {
        "state": {
            "brand": "#5d78ff",
            "dark": "#282a3c",
            "light": "#ffffff",
            "primary": "#5867dd",
            "success": "#0E8E46",
            "info": "#04389E",
            "warning": "#DFBA04",
            "danger": "#fd3995"
        },
        "base": {
            "label": ["#c5cbe3", "#a1a8c3", "#3d4465", "#3e4466"],
            "shape": ["#f0f3ff", "#d9dffa", "#afb4d4", "#646c9a"]
        }
    }
};


        var KTToastrDemo = new function() {
            this.initDemo =()=> {
                toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": false,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "300",
                "timeOut": "400",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut",
                "onShown": function () {
                    // When a toast is shown, check if there are more than 2 toasts displayed.
                    // If so, hide the oldest toast.
                    if (toastr.visible().length > 2) {
                      const oldestToast = toastr.getContainer().find(".toast:first");
                      toastr.clear(oldestToast);
                    }
                  }
                };

                //toastr.success("{{ Session::get('flash_message') }}");   
            }

        // return {
        //     init: function() {
        //         demo();
        //     }
        // };
    };

    // $(document).ready(()=>{
    //     KTToastrDemo.initDemo();
    // });
    