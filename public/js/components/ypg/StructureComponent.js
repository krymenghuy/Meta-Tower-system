"use strict";

var StructureComponent = (function () {
    const mThis = {};
    mThis.title_prop = "Company Structure";
    mThis.base_url = main_view.base_url;
    mThis.jm = main_view.appContent.children("#_main_structure_component");
    mThis.self = mThis.jm[0];
   
   

    mThis.show = function () {
        main_view.setTitle(mThis.title_prop);
        
        mThis.jm.siblings().hide();
        mThis.jm.fadeIn(200);
    };
    return mThis;
})();







// var PolicyComponent = (function () {
//     const mThis = {};
//     mThis.title_prop = "Association Policy";
//     mThis.base_url = main_view.base_url;
//     mThis.jm = main_view.appContent.children("#_main_policy_component");
//     mThis.self = mThis.jm[0];






    
//     mThis.show = function () {
//         main_view.setTitle(mThis.title_prop);
        
//         mThis.jm.siblings().hide();
//         mThis.jm.fadeIn(200);
//     };
//     return mThis;
// })();

// const chinesePolicy = `
//         <h2 class="text-2xl font-semibold mb-4 text-gray-800">饒平鳳凰同鄉會會章</h2>
//         <h3 class="text-xl font-medium mb-2 text-gray-700">宗旨:</h3>
//         <p class="mb-4">不牟私利、不涉政治、團結鄉親、互助福利、造福社會、發揚我鄉親一向優良傳統。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第一條: 本會定名:</h3>
//         <p class="mb-4">饒平鳳颶同鄉會</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第三條: 會員資格:</h3>
//         <p class="mb-4">凡屬同鄉及與鄉親有直屬姻親關係者、皆可成為同鄉會成員, 姻親會員不得提名正、副會長。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第四條: 會員權利:</h3>
//         <p class="mb-4">有選舉和被選舉權、提議和表決權及優先享有體會各種善舉、義舉之慈普事業。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第五條: 會員義務:</h3>
//         <p class="mb-4">遵守本會各種決議和通告、積極和支持一切會務活動財政費用。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第六條: 福利:</h3>
//         <p class="mb-4">凡如鄉親有婚慶喜事或新厦落成皆可要求本會理事協助處理, 如有父母年老或喪事, 本會以橫軸一幅, 前往吊祭, 若貧窮者, 可向本會反映, 本會將會協調全體同鄉前往吊祭和協助處理。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第七條: 墓園:</h3>
//         <p class="mb-4">本會墓園地規劃為一等、二等、三等規格。一等地報效本會美金壹仟元、二等地報效本會美金肆佰元、三等地報效本會美金參佰元, 其餘為總地不用報效。若當事人自願樂捐多少不拘。清貧者由同鄉會量情處理之。凡我同鄉人或與同鄉有親屬關係者, 皆可安于墓園之原。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第八條: 本會經濟:</h3>
//         <p class="mb-4">本會不收會員費, 經濟由樂捐及墓地收入為主, 有必要時成員大會發動特別樂捐補助之。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第九條: 行政:</h3>
//         <p class="mb-4">由全體成員大會選出名譽會長、顧問、會長一人、副會長二人、監事一人、文書一人、財政一人、交際一人、福利組長一人、副組長二人。本會成員各家長皆為當然理事, 協助會務進行之。</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">第十條: 退會:</h3>
//         <p class="mb-4">凡有損害、中傷、破壞本會名譽者, 經查屬實, 初期警告, 若不悔改、發動大會表決抵制和取消成員資格。</p>
//     `;

