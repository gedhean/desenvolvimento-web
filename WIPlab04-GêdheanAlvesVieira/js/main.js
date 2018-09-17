(function() {
	fetch('data/data.json')
	.then(res => res.json())
	.then(res => {
		console.log('data:', res)
		// Dados Pessoais
		let template = `
			<li><strong>Nome</strong>: ${res.personalData.name};</li>
			<li><strong>Sexo</strong>: ${res.personalData.sex};</li>
			<li><strong>Endereço</strong>: ${res.personalData.address};</li>
			<li><strong>Data de nascimento</strong>: ${res.personalData.born}.</li>
		`
		let personalData = document.getElementById('personalData');
		personalData.innerHTML = template;
	});
})();

(function(){
	let xmlreq = new XMLHttpRequest();

	xmlreq.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			console.log('xml data:', JSON.parse(this.responseText));
		}
	};

	xmlreq.open('GET', 'data/data.json', true);
	// xmlreq.setRequestHeader("Content-Type", "application/json");
	xmlreq.send();
	
})();