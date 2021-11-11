"use strict";


//sınıflar
class Frekans
{
	constructor(string)
	{
		this.string=string;
		this.sayi=1;
	}
}



class AnahtarKelime
{
	constructor(string)
	{
		this.string=string;
		this.substring=string.split(" ");
		this.skor=0;
		this.bolucu=this.substring.length;
	}
}

class VektorElemani
{
	constructor(string)
	{
		this.string=string;
		this.sayi=0;
	}
}

class Site
{
	constructor(url)
	{
		this.altSiteler=[];
		this.kelimeler=[];
		this.frekansDizisi=[];
		this.anahtarKelimeler=[];
		this.url=url;
	}
}

//node js

const cheerio=require("cheerio");
const stopword=require("stopword");

//ekran tutucular

const dorduncuKisimEkrani=document.querySelector("#dorduncuKisimEkrani");

//4.kisim buton tutucular

const anaSiteTamamButonu=document.querySelector("#anaSiteTamam");
const siteKumesiTamamButonu=document.querySelector("#siteKumesiTamam");
const islemiBaslatButonu=document.querySelector("#islemiBaslat");

//4.kisim text tutucular

const anaSiteText=document.querySelector("#anaSiteText");
const siteKumesiText=document.querySelector("#siteKumesiText");

//global 

let anaSite;
let siteKumesi=[];

//4. kısım fonksiyonları
anaSiteTamamButonu.onclick=() =>
{
	let url=anaSiteText.value;
	anaSiteText.value="";

	let yeniSite=new Site(url);

	anaSite=yeniSite;

}

siteKumesiTamamButonu.onclick=() =>
{
	let url=siteKumesiText.value;
	siteKumesiText.value="";

	let yeniSite=new Site(url);

	siteKumesi.push(yeniSite);

}


