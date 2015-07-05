// nCode Image Resizer Box 1.0
// http://www.xpserkan.com/
var NcodeImageResizerBox={};

function T$(i){return document.getElementById(i)}

NcodeImageResizerBox.box=function(){
	var p,m,b,fn,ic,iu,iw,ih,ia,f=0;
	return{
		show:function(c,u,w,h,a,t){
			if(!f){
				p=document.createElement('div'); p.id='ncode_imageresizer_box'; p.style.position = 'absolute';
				p.style.display = 'none'; p.style.padding = '10px'; p.style.border = '4px solid #fff';
				p.style.zIndex = '2000'; p.style.background = '#fff url(images/spinner_big.gif) no-repeat 50% 50%';
				p.style.borderRadius = '0.5em'; p.style.MozBorderRadius = '0.5em'; p.style.WebkitBorderRadius = '0.5em';
				p.style.overflow = 'hidden';
				m=document.createElement('div'); m.id='ncode_imageresizer_mask'; m.style.background = '#000';
				m.style.position = 'absolute'; m.style.display = 'none'; m.style.top = '0'; m.style.left = '0';
				m.style.height = '100%'; m.style.width = '100%'; m.style.zIndex = '1500';
				b=document.createElement('div'); b.id='ncode_imageresizer_content'; b.style.background = '#fff';
				b.style.overflow = 'auto';
				document.body.appendChild(m); document.body.appendChild(p); p.appendChild(b);
				m.onclick=NcodeImageResizerBox.box.hide; window.onresize=NcodeImageResizerBox.box.resize; f=1
			}
			if(!a&&!u){
				p.style.width=w?w+'px':'auto'; p.style.height=h?h+'px':'auto';
				p.style.backgroundImage='none'; b.innerHTML=c
			}else{
				b.style.display='none'; p.style.width=p.style.height='100px'
			}
			this.mask();
			ic=c; iu=u; iw=w; ih=h; ia=a; this.alpha(m,1,50,1);
			if(t){setTimeout(function(){NcodeImageResizerBox.box.hide()},1000*t)}
		},
		fill:function(c,u,w,h,a){
			if(u){
				p.style.backgroundImage='';
				var x=window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
				x.onreadystatechange=function(){
					if(x.readyState==4&&x.status==200){NcodeImageResizerBox.box.psh(x.responseText,w,h,a)}
				};
				x.open('GET',c,1); x.send(null)
			}else{
				this.psh(c,w,h,a)
			}
		},
		psh:function(c,w,h,a){
			if(a){
				if(!w||!h){
					var x=p.style.width, y=p.style.height; b.innerHTML=c;
					p.style.width=w?w+'px':''; p.style.height=h?h+'px':'';
					b.style.display='';
					w=parseInt(b.offsetWidth); h=parseInt(b.offsetHeight);
					b.style.display='none'; p.style.width=x; p.style.height=y;
				}else{
					b.innerHTML=c
				}
				this.size(p,w,h,4)
			}else{
				p.style.backgroundImage='none'
			}
		},
		hide:function(){
			NcodeImageResizerBox.box.alpha(p,-1,0,1)
		},
		resize:function(){
			NcodeImageResizerBox.box.pos(); NcodeImageResizerBox.box.mask()
		},
		mask:function(){
			m.style.height=NcodeImageResizerBox.page.theight()+'px';
			m.style.width=''; m.style.width=NcodeImageResizerBox.page.twidth()+'px'
		},
		pos:function(){
			var t=(NcodeImageResizerBox.page.height()/2)-(p.offsetHeight/2); t=t<10?10:t;
			p.style.top=(t+NcodeImageResizerBox.page.top())+'px';
			p.style.left=(NcodeImageResizerBox.page.width()/2)-(p.offsetWidth/2)+'px'
		},
		alpha:function(e,d,a,s){
			clearInterval(e.ai);
			if(d==1){
				e.style.opacity=0; e.style.filter='alpha(opacity=0)';
				e.style.display='block'; this.pos()
			}
			e.ai=setInterval(function(){NcodeImageResizerBox.box.twalpha(e,a,d,s)},20)
		},
		twalpha:function(e,a,d,s){
			var o=Math.round(e.style.opacity*100);
			if(o==a){
				clearInterval(e.ai);
				if(d==-1){
					e.style.display='none';
					e==p?NcodeImageResizerBox.box.alpha(m,-1,0,1):b.innerHTML=p.style.backgroundImage=''
				}else{
					e==m?this.alpha(p,1,100,1):NcodeImageResizerBox.box.fill(ic,iu,iw,ih,ia)
				}
			}else{
				var n=o+Math.ceil(Math.abs(a-o)/s)*d;
				e.style.opacity=n/100; e.style.filter='alpha(opacity='+n+')'
			}
		},
		size:function(e,w,h,s){
			e=typeof e=='object'?e:T$(e); clearInterval(e.si);
			var ow=e.offsetWidth, oh=e.offsetHeight,
			wo=ow-parseInt(e.style.width), ho=oh-parseInt(e.style.height);
			var wd=ow-wo>w?-1:1, hd=(oh-ho>h)?-1:1;
			e.si=setInterval(function(){NcodeImageResizerBox.box.twsize(e,w,wo,wd,h,ho,hd,s)},20)
		},
		twsize:function(e,w,wo,wd,h,ho,hd,s){
			var ow=e.offsetWidth-wo, oh=e.offsetHeight-ho;
			if(ow==w&&oh==h){
				clearInterval(e.si); p.style.backgroundImage='none'; b.style.display='block'
			}else{
				if(ow!=w){e.style.width=ow+(Math.ceil(Math.abs(w-ow)/s)*wd)+'px'}
				if(oh!=h){e.style.height=oh+(Math.ceil(Math.abs(h-oh)/s)*hd)+'px'}
				this.pos()
			}
		}
	}
}();

