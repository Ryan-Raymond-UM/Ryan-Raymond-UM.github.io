function make_account_option(account) {
	const option = document.createElement('option');
	account = web3.utils.toChecksumAddress(account);
	option.innerText = account;
	option.value = account;
	return option;
}

async function get_CID(file) {
	const helia = await Helia.createHelia();
	const unix_fs = HeliaUnixfs.unixfs(helia);
	const array_buffer = await file.arrayBuffer();
	const uint8_array = new Uint8Array(array_buffer);
	const IPFS_object = await unix_fs.addBytes(uint8_array);
	helia.stop();
	return IPFS_object.toString();
}

async function get_exchange_rate() {
	return (await (await fetch(exchange_rate_URL)).json())['USD'];
}

async function ETH2USD(eth) {
	return eth * (await get_exchange_rate());
}

async function get_exists(token_ID) {
	return (await contract.methods.exists(token_ID).call());
}

async function get_is_for_sale(token_ID) {
	return (await contract.methods.is_for_sale(token_ID).call());
}

async function get_owner(token_ID) {
	return (await contract.methods.ownerOf(token_ID).call());
}

async function get_price(token_ID) {
	return (await contract.methods.asking_price(token_ID).call());
}

async function get_minting_fee() {
	const wei = await contract.methods.minting_fee().call();
	return web3.utils.fromWei(wei, 'ether');
}

async function get_tokenURI(hash) {
	try {
		return (await contract.methods.tokenURI(hash).call());
	} catch (error) {
		return '';
	}
}

async function get_metadata(URI) {
	if (URI) {
		try { return await (await fetch(URI)).text(); }
		catch (error) { return URI; }
	} else {
		return URI;
	}
}