//     const khmerPolicy = `
//         <h2 class="text-2xl font-semibold mb-4 text-gray-800">មាត្រានិងបទបញ្ញាត្តិផ្ទៃក្នុងរបស់សមាគមចិនយាវផេង</h2>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 1: ការកំណត់ឈ្មោះសមាគម</h3>
//         <p class="mb-4">សមាគមចិនយាផេង</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 2: កម្មវត្ថុ</h3>
//         <p class="mb-4">មិនស្វែងរកផលប្រយោជន៍ផ្ទាល់ខ្លួនមិនជ្រៀតជ្រែករឿងនយោបាយ បង្រួបបង្រួមបងប្អូនស្រុកភូមិចេះជួយគ្នានិងផ្តល់ប្រយោជន៍ដល់សង្គមផ្តើមចេញពីស្រុកកំណើតខ្ញុំមានវប្បធម៌ដ៏ប្រពៃរហូតមក។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 3: លក្ខខណ្ឌសម្បត្តិសមាជិកភាព</h3>
//         <p class="mb-4">មិនស្វែងរកផលប្រយោជន៍ផ្ទាល់ខ្លួនមិនជ្រៀតជ្រែករឿងនយោបាយ បង្រួបបង្រួមបងប្អូនស្រុកភូមិចេះជួយគ្នានិងផ្តល់ប្រយោជន៍ដល់សង្គមផ្តើមចេញពីស្រុកកំណើតខ្ញុំមានវប្បធម៌ដ៏ប្រពៃរហូតមក។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 4: សិទ្ធិសមាជិក</h3>
//         <p class="mb-4">សិទ្ធិបោះឆ្នោតនិងសិទ្ធិត្រូវបានជ្រើសតាំង។ សិទ្ធិក្នុងការលើកយោបល់ និងសិទ្ធិសម្រេចបោះឆ្នោតព្រមទាំងអតិភាពក្នុងការទទួលបានបទពិសោធន៍ផ្សេងៗនៃសកម្មភាពសប្បធម៌និងកិច្ចការសមធម៌ដែលជាទង្វើត្រឹមត្រូវ។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 5: កាតព្វកិច្ចសមាជិក</h3>
//         <p class="mb-4">គោរពតាមសេចក្តីសម្រេចចិត្តនិងសេចក្តីប្រកាសគាំទ្រយ៉ាងខ្លះខ្នែងរាល់សកម្មភាពហិរញ្ញវត្ថុ នានារបស់សមាគមន៍។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 6: ផ្នែកសុខមាលភាព</h3>
//         <p class="mb-4">បើមានពិធីរៀបការឬការសាងសង់ថ្មីចេញជារូបរាងទាំងនេះសុទ្ធតែអាចសុំប្រធានសមាគមឲ ជួយចាត់ចែង។ បើឪពុកម្តាយចាស់។ ឬមានវិធីបុណ្យសពសមាគម អាស្រាយចិត្តស្រឡាញ់ចាត់ទុកដូចជាសាច់ញាតិខ្លួនទៅចូលរួមគោរពវិញ្ញាណក្ខន្ធ។ បើអ្នកក្រីក្រវិញអាចរាយការណ៍មកសមាគមដោយផ្ទាល់ហើយបងប្អូនក្នុងសមាគមនិងទៅគោរពហើយជួយចាត់ចែង។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 7: ទីបញ្ចុះសព</h3>
//         <p class="mb-4">ទីបញ្ចុះសពរបស់សមាគមយើងគ្រងនិងចែកចេញដីជា3 ប្រភេទ ការផ្តល់ជូននៃលក្ខណៈប្រភេទដីទី 1 សមាគមយើងនឹងគិតថ្លៃ 1.000 ដុល្លារអាមេរិក សម្រាប់ប្រភេទដីទី 2 សមាគមយើងនឹងគិតថ្លៃជូន 400 ដុល្លារអាមេរិក និងសម្រាប់ប្រភេទដីទី 3 សមាគមយើងនឹងគិតថ្លៃជូន 300 ដុល្លារអាមេរិក។ ក្នុងករណីចាំបាច់ទោះជាអ្នកក្រីក្រក្ដីឲ្យតែជាអ្នកស្រុកតែមួយឬអ្នកមានចុះខ្សែស្រឡាយជាមួយសុទ្ធតែអាចប្រើប្រាស់ទីបញ្ចុះសពនៅទីតាំងដើមនេះដោយស្ងប់ចិត្តបាន។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 8: ផ្នែកសេដ្ឋកិច្ចរបស់សមាគម</h3>
//         <p class="mb-4">សមាគមមិនប្រមូលប្រាក់សមាជិកភាពទេហើយសេដ្ឋកិច្ចគឺយកលើការបរិច្ចាគ។ និងប្រាក់ចំណូលទីបញ្ចុះសព។ បើមានតម្រូវការចាំបាច់សមាជិកនិងធ្វើការប្រជុំធំ សម្រាប់ធ្វើការបរិច្ចាគពិសេសដើម្បីឧបត្ថម្ភ។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 9: ផ្នែករដ្ឋបាល</h3>
//         <p class="mb-4">ជ្រើសរើសដោយអង្គប្រជុំទូទៅប្រធានកិត្តិយសប្រធានទីប្រឹក្សាមួយរូបអនុប្រធានពីររូបអ្នកគ្រប់គ្រងមួយរូបលេខាធិការមួយរូបហិរញ្ញវត្ថុមួយរូបអ្នកទំនាក់ទំនងមួយរូបប្រធានសុខមាលភាពមួយរូបនិងអនុប្រធានពីររូបអាណាព្យាបាលនៃសមាជិកសមាគមសុទ្ធតែអាចចាត់ចែងនិងជួយក្នុងការដឹកនាំកិច្ចប្រជុំ។</p>

