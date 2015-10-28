function refresh() {
	location.reload(true);
};

//refresh page after time period
var t60x = setTimeout(refresh, 10000);

//cancel refresh if mouse is moved
document.onmousemove = function(){clearTimeout(t60x);}
