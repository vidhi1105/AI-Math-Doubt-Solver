document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => {
                b.classList.remove('text-purple-700', 'border-purple-500', 'active');
                b.classList.add('text-gray-500', 'border-transparent');
            });
            btn.classList.add('text-purple-700', 'border-purple-500', 'active');
            btn.classList.remove('text-gray-500', 'border-transparent');

            const target = btn.getAttribute('data-target');
            tabContents.forEach(c => {
                c.classList.add('hidden');
                if (c.id === target) c.classList.remove('hidden');
            });

            // Special trigger for plotly resize if returning to graph tab
            if (target === 'graph-tab' && window.plotRelayout) {
                setTimeout(window.plotRelayout, 100);
            }
        });
    });

    // Image Upload Preview Logic
    const imageInput = document.getElementById('image-upload');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeImageBtn = document.getElementById('remove-image-btn');
    const problemInput = document.getElementById('problem-input');
    const clearBtn = document.getElementById('clear-btn');
    
    let base64Image = null;

    imageInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                imagePreview.src = event.target.result;
                base64Image = event.target.result;
                imagePreviewContainer.classList.remove('hidden');
                checkInputs();
            }
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    removeImageBtn.addEventListener('click', () => {
        imageInput.value = '';
        base64Image = null;
        imagePreviewContainer.classList.add('hidden');
        checkInputs();
    });

    problemInput.addEventListener('input', checkInputs);

    function checkInputs() {
        if (problemInput.value.trim() !== '' || base64Image) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    clearBtn.addEventListener('click', () => {
        problemInput.value = '';
        removeImageBtn.click();
    });

    // Submitting Math Problem AI
    const solveBtn = document.getElementById('solve-btn');
    const solutionContainer = document.getElementById('solution-container');
    const solutionEmpty = document.getElementById('solution-empty');
    const solutionLoading = document.getElementById('solution-loading');
    const solutionContent = document.getElementById('solution-content');
    const solutionText = document.getElementById('solution-text');
    const downloadBtn = document.getElementById('download-current-btn');
    
    // Chat UI elements
    const chatInput = document.getElementById('chat-input');
    const chatSubmit = document.getElementById('chat-submit');
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.querySelectorAll('.chat-suggestion');
    const chatLoading = document.getElementById('chat-loading');

    let currentSolutionContext = "";

    solveBtn.addEventListener('click', async () => {
        const problem = problemInput.value.trim();
        if (!problem && !base64Image) {
            alert('Please enter a problem or upload an image.');
            return;
        }

        // Show loading state
        solutionEmpty.classList.add('hidden');
        solutionContent.classList.add('hidden');
        solutionLoading.classList.remove('hidden');
        solveBtn.disabled = true;
        solveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Solving...';

        try {
            const response = await fetch(window.APP_CONFIG.api_solve_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    problem: problem,
                    image_base64: base64Image
                })
            });

            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error || 'Server error');

            // Render Solution
            solutionLoading.classList.add('hidden');
            solutionContent.classList.remove('hidden');
            
            // Requires marked.js loaded in base
            currentSolutionContext = data.solution;
            solutionText.innerHTML = marked.parse(data.solution);
            
            // Enable download
            downloadBtn.onclick = () => window.location.href = window.APP_CONFIG.download_url_base + data.history_id;
            
            // Enable chat
            chatInput.disabled = false;
            addChatMessage('robot', `I just solved that! Let me know if you need to go over any of the steps.`);
            
            // Optionally, add to sidebar history without reloading (basic implementation)
            prependHistory(problem || "Image Uploaded", data.history_id, data.solution);

        } catch (error) {
            solutionLoading.classList.add('hidden');
            solutionEmpty.classList.remove('hidden');
            alert(`Error solving problem: ${error.message}`);
        } finally {
            solveBtn.disabled = false;
            solveBtn.innerHTML = '<span>Solve with AI</span> <i class="fas fa-magic"></i>';
        }
    });
    
    function prependHistory(title, id, solution) {
        const container = document.getElementById('history-container');
        // Hide the empty state if it exists
        const emptyState = container.querySelector('.text-center.py-8');
        if(emptyState) emptyState.style.display = 'none';
        
        const markup = `
            <div class="bg-white/60 hover:bg-white rounded-xl p-3 border border-pastel-primary/20 cursor-pointer transition-all hover:shadow-md mb-2 group history-item animate-slide-down" data-id="${id}" data-solution="${escapeHTML(solution)}">
                <p class="text-xs text-gray-400 mb-1">Just now</p>
                <p class="text-sm font-medium text-gray-700 truncate">${escapeHTML(title)}</p>
                <div class="mt-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span class="text-xs text-purple-600 font-medium">View Result</span>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', markup);
        attachHistoryListeners();
    }
    
    function escapeHTML(str) {
        return new Option(str).innerHTML;
    }

    // Chat Logic
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;
        
        chatInput.value = '';
        addChatMessage('user', msg);
        chatLoading.classList.remove('hidden');
        chatSubmit.disabled = true;
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(window.APP_CONFIG.api_chat_url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msg,
                    context: currentSolutionContext
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            
            chatLoading.classList.add('hidden');
            addChatMessage('robot', marked.parse(data.response), true);
        } catch (error) {
            chatLoading.classList.add('hidden');
            addChatMessage('robot', "Sorry, I encountered an error: " + error.message);
        } finally {
            chatSubmit.disabled = false;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });

    chatSuggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            chatInput.value = btn.innerText;
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    function addChatMessage(sender, content, isHtml = false) {
        const isUser = sender === 'user';
        const html = `
            <div class="flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-slide-down">
                <div class="w-8 h-8 rounded-full ${isUser ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-pastel-primary/30 text-purple-700'} flex items-center justify-center shrink-0">
                    <i class="fas ${isUser ? 'fa-user' : 'fa-robot'} text-sm"></i>
                </div>
                <div class="${isUser ? 'bg-gradient-to-r from-pastel-primary to-purple-400 text-white rounded-tr-none' : 'bg-gray-100 rounded-tl-none text-gray-800'} rounded-2xl p-3 text-sm shadow-sm max-w-[85%]">
                    ${isHtml ? content : escapeHTML(content)}
                </div>
            </div>
        `;
        chatMessages.insertAdjacentHTML('beforeend', html);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // View History Item
    function attachHistoryListeners() {
        document.querySelectorAll('.history-item').forEach(item => {
            item.onclick = function() {
                const solution = this.getAttribute('data-solution');
                const id = this.getAttribute('data-id');
                
                solutionEmpty.classList.add('hidden');
                solutionLoading.classList.add('hidden');
                solutionContent.classList.remove('hidden');
                
                currentSolutionContext = solution;
                solutionText.innerHTML = marked.parse(solution);
                downloadBtn.onclick = () => window.location.href = window.APP_CONFIG.download_url_base + id;
                chatInput.disabled = false;
                
                addChatMessage('robot', 'I loaded this past solution. Do you have any questions about it?');
                
                // Show solver tab if we're not currently on it
                document.querySelector('.tab-btn[data-target="solver-tab"]').click();
            };
        });
    }
    attachHistoryListeners();
});