//         <h3 class="text-xl font-medium mb-2 text-gray-700">ប្រការទី 10: ការដកខ្លួនចេញពីសមាគម</h3>
//         <p class="mb-4">ឲ្យតែធ្វើឲ្យខូចខាតបង្កាច់បង្អួច បំផ្លាញកេរ្តិ៍ឈ្មោះរបស់សមាគមនិងត្រូវបានព្រមានជាដំណាក់កាល ប្រសិនបើមិនកែប្រែទេនឹងបើកអង្គប្រជុំទូទៅដើម្បីបោះឆ្នោតធ្វើពហិការ និងលុបចោលសមាជិកភាព។</p>
//     `;


{/* <body class="p-4 sm:p-6 lg:p-8 flex flex-col items-center min-h-screen">
            <div id="_main_policy_component" class="w-full max-w-4xl bg-white shadow-xl rounded-xl p-6 sm:p-8 lg:p-10">
                <h1 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Association Policy Document</h1>

                <div class="flex justify-center space-x-4 mb-8">
                    <button id="showChineseBtn" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                        中文 (Chinese)
                    </button>
                    <button id="showKhmerBtn" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
                        ភាសាខ្មែរ (Khmer)
                    </button>
                </div>

                <div id="policyContent" class="policy-content bg-gray-50 p-6 rounded-lg border border-gray-200 h-[60vh] overflow-y-auto text-gray-700 leading-relaxed text-sm sm:text-base">
                    <p class="text-center text-gray-500 mt-10">Select a language to view the policy.</p>
                </div>
            </div>
        </body> */}



//         import React from 'react';
// "use strict";

// var PolicyComponent = (function () {
//     const mThis = {};
//     mThis.title_prop = "Association Policy";
//     mThis.base_url = main_view.base_url;
//     mThis.jm = main_view.appContent.children("#_main_policy_component");
//     mThis.self = mThis.jm[0];


//     const PolicyComponent = () => {