islemiBaslatButonu.onclick=() =>
{
	dorduncuKisimEkrani.style.display="none";

	let fetchDizisi1=[];


	 fetchDizisi1.push(fetch(anaSite.url)
    .then(function (cevap)
    {
      return cevap.text();

    })
    .then(function (html) {
      	
    	const $=cheerio.load(html);

		let kelimeler=$.text();

		kelimeler=kelimeler.split(/[\s,.!?{}():=""<>/;\[\]&]/);

		for(let i=0;i<kelimeler.length;i++)
		{	

			kelimeler[i]=kelimeler[i].toLowerCase();


			if(kelimeler[i].length<2)
			{
				kelimeler.splice(i,1);
				i--;
			}

		}


		anaSite.kelimeler=kelimeler;

		frekansHesabi(anaSite);

    }).catch(function(error){

    	console.log(anaSite.url+"\t hata:"+error);
    }));


	 
	 for(let i=0;i<siteKumesi.length;i++)
	 {
	 	fetchDizisi1.push(
	 		fetch(siteKumesi[i].url)
	 		.then(function(cevap){

	 			return cevap.text();

	 		}).then(function(html){

	 			const $=cheerio.load(html);

	 			let kelimeler=$.text();

	 			kelimeler=kelimeler.split(/[\s,.!?{}():=""<>/;\[\]&]/);

	 			for(let i=0;i<kelimeler.length;i++)
				{

					kelimeler[i]=kelimeler[i].toLowerCase();

					if(kelimeler[i].length<2)
					{
						kelimeler.splice(i,1);
						i--;
					}

				}

				siteKumesi[i].kelimeler=kelimeler;

				let linkSayisi=0;

				$("body a").each(function(index,value){

					let href=$(value).prop("href");

					if(typeof href!=="undefined")
					{
						let kontrol1=href.substring(0,4);
						let kontrol2=href.substring(0,5);

						if(kontrol1.includes("http")||kontrol2.includes("https"))
						{
							let yeniSite=new Site(href);

							siteKumesi[i].altSiteler.push(yeniSite);

							linkSayisi++;

							if(linkSayisi==5)
							{
								return false;
							}
						}

					}

				});
	 		}).catch(function(error){

	 			console.log(siteKumesi[i].url+"\t hata:"+error);
	 		})
	 		);
	 }


	 Promise.all(fetchDizisi1).then(function(){

	 	let fetchDizisi2=[];

	 	for(let i=0;i<siteKumesi.length;i++)
	 	{
	 		for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
	 		{
	 			fetchDizisi2.push(
	 				fetch(siteKumesi[i].altSiteler[j].url)
	 				.then(function(cevap){

	 					return cevap.text();

	 				}).then(function(html){

	 					const $=cheerio.load(html);

	 					let kelimeler=$.text();

	 					kelimeler=kelimeler.split(/[\s,.!?{}():=""<>/;\[\]&]/);

	 					for(let i=0;i<kelimeler.length;i++)
						{

							kelimeler[i]=kelimeler[i].toLowerCase();

							if(kelimeler[i].length<2)
							{
								kelimeler.splice(i,1);
								i--;
							}

						}

						siteKumesi[i].altSiteler[j].kelimeler=kelimeler;

						let linkSayisi=0;

						$("body a").each(function(index,value){

							let href=$(value).prop("href");

							if(typeof href!=="undefined")
							{
								let kontrol1=href.substring(0,4);
								let kontrol2=href.substring(0,5);

								if(kontrol1.includes("http")||kontrol2.includes("https"))
								{
									let yeniSite=new Site(href);

									siteKumesi[i].altSiteler[j].altSiteler.push(yeniSite);

									linkSayisi++;

									if(linkSayisi==5)
									{
										return false;
									}
								}
							}


						});

	 				}).catch(function(error){

	 					console.log(siteKumesi[i].altSiteler[j].url+"\t hata:"+error);
	 				})
	 				);
	 		}
	 	}

	 	Promise.all(fetchDizisi2).then(function(){

	 		let fetchDizisi3=[];

	 		for(let i=0;i<siteKumesi.length;i++)
	 		{
	 			for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
	 			{
	 				for(let k=0;k<siteKumesi[i].altSiteler[j].altSiteler.length;k++)
	 				{
	 					fetchDizisi3.push(

	 						fetch(siteKumesi[i].altSiteler[j].altSiteler[k].url)
	 						.then(function(cevap){

	 							return cevap.text();
	 						}).then(function(html){

	 							const $=cheerio.load(html);

	 							let kelimeler=$.text();

	 							kelimeler=kelimeler.split(/[\s,.!?{}():=""<>/;\[\]&]/);

	 							for(let i=0;i<kelimeler.length;i++)
								{

									kelimeler[i]=kelimeler[i].toLowerCase();
									
									if(kelimeler[i].length<2)
									{
										kelimeler.splice(i,1);
										i--;
									}

								}

								siteKumesi[i].altSiteler[j].altSiteler[k].kelimeler=kelimeler;


	 						}).catch(function(error){

	 							console.log(siteKumesi[i].altSiteler[j].altSiteler[k].url+"\t hata:"+error);

	 						})

	 						);
	 				}
	 			}
	 		}


	 		Promise.all(fetchDizisi3).then(function(){

	 			console.log("fetch tamamlandı");
	 			anaSite.kelimeler=stopword.removeStopwords(anaSite.kelimeler);

	 			for(let i=0;i<siteKumesi.length;i++)
	 			{
	 				frekansHesabi(siteKumesi[i]);
	 				benzerlikHesabi(anaSite, siteKumesi[i])

	 				for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
	 				{
	 					frekansHesabi(siteKumesi[i].altSiteler[j]);
	 					benzerlikHesabi(anaSite,siteKumesi[i].altSiteler[j]);

	 					for(let k=0;k<siteKumesi[i].altSiteler[j].altSiteler.length;k++)
	 					{
	 						frekansHesabi(siteKumesi[i].altSiteler[j].altSiteler[k]);
	 						benzerlikHesabi(anaSite,siteKumesi[i].altSiteler[j].altSiteler[k]);
	 					}
	 				}
	 			}

	 			benzerlikleriBulma();
	 		});
	 	});
	 });
	 
	

}



