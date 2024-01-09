
jQuery(document).ready(function () {

    // update_archivies_list();

    let dropdown = jQuery("#currency-select");

    jQuery.getJSON("/currencies.json", function (data) {

        jQuery.each(data, function (index, obj) {

            let favorite = obj.favorite === "true" ? " ★" : "";
            dropdown.append(jQuery("<option />").val(obj.key).text(obj.name + favorite));

            if (obj.key === '1') {
                jQuery('#crypto-box').append('<div style="display:block;" class="coinmarketcap-currency-widget" data-currencyid="' + obj.key + '" data-base="USD" data-secondary="" data-ticker="true" data-rank="false" data-marketcap="false" data-volume="false" data-statsticker="false" data-stats="USD"></div>');
            } else {
                jQuery('#crypto-box').append('<div style="display:none;" class="coinmarketcap-currency-widget" data-currencyid="' + obj.key + '" data-base="USD" data-secondary="" data-ticker="true" data-rank="false" data-marketcap="false" data-volume="false" data-statsticker="false" data-stats="USD"></div>');
            }

        });
    });

    dropdown.change(function () {

        $(".coinmarketcap-currency-widget[data-currencyid='" + $(this).val() + "']").attr('style', 'display:block;');
        $(".coinmarketcap-currency-widget[data-currencyid!='" + $(this).val() + "']").attr('style', 'display:none;');

    });

    $("#archive-save").click(function () {

        let hash = '_' + Math.random().toString(36).substr(2, 9);

        let save =  {
            currencyid: dropdown.val(),
            value: get_token_value(dropdown.val()),
            hour: get_current_hour(),
            date: get_current_date(),
        }

        save_storage(save)

        update_archivies_list();

    });

});

async function update_archivies_list() {

    let archives = await get_storage('archives');

    const list_archives = $('#currency-archives');

    list_archives.html("");  // clear list before appends...

    $.each(archives, function(key, each) {
        var li = $('<li/>')
            .addClass('list-group-item')
            .appendTo(list_archives);
        var div = $('<div/>')
            .addClass('row')
            .addClass('align-items-center')
            .attr('style', 'font-size: 55%;')
            .appendTo(li);
        var value = $('<div/>')
            .addClass('col-5')
            .html(each.value)
            .appendTo(div);
        var hour = $('<div/>')
            .addClass('col-2')
            .html(each.hour)
            .appendTo(div);
        var date = $('<div/>')
            .addClass('col-3')
            .html(each.date)
            .appendTo(div);
        var col_close = $('<div/>')
            .addClass('col-2')
            .appendTo(div);
        var close_button = $('<button/>')
            .addClass('btn')
            .addClass('btn-danger')
            .addClass('btn-sm')
            .addClass('col-0')
            .html('X')
            .attr('currency-id', each.currencyid)
            .attr('archive-hash', key)
            .appendTo(col_close);

    });

}

async function save_storage(data) {

    let archives = await get_storage('archives');
    
    let hash = '_' + Math.random().toString(36).substr(2, 9) + new Date().getSeconds() + new Date().getMinutes() + new Date().getHours();

    Object.assign (archives, { [hash] : data });

    chrome.storage.sync.set({ 'archives': archives });

}

async function get_storage(key) {

    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(key, resolve);
    }).then(result => {
            if (key == null) return result;
            else return result[key];
    });

}

function get_token_value(currencyid) {

    let value = jQuery("#crypto-box > .coinmarketcap-currency-widget[data-currencyid='" + currencyid + "'] > div > div:nth-child(1) > div:nth-child(2) > span:nth-child(3) > span:nth-child(1)").html();

    return value;

}

function get_current_hour() {

    var seconds = new Date().getSeconds();
    var minutes = new Date().getMinutes();
    var hour = new Date().getHours();

    return hour + ":" + minutes + ":" + seconds;

}

function get_current_date() {

    let date = new Date().toLocaleDateString();

    return date;

}