//   const policies = [
//     {
//       article: '第一條 / ប្រការទី 1',
//       chinese: '本會定名: 饒平鳳颶同鄉會',
//       khmer: 'ការកំណត់ឈ្មោះសមាគម: សមាគមចិនយាវផេង'
//     },
//     {
//       article: '宗旨 / ប្រការទី 2',
//       chinese: '不牟私利、不涉政治、團結鄉親、互助福利、造福社會、發場我鄉親-向優良傳統',
//       khmer: 'មិនស្វែងរកផលប្រយោជន៍ផ្ទាល់ខ្លួនមិនជ្រៀតជ្រែករឿងនយោបាយ បង្រួបបង្រួមបងប្អូនស្រុកភូមិចេះជួយគ្នានិងផ្តល់ប្រយោជន៍ដល់សង្គមផ្តើមចេញពីស្រុកកំណើតខ្ញុំមានវប្បធម៌ដ៏ប្រពៃរហូតមក។'
//     },
//     {
//       article: '第三條 / ប្រការទី 3',
//       chinese: '會員資格:凡屬同鄉及與鄉親有直屬姻親關系者、皆可成為同鄉會成員,姻親會員不得提名正,付會長。',
//       khmer: 'លក្ខខណ្ឌសម្បត្តិសមាជិកភាព មិនស្វែងរកផលប្រយោជន៍ផ្ទាល់ខ្លួនមិនជ្រៀតជ្រែករឿងនយោបាយ បង្រួបបង្រួមបងប្អូនស្រុកភូមិចេះជួយគ្នានិងផ្តល់ប្រយោជន៍ដល់សង្គមផ្តើមចេញពីស្រុកកំណើតខ្ញុំមានវប្បធម៌ដ៏ប្រពៃរហូតមក។'
//     },
//     {
//       article: '第四條 / ប្រការទី 4',
//       chinese: '會員資格: 有選舉和被選舉懼、提議和表決權及優先享有體會各種善舉,義舉之慈普事業。',
//       khmer: 'សិទ្ធិសមាជិក: សិទ្ធិបោះឆ្នោតនិងសិទ្ធិត្រូវបានជ្រើសតាំង។សិទ្ធិក្នុងការលើកយោបល់ និងសិទ្ធិសម្រេចបោះឆ្នោតព្រមទាំងអតិភាពក្នុងការទទួលបានបទពិសោធន៍ផ្សេងៗនៃសកម្មភាពសប្បធម៌និងកិច្ចការសមធម៌ដែលជាទង្វើត្រឹមត្រូវ។'
//     },
//     {
//       article: '第五條 / ប្រការទី 5',
//       chinese: '會員義務: 遵守本會各種決議利通告、積極利支持一切會務活動財政寶用。',
//       khmer: 'កាតព្វកិច្ចសមាជិក: គោរពតាមសេចក្តីសម្រេចចិត្តនិងសេចក្តីប្រកាសគាំទ្រយ៉ាងខ្លះខ្នែងរាល់សកម្មភាពហិរញ្ញវត្ថុ នានារបស់សមាគមន៍។'
//     },
//     {
//       article: '第六條 / ប្រការទី 6',
//       chinese: '福利: 凡如鄉親有婚慶喜事或新厦洛成皆可要求本會理事協助處理, 如有父母年老或喪事,本會以横軸一幅,前往吊祭,若貧窮者, 微问本會反映 全髅同鄉前往吊祭和協助處理.',
//       khmer: 'ផ្នែកសុខមាលភាព: បើមានពិធីរៀបការឬការសាងសង់ថ្មីចេញជារូបរាងទាំងនេះសុទ្ធតែអាចសុំប្រធានសមាគមឲ ជួយចាត់ចែង។បើឪពុកម្តាយចាស់។ ឬមានវិធីបុណ្យសពសមាគម អាស្រាយចិត្តស្រឡាញ់ចាត់ទុកដូចជាសាច់ញាតិខ្លួនទៅចូលរួមគោរពវិញ្ញាណក្ខន្ធ។ បើអ្នកក្រីក្រវិញអាចរាយការណ៍មកសមាគមដោយផ្ទាល់ហើយបងប្អូនក្នុង សមាគមនិងទៅគោរពហើយជួយចាត់ចែង។'
//     },
//     {
//       article: '第七條 / ប្រការទី 7',
//       chinese: '墓限: 本會墓園地規劃為 等、二等、三等規格一等地報效本會 美金壹仟元、二等地報效本會美金肆佰元、三等地報效本會美金 叁佰元,其余為總地不用報效,若當事人自願樂捐多少不枸清貧者由同鄉會量情處理之,凡我同鄉人或與同鄉有親屬關系者、皆可安于墓園之原。',
//       khmer: 'ទីបញ្ចុះសព: ទីបញ្ចុះសពរបស់សមាគមយើងគ្រងនិងចែកចេញដីជា3 ប្រភេទ ការផ្តល់ជូននៃលក្ខណៈប្រភេទដីទី 1 សមាគមយើងនឹងគិតថ្លៃ 1.000 ដុល្លារអាមេរិក សម្រាប់ប្រភេទដីទី 2 សមាគមយើងនឹងគិតថ្លៃជូន 400 ដុល្លារអាមេរិក និងសម្រាប់ប្រភេទដីទី 3 សមាគមយើងនឹងគិតថ្លៃជូន 300 ដុល្លារអាមេរិក។ ក្នុងករណីចាំបាច់ទោះជាអ្នកក្រីក្រក្ដីឲ្យតែជាអ្នកស្រុកតែមួយឬអ្នកមានចុះខ្សែស្រឡាយជាមួយសុទ្ធតែអាចប្រើប្រាស់ទីបញ្ចុះសពនៅទីតាំងដើមនេះដោយស្ងប់ចិត្តបាន។'
//     },
//     {
//       article: '第八條 / ប្រការទី 8',
//       chinese: '本會經濟: 本會不收會員費經濟由樂捐及墓地收人為主,有必要時成员大會發動特别樂扪補助之。',
//       khmer: 'ផ្នែកសេដ្ឋកិច្ចរបស់សមាគម: សមាគមមិនប្រមូលប្រាក់សមាជិកភាពទេហើយសេដ្ឋកិច្ចគឺយកលើការបរិច្ចាគ។ និងប្រាក់ចំណូលទីបញ្ចុះសព។បើមានតម្រូវការចាំបាច់សមាជិកនិងធ្វើការប្រជុំធំ សម្រាប់ធ្វើការបរិច្ចាគពិសេសដើម្បីឧបត្ថម្ភ។'
//     },
//     {
//       article: '第九條 / ប្រការទី 9',
//       chinese: '行收: 山全體成員人會選出,名譽會長,顧問會長一人副會長二人,監事一人,文書一人財政一人,交際一人,福利組長一人副組長二人,本會成員各家長皆爲當然理事,協助會務進行之。',
//       khmer: 'ផ្នែករដ្ឋបាល: ជ្រើសរើសដោយអង្គប្រជុំទូទៅប្រធានកិត្តិយសប្រធានទីប្រឹក្សាមួយរូបអនុប្រធានពីររូបអ្នកគ្រប់គ្រងមួយរូបលេខាធិការមួយរូបហិរញ្ញវត្ថុមួយរូបអ្នកទំនាក់ទំនងមួយរូបប្រធានសុខមាលភាពមួយរូបនិងអនុប្រធានពីររូបអាណាព្យាបាលនៃសមាជិកសមាគមសុទ្ធតែអាចចាត់ចែងនិងជួយក្នុងការដឹកនាំកិច្ចប្រជុំ។'
//     },
//     {
//       article: '第十條 / ប្រការទី 10',
//       chinese: '退會: 凡有損害,中傷,破壞本會名魯者,經查屬實,初期警告,若不悔改、發動大會表决抵制和取消成員资格。',
//       khmer: 'ការដកខ្លួនចេញពីសមាគម: ឲ្យតែធ្វើឲ្យខូចខាតបង្កាច់បង្អួច បំផ្លាញកេរ្តិ៍ឈ្មោះរបស់សមាគមនិងត្រូវបានព្រមានជាដំណាក់កាល ប្រសិនបើមិនកែប្រែទេនឹងបើកអង្គប្រជុំទូទៅដើម្បីបោះឆ្នោតធ្វើពហិការ និងលុបចោលសមាជិកភាព។'
//     }
//   ];

