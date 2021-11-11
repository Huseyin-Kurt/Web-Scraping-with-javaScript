
//Secim ekrani butonlarının tutulduğu yer
const birinciKisimButonu=document.querySelector("#birinciKisimButonu");
const ikinciKisimButonu=document.querySelector("#ikinciKisimButonu");
const ucuncuKisimButonu=document.querySelector("#ucuncuKisimButonu");
const dorduncuKisimButonu=document.querySelector("#dorduncuKisimButonu");
const besinciKisimButonu=document.querySelector("#besinciKisimButonu");
//birinci kısım geçiş fonksiyonu

birinciKisimButonu.onclick=() =>
{
	location.href="birinciKisim.html";
}

//ikinci kısım geçiş fonksiyonu

ikinciKisimButonu.onclick=() =>
{
	location.href="ikinciKisim.html";
}

//ucuncu kisim geçiş fonksiyonu

ucuncuKisimButonu.onclick=() =>
{
	location.href="ucuncuKisim.html";
}

//dorduncu kisim gecis fonksiyonu

dorduncuKisimButonu.onclick=() =>
{
	location.href="dorduncuKisim.html";
}

besinciKisimButonu.onclick=() =>
{
	location.href="besinciKisim.html";
}