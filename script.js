/*
import OpenAI from 'openai';

const Key = "KEY"

const openai = new OpenAI(apiKey=Key);

async function getMessage(expression, text) {
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "Você é um assistente de tradução de idiomas." },
            {
                role: "user",
                content: `Me de a melhor tradução da expreção: "${expression}", no contexto deste texto: """${text}"""`,
            },
        ],
        max_tokens: 25,
    });

    return completion
}
*/

// ------------------------------------------------------------------------------------------------

async function getMessage(expression, text){
    const Key = "KEY";

    try {
        const completion = await fetch("https://api.openai.com/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Key}`,
                },
            body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: "Você é um assistente de tradução de idiomas." },
                        {
                            role: "user",
                            content: `Me de a melhor tradução, com no máximo 200 caracteres, da expreção: """${expression}""", no contexto deste texto: """${text}"""`,
                        },
                    ],
                    max_tokens: 50,
            }),
        });

        if (!completion.ok) {
            throw new Error(`Api Erro: ${completion.statusText}`);
        }

        return await completion.json();

    } catch (error) {
        console.error('Error:', error);
    }

    return null;
}

function getSelectionText() {
    let text = "";
    const activeEl = document.activeElement;
    const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    const idEL = activeEl ? activeEl.getAttribute('id') : null;

    if (activeElTagName == "textarea" && idEL == "insertText") {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else {
        return null;
    }

    return text;
}

let expression;

document.onselect = () => {
    expression = getSelectionText();
}

document.getElementById("getExpression").addEventListener("click", async () => {
    let fullText = document.getElementById("insertText").value;

    if (!fullText) {
        document.getElementById("viewText").textContent = "Sem texto para traduzir";
        return;
    }
    
    if (!expression) {
        document.getElementById("viewText").textContent = "Selecione parte do texto";
        return;
    }

    let res = await getMessage(expression, fullText);

    if (res) {
        document.getElementById("viewText").textContent = res.choices[0].message.content;
    } else {
        document.getElementById("viewText").textContent = "Falha na tradução";
    }
});
