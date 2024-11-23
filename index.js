const axios = require("axios");
const cherrio = require("cheerio");
const cron = require("node-cron");

const accountSid = "";
const authToken = "";
const client = require("twilio")(accountSid, authToken);

const phonesDefault = [
    
];


const URL_PORTAL_30 = "https://amzn.to/493Otbg";
const URL_CONTROLE_30 = "https://amzn.to/3V19Jsg";
const URL_EDGE_30 = "https://amzn.to/3Z20zga";
const URL_PLAYSTATION_30 = "https://amzn.to/4fXmtIl";

function verificarDisponibilidade(name, url, phones) {
    axios.get(url).then(({data}) => {
        const $ = cherrio.load(data);
        const result = $("#outOfStock > div > div > span.a-color-price")
            .text()
            .trim()
            .toUpperCase();

        if (result == "NÃO DISPONÍVEL.") return;

        console.log(name, "MUDOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOU");
        console.log(name, "MANDANDO NO ZAP");

        for (let index = 0; index < phones.length; index++) {
            const phone = phones[index];
            client.messages.create({
                from: "whatsapp:+14155238886",
                to: `whatsapp:${phone}`,
                body: `${url}`,
            });
        }
    });
}



async function tarefaAgendada() {
    try {
        const agora = new Date();
        const horaAtual = agora.getHours();
        console.log("Execução", agora, horaAtual);
        console.log("Buscando ....");

        verificarDisponibilidade("URL_CONTROLE_30", URL_CONTROLE_30,  [...phonesDefault ]);
        verificarDisponibilidade("URL_PLAYSTATION_30", URL_PLAYSTATION_30,  [...phonesDefault ]);
        verificarDisponibilidade("URL_PORTAL_30", URL_PORTAL_30,  [ ...phonesDefault  ]);
        verificarDisponibilidade("URL_EDGE_30", URL_EDGE_30,  [...phonesDefault  ]);

    } catch (error) {
        client.messages.create({
            from: "whatsapp:+14155238886",
            to: `whatsapp:`,
            body: `deu erro.`,
        });
    }
}
// tarefaAgendada();
cron.schedule("* */1 * * *", tarefaAgendada);

