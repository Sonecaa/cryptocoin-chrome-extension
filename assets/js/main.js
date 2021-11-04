
jQuery(document).ready(function () {


    let dropdown = jQuery("#currency-select");

    jQuery.getJSON("/assets/js/currencies.json", function(data){

        console.log(data);
        jQuery.each(data, function (index, obj) {

            let favorite = obj.favorite === "true" ? " ★" : "";
            dropdown.append(jQuery("<option />").val(obj.key).text(obj.name + favorite));
            
            if(obj.key === '1') {
                jQuery('#crypto-box').append('<div style="display:block;" class="coinmarketcap-currency-widget" data-currencyid="'+ obj.key +'" data-base="USD" data-secondary="" data-ticker="true" data-rank="false" data-marketcap="false" data-volume="false" data-statsticker="false" data-stats="USD"></div>');
            } else {
                jQuery('#crypto-box').append('<div style="display:none;" class="coinmarketcap-currency-widget" data-currencyid="'+ obj.key +'" data-base="USD" data-secondary="" data-ticker="true" data-rank="false" data-marketcap="false" data-volume="false" data-statsticker="false" data-stats="USD"></div>');
            }

        });
    });

    dropdown.change(function() {

       $(".coinmarketcap-currency-widget[data-currencyid='" + $(this).val() + "']").attr('style', 'display:block;') ;
       $(".coinmarketcap-currency-widget[data-currencyid!='" + $(this).val() + "']").attr('style', 'display:none;') ;
        
    });

});