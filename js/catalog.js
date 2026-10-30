// CELINE — catalogue, copied exactly from the static site (js/produtos.js).
// Prices in MT only where the owner defined them; null = price to confirm.
// Unpriced items (p01–p10) can be added to the cart and discussed in chat,
// but they can NEVER be paid online: the server refuses them at checkout.
const PRODUCTS = [
  {id:"p01", name:"Argolas octogonais", cat:"Brincos", price:null, img:"images/celine-13.jpg", desc:"Argolas em tom dourado, de desenho geométrico aberto, em octógono."},
  {id:"p02", name:"Brincos flor", cat:"Brincos", price:null, img:"images/celine-14.jpg", desc:"Brincos em tom dourado, em forma de flor, de superfície trabalhada."},
  {id:"p03", name:"Discos borgonha", cat:"Brincos", price:null, img:"images/celine-15.jpg", desc:"Brincos com disco borgonha e topo dourado."},
  {id:"p04", name:"Argolas duplas torcidas", cat:"Brincos", price:null, img:"images/celine-16.jpg", desc:"Argolas duplas em tom dourado, com acabamento torcido."},
  {id:"p05", name:"Hexagonais verde", cat:"Brincos", price:null, img:"images/celine-17.jpg", desc:"Argolas hexagonais em verde com argolas douradas."},
  {id:"p06", name:"Argolas flor", cat:"Brincos", price:null, img:"images/celine-18.jpg", desc:"Argolas em tom dourado, em contorno de flor."},
  {id:"p07", name:"Quadrados azuis", cat:"Brincos", price:null, img:"images/celine-19.jpg", desc:"Brincos quadrados em azul, com detalhe dourado."},
  {id:"p08", name:"Argolas triângulo", cat:"Brincos", price:null, img:"images/celine-20.jpg", desc:"Argolas em tom dourado, em forma de triângulo."},
  {id:"p09", name:"Conjunto bolas douradas", cat:"Colar · Brincos", price:null, img:"images/celine-21.jpg", desc:"Conjunto de colar e brincos com bolas em tom dourado."},
  {id:"p10", name:"Brincos longos bola", cat:"Brincos", price:null, img:"images/celine-22.jpg", desc:"Brincos longos com bola dourada e topo em cristal."},
  {id:"n01", name:"Conjunto completo", cat:"Brincos · Colar · Pulseira · Anel", price:3500, img:"images/celine-new-01.jpg", desc:"Conjunto completo em manequim: brincos, colar, pulseira e anel em tom dourado com contas cinzentas."},
  {id:"n02", name:"Argolas acrílico", cat:"Brincos", price:1200, img:"images/celine-new-02.jpg", desc:"Argolas duplas em acrílico transparente, com topo dourado."},
  {id:"n03", name:"Retangulares verde mármore", cat:"Brincos", price:1450, img:"images/celine-new-03.jpg", desc:"Brincos retangulares em verde mármore, com risca dourada."},
  {id:"n04", name:"Redondos verde com brilho", cat:"Brincos", price:950, img:"images/celine-new-04.jpg", desc:"Brincos redondos em verde, com brilho dourado e aro dourado."},
  {id:"n05", name:"Folha tartaruga", cat:"Brincos", price:1350, img:"images/celine-new-05.jpg", desc:"Brincos em folha, em padrão tartaruga, com topo turquesa."},
  {id:"n06", name:"Gota verde-menta", cat:"Brincos", price:1100, img:"images/celine-new-06.jpg", desc:"Brincos em gota, em verde-menta com dourado."},
  {id:"n07", name:"Semicírculo aqua", cat:"Brincos", price:1250, img:"images/celine-new-07.jpg", desc:"Brincos em semicírculo aqua, com topo dourado."},
  {id:"n08", name:"Brancos com dourado", cat:"Brincos", price:1600, img:"images/celine-new-08.jpg", desc:"Brincos em branco pérola, com bolas douradas e argola."},
  {id:"n09", name:"Disco transparente", cat:"Brincos", price:1050, img:"images/celine-new-09.jpg", desc:"Brincos em disco transparente com flocos prateados e topo verde."},
  {id:"n10", name:"Argolas verde mármore", cat:"Brincos", price:1300, img:"images/celine-new-10.jpg", desc:"Argolas em verde mármore, com topo dourado."},
  {id:"n11", name:"Disco dourado com turquesa", cat:"Brincos", price:1750, img:"images/celine-new-11.jpg", desc:"Brincos com disco dourado e pedra turquesa."},
  {id:"n12", name:"Pretos com pérola", cat:"Brincos", price:1400, img:"images/celine-new-12.jpg", desc:"Brincos em preto, com pérola em tom cinzento."},
  {id:"n15", name:"Conjunto rubi", cat:"Colar · Pulseira · Brincos", price:4800, img:"images/celine-new-15.jpg", desc:"Conjunto em manequim: colar, pulseira e brincos em rubi e brilho."},
  {id:"n16", name:"Conjunto gota dourada", cat:"Colar · Pulseira · Brincos", price:2900, img:"images/celine-new-16.jpg", desc:"Conjunto em manequim: colar, pulseira e brincos em gota dourada."}
];
// Trusted price list, mirrored server-side in the payment Edge Function.
// The server never trusts a price sent by the browser.
const TRUSTED_PRICES = {};
PRODUCTS.forEach(function(p){ if (p.price !== null) TRUSTED_PRICES[p.id] = p.price; });
function fmtMT(v){ return v.toLocaleString("pt-PT").replace(/,/g, ".") + " MT"; }
function productById(id){ return PRODUCTS.find(function(x){ return x.id === id; }); }