function frekansHesabi(obje)
{
	let frekansDizisi=[];


	for(let i=0;i<obje.kelimeler.length;i++)
	{	
		let mevcutmu=false;

		for(let j=0;j<frekansDizisi.length;j++)
		{
			if(obje.kelimeler[i]===frekansDizisi[j].string)
			{
				mevcutmu=true;
				frekansDizisi[j].sayi++;
				break;
			}
		}

		if(!mevcutmu)
		{
			let yeniEleman=new Frekans(obje.kelimeler[i]);
			frekansDizisi.push(yeniEleman);
		}
	}


	

	obje.frekansDizisi=frekansDizisi;

	anahtarKelimeBulma(obje);
}

function anahtarKelimeBulma(obje)
{	
	let anahtarKelimeler=[];

	let gereksizKelimeler=["0o","0s", "3a", "3b", "3d", "6b", "6o", "a", "a1", "a2", "a3", "a4", "ab", "able", "about", "above", "abst", "ac", "accordance", "according", "accordingly", "across", "act", "actually", "ad", "added", "adj", "ae", "af", "affected", "affecting", "affects", "after", "afterwards", "ag", "again", "against", "ah", "ain", "ain't", "aj", "al", "all", "allow", "allows", "almost", "alone", "along", "already", "also", "although", "always", "am", "among", "amongst", "amoungst", "amount", "an", "and", "announce", "another", "any", "anybody", "anyhow", "anymore", "anyone", "anything", "anyway", "anyways", "anywhere", "ao", "ap", "apart", "apparently", "appear", "appreciate", "appropriate", "approximately", "ar", "are", "aren", "arent", "aren't", "arise", "around", "as", "a's", "aside", "ask", "asking", "associated", "at", "au", "auth", "av", "available", "aw", "away", "awfully", "ax", "ay", "az", "b", "b1", "b2", "b3", "ba", "back", "bc", "bd", "be", "became", "because", "become", "becomes", "becoming", "been", "before", "beforehand", "begin", "beginning", "beginnings", "begins", "behind", "being", "believe", "below", "beside", "besides", "best", "better", "between", "beyond", "bi", "bill", "biol", "bj", "bk", "bl", "bn", "both", "bottom", "bp", "br", "brief", "briefly", "bs", "bt", "bu", "but", "bx", "by", "c", "c1", "c2", "c3", "ca", "call", "came", "can", "cannot", "cant", "can't", "cause", "causes", "cc", "cd", "ce", "certain", "certainly", "cf", "cg", "ch", "changes", "ci", "cit", "cj", "cl", "clearly", "cm", "c'mon", "cn", "co", "com", "come", "comes", "con", "concerning", "consequently", "consider", "considering", "contain", "containing", "contains", "corresponding", "could", "couldn", "couldnt", "couldn't", "course", "cp", "cq", "cr", "cry", "cs", "c's", "ct", "cu", "currently", "cv", "cx", "cy", "cz", "d", "d2", "da", "date", "dc", "dd", "de", "definitely", "describe", "described", "despite", "detail", "df", "di", "did", "didn", "didn't", "different", "dj", "dk", "dl", "do", "does", "doesn", "doesn't", "doing", "don", "done", "don't", "down", "downwards", "dp", "dr", "ds", "dt", "du", "due", "during", "dx", "dy", "e", "e2", "e3", "ea", "each", "ec", "ed", "edu", "ee", "ef", "effect", "eg", "ei", "eight", "eighty", "either", "ej", "el", "eleven", "else", "elsewhere", "em", "empty", "en", "end", "ending", "enough", "entirely", "eo", "ep", "eq", "er", "es", "especially", "est", "et", "et-al", "etc", "eu", "ev", "even", "ever", "every", "everybody", "everyone", "everything", "everywhere", "ex", "exactly", "example", "except", "ey", "f", "f2", "fa", "far", "fc", "few", "ff", "fi", "fifteen", "fifth", "fify", "fill", "find", "fire", "first", "five", "fix", "fj", "fl", "fn", "fo", "followed", "following", "follows", "for", "former", "formerly", "forth", "forty", "found", "four", "fr", "from", "front", "fs", "ft", "fu", "full", "further", "furthermore", "fy", "g", "ga", "gave", "ge", "get", "gets", "getting", "gi", "give", "given", "gives", "giving", "gj", "gl", "go", "goes", "going", "gone", "got", "gotten", "gr", "greetings", "gs", "gy", "h", "h2", "h3", "had", "hadn", "hadn't", "happens", "hardly", "has", "hasn", "hasnt", "hasn't", "have", "haven", "haven't", "having", "he", "hed", "he'd", "he'll", "hello", "help", "hence", "her", "here", "hereafter", "hereby", "herein", "heres", "here's", "hereupon", "hers", "herself", "hes", "he's", "hh", "hi", "hid", "him", "himself", "his", "hither", "hj", "ho", "home", "hopefully", "how", "howbeit", "however", "how's", "hr", "hs", "http", "hu", "hundred", "hy", "i", "i2", "i3", "i4", "i6", "i7", "i8", "ia", "ib", "ibid", "ic", "id", "i'd", "ie", "if", "ig", "ignored", "ih", "ii", "ij", "il", "i'll", "im", "i'm", "immediate", "immediately", "importance", "important", "in", "inasmuch", "inc", "indeed", "index", "indicate", "indicated", "indicates", "information", "inner", "insofar", "instead", "interest", "into", "invention", "inward", "io", "ip", "iq", "ir", "is", "isn", "isn't", "it", "itd", "it'd", "it'll", "its", "it's", "itself", "iv", "i've", "ix", "iy", "iz", "j", "jj", "jr", "js", "jt", "ju", "just", "k", "ke", "keep", "keeps", "kept", "kg", "kj", "km", "know", "known", "knows", "ko", "l", "l2", "la", "largely", "last", "lately", "later", "latter", "latterly", "lb", "lc", "le", "least", "les", "less", "lest", "let", "lets", "let's", "lf", "like", "liked", "likely", "line", "little", "lj", "ll", "ll", "ln", "lo", "look", "looking", "looks", "los", "lr", "ls", "lt", "ltd", "m", "m2", "ma", "made", "mainly", "make", "makes", "many", "may", "maybe", "me", "mean", "means", "meantime", "meanwhile", "merely", "mg", "might", "mightn", "mightn't", "mill", "million", "mine", "miss", "ml", "mn", "mo", "more", "moreover", "most", "mostly", "move", "mr", "mrs", "ms", "mt", "mu", "much", "mug", "must", "mustn", "mustn't", "my", "myself", "n", "n2", "na", "name", "namely", "nay", "nc", "nd", "ne", "near", "nearly", "necessarily", "necessary", "need", "needn", "needn't", "needs", "neither", "never", "nevertheless", "new", "next", "ng", "ni", "nine", "ninety", "nj", "nl", "nn", "no", "nobody", "non", "none", "nonetheless", "noone", "nor", "normally", "nos", "not", "noted", "nothing", "novel", "now", "nowhere", "nr", "ns", "nt", "ny", "o", "oa", "ob", "obtain", "obtained", "obviously", "oc", "od", "of", "off", "often", "og", "oh", "oi", "oj", "ok", "okay", "ol", "old", "om", "omitted", "on", "once", "one", "ones", "only", "onto", "oo", "op", "oq", "or", "ord", "os", "ot", "other", "others", "otherwise", "ou", "ought", "our", "ours", "ourselves", "out", "outside", "over", "overall", "ow", "owing", "own", "ox", "oz", "p", "p1", "p2", "p3", "page", "pagecount", "pages", "par", "part", "particular", "particularly", "pas", "past", "pc", "pd", "pe", "per", "perhaps", "pf", "ph", "pi", "pj", "pk", "pl", "placed", "please", "plus", "pm", "pn", "po", "poorly", "possible", "possibly", "potentially", "pp", "pq", "pr", "predominantly", "present", "presumably", "previously", "primarily", "probably", "promptly", "proud", "provides", "ps", "pt", "pu", "put", "py", "q", "qj", "qu", "que", "quickly", "quite", "qv", "r", "r2", "ra", "ran", "rather", "rc", "rd", "re", "readily", "really", "reasonably", "recent", "recently", "ref", "refs", "regarding", "regardless", "regards", "related", "relatively", "research", "research-articl", "respectively", "resulted", "resulting", "results", "rf", "rh", "ri", "right", "rj", "rl", "rm", "rn", "ro", "rq", "rr", "rs", "rt", "ru", "run", "rv", "ry", "s", "s2", "sa", "said", "same", "saw", "say", "saying", "says", "sc", "sd", "se", "sec", "second", "secondly", "section", "see", "seeing", "seem", "seemed", "seeming", "seems", "seen", "self", "selves", "sensible", "sent", "serious", "seriously", "seven", "several", "sf", "shall", "shan", "shan't", "she", "shed", "she'd", "she'll", "shes", "she's", "should", "shouldn", "shouldn't", "should've", "show", "showed", "shown", "showns", "shows", "si", "side", "significant", "significantly", "similar", "similarly", "since", "sincere", "six", "sixty", "sj", "sl", "slightly", "sm", "sn", "so", "some", "somebody", "somehow", "someone", "somethan", "something", "sometime", "sometimes", "somewhat", "somewhere", "soon", "sorry", "sp", "specifically", "specified", "specify", "specifying", "sq", "sr", "ss", "st", "still", "stop", "strongly", "sub", "substantially", "successfully", "such", "sufficiently", "suggest", "sup", "sure", "sy", "system", "sz", "t", "t1", "t2", "t3", "take", "taken", "taking", "tb", "tc", "td", "te", "tell", "ten", "tends", "tf", "th", "than", "thank", "thanks", "thanx", "that", "that'll", "thats", "that's", "that've", "the", "their", "theirs", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "thered", "therefore", "therein", "there'll", "thereof", "therere", "theres", "there's", "thereto", "thereupon", "there've", "these", "they", "theyd", "they'd", "they'll", "theyre", "they're", "they've", "thickv", "thin", "think", "third", "this", "thorough", "thoroughly", "those", "thou", "though", "thoughh", "thousand", "three", "throug", "through", "throughout", "thru", "thus", "ti", "til", "tip", "tj", "tl", "tm", "tn", "to", "together", "too", "took", "top", "toward", "towards", "tp", "tq", "tr", "tried", "tries", "truly", "try", "trying", "ts", "t's", "tt", "tv", "twelve", "twenty", "twice", "two", "tx", "u", "u201d", "ue", "ui", "uj", "uk", "um", "un", "under", "unfortunately", "unless", "unlike", "unlikely", "until", "unto", "uo", "up", "upon", "ups", "ur", "us", "use", "used", "useful", "usefully", "usefulness", "uses", "using", "usually", "ut", "v", "va", "value", "various", "vd", "ve", "ve", "very", "via", "viz", "vj", "vo", "vol", "vols", "volumtype", "vq", "vs", "vt", "vu", "w", "wa", "want", "wants", "was", "wasn", "wasnt", "wasn't", "way", "we", "wed", "we'd", "welcome", "well", "we'll", "well-b", "went", "were", "we're", "weren", "werent", "weren't", "we've", "what", "whatever", "what'll", "whats", "what's", "when", "whence", "whenever", "when's", "where", "whereafter", "whereas", "whereby", "wherein", "wheres", "where's", "whereupon", "wherever", "whether", "which", "while", "whim", "whither", "who", "whod", "whoever", "whole", "who'll", "whom", "whomever", "whos", "who's", "whose", "why", "why's", "wi", "widely", "will", "willing", "wish", "with", "within", "without", "wo", "won", "wonder", "wont", "won't", "words", "world", "would", "wouldn", "wouldnt", "wouldn't", "www", "x", "x1", "x2", "x3", "xf", "xi", "xj", "xk", "xl", "xn", "xo", "xs", "xt", "xv", "xx", "y", "y2", "yes", "yet", "yj", "yl", "you", "youd", "you'd", "you'll", "your", "youre", "you're", "yours", "yourself", "yourselves", "you've", "yr", "ys", "yt", "z", "zero", "zi", "zz"];


	let string="";

	for(let i=0;i<obje.kelimeler.length;i++)
	{
		let gereksizmi=false;


		for(let j=0;j<gereksizKelimeler.length;j++)
		{
			if(obje.kelimeler[i]===gereksizKelimeler[j])
			{
				gereksizmi=true;
				break;
			}
		}

		if(gereksizmi===false)
		{
			string+=obje.kelimeler[i]+" ";
		}

		else if(gereksizmi===true)
		{
			let oncedenVarmi=false;

			for(let k=0;k<anahtarKelimeler.length;k++)
			{
				if(string===anahtarKelimeler[k].string)
				{
					oncedenVarmi=true;
					break;
				}
			}

			if(oncedenVarmi===false)
			{
				let yeniAnahtar=new AnahtarKelime(string);
				anahtarKelimeler.push(yeniAnahtar);

			}

			string="";
		}
	}



	
	for(let i=0;i<anahtarKelimeler.length;i++)
	{
		for(let j=0;j<anahtarKelimeler[i].substring.length;j++)
		{
			for(let k=0;k<obje.frekansDizisi.length;k++)
			{
				if(anahtarKelimeler[i].substring[j]===obje.frekansDizisi[k].string)
				{
					anahtarKelimeler[i].skor+=obje.frekansDizisi[k].sayi;
				}
			}
		}
	}


	for(let i=0;i<anahtarKelimeler.length;i++)
	{
		anahtarKelimeler[i].skor=anahtarKelimeler[i].skor/anahtarKelimeler[i].bolucu;
	}



	for(let i=0;i<anahtarKelimeler.length;i++)
	{	
		
		for(let j=0;j<anahtarKelimeler[i].substring.length;j++)
		{	
			let cikilcakmi=false;

			for(let k=j+1;k<anahtarKelimeler[i].substring.length;k++)
			{	

				if(anahtarKelimeler[i].substring[j]===anahtarKelimeler[i].substring[k])
				{	
					anahtarKelimeler.splice(i,1);
					i--;
					cikilcakmi=true;
					break;
				}
			}

			if(cikilcakmi===true)
			{
				break;
			}
		}
	}

	

	for(let i=0;i<anahtarKelimeler.length;i++)
	{
		for(let j=i+1;j<anahtarKelimeler.length;j++)
		{
			if(anahtarKelimeler[i].skor<anahtarKelimeler[j].skor)
			{
				let temp=anahtarKelimeler[i];
				anahtarKelimeler[i]=anahtarKelimeler[j];
				anahtarKelimeler[j]=temp;
			}
		}
	}

	let baslangic=anahtarKelimeler.length*1/10;
	let miktar=anahtarKelimeler.length*9/10;
	
	anahtarKelimeler.splice(baslangic,miktar+1);

	obje.anahtarKelimeler=anahtarKelimeler;


}



