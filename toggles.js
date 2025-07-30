function enable_guided_URL_creation(b=true) {
    document.getElementById('copyright-holder').disabled = !b;
    document.getElementById('include-CID').disabled = !b;
    //document.getElementById('license-CC').disabled = !b;
    document.getElementById('license-all-rights-reserved').disabled = !b;
    document.getElementById('license-CC-NC').disabled = !b;
    document.getElementById('license-CC-BY').disabled = !b;
    document.getElementById('license-CC-ND').disabled = !b;
}

function enable_custom_URL_creation(b=true) {
    document.getElementById('custom-url').disabled = !b;
}

function enable_metadata_update(b=true) {
	document.getElementById('update-metadata').disabled = !b;
}

function enable_document(b=true) {
    document.getElementById('provenance').style.display = b ? '' : 'none';
    document.getElementById('wait').style.display = b ? 'none' : '';
}

var disable_custom_URL_creation = () => enable_custom_URL_creation(false);
var disable_metadata_update = () => enable_metadata_update(false);
var disable_guided_URL_creation = () => enable_guided_URL_creation(false);
var disable_document = () => enable_document(false);

