function searchUp(el, predicate) {
	while( el && ! predicate(el) ) {
		el=el.parentElement;
		//console.log(el && el.localName || null);
	}
	return el;
}

window.onclick=function(ev) {
//	var pre = searchUp(ev.target, el=>el.classList.contains('highlight'));
	var pre = searchUp(ev.target, function(el){return el.classList.contains('highlight')});	//for M$ IE11

	//console.log(pre && pre.localName);
	if( pre ) {
		if( pre.classList.contains('collapse') ) {
			pre.classList.remove('collapse')
		}
		else {
			(ev.target==pre || ev.target==pre.firstElementChild) && pre.classList.add('collapse');
		}
	}
}
/*
window.__onload=function(ev) {
	Array.forEach(document.getElementsByClassName('highlight'),x=>{
		console.log( x.style.height,  getComputedStyle(x).height);
		x.style.height = getComputedStyle(x).height;
		x.classList.add('collapse');
	});
}
*/
window.onload=function(ev) {
//	Array.forEach(document.getElementsByClassName('highlight'),x=>{	//firefox
//	Array.prototype.forEach.call(document.getElementsByClassName('highlight'), x=>{	//for M$ Edge
	Array.prototype.forEach.call(document.getElementsByClassName('highlight'), function(x){	//for M$ IE-11
		console.log( x.style.height,  getComputedStyle(x).height);
		x.style.height = getComputedStyle(x).height;
		x.classList.add('collapse');
	});
}
