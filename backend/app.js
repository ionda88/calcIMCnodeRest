const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 3000

let cors = require('cors')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`App ouvindo na porta: ${port}`)
})

const listaUsers = [];

function validaPeso(peso) {
    if (peso != undefined && peso != NaN) {
        return true;
    }
    throw ('Para calcular o IMC deve informar um peso valido!')
}

function validaAltura(altura) {
    if (altura != undefined && altura != NaN) {
        return true;
    }
    throw ('Para calcular o IMC deve informar uma altura valida!')
}

function calculaImc(peso, altura) {
    let alturaTratada = altura / 100;
    return (peso / (alturaTratada * alturaTratada)).toFixed(2);
}

function classificaImc(imc) {
    const objImc = {
        imc: imc,
        text: ''
    }
    
    if (imc < 17) {
        objImc.text = 'Muito Abaixo do Peso'
    } else if (imc > 17 && imc <= 18.49) {
        objImc.text = 'Abaixo do Peso'
    } else if (imc >= 18.5 && imc <= 24.99) {
        objImc.text = 'Peso Normal'
    } else if (imc >= 25 && imc <= 29.99) {
        objImc.text = 'Sobre Peso'
    } else if (imc >= 30 && imc <= 34.99) {
        objImc.text = 'Obesidade Grau 1'
    } else if (imc >= 34.99 && imc <= 39.99) {
        objImc.text = 'Obesidade Grau 2'
    } else {
        objImc.text = 'Obesidade Grau 3'
    }

    return objImc;
}

app.post('/imc', (req, res, next) => {
    console.log(req.body);

    try {
        if (validaAltura(req.body.altura) && validaPeso(req.body.peso)) {
            const imc = calculaImc(req.body.peso, req.body.altura);
            const imcClassificado = classificaImc(imc);
            console.log(imc, imcClassificado)
            // res.writeHead(200, { 'Content-Type': 'application/json' });
            res.json(imcClassificado);
            return res.end();
        }
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})

app.post('/usuario', (req, res, next) => {
    console.log(req.body);

    try {

        const user = new Object();

        user.id = req.body.id;
        user.nome = req.body.nome;
        user.imc = req.body.imc;
        user.classificacao = req.body.classificacao;
        //console.log('User:' + user);
        listaUsers.push(user);
        //console.log('listaUsers:' + listaUsers);
        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})


app.get('/usuario', (req, res, next) => {
    console.log(req.body);

    try {

        res.json(listaUsers);
        return res.end();
    } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.write(error);
        return res.end();
    }

})
