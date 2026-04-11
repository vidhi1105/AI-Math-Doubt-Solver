document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('calc-display');
    const history = document.getElementById('calc-history');
    let currentInput = '';
    let isEvaluated = false;

    // We rely on math.js being loaded from CDN in base.html
    // Update Display
    function updateDisplay(val) {
        // limit display length to prevent overflow
        if (val.length > 15) {
            display.innerText = "..." + val.substring(val.length - 12);
        } else {
            display.innerText = val || '0';
        }
    }

    document.querySelectorAll('.calc-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-val');
            const action = btn.getAttribute('data-action');

            if (action) {
                if (action === 'all-clear') {
                    currentInput = '';
                    history.innerText = '';
                    isEvaluated = false;
                } else if (action === 'delete') {
                    if (isEvaluated) {
                        currentInput = '';
                        isEvaluated = false;
                    } else {
                        currentInput = currentInput.slice(0, -1);
                    }
                } else if (action === 'evaluate') {
                    try {
                        if (!currentInput) return;
                        history.innerText = currentInput + ' =';
                        
                        // Use math.js for safe and powerful evaluation
                        // Replace common symbols with math.js equivalents
                        let evalStr = currentInput;
                        evalStr = evalStr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                        
                        const result = math.evaluate(evalStr);
                        
                        // Rounding to avoid floating point weirdness
                        let safeResult = math.format(result, { precision: 14 });
                        currentInput = safeResult.toString();
                        isEvaluated = true;
                    } catch (e) {
                        currentInput = 'Error';
                        isEvaluated = true;
                        setTimeout(() => { if(currentInput === 'Error') { currentInput=''; updateDisplay(''); } }, 1500);
                    }
                }
            } else if (val) {
                if (isEvaluated && !['+', '-', '*', '/', '^'].includes(val)) {
                    currentInput = val; 
                    history.innerText = '';
                } else {
                    currentInput += val;
                }
                isEvaluated = false;
            }
            
            updateDisplay(currentInput);
        });
    });
});