//   return (
//     <div className="container mx-auto p-4 font-sans">
//       <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">饒平鳳凰同鄉會會章 / មាត្រានិងបទបញ្ញាត្តិផ្ទៃក្នុងរបស់សមាគមចិនយាវផេង</h1>
//       <div className="overflow-x-auto rounded-lg shadow-lg">
//         <table className="min-w-full bg-white border-collapse">
//           <thead>
//             <tr className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
//               <th className="py-3 px-6 text-left border-b border-gray-300">Article</th>
//               <th className="py-3 px-6 text-left border-b border-gray-300">Chinese Policy</th>
//               <th className="py-3 px-6 text-left border-b border-gray-300">Khmer Policy</th>
//             </tr>
//           </thead>
//           <tbody className="text-gray-600 text-sm font-light">
//             {policies.map((policy, index) => (
//               <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
//                 <td className="py-3 px-6 text-left whitespace-normal break-words w-1/6">{policy.article}</td>
//                 <td className="py-3 px-6 text-left whitespace-normal break-words w-2/6">{policy.chinese}</td>
//                 <td className="py-3 px-6 text-left whitespace-normal break-words w-2/6">{policy.khmer}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };
//    const App = () => {
//   return (
//     <div>
//       <PolicyComponent />
//     </div>
//   );
// };
   
//     mThis.show = function () {
//         main_view.setTitle(mThis.title_prop);
        
//         mThis.jm.siblings().hide();
//         mThis.jm.fadeIn(200);
//     };
//     return mThis;
// })();