NcodeImageResizerBox.page=function(){
	return{
		top:function(){return document.body.scrollTop||document.documentElement.scrollTop},
		width:function(){return self.innerWidth||document.documentElement.clientWidth},
		height:function(){return self.innerHeight||document.documentElement.clientHeight},
		theight:function(){
			var d=document, b=d.body, e=d.documentElement;
			return Math.max(Math.max(b.scrollHeight,e.scrollHeight),Math.max(b.clientHeight,e.clientHeight))
		},
		twidth:function(){
			var d=document, b=d.body, e=d.documentElement;
			return Math.max(Math.max(b.scrollWidth,e.scrollWidth),Math.max(b.clientWidth,e.clientWidth))
		}
	}
}();
// nCode Image Resizer 1.0.1
// http://www.ncode.nl/vbulletinplugins/
NcodeImageResizer.IMAGE_ID_BASE = 'ncode_imageresizer_container_';
NcodeImageResizer.WARNING_ID_BASE = 'ncode_imageresizer_warning_';
NcodeImageResizer.scheduledResizes = [];

function NcodeImageResizer(id, img) {
	this.id = id;
	this.img = img;
	this.originalWidth = 0;
	this.originalHeight = 0;
	this.warning = null;
	this.warningTextNode = null;
	this.originalWidth = img.originalWidth;
	this.originalHeight = img.originalHeight;
	
	img.id = NcodeImageResizer.IMAGE_ID_BASE+id;
}

NcodeImageResizer.executeOnload = function() {
	var rss = NcodeImageResizer.scheduledResizes;
	for(var i = 0; i  < rss.length; i++) {
		NcodeImageResizer.createOn(rss[i], true);
	}
}

NcodeImageResizer.schedule = function(img) {
	if(NcodeImageResizer.scheduledResizes.length == 0) {
		if(window.addEventListener) {
			window.addEventListener('load', NcodeImageResizer.executeOnload, false);
		} else if(window.attachEvent) {
			window.attachEvent('onload', NcodeImageResizer.executeOnload);
		}
	}
	NcodeImageResizer.scheduledResizes.push(img);
}

