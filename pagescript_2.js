function refresh() {
	location.reload(true);
};

//refresh page after time period
var stayfresh_timer = setTimeout(refresh, 10000);

//cancel refresh if mouse is moved
document.onmousemove = function(){clearTimeout(stayfresh_timer);}
