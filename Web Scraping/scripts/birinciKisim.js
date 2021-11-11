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

//node js

const cheerio=require("cheerio");

//Ekran tutucular

const birinciKisimEkrani=document.querySelector("#birinciKisimEkrani");

//birinci kisim fonksiyonları

function birinciKisimFonksiyonu() 
{	
	let url=prompt("Url giriniz?(Frekans Hesaplama)");

	while(url===null)
	{
		url=prompt("Url giriniz?(Frekans Hesaplama)");
	}

	 fetch(url)
    .then(function (cevap) {
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


		frekansHesabi(kelimeler);

    }).catch(function(error){

    	console.log(url+"\t hata:"+error);
    });
}

function frekansHesabi(kelimeler)
{
	let frekansDizisi=[];

	for(let i=0;i<kelimeler.length;i++)
	{	
		let mevcutmu=false;

		for(let j=0;j<frekansDizisi.length;j++)
		{
			if(kelimeler[i]===frekansDizisi[j].string)
			{
				mevcutmu=true;
				frekansDizisi[j].sayi++;
				break;
			}
		}

		if(!mevcutmu)
		{
			let yeniEleman=new Frekans(kelimeler[i]);
			frekansDizisi.push(yeniEleman);
		}
	}


	for(let i=0;i<frekansDizisi.length;i++)
	{
		for(let j=i+1;j<frekansDizisi.length;j++)
		{
			if(frekansDizisi[i].sayi<frekansDizisi[j].sayi)
			{
				let temp=frekansDizisi[i];
				frekansDizisi[i]=frekansDizisi[j];
				frekansDizisi[j]=temp;
			}
		}
	}


	sonuclariYazdirma(frekansDizisi);
}



function sonuclariYazdirma(frekansDizisi)
{
	
	let birinciKisimSonuclari=document.createElement("div");
	birinciKisimSonuclari.id="birinciKisimSonuclari";


	frekansDizisi.map((mevcutSonuc) =>{
	
		let yeniParagraf=document.createElement("p");
		yeniParagraf.className="birinciKisimYeniParagraf";

		let yeniParagrafYazisi=document.createTextNode(mevcutSonuc.string+":\t"+mevcutSonuc.sayi);

		yeniParagraf.appendChild(yeniParagrafYazisi);
		birinciKisimSonuclari.appendChild(yeniParagraf);

	});

	birinciKisimEkrani.appendChild(birinciKisimSonuclari);

}

birinciKisimFonksiyonu();

