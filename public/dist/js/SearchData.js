class SearchData{
    constructor(elSearch,tbl_search){
        this.search = elSearch;
        this.block = tbl_search;
        this.searchDataInTr();
    }

    searchDataInTr = () => {
        let elSearch = this.search, div = this.block;

        elSearch.on('keyup',function(e){
            e.preventDefault();
            let value = $(this).val().toLowerCase().trim();

            div.find('tbody > tr').each(function(){
                if($(this).text().toLowerCase().trim().indexOf(value) != -1){
                    $(this).show();
                }
                else{
                    $(this).hide();  
                }
            });
        });
    }
}