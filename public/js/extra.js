console.log('load js file')
$('.status').each(function(i){
    if($('.status'+i).html() == 'BOOKED'){
        $('.status'+i).css('color', 'red');
    }else if($('.status'+i).html() == 'PENDING'){
        $('.status'+i).css('color', 'green');    
    }else if($('.status'+i).html() == 'OPTION'){
        $('.status'+i).css('color', 'blue');    
    }

})

var btn = $('.hide_show')
$('.password').hide();
btn.attr('data-click-state', 0);

$(document).on('click','.hide_show', function(){
    if($(this).attr('data-click-state') == 0) {
        $(this).attr('data-click-state', 1)
        $('.password').show();
        $(this).html('Hide passwords')
        $(this).css('background-color', 'red')
        } else {
        $(this).attr('data-click-state', 0)
        $('.password').hide();
        $(this).html('Show passwords')
        $(this).css('background-color', 'orange')
        }
    
})


