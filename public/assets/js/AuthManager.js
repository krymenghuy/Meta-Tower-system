const AuthManager = (function () {
    const base_url = window.location.origin;
    let prns = [];
    let modules = [];
    let is_system_admin = 0;
    let initAlready = false;
    let user = null;
    // Function to load user's authentication data and check permissions
    function init(onFinish) {
        if (initAlready && user){
            onFinish();
            return;
        }

        vsapi.call(`${base_url}/api/auth/auth-data`, null, false).then((res) => {
            if (res.status_code === 200) {
                const d = res.data || {};
                user = d.user;
                prns = d.prns || [];
                is_system_admin = d.is_super_admin || 0;
                modules = d.modules || [];
                initAlready = true;
                onFinish();
            }
        });
    }

    // Function to check if the user has access to a specific module
    function access_mod(mod_id, show_unauth_page = true) {
        if (is_system_admin ===true || is_system_admin === 1) return true;
        const m = modules.find((mod) => mod.id == mod_id);
        if (m) return true;
        if (show_unauth_page) {
            UnauthComponent.show();
        }
        return false;
    }

    // Function to check if the user is allowed to perform a specific action based on permission number
    function allowed(prn_number, silent_mode = false) {
        if (is_system_admin ===true || is_system_admin === 1) return true;
        
        const hasPermission = prns.some((c) => c.permission_id === prn_number);
    
        if (!hasPermission && !silent_mode) {
            cv_interact.warning(`Permission ${prn_number} is required to perform this action!`);
        }
    
        return hasPermission;
    }
 
    // Expose the public methods and properties
    return {
        init,
        modules,
        user,
        allowed,
        access_mod,
    };
})();
