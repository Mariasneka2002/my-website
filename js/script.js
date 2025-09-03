console.log('🔥 script.js loaded — chatbot form exists?', !!document.getElementById('chatbot-form'));

// Product‑card toggle (fixed selector)
document.querySelectorAll('.application-card').forEach(card => {
    card.addEventListener('click', function () {
        const details = this.querySelector('.product-details');
        if (details) {
            details.style.display = details.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// Service‑card expand/collapse
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Hugging Face chatbot config
const HF_API   = 'https://api-inference.huggingface.co/models/google/flan-t5-small';
const HF_TOKEN = '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';

async function queryHF(prompt) {
    const res = await fetch(HF_API, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt })
    });
    const data = await res.json();
    return data.error ? 'Sorry, I couldn’t process that.' : data[0].generated_text;
}

function appendChat(msg, cls) {
    const li = document.createElement('li');
    li.textContent = msg;
    li.className = cls;
    document.getElementById('chatbot-messages').appendChild(li);
    li.scrollIntoView({ behavior: 'smooth' });
}

// Chat form submit handler
document.getElementById('chatbot-form').addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('chatbot-input');
    const question = input.value.trim();
    if (!question) return;

    appendChat(question, 'user');
    input.value = '';
    appendChat('Typing…', 'bot');

    try {
        const answer = await queryHF(question);
        document.querySelector('#chatbot-messages li.bot:last-child').textContent = answer;
    } catch (err) {
        console.error('Chatbot error:', err);
        document.querySelector('#chatbot-messages li.bot:last-child').textContent = '⚠️ Something went wrong.';
    }
});