function benzerlikHesabi(obje1,obje2)
{	
	obje2.kelimeler=stopword.removeStopwords(obje2.kelimeler);

	let toplamKelimeler=[];

	for(let i=0;i<obje1.kelimeler.length;i++)
	{	
		let mevcutmu=false;

		for(let j=0;j<toplamKelimeler.length;j++)
		{
			if(toplamKelimeler[j]===obje1.kelimeler[i])
			{
				mevcutmu=true;
				break;
			}
		}

		if(mevcutmu===false)
		{
			toplamKelimeler.push(obje1.kelimeler[i]);
		}
	}


	for(let i=0;i<obje2.kelimeler.length;i++)
	{	
		let mevcutmu=false;

		for(let j=0;j<toplamKelimeler.length;j++)
		{
			if(toplamKelimeler[j]===obje2.kelimeler[i])
			{
				mevcutmu=true;
				break;
			}
		}

		if(mevcutmu===false)
		{
			toplamKelimeler.push(obje2.kelimeler[i]);
		}
	}

	

	let vektor1=[];
	let vektor2=[];

	for(let i=0;i<toplamKelimeler.length;i++)
	{
		let yeni=new VektorElemani(toplamKelimeler[i]);
		vektor1.push(yeni);
	}

	for(let i=0;i<toplamKelimeler.length;i++)
	{
		let yeni=new VektorElemani(toplamKelimeler[i]);
		vektor2.push(yeni);
	}



	for(let i=0;i<obje1.kelimeler.length;i++)
	{
		for(let j=0;j<vektor1.length;j++)
		{
			if(obje1.kelimeler[i]===vektor1[j].string)
			{
				vektor1[j].sayi++;
			}
		}
	}


	for(let i=0;i<obje2.kelimeler.length;i++)
	{
		for(let j=0;j<vektor2.length;j++)
		{
			if(obje2.kelimeler[i]===vektor2[j].string)
			{
				vektor2[j].sayi++;
			}
		}
	}


	
	let pay=0;

	for(let i=0;i<vektor1.length;i++)
	{	
		pay+=vektor1[i].sayi*vektor2[i].sayi;
	}

	let uzunluk1=0;
	let uzunluk2=0;


	for(let i=0;i<vektor1.length;i++)
	{
		uzunluk1+=Math.pow(vektor1[i].sayi, 2);
	}		

	uzunluk1=Math.sqrt(uzunluk1);


	for(let i=0;i<vektor2.length;i++)
	{
		uzunluk2+=Math.pow(vektor2[i].sayi,2);
	}

	uzunluk2=Math.sqrt(uzunluk2);

	let payda=uzunluk1*uzunluk2;


	let benzerlikOrani=pay/payda;

	obje2.benzerlikOrani=benzerlikOrani;

}