NcodeImageResizer.getNextId = function() {
	var id = 1;
	while(document.getElementById(NcodeImageResizer.IMAGE_ID_BASE+id) != null) {
		id++;
	}
	return id;
}

NcodeImageResizer.createOnId = function(id) {
	return NcodeImageResizer.createOn(document.getElementById(id));
}

NcodeImageResizer.createOn = function(img, isSchedule) {
	if(typeof isSchedule == 'undefined') isSchedule = false;
	
	if(!img || !img.tagName || img.tagName.toLowerCase() != 'img') {
		alert(img+' is not an image ('+img.tagName.toLowerCase()+')');
	}
	
	if(img.width == 0 || img.height == 0) {
		if(!isSchedule)
			NcodeImageResizer.schedule(img);
		return;
	}
	
	if(!img.originalWidth) img.originalWidth = img.width;
	if(!img.originalHeight) img.originalHeight = img.height;
	
	if((NcodeImageResizer.MAXWIDTH > 0 && img.originalWidth > NcodeImageResizer.MAXWIDTH) || (NcodeImageResizer.MAXHEIGHT > 0 && img.originalHeight > NcodeImageResizer.MAXHEIGHT)) {
		var isRecovery = false;
		var newid, resizer;
		if(img.id && img.id.indexOf(NcodeImageResizer.IMAGE_ID_BASE) == 0) {
			newid = img.id.substr(NcodeImageResizer.IMAGE_ID_BASE.length);
			if(document.getElementById(NcodeImageResizer.WARNING_ID_BASE+newid) != null) {
				resizer = new NcodeImageResizer(newid, img);
				isRecovery = true;
				resizer.restoreImage();
			}
		} else {
			newid = NcodeImageResizer.getNextId();
			resizer = new NcodeImageResizer(newid, img);
		}
		
		if(isRecovery) {
			resizer.reclaimWarning(newid);
		} else {
			resizer.createWarning();
		}
		resizer.scale();
	}
}

NcodeImageResizer.prototype.restoreImage = function() {
	newimg = document.createElement('IMG');
	newimg.src = this.img.src;
	this.img.width = newimg.width;
	this.img.height = newimg.height;
}

NcodeImageResizer.prototype.reclaimWarning = function(id) {
	this.warning = document.getElementById(NcodeImageResizer.WARNING_ID_BASE+id);
	this.warningTextNode = this.warning.firstChild.firstChild.childNodes[1].firstChild;
	this.warning.resize = this;
	
	this.scale();
}

NcodeImageResizer.prototype.createWarning = function() {
	var mtable = document.createElement('TABLE');
	var mtbody = document.createElement('TBODY');
	var mctr = document.createElement('TR');
	var mtd1 = document.createElement('TD');
	var mtd2 = document.createElement('TD');
	var mimg = document.createElement('IMG');
	var mtext = document.createTextNode('');
	
	//var m = document.createElement('div');
	//m.id = 'ncode_imageresizer_mask';
	//m.style.background = '#000';
	
	//mimg.src = NcodeImageResizer.BBURL+'/Ncode/uyari.png';
	mimg.src = NcodeImageResizer.BBURL;
	mimg.width = 16;
	mimg.height = 16;
	mimg.alt = 'uyari';
	mimg.border = 0;
	
	mtd1.width = 20;
	mtd1.className = 'td1';
	
	mtd2.unselectable = 'on';
	mtd2.className = 'td2';
	
	//mtable.style.backgroundColor = '';
	//mtable.style.color = '#F50026';
	
	mtable.style.cursor = 'pointer';
	mtable.style.margin = '10px 0 0 0';
	mtable.style.borderBottom = '0px';
	
	mtd1.style.padding = '4px';
	
	mtd2.style.textAlign = 'left';
	mtd2.style.textDecoration = 'none';
	mtd2.style.verticalAlign = 'middle';
	
	mtable.className = 'ncode_imageresizer_warning';
	mtable.textNode = mtext;
	mtable.resize = this;
	mtable.id = NcodeImageResizer.WARNING_ID_BASE+this.id;
	
	mtd1.appendChild(mimg);
	mtd2.appendChild(mtext);
	
	mctr.appendChild(mtd1);
	mctr.appendChild(mtd2);
	
	mtbody.appendChild(mctr);
	
	mtable.appendChild(mtbody);
	this.img.parentNode.insertBefore(mtable, this.img);
	
	this.warning = mtable;
	this.warningTextNode = mtext;
}

