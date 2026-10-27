/* Novaera City Store — catálogo e pedidos de demonstração.
   O checkout ainda NÃO cobra PIX e NÃO entrega itens no MTA. */
const STORE_CONFIG = {
  currency: "BRL",
  products: [{"id":"vip-vip-royal","name":"VIP Royal","category":"VIP","price":10,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 1.","deliveryType":"give:vip","vipIndex":1,"days":30},{"id":"vip-vip-mestre","name":"VIP Mestre","category":"VIP","price":20,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 2.","deliveryType":"give:vip","vipIndex":2,"days":30},{"id":"vip-vip-black","name":"VIP Black","category":"VIP","price":40,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 3.","deliveryType":"give:vip","vipIndex":3,"days":30},{"id":"vip-vip-novaera","name":"VIP NOVAERA","category":"VIP","price":70,"tag":"30 DIAS","symbol":"VIP","description":"VIP por 30 dias. Índice de entrega do sistema original: 4.","deliveryType":"give:vip","vipIndex":4,"days":30},{"id":"vip-vip-patrocinador","name":"VIP Patrocinador","category":"VIP","price":100,"tag":"60 DIAS","symbol":"VIP","description":"VIP por 60 dias. Índice de entrega do sistema original: 5.","deliveryType":"give:vip","vipIndex":5,"days":60},{"id":"money-100000","name":"+ R$ 100.000","category":"Moedas","price":10,"tag":"DINHEIRO","symbol":"R$","description":"Dinheiro no jogo","deliveryType":"give:money","amount":100000},{"id":"money-250000","name":"+ R$ 250.000","category":"Moedas","price":20,"tag":"DINHEIRO","symbol":"R$","description":"Dinheiro no jogo","deliveryType":"give:money","amount":250000},{"id":"money-500000","name":"+ R$ 500.000","category":"Moedas","price":35,"tag":"DINHEIRO","symbol":"R$","description":"Dinheiro no jogo","deliveryType":"give:money","amount":500000},{"id":"money-1000000","name":"+ R$ 1.000.000","category":"Moedas","price":65,"tag":"DINHEIRO","symbol":"R$","description":"Dinheiro no jogo","deliveryType":"give:money","amount":1000000},{"id":"vehicle-431-7","name":"Ônibus — 7 dias","category":"Veículos","price":7,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":431,"days":7},{"id":"vehicle-431-15","name":"Ônibus — 15 dias","category":"Veículos","price":15,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":431,"days":15},{"id":"vehicle-431-30","name":"Ônibus — 30 dias","category":"Veículos","price":20,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":431,"days":30},{"id":"vehicle-431-230","name":"Ônibus — Permanente","category":"Veículos","price":200,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":431,"days":null},{"id":"vehicle-422-7","name":"Saveiro Paredão — 7 dias","category":"Veículos","price":7,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":422,"days":7},{"id":"vehicle-422-15","name":"Saveiro Paredão — 15 dias","category":"Veículos","price":15,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":422,"days":15},{"id":"vehicle-422-30","name":"Saveiro Paredão — 30 dias","category":"Veículos","price":25,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":422,"days":30},{"id":"vehicle-422-230","name":"Saveiro Paredão — Permanente","category":"Veículos","price":200,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":422,"days":null},{"id":"vehicle-522-7","name":"BMW GS R1200 — 7 dias","category":"Veículos","price":10,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":522,"days":7},{"id":"vehicle-522-15","name":"BMW GS R1200 — 15 dias","category":"Veículos","price":25,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":522,"days":15},{"id":"vehicle-522-30","name":"BMW GS R1200 — 30 dias","category":"Veículos","price":40,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":522,"days":30},{"id":"vehicle-522-230","name":"BMW GS R1200 — Permanente","category":"Veículos","price":300,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":522,"days":null},{"id":"vehicle-559-7","name":"Skyline GTR R34 — 7 dias","category":"Veículos","price":10,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":559,"days":7},{"id":"vehicle-559-15","name":"Skyline GTR R34 — 15 dias","category":"Veículos","price":25,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":559,"days":15},{"id":"vehicle-559-30","name":"Skyline GTR R34 — 30 dias","category":"Veículos","price":45,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":559,"days":30},{"id":"vehicle-559-230","name":"Skyline GTR R34 — Permanente","category":"Veículos","price":350,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":559,"days":null},{"id":"vehicle-546-7","name":"AMG GT 63S — 7 dias","category":"Veículos","price":10,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":546,"days":7},{"id":"vehicle-546-15","name":"AMG GT 63S — 15 dias","category":"Veículos","price":20,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":546,"days":15},{"id":"vehicle-546-30","name":"AMG GT 63S — 30 dias","category":"Veículos","price":30,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":546,"days":30},{"id":"vehicle-546-230","name":"AMG GT 63S — Permanente","category":"Veículos","price":400,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":546,"days":null},{"id":"vehicle-602-7","name":"Mazda Rx7 — 7 dias","category":"Veículos","price":15,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":602,"days":7},{"id":"vehicle-602-15","name":"Mazda Rx7 — 15 dias","category":"Veículos","price":30,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":602,"days":15},{"id":"vehicle-602-30","name":"Mazda Rx7 — 30 dias","category":"Veículos","price":50,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":602,"days":30},{"id":"vehicle-602-230","name":"Mazda Rx7 — Permanente","category":"Veículos","price":500,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":602,"days":null},{"id":"vehicle-496-7","name":"McLaren 600LT — 7 dias","category":"Veículos","price":10,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":496,"days":7},{"id":"vehicle-496-15","name":"McLaren 600LT — 15 dias","category":"Veículos","price":20,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":496,"days":15},{"id":"vehicle-496-30","name":"McLaren 600LT — 30 dias","category":"Veículos","price":35,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":496,"days":30},{"id":"vehicle-496-230","name":"McLaren 600LT — Permanente","category":"Veículos","price":400,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":496,"days":null},{"id":"vehicle-487-7","name":"Swift Deluxe — 7 dias","category":"Veículos","price":15,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":487,"days":7},{"id":"vehicle-487-15","name":"Swift Deluxe — 15 dias","category":"Veículos","price":25,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":487,"days":15},{"id":"vehicle-487-30","name":"Swift Deluxe — 30 dias","category":"Veículos","price":45,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":487,"days":30},{"id":"vehicle-487-230","name":"Swift Deluxe — Permanente","category":"Veículos","price":300,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":487,"days":null},{"id":"vehicle-456-7","name":"Caminhão Baú — 7 dias","category":"Veículos","price":12,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":456,"days":7},{"id":"vehicle-456-15","name":"Caminhão Baú — 15 dias","category":"Veículos","price":25,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":456,"days":15},{"id":"vehicle-456-30","name":"Caminhão Baú — 30 dias","category":"Veículos","price":45,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":456,"days":30},{"id":"vehicle-456-230","name":"Caminhão Baú — Permanente","category":"Veículos","price":300,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":456,"days":null},{"id":"vehicle-463-7","name":"MonoWheel — 7 dias","category":"Veículos","price":7,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":463,"days":7},{"id":"vehicle-463-15","name":"MonoWheel — 15 dias","category":"Veículos","price":15,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":463,"days":15},{"id":"vehicle-463-30","name":"MonoWheel — 30 dias","category":"Veículos","price":30,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":463,"days":30},{"id":"vehicle-463-230","name":"MonoWheel — Permanente","category":"Veículos","price":150,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":463,"days":null},{"id":"vehicle-415-7","name":"GTR R35 (BLINDADA) — 7 dias","category":"Veículos","price":20,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":415,"days":7},{"id":"vehicle-415-15","name":"GTR R35 (BLINDADA) — 15 dias","category":"Veículos","price":45,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":415,"days":15},{"id":"vehicle-415-30","name":"GTR R35 (BLINDADA) — 30 dias","category":"Veículos","price":70,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":415,"days":30},{"id":"vehicle-415-230","name":"GTR R35 (BLINDADA) — Permanente","category":"Veículos","price":550,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":415,"days":null},{"id":"vehicle-547-7","name":"Audi RS6 (BLINDADO) — 7 dias","category":"Veículos","price":20,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":547,"days":7},{"id":"vehicle-547-15","name":"Audi RS6 (BLINDADO) — 15 dias","category":"Veículos","price":35,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":547,"days":15},{"id":"vehicle-547-30","name":"Audi RS6 (BLINDADO) — 30 dias","category":"Veículos","price":60,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":547,"days":30},{"id":"vehicle-547-230","name":"Audi RS6 (BLINDADO) — Permanente","category":"Veículos","price":500,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":547,"days":null},{"id":"vehicle-438-7","name":"G63 (BLINDADA) — 7 dias","category":"Veículos","price":20,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":438,"days":7},{"id":"vehicle-438-15","name":"G63 (BLINDADA) — 15 dias","category":"Veículos","price":35,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":438,"days":15},{"id":"vehicle-438-30","name":"G63 (BLINDADA) — 30 dias","category":"Veículos","price":60,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":438,"days":30},{"id":"vehicle-438-230","name":"G63 (BLINDADA) — Permanente","category":"Veículos","price":500,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":438,"days":null},{"id":"vehicle-400-7","name":"X7 (BLINDADA) — 7 dias","category":"Veículos","price":20,"tag":"7 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":400,"days":7},{"id":"vehicle-400-15","name":"X7 (BLINDADA) — 15 dias","category":"Veículos","price":40,"tag":"15 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":400,"days":15},{"id":"vehicle-400-30","name":"X7 (BLINDADA) — 30 dias","category":"Veículos","price":60,"tag":"30 DIAS","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":400,"days":30},{"id":"vehicle-400-230","name":"X7 (BLINDADA) — Permanente","category":"Veículos","price":500,"tag":"PERMANENTE","symbol":"AUTO","description":"Veículo na garagem do MTA","deliveryType":"give:vehicle","model":400,"days":null},{"id":"weapon-1","name":"G36C Azul","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":1},{"id":"weapon-2","name":"G36C Rosa","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":2},{"id":"weapon-3","name":"G36C Verde","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":3},{"id":"weapon-4","name":"G36C Amarela","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":4},{"id":"weapon-5","name":"G36C Roxa","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":5},{"id":"weapon-6","name":"G36C Camo Vermelha","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":6},{"id":"weapon-7","name":"G36C Camo Azul","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":7},{"id":"weapon-8","name":"G36C Camo Roxa","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":8},{"id":"weapon-9","name":"G36C Camo Verde","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":9},{"id":"weapon-10","name":"G36C Deserto","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":10},{"id":"weapon-11","name":"G36C Galáxia 1","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":11},{"id":"weapon-12","name":"G36C Galáxia 2","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":12},{"id":"weapon-13","name":"G36C Galáxia 3","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":13},{"id":"weapon-14","name":"G36C Vulcan","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":14},{"id":"weapon-15","name":"G36C Asiimov","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":15},{"id":"weapon-16","name":"G36C Asiimov Roxa","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":16},{"id":"weapon-17","name":"G36C Asiimov Verde","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":17},{"id":"weapon-76","name":"G36C Lacoste","category":"Armas","price":30,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":76},{"id":"weapon-18","name":"G36C Natal 2024","category":"Armas","price":55,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":18},{"id":"weapon-43","name":"Parafal Azul","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":43},{"id":"weapon-44","name":"Parafal Rosa","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":44},{"id":"weapon-45","name":"Parafal Verde","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":45},{"id":"weapon-59","name":"Parafal Amarela","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":59},{"id":"weapon-60","name":"Parafal Roxa","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":60},{"id":"weapon-61","name":"Parafal Camo Vermelha","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":61},{"id":"weapon-49","name":"Parafal Camo Azul","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":49},{"id":"weapon-50","name":"Parafal Camo Roxa","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":50},{"id":"weapon-51","name":"Parafal Camo Verde","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":51},{"id":"weapon-52","name":"Parafal Deserto","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":52},{"id":"weapon-53","name":"Parafal Galáxia 1","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":53},{"id":"weapon-54","name":"Parafal Galáxia 2","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":54},{"id":"weapon-55","name":"Parafal Galáxia 3","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":55},{"id":"weapon-63","name":"Parafal Vulcan","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":63},{"id":"weapon-67","name":"Parafal Asiimov","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":67},{"id":"weapon-70","name":"Parafal Asiimov Roxa","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":70},{"id":"weapon-73","name":"Parafal Asiimov Verde","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":73},{"id":"weapon-75","name":"Parafal Lacoste","category":"Armas","price":30,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":75},{"id":"weapon-74","name":"Parafal Natal 2024","category":"Armas","price":55,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":74},{"id":"weapon-25","name":"AWP Dragon Lore","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":25},{"id":"weapon-26","name":"AWP Laranja","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":26},{"id":"weapon-27","name":"AWP Asiimov","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":27},{"id":"weapon-36","name":"M9 Aquecimento de Aço","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":36},{"id":"weapon-37","name":"M9 Massacre","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":37},{"id":"weapon-35","name":"M9 Safira","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":35},{"id":"weapon-38","name":"M9 Rubi","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":38},{"id":"weapon-42","name":"GLOCK Espectros","category":"Armas","price":10,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":42},{"id":"weapon-41","name":"GLOCK Fuinha","category":"Armas","price":15,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":41},{"id":"weapon-40","name":"GLOCK Rebelde","category":"Armas","price":20,"tag":"SKIN","symbol":"ARMA","description":"Skin de arma no inventário MTA","deliveryType":"give:weapon-skin","skinId":40}]
};
const $ = s => document.querySelector(s);
const money = value => value == null ? "Preço a definir" : Number(value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
let cart = [];
let currentFilter = "Todos";
let pixGerado = false;
const grid = $("#product-grid");
const safeReadOrders = () => { try { return JSON.parse(localStorage.getItem("novaera_store_orders") || "[]"); } catch { return []; } };
function renderProducts(){
  const items = STORE_CONFIG.products.filter(p => currentFilter === "Todos" || p.category === currentFilter);
  grid.innerHTML = items.map(p => { const art = p.category === "VIP" ? "vip" : p.category === "Moedas" ? "money" : p.category === "Armas" ? "weapons" : p.category === "Veículos" ? "vehicles" : p.category === "Casas" ? "houses" : p.category === "Facções" ? "factions" : p.category === "Garagem" ? "garage" : "vip"; return `<article class="product-card"><div class="product-visual product-visual-photo"><img class="product-image" src="assets/products/${art}.svg" alt="Imagem ilustrativa de ${escapeHtml(p.name)}" loading="lazy"><span class="tag">${p.tag || p.category}</span></div><div class="product-content"><span class="product-category">${p.category.toUpperCase()}</span><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description || "")}</p><div class="product-buy"><div class="price">${money(p.price)}<small>${p.price == null ? "Configure o preço" : "Pagamento via PIX"}</small></div><button class="add-button" data-add="${p.id}" ${p.price == null ? "disabled title=\"Preço precisa ser configurado\"" : ""}>${p.price == null ? "INDISPONÍVEL" : "+ ADICIONAR"}</button></div></div></article>`; }).join("");
  grid.querySelectorAll("[data-add]").forEach(btn => btn.addEventListener("click", () => addToCart(btn.dataset.add)));
}
function addToCart(id){ const product = STORE_CONFIG.products.find(p => p.id === id); if (!product || product.price == null) return; const existing = cart.find(i => i.id === id); if (existing) existing.qty++; else cart.push({...product,qty:1}); renderCart(); openCart(); }
function total(){ return cart.reduce((sum,item) => sum + item.price * item.qty, 0); }
function renderCart(){
  $("#cart-count").textContent = cart.reduce((sum,item) => sum + item.qty,0);
  $("#cart-total").textContent = money(total()); $("#modal-total").textContent = money(total()); $("#checkout").disabled = cart.length === 0;
  $("#cart-items").innerHTML = cart.length ? cart.map(item => `<div class="cart-row"><div><strong>${escapeHtml(item.name)}</strong><small>Qtd: ${item.qty} · ${money(item.price)} cada</small><button data-remove="${item.id}">Remover</button></div><strong>${money(item.price * item.qty)}</strong></div>`).join("") : `<div class="empty-cart">Sua sacola está vazia.<br>Escolha um produto para começar.</div>`;
  $("#cart-items").querySelectorAll("[data-remove]").forEach(btn => btn.addEventListener("click", () => { cart = cart.filter(i => i.id !== btn.dataset.remove); renderCart(); }));
}
function openCart(){ $("#cart-drawer").classList.add("show"); $("#backdrop").classList.add("show"); }
function closeCart(){ $("#cart-drawer").classList.remove("show"); $("#backdrop").classList.remove("show"); }
function renderOrders(){ const orders = safeReadOrders(); const host = $("#orders-list"); if (!orders.length) { host.innerHTML = '<div class="empty-cart">Nenhum pedido de teste salvo neste navegador.</div>'; return; } host.innerHTML = orders.slice().reverse().map(o => `<article class="order-card"><div><strong>${escapeHtml(o.id)}</strong><small>${escapeHtml(o.date)} · Conta: ${escapeHtml(o.contaMta || "Não informada")} · ID: ${escapeHtml(o.jogadorId || "Não informado")} · Conta MTA: ${escapeHtml(o.contaMta || o.nick || "-")}</small></div><strong>${money(o.total)}</strong><p>${o.items.map(i => `${escapeHtml(i.name)} × ${i.qty}`).join(" · ")}</p><span class="order-status">${escapeHtml(o.status)}</span></article>`).join(""); }
function escapeHtml(value){ return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
$("#open-cart").addEventListener("click",openCart); $("#close-cart").addEventListener("click",closeCart); $("#backdrop").addEventListener("click",closeCart);
$("#filters").querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => { currentFilter = btn.dataset.filter; $("#filters").querySelectorAll(".filter").forEach(b => b.classList.toggle("active",b === btn)); renderProducts(); }));
function fecharPagamento(){
  $("#checkout-modal").classList.remove("show");
  if (pixGerado) {
    pixGerado = false;
    $("#checkout-form").hidden = false;
    $("#checkout-form").reset();
    $("#order-result").hidden = true;
    $("#order-result").replaceChildren();
    $("#checkout-modal .eyebrow").textContent = "FINALIZAR PEDIDO";
    $("#checkout-modal h2").textContent = "Quase lá!";
    $("#checkout-modal .modal-intro").textContent = "Informe os dados da sua conta para gerar o PIX.";
  }
}
$("#checkout").addEventListener("click",() => { if (!cart.length) return; closeCart(); fecharPagamento(); $("#order-result").hidden = true; $("#checkout-modal").classList.add("show"); });
$("#close-modal").addEventListener("click",fecharPagamento);
$("#checkout-modal").addEventListener("click",e => { if (e.target.id === "checkout-modal") fecharPagamento(); });
// Código copiado pelo comando /vincularloja no cliente MTA.
const linkCodeInput = $("#link-code");
const linkCodeFeedback = $("#link-code-feedback");
function aplicarCodigoMTA(texto) {
  const codigo = String(texto || "").trim().toUpperCase();
  if (!/^[A-F0-9]{10}$/.test(codigo)) {
    linkCodeFeedback.textContent = "Código inválido. Use /vincularloja no MTA e tente novamente.";
    return false;
  }
  linkCodeInput.value = codigo;
  linkCodeFeedback.textContent = "Código preenchido! Agora informe seu ID e e-mail.";
  return true;
}
$("#paste-link-code").addEventListener("click", async () => {
  try {
    if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error("Clipboard indisponível");
    aplicarCodigoMTA(await navigator.clipboard.readText());
  } catch (err) {
    linkCodeFeedback.textContent = "O navegador não permitiu colar automaticamente. Clique no campo e pressione Ctrl+V.";
    linkCodeInput.focus();
  }
});
linkCodeInput.addEventListener("paste", event => {
  const texto = event.clipboardData && event.clipboardData.getData("text");
  if (texto && /^[A-Fa-f0-9]{10}$/.test(texto.trim())) {
    event.preventDefault();
    aplicarCodigoMTA(texto);
  }
});
$("#checkout-form").addEventListener("submit", async e => {
  e.preventDefault();
  if (!cart.length) return;
  if (cart.length !== 1 || cart[0].qty !== 1 || !cart[0].id) {
    alert("Por enquanto, o PIX aceita apenas 1 produto por pedido. Retire os outros itens da sacola.");
    return;
  }
  const codigoVinculacao = $("#link-code").value.trim().toUpperCase();
  const jogadorId = $("#player-id").value.trim();
  const email = $("#buyer-email").value.trim();
  if (!/^[A-F0-9]{10}$/.test(codigoVinculacao) || !/^[0-9]{1,10}$/.test(jogadorId) || !email) {
    alert("Preencha o código do MTA, ID e e-mail corretamente."); return;
  }
  const btn = $("#checkout-form button[type=submit]");
  const result = $("#order-result");
  btn.disabled = true;
  btn.textContent = "GERANDO PIX...";
  result.hidden = false;
  result.replaceChildren();
  try {
    const resposta = await fetch("/api/pix/criar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ produtoId: cart[0].id, codigoVinculacao, jogadorId, email })
    });
    const dados = await resposta.json();
    if (!resposta.ok) throw new Error(dados.erro || "Nao foi possivel gerar o PIX.");
    if (!dados.qrCode && !dados.qrCodeBase64 && !dados.ticketUrl) {
      throw new Error("Mercado Pago nao retornou dados para pagamento. Nao tente pagar sem confirmar o pedido.");
    }
    const heading = document.createElement("strong");
    heading.textContent = "PIX GERADO — " + money(cart[0].price);
    result.append(heading, document.createElement("hr"));
    if (dados.qrCodeBase64) {
      const img = document.createElement("img");
      img.alt = "QR Code PIX";
      img.style.cssText = "display:block;width:210px;max-width:100%;margin:12px auto;background:white;padding:8px;border-radius:8px";
      img.src = "data:image/png;base64," + dados.qrCodeBase64;
      result.append(img);
    }
    if (dados.qrCode) {
      const campo = document.createElement("textarea");
      campo.readOnly = true;
      campo.value = dados.qrCode;
      campo.rows = 4;
      campo.style.cssText = "width:100%;box-sizing:border-box;resize:vertical";
      result.append(campo);
      const copiar = document.createElement("button");
      copiar.type = "button";
      copiar.textContent = "COPIAR PIX COPIA E COLA";
      copiar.className = "checkout-button";
      copiar.addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(dados.qrCode); copiar.textContent = "PIX COPIADO!"; }
        catch { campo.select(); alert("Selecione e copie o codigo PIX acima."); }
      });
      result.append(copiar);
    }
    if (dados.ticketUrl && /^https:\/\//.test(dados.ticketUrl)) {
      const a = document.createElement("a");
      a.href = dados.ticketUrl;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "Abrir pagina do PIX";
      result.append(a);
    }
    const status = document.createElement("p");
    status.textContent = "Aguardando confirmacao do pagamento. VIP nao e entregue automaticamente.";
    result.append(status);
    const order = {
      id: dados.referencia, date: new Date().toLocaleString("pt-BR"),
      contaMta: "Conta vinculada pelo MTA", jogadorId, items: [{ id: cart[0].id, name: cart[0].name, qty: 1, price: cart[0].price }],
      total: cart[0].price, status: "PIX gerado — aguardando confirmacao"
    };
    const orders = safeReadOrders(); orders.push(order);
    localStorage.setItem("novaera_store_orders", JSON.stringify(orders));
    renderOrders();
    cart = []; renderCart();
    const voltar = document.createElement("button");
    voltar.type = "button";
    voltar.className = "secondary-button";
    voltar.textContent = "VOLTAR À LOJA";
    voltar.style.cssText = "display:block;width:100%;margin-top:12px";
    voltar.addEventListener("click", fecharPagamento);
    result.append(voltar);
    pixGerado = true;
    $("#checkout-form").hidden = true;
    $("#checkout-modal .eyebrow").textContent = "PAGAMENTO PIX";
    $("#checkout-modal h2").textContent = "PIX GERADO";
    $("#checkout-modal .modal-intro").textContent = "Valor: " + money(order.total) + " • Pague pelo QR Code ou Copia e Cola.";
  } catch (err) {
    result.textContent = "Erro ao gerar PIX: " + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "GERAR PIX";
  }
});
$("#clear-orders").addEventListener("click",() => { if (confirm("Apagar o histórico de pedidos salvo somente neste navegador?")) { localStorage.removeItem("novaera_store_orders"); renderOrders(); } });
document.addEventListener("keydown",e => { if (e.key === "Escape") { closeCart(); fecharPagamento(); } });
$("#year").textContent = new Date().getFullYear(); renderProducts(); renderCart(); renderOrders();
