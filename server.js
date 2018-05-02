var express = require("express")
var bodyParser = require("body-parser")
var app = express()

var contracts = require("./data/contracts.json")
var clients = require("./data/clients.json")

console.log(clients)

app.use(bodyParser.urlencoded({extended: true}))
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SERVER PORT: 9992
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// /httpbridge-server/csrfToken/get - получение токена
//
// /httpbridge-server/invoke/support-client/serviceLayer/:action - вызов API бэк-офиса: getSampleOfClient (возвращает клиента),
//                                                                                      getSampleOfContract (поиск контракта по номеру)
//
// /httpbridge-server/:action - API httpbridge-server:  login (на любые вводные говорит, что все хорошо)
//                                                      ping - эмуляция доступности httpbridge-server
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get("/httpbridge-server/csrfToken/get", function (req, res) {
    res.send("{\"token\":\"AAABYi5XM2AKWsHN959hnJ8LlwYBmBY6A5h2XTFl/Xdh1d3U18K6eg==\",\"validUntil\":1521195889504}")
})

app.post("/httpbridge-server/invoke/support-client/serviceLayer/:action", function (req, res) {
    var action = req.params.action
    var filterNumberOfContract = JSON.parse(req.body.filter).filterNumberOfContract
    var answer = ""

    switch(action){
        case "getSampleOfClient":
            answer = JSON.stringify(clients[0])
            break
        case "getSampleOfContract":
            if (filterNumberOfContract){
                // поиск по номеру
                console.log('search...')
                contracts.forEach(function (value) {
                    if (value.numberOfContract === filterNumberOfContract){
                        answer = JSON.stringify(value)
                    }
                })
            }
            else {
                answer = "{\"id\":null,\"numberOfContract\":null,\"loanAccountNumber\":null,\"fullNameOfPrimaryBorrower\":null,\"statusOfContract\":null,\"result\":\"Договор не найден!\"}"
            }
            break
        default:
            answer = "Something wrong!!!"
    }

    res.send(answer)
})

app.post("/httpbridge-server/:action", function (req, res) {
    var thing = req.params.action
    var answer = ""

    console.log("req: ", req)
    console.log("input: ", thing)
    switch(thing){
        case "ping":
            answer = "pong"
            break
        case "login":
            // answer = "{\"errorCode\":null,\"httpStatusCode\":200,\"loginState\":\"OK\",\"message\":null}"
          answer = {
            'succes': true,
            'errorCode': null,
            'httpStatusCode': 200,
            'loginState': 'OK',
            'message': null,
            'data': {
              'token': 'AAABYi5XM2AKWsHN959hnJ8LlwYBmBY6A5h2XTFl/Xdh1d3U18K6eg==',
              'validUntil': 1521195889504
            }
          };
          res.json(answer);
          break
        default:
            answer = "It's me! HttpBridge-Server!"
            break
    }

    console.log("output: ", answer)
    res.send(answer)
})

app.get("/httpbridge-server/:action", function (req, res) {
    var thing = req.params.action
    console.log("req: ", req)
    console.log("input: ", thing)

    switch(thing){
        case "ping":
            answer = "pong"
            break
        case "login":
            // answer = "{\"errorCode\":null,\"httpStatusCode\":200,\"loginState\":\"OK\",\"message\":null}"
            // answer = "{ \"succes\": true,\"errorCode\":null,\"httpStatusCode\":200,\"loginState\":\"OK\",\"message\":null, \"data\": {\"body\": {\"token\":\"AAABYi5XM2AKWsHN959hnJ8LlwYBmBY6A5h2XTFl/Xdh1d3U18K6eg==\",\"validUntil\":1521195889504}}}"
          answer = {
            'succes': true,
            'errorCode': null,
            'httpStatusCode': 200,
            'loginState': 'OK',
            'message': null,
            'data': {
              'token': 'AAABYi5XM2AKWsHN959hnJ8LlwYBmBY6A5h2XTFl/Xdh1d3U18K6eg==',
              'validUntil': 1521195889504
            }
          };
          res.json(answer);
            break
        default:
            answer = "It's me! HttpBridge-Server!"
            break
    }

    console.log("output: ", answer)
    res.send(answer)
})

app.get("/", function (req, res) {
    res.send("It's me! Stub!")
})

app.listen(9992, function () {
    console.log("StubServer started...")
})
