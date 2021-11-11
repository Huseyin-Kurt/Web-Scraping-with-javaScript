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
		this.alakali=[];
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
		this.yakinDizisi=[];
		this.url=url;
	}
}

class Yakin
{
	constructor(string,yakinString)
	{
		this.yazilcak=string+"\t:";

		for(let i=0;i<yakinString.length;i++)
		{
			this.yazilcak+=yakinString[i]+",";
		}
	}
}

//node js

const cheerio=require("cheerio");
const stopword=require("stopword");
const synonyms=require("synonyms");

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

	yakinBulma(obje)

}


function yakinBulma(obje)
{
	for(let i=0;i<obje.frekansDizisi.length;i++)
	{
		obje.frekansDizisi[i].n=synonyms(obje.frekansDizisi[i].string,"n");
		obje.frekansDizisi[i].v=synonyms(obje.frekansDizisi[i].string,"v");
	}


	for(let i=0;i<obje.frekansDizisi.length;i++)
	{
		let yakinString=[];

		for(let j=0;j<obje.frekansDizisi.length;j++)
		{

			if(i===j)
			{
				continue;
			}

			let cikilcakmi=false;

			if(typeof obje.frekansDizisi[i].n!=="undefined"&&typeof obje.frekansDizisi[j].n!=="undefined")
			{
				for(let n=0;n<obje.frekansDizisi[i].n.length;n++)
				{
					for(let n2=0;n2<obje.frekansDizisi[j].n.length;n2++)
					{
						if(obje.frekansDizisi[i].n[n]===obje.frekansDizisi[j].n[n2]&&obje.frekansDizisi[i].n[n]!=="n"&&obje.frekansDizisi[j].n[n2]!=="n")
						{
							cikilcakmi=true;
							yakinString.push(obje.frekansDizisi[j].string);
							break;
						}
					}

					if(cikilcakmi===true)
					{
						break;
					}
				}
			}

			if(cikilcakmi===true)
			{
				continue;
			}


			if(typeof obje.frekansDizisi[i].v!=="undefined"&&typeof obje.frekansDizisi[j].v!=="undefined")
			{
				for(let v=0;v<obje.frekansDizisi[i].v.length;v++)
				{
					for(let v2=0;v2<obje.frekansDizisi[j].v.length;v2++)
					{
						if(obje.frekansDizisi[i].v[v]===obje.frekansDizisi[j].v[v2]&&obje.frekansDizisi[i].v[v]!=="v"&&obje.frekansDizisi[j].v[v2]!="v")
						{
							cikilcakmi=true;
							yakinString.push(obje.frekansDizisi[j].string);
							break;
						}
					}

					if(cikilcakmi===true)
					{
						break;
					}
				}
			}

			if(cikilcakmi===true)
			{
				continue;
			}
		}

		if(yakinString.length>0)
		{
			let yeniYakin=new Yakin(obje.frekansDizisi[i].string,yakinString);
			obje.yakinDizisi.push(yeniYakin);
		}
	}
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

		for(let d=0;d<siteKumesi[i].yakinDizisi.length;d++)
		{
			const anahtarKelimeParagraf=document.createElement("p");
			anahtarKelimeParagraf.className="anahtarKelimeParagraf1";

			const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].yakinDizisi[d].yazilcak);

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


			for(let d=0;d<siteKumesi[i].altSiteler[j].yakinDizisi.length;d++)
			{
				const anahtarKelimeParagraf=document.createElement("p");
				anahtarKelimeParagraf.className="anahtarKelimeParagraf2";

				const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].altSiteler[j].yakinDizisi[d].yazilcak);

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

				for(let d=0;d<siteKumesi[i].altSiteler[j].altSiteler[k].yakinDizisi.length;d++)
				{
					const anahtarKelimeParagraf=document.createElement("p");
					anahtarKelimeParagraf.className="anahtarKelimeParagraf3";

					const anahtarKelimeParagrafYazisi=document.createTextNode(siteKumesi[i].altSiteler[j].altSiteler[k].yakinDizisi[d].yazilcak);

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



