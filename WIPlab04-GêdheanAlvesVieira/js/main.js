(function() {
	function fetchData(url, handler) {
		fetch(url)
		.then(res => res.json())
		.then(handler);
	}

	// Dados Pessoais
	fetchData('data/personal-info.json', function(data){
		let template = `
		<li><strong>Nome</strong>: ${data.personalData.name};</li>
		<li><strong>Sexo</strong>: ${data.personalData.sex};</li>
		<li><strong>Endereço</strong>: ${data.personalData.address};</li>
		<li><strong>Data de nascimento</strong>: ${data.personalData.born}.</li>
		`
		let personalData = document.getElementById('personalData');
		personalData.innerHTML = template;
		console.log('data:', data)
	})
	// Educação
	fetchData('data/education.json', function(data) {
		let template = (education) =>
		`
		<li>
			<strong>${education.course}</strong> -
			<a href="${education.url}" target="_blank">${education.institution}</a>;
		</li>`
		let eduEl = document.getElementById("education");
		let eduChildren = data.education.reduce((acc, curr) => acc + template(curr), '');
		eduEl.innerHTML = eduChildren;
	console.log('data:', data);
	})
	// Idiomas
	fetchData('data/idioms.json', function(data) {
		let template = (idiom) => `
		<li><strong>${idiom.language}</strong> - Nível: ${idiom.level};</li>
		`
		let idiomEl = document.getElementById('idioms');
		idiomEl.innerHTML = data.idioms.reduce((acc, curr) => acc + template(curr), '');
	})
	// Cursos
	fetchData('data/courses.json', function(data) {
		let template = (course) => `
		<li>
		<strong>${course.name}</strong> - 
		<a href="${course.url}" target="_blank">${course.institution}</a>;
		</li>
		<div class="img-2">
			<img id="ccb-img" src="${course.img}" alt="" width="447" height="120">			
		</div>
		`
		let coursesEl = document.getElementById('courses');
		coursesEl.innerHTML = data.courses.reduce((acc, curr) => acc + template(curr), '');
	});
})();

// (function(){
// 	let xmlreq = new XMLHttpRequest();

// 	xmlreq.onreadystatechange = function() {
// 		if(this.readyState == 4 && this.status == 200) {
// 			console.log('xml data:', JSON.parse(this.responseText));
// 		}
// 	};

// 	xmlreq.open('GET', 'data/data.json', true);
// 	// xmlreq.setRequestHeader("Content-Type", "application/json");
// 	xmlreq.send();
	
// })();