'use strict'
document.addEventListener('keydown',function(e,ui){
     if (e.ctrlKey && e.keyCode == 13){
         if (MagicEntryDialog.visible){
            MagicEntryDialog.savePackageInfo();
         }
     }
});

// $(window).keydown(function (event, ui) {
//     if (event.ctrlKey && event.keyCode == 70) {
//         if (MainView.currentView == 'class') {
//             ClassView.btnFindClass.trigger('click');
//             event.preventDefault();
//         } else if (MainView.currentView == 'batch') {
//             BatchView.btnFindBatch.trigger('click');
//             event.preventDefault();
//         } else if (MainView.currentView == 'oldandnewstudent' || MainView.currentView == 'newstudent' || MainView.currentView == 'oldstudent') {
//             StudentContextMenus.mnuFindStudent.trigger('click');
//             event.preventDefault();
//         }
//     }
// });