function benzerlikleriBulma()
{	
	for(let i=0;i<siteKumesi.length;i++)
	{
		benzerlikHesabi(anaSite,siteKumesi[i])
		siteKumesi[i].dalOrani=0;
		siteKumesi[i].dalOrani+=3*siteKumesi[i].benzerlikOrani;

		for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
		{
			benzerlikHesabi(anaSite,siteKumesi[i].altSiteler[j]);
			siteKumesi[i].dalOrani+=2*siteKumesi[i].altSiteler[j].benzerlikOrani;

			for(let k=0;k<siteKumesi[i].altSiteler[j].altSiteler.length;k++)
			{
				benzerlikHesabi(anaSite, siteKumesi[i].altSiteler[j].altSiteler[k]);
				siteKumesi[i].dalOrani+=siteKumesi[i].altSiteler[j].altSiteler[k].benzerlikOrani;
			}
		}
	}




	for(let i=0;i<siteKumesi.length;i++)
	{
		for(let j=i+1;j<siteKumesi.length;j++)
		{
			if(siteKumesi[i].dalOrani<siteKumesi[j].dalOrani)
			{
				let temp=siteKumesi[i];
				siteKumesi[i]=siteKumesi[j];
				siteKumesi[j]=temp;
			}
		}
	}


	for(let i=0;i<siteKumesi.length;i++)
	{
		for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
		{
			for(let k=0;k<siteKumesi[i].altSiteler.length;k++)
			{
				if(siteKumesi[i].altSiteler[j].benzerlikOrani>siteKumesi[i].altSiteler[k].benzerlikOrani)
				{
					let temp=siteKumesi[i].altSiteler[j];
					siteKumesi[i].altSiteler[j]=siteKumesi[i].altSiteler[k];
					siteKumesi[i].altSiteler[k]=temp;
				}
			}
		}
	}


	for(let i=0;i<siteKumesi.length;i++)
	{
		for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
		{
			for(let k=0;k<siteKumesi[i].altSiteler[j].altSiteler.length;k++)
			{
				for(let d=0;d<siteKumesi[i].altSiteler[j].altSiteler.length;d++)
				{
					if(siteKumesi[i].altSiteler[j].altSiteler[k].benzerlikOrani>siteKumesi[i].altSiteler[j].altSiteler[d].benzerlikOrani)
					{	
						let temp=siteKumesi[i].altSiteler[j].altSiteler[k];
						siteKumesi[i].altSiteler[j].altSiteler[k]=siteKumesi[i].altSiteler[j].altSiteler[d];
						siteKumesi[i].altSiteler[j].altSiteler[d]=temp;
					}
				}
			}
		}
	}

	sonuclariYazdirma();
}


