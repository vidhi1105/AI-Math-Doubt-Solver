document.addEventListener('DOMContentLoaded', () => {
    const plotBtn = document.getElementById('plot-btn');
    const eqInput = document.getElementById('graph-equation');
    const presetBtns = document.querySelectorAll('.preset-graph');
    
    // Default plot
    plotGraph('x^2');

    plotBtn.addEventListener('click', () => {
        let eq = eqInput.value.trim();
        if(!eq) return;
        plotGraph(eq);
    });

    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const eq = btn.getAttribute('data-eq');
            eqInput.value = eq;
            plotGraph(eq);
        });
    });

    // Enter key support
    eqInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            plotBtn.click();
        }
    });

    function plotGraph(expression) {
        try {
            // Compile expression with math.js
            const node = math.parse(expression);
            const code = node.compile();

            // Evaluate expression over a range
            const xValues = math.range(-10, 10, 0.1).toArray();
            const yValues = xValues.map(function (x) {
                return code.evaluate({x: x});
            });

            // Make sure we only plot valid real numbers
            const cleanX = [];
            const cleanY = [];
            for (let i = 0; i < xValues.length; i++) {
                if (typeof yValues[i] === 'number' && !isNaN(yValues[i])) {
                    cleanX.push(xValues[i]);
                    cleanY.push(yValues[i]);
                }
            }

            const trace = {
                x: cleanX,
                y: cleanY,
                type: 'scatter',
                mode: 'lines',
                line: {
                    color: '#9333ea', // purple-600
                    width: 3
                },
                name: 'y = ' + expression
            };

            const layout = {
                title: {
                    text: 'y = ' + expression,
                    font: { family: 'Outfit, sans-serif', color: '#4a4e69' }
                },
                xaxis: { title: 'x', zerolinecolor: '#cdb4db', gridcolor: '#f3f4f6' },
                yaxis: { title: 'y', zerolinecolor: '#cdb4db', gridcolor: '#f3f4f6' },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                margin: { t: 40, r: 20, l: 40, b: 40 }
            };

            Plotly.newPlot('plotly-div', [trace], layout, {responsive: true});
            
        } catch (err) {
            Plotly.newPlot('plotly-div', [], {
                title: 'Error: Invalid Equation'
            });
            console.error(err);
        }
    }
});
