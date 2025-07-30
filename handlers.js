async function connect_wallet_handler(event) {
    const account_selector = document.getElementById('account-selector');
    const args = {method: 'eth_requestAccounts'};
    const accounts = await window.ethereum.request(args);
    const options = accounts.map(make_account_option);
	
	account_selector.replaceChildren(...options);
	account_selector.dispatchEvent(new Event('change', { bubbles: true }));
    account_selector.disabled = false;

	refresh_callback();
}

async function file_upload_handler(event) {
	const files = document.getElementById('file').files;
    if (files.length < 1) return;

    file = files[0];
	refresh_callback();
}

async function refresh_callback() {
	if (!file) return;
    url = URL.createObjectURL(file);
    document.getElementById('image-preview').src = url;

    hash = '0x' + (await pHash.hash(file)).toHex();
    CID = await get_CID(file);
    exists = await get_exists(hash);
    owner = exists? await get_owner(hash) : null;
    is_for_sale = await get_is_for_sale(hash);
    price = await get_price(hash);
	tokenURI = await get_tokenURI(hash);

    document.getElementById('image-preview').src = url;
    document.getElementById('hash').innerText = hash;
    document.getElementById('CID').innerText = CID;
    document.getElementById('owner').innerText = exists ? owner : 'Nobody';
    document.getElementById('for-sale').innerText = is_for_sale;
    document.getElementById('ask-price').innerText = is_for_sale? price : 'N/A';
	document.getElementById('metadata').innerText = await get_metadata(tokenURI);

	document.getElementById('buy').disabled = !((account != owner) && exists && is_for_sale);
	document.getElementById('price').disabled = !((account == owner) && exists);
	document.getElementById('mint').disabled = !(!exists && hash && account);
	document.getElementById('de-list').disabled = !((owner == account) && is_for_sale);
	document.getElementById('sell').disabled = true;

	enable_guided_URL_creation(exists && (account == owner) && !document.getElementById('custom-url').value);
	enable_custom_URL_creation(exists && (account == owner));
	enable_metadata_update(exists && (account == owner));
}

async function account_selector_handler(event) {
	account = event.target.value;
	refresh_callback();
}

async function mint_handler(event) {
	const fee = web3.utils.toWei(minting_fee, 'ether');
	const args = {from: account, value: fee};
	disable_document();
	try {
		receipt = await contract.methods.mint(hash).send(args);
	} catch (error) {
		error = error.cause;
		if (error.code == 4001) message = 'User did not approve transaction';
		else message = 'Unknown error';

		alert('Token will not be minted: ' + message);
		enable_document();
		return
	}
	console.log(receipt);
	if (Number(receipt.status) == 1) {
		file_upload_handler();
	}
	else alert('Token minting failed: ' + Number(receipt.status));
	enable_document();
	refresh_callback();
}

async function sell_handler(event) {
	const args = {from: account};
	try {
		disable_document();
		const receipt = await contract.methods.list(hash, price).send(args);
	} catch (error) {
		console.log(error);
	} finally {
		refresh_callback();
		enable_document();
	}
}

async function price_change_handler(event) {
	price = document.getElementById('price').value;
	document.getElementById('sell').disabled = !((price > 0) && exists && (account == owner));
}

async function buy_handler(event) {
	const args = {from: account, value: price}
	disable_document();
	try {
		const receipt = await contract.methods.buy(hash).send(args);
		console.log(receipt);
		set_capabilities_callback();
	} catch (error) {
		console.log(error);
	} finally {
		refresh_callback();
		enable_document();
	}
}

async function delist_handler(event) {
	const args = {from: account};
	try {
		disable_document();
		const receipt = await contract.methods.delist(hash).send(args);
	} catch (error) {
		console.log(error);
	} finally {
		refresh_callback();
		enable_document();
	}
}

async function update_metadata_handler(event) {
	var url = document.getElementById('custom-url').value;
	if (!url) {
		const license = document.getElementById('license').elements['license'].value;
		const copyright = document.getElementById('copyright-holder').value;
		const include_CID = document.getElementById('include-CID').checked;
		const metadata = {};
		if (license) metadata['license'] = license;
		if (copyright) metadata['copyright'] = copyright;
		if (include_CID) metadata['IPFS-CID'] = CID;
		const base64_encoded = encodeURIComponent(JSON.stringify(metadata));
		url = `data:application/json;charset=utf-8,${base64_encoded}`
	}
	if (hash) {
		try {
			disable_document();
			args = {from: account};
			const receipt = await contract.methods.setURI(hash, url).send(args);
		} catch (error) {
			console.log(error);
		} finally {
			enable_document();
		}
	} else {
		console.log(url);
	}
	refresh_callback();
}

async function custom_URL_handler(event) {
	const URL = document.getElementById('custom-url').value;
	if (URL) disable_guided_URL_creation();
	else enable_guided_URL_creation();
}