NcodeImageResizer.prototype.setText = function(text) {
	var newnode = document.createTextNode(text);
	this.warningTextNode.parentNode.replaceChild(newnode, this.warningTextNode);
	this.warningTextNode = newnode;
}

NcodeImageResizer.prototype.scale = function() {
	this.img.height = this.originalHeight;
	this.img.width = this.originalWidth;
	
	if(NcodeImageResizer.MAXWIDTH > 0 && this.img.width > NcodeImageResizer.MAXWIDTH) {
		this.img.height = (NcodeImageResizer.MAXWIDTH / this.img.width) * this.img.height;
		this.img.width = NcodeImageResizer.MAXWIDTH;
	}
	
	if(NcodeImageResizer.MAXHEIGHT > 0 && this.img.height > NcodeImageResizer.MAXHEIGHT) {
		this.img.width = (NcodeImageResizer.MAXHEIGHT / this.img.height) * this.img.width;
		this.img.height = NcodeImageResizer.MAXHEIGHT;
	}
	
	this.warning.width = this.img.width;
	this.warning.onclick = function() { return this.resize.unScale(); }
	
	if(this.img.width < 450) {
		this.setText(NcodeBoxBilgi['ncode_imageresizer_warning_small']);
	} else if(this.img.fileSize && this.img.fileSize > 0) {
		this.setText(NcodeBoxBilgi['ncode_imageresizer_warning_filesize'].replace('%1$s', this.originalWidth).replace('%2$s', this.originalHeight).replace('%3$s', Math.round(this.img.fileSize/1024)));
	} else {
		this.setText(NcodeBoxBilgi['ncode_imageresizer_warning_no_filesize'].replace('%1$s', this.originalWidth).replace('%2$s', this.originalHeight));
	}
	
	return false;
}

NcodeImageResizer.prototype.unScale = function() {
	switch(NcodeImageResizer.MODE) {
		case 'samewindow': //Resmi aynÄ± pencerede/sayfada orjinal boyutunda aÃ§
			window.open(this.img.src, '_self');
			break;
		case 'newwindow': //Resmi yeni sekme/pencerede orjinal boyutunda aÃ§
			window.open(this.img.src, '_blank');
			break;
		case 'ncodebox': //Resmi aynÄ± sayfada efektli olarak orjinal boyutunda aÃ§
			NcodeImageResizerBox.box.show('<img src="'+this.img.src+'" />',0,0,0,1);
			break;			
		case 'enlarge': //Resmi aynÄ± sayfada bÃ¼yÃ¼lt/kÃ¼Ã§Ã¼lt
		default: //VarsayÄ±lan seÃ§im, seÃ§im yapÄ±lmamÄ±ÅŸsa aynÄ± sayfada resmi boyutlandÄ±rmayÄ± (bÃ¼yÃ¼ltÃ¼p/kÃ¼Ã§Ã¼ltmeyi) saÄŸlar.
			this.img.width = this.originalWidth;
			this.img.height = this.originalHeight;
			this.img.className = 'ncode_imageresizer_original';
			if(this.warning != null) {
				this.setText(NcodeBoxBilgi['ncode_imageresizer_warning_fullsize']);
				this.warning.width = this.img.width;
				this.warning.onclick = function() { return this.resize.scale() };
			}
			break;
	}
	
	return false;
}