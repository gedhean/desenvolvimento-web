/*
   TI0080 - Des de Aplicações Web 

   Exemplo de implementação do UPLOAD com o NodeJs
   Usando os módulos Express e Multer  

*/

const express = require('express')
	, app = express()
	, multer = require('multer')
	, path = require('path'); 

app.use(express.static('public'));

var maxSize = 10*1024*1024; // 10MB 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// utiliza a storage para configurar a instância do multer
const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize } // bytes?
}).single('file');

app.post('/file/upload', function (req,res) {
	upload (req, res, function (err) {
		if (err) {
			res.send(' <h2>O seu upload NÃO foi realizado! <h2>');

			return console.log(err); 
		}
		res.send('<h2>Upload realizado com sucesso! </h2>');
	})
}); 

app.listen(3000, () => console.log('App na porta 3000'));