function sonuclariYazdirma()
{	
	const sonucEkrani=document.querySelector("#sonucEkrani");

	const anaSiteParagraf=document.createElement("p");
	anaSiteParagraf.className="anaSiteParagraf";
	const anaSiteParagrafYazisi=document.createTextNode(anaSite.url);

	anaSiteParagraf.appendChild(anaSiteParagrafYazisi);

	sonucEkrani.appendChild(anaSiteParagraf);


	for(let i=0;i<siteKumesi.length;i++)
	{	
		const birinciDiv=document.createElement("div");
		birinciDiv.className="birinciDiv";

		const totalSkor=document.createElement("p");
		totalSkor.className="totalSkorParagraf";
		const totalSkorYazisi=document.createTextNode(siteKumesi[i].dalOrani);

		totalSkor.appendChild(totalSkorYazisi);

		const birinciSite=document.createElement("p");
		birinciSite.className="birinciParagraf";
		const birinciSiteYazisi=document.createTextNode(siteKumesi[i].url+"\t("+siteKumesi[i].benzerlikOrani+")");

		birinciSite.appendChild(birinciSiteYazisi);

		birinciDiv.appendChild(totalSkor);
		birinciDiv.appendChild(birinciSite);

		for(let d=0;d<siteKumesi[i].anahtarKelimeler.length;d++)
		{
			const anahtarKelimeParagraf=document.createElement("p");
			anahtarKelimeParagraf.className="anahtarKelimeParagraf1";

			const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].anahtarKelimeler[d].string+"\t("+siteKumesi[i].anahtarKelimeler[d].skor+")");

			anahtarKelimeParagraf.appendChild(anahtarKelimeParagrafYazisi);

			birinciDiv.appendChild(anahtarKelimeParagraf);
		}


		for(let j=0;j<siteKumesi[i].altSiteler.length;j++)
		{
			const ikinciDiv=document.createElement("div");
			ikinciDiv.className="ikinciDiv";

			const ikinciSite=document.createElement("p");
			ikinciSite.className="ikinciParagraf";
			const ikinciSiteYazisi=document.createTextNode("* \t"+siteKumesi[i].altSiteler[j].url+"\t("+siteKumesi[i].altSiteler[j].benzerlikOrani+")");

			ikinciSite.appendChild(ikinciSiteYazisi);

			ikinciDiv.appendChild(ikinciSite);

			for(let d=0;d<siteKumesi[i].altSiteler[j].anahtarKelimeler.length;d++)
				{
					const anahtarKelimeParagraf=document.createElement("p");
					anahtarKelimeParagraf.className="anahtarKelimeParagraf2";

					const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].altSiteler[j].anahtarKelimeler[d].string+"\t("+siteKumesi[i].altSiteler[j].anahtarKelimeler[d].skor+")");

					anahtarKelimeParagraf.appendChild(anahtarKelimeParagrafYazisi);

					ikinciDiv.appendChild(anahtarKelimeParagraf);
				}


			for(let k=0;k<siteKumesi[i].altSiteler[j].altSiteler.length;k++)
			{
				const ucuncuDiv=document.createElement("div");
				ucuncuDiv.className="ucuncuDiv";

				const ucuncuSite=document.createElement("p");
				ucuncuSite.className="ucuncuParagraf";
				const ucuncuSiteYazisi=document.createTextNode("** \t"+siteKumesi[i].altSiteler[j].altSiteler[k].url+"\t("+siteKumesi[i].altSiteler[j].altSiteler[k].benzerlikOrani+")");

				ucuncuSite.appendChild(ucuncuSiteYazisi);

				ucuncuDiv.appendChild(ucuncuSite);


				for(let d=0;d<siteKumesi[i].altSiteler[j].altSiteler[k].anahtarKelimeler.length;d++)
				{
					const anahtarKelimeParagraf=document.createElement("p");
					anahtarKelimeParagraf.className="anahtarKelimeParagraf3";

					const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].altSiteler[j].altSiteler[k].anahtarKelimeler[d].string+"\t("+siteKumesi[i].altSiteler[j].altSiteler[k].anahtarKelimeler[d].skor+")");

					anahtarKelimeParagraf.appendChild(anahtarKelimeParagrafYazisi);

					ucuncuDiv.appendChild(anahtarKelimeParagraf);
				}

				ikinciDiv.appendChild(ucuncuDiv);
			}

			birinciDiv.appendChild(ikinciDiv);
		}

		sonucEkrani.appendChild(birinciDiv);
		
	}

	sonucEkrani.style.display="flex";

}



