function searchUp(el, predicate) {
	while( el && ! predicate(el) ) {
		el=el.parentElement;
		console.log(el && el.localName || null);
	}
	return el;
}

window.onclick=function(ev) {
	var pre = searchUp(ev.target, el=>el.classList.contains('highlight'));

	console.log(pre && pre.localName);
	if( pre ) {
		if( pre.classList.contains('collapse') ) {
			pre.classList.remove('collapse')
		}
		else {
			pre == ev.target && pre.classList.add('collapse');
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
	Array.prototype.forEach.call(document.getElementsByClassName('highlight'), x=>{	//M$
		console.log( x.style.height,  getComputedStyle(x).height);
		x.style.height = getComputedStyle(x).height;
		x.classList.add('collapse');
	});
}
