const exchange_rate_URL = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'

var web3;
var contract;
var contract_abi;
var contract_address;
var minting_fee;
var account;

var file;
var url;
var hash;
var CID;
var exists;
var owner;
var is_for_sale;
var price;
var tokenURI;
var metadata;

var main = async function (event) {
	contract_address = await (await fetch('contract-address.txt')).text();
	contract_abi = await (await fetch('contract-abi.json')).json();
	web3 = new Web3(window.ethereum);
	contract = new web3.eth.Contract(contract_abi, contract_address);
	minting_fee = Number(await get_minting_fee());
	document.getElementById('minting-fee-eth').innerText = minting_fee;
	document.getElementById('minting-fee-usd').innerText = await ETH2USD(minting_fee);

	const connect_wallet_button = document.getElementById('connect-wallet');
	const file_selection = document.getElementById('file');

	document.getElementById('account-selector').onchange = account_selector_handler;
	connect_wallet_button.onclick = connect_wallet_handler;
	file_selection.onchange = file_upload_handler;
	document.getElementById('mint').onclick = mint_handler;
	document.getElementById('sell').onclick = sell_handler;
	document.getElementById('price').oninput = price_change_handler;
	document.getElementById('buy').onclick = buy_handler;
	document.getElementById('de-list').onclick = delist_handler;
	document.getElementById('custom-url').oninput = custom_URL_handler;
	document.getElementById('update-metadata').onclick = update_metadata_handler;

	file_selection.disabled = false;
	document.getElementById('connect-wallet').disabled = false;
}

window.addEventListener('load', main);
