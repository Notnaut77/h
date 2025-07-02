 // State management
        let checklistState = {};
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            initializeChecklist();
            loadSavedState();
            setupEventListeners();
            updateProgress();
        });

        function initializeChecklist() {
            // Initialize all checkbox event listeners
            const checkboxes = document.querySelectorAll('.checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('click', function() {
                    toggleItem(this);
                });
            });

            // Initialize category toggle functionality
            const categoryHeaders = document.querySelectorAll('.category-header');
            categoryHeaders.forEach(header => {
                header.addEventListener('click', function() {
                    toggleCategory(this.parentElement);
                });
            });
        }

        function setupEventListeners() {
            // Add item input listeners
            const inputs = document.querySelectorAll('.add-item-input');
            inputs.forEach(input => {
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        const category = this.closest('.category').dataset.category;
                        addNewItem(this.value.trim(), category);
                        this.value = '';
                    }
                });
            });
        }

        function toggleItem(checkbox) {
            const itemId = checkbox.dataset.item;
            const itemText = checkbox.parentElement.nextElementSibling;
            const isChecked = checkbox.classList.toggle('checked');
            
            // Update text appearance
            if (isChecked) {
                itemText.classList.add('completed');
                checklistState[itemId] = true;
            } else {
                itemText.classList.remove('completed');
                checklistState[itemId] = false;
            }
            
            // Save state and update progress
            saveState();
            updateProgress();
            
            // Check if all items are completed
            checkForCompletion();
        }

        function toggleCategory(category) {
            category.classList.toggle('collapsed');
        }

        function updateProgress() {
            const categories = document.querySelectorAll('.category');
            let totalItems = 0;
            let completedItems = 0;
            
            categories.forEach(category => {
                const checkboxes = category.querySelectorAll('.checkbox');
                const completedCheckboxes = category.querySelectorAll('.checkbox.checked');
                const categoryCompleted = completedCheckboxes.length;
                const categoryTotal = checkboxes.length;
                
                // Update category stats
                const completedCount = category.querySelector('.completed-count');
                const totalCount = category.querySelector('.total-count');
                if (completedCount && totalCount) {
                    completedCount.textContent = categoryCompleted;
                    totalCount.textContent = categoryTotal;
                }
                
                totalItems += categoryTotal;
                completedItems += categoryCompleted;
            });
            
            // Update overall progress
            const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
            const progressFill = document.getElementById('progressFill');
            const overallProgress = document.getElementById('overallProgress');
            
            if (progressFill && overallProgress) {
                progressFill.style.width = progressPercentage + '%';
                overallProgress.textContent = progressPercentage + '%';
            }
        }

        function addNewItem(itemText, category) {
            if (!itemText) return;
            
            const categoryElement = document.querySelector(`[data-category="${category}"]`);
            const checklistItems = categoryElement.querySelector('.checklist-items');
            
            // Create new item
            const itemElement = document.createElement('div');
            itemElement.className = 'checklist-item';
            itemElement.innerHTML = `
                <div class="checkbox-container">
                    <div class="checkbox" data-item="${generateItemId(itemText)}"></div>
                </div>
                <span class="item-text">${itemText}</span>
                <div class="item-actions">
                    <button class="action-btn" onclick="deleteItem(this)">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Add to DOM
            checklistItems.appendChild(itemElement);
            
            // Setup event listener for new checkbox
            const newCheckbox = itemElement.querySelector('.checkbox');
            newCheckbox.addEventListener('click', function() {
                toggleItem(this);
            });
            
            // Update progress
            updateProgress();
        }

        function generateItemId(text) {
            return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        }

        function deleteItem(button) {
            const item = button.closest('.checklist-item');
            const checkbox = item.querySelector('.checkbox');
            const itemId = checkbox.dataset.item;
            
            // Remove from state
            delete checklistState[itemId];
            
            // Remove from DOM with animation
            item.style.opacity = '0';
            item.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                item.remove();
                updateProgress();
                saveState();
            }, 300);
        }

        function handleAddItem(event, category) {
            if (event.key === 'Enter') {
                const input = event.target;
                addNewItem(input.value.trim(), category);
                input.value = '';
            }
        }

        function markAllCompleted() {
            const checkboxes = document.querySelectorAll('.checkbox');
            checkboxes.forEach(checkbox => {
                if (!checkbox.classList.contains('checked')) {
                    checkbox.click();
                }
            });
        }

        function resetAll() {
            if (confirm('Are you sure you want to reset all items? This action cannot be undone.')) {
                const checkboxes = document.querySelectorAll('.checkbox.checked');
                checkboxes.forEach(checkbox => {
                    checkbox.click();
                });
                checklistState = {};
                saveState();
            }
        }

        function checkForCompletion() {
            const totalCheckboxes = document.querySelectorAll('.checkbox').length;
            const completedCheckboxes = document.querySelectorAll('.checkbox.checked').length;
            
            if (totalCheckboxes > 0 && completedCheckboxes === totalCheckboxes) {
                setTimeout(() => {
                    showCelebration();
                }, 500);
            }
        }

        function showCelebration() {
            const overlay = document.getElementById('overlay');
            const celebration = document.getElementById('celebration');
            overlay.classList.add('show');
            celebration.classList.add('show');
        }

        function hideCelebration() {
            const overlay = document.getElementById('overlay');
            const celebration = document.getElementById('celebration');
            overlay.classList.remove('show');
            celebration.classList.remove('show');
        }

        function saveState() {
            // Note: In a real implementation, you might want to use localStorage
            // For this demo, we'll just keep it in memory
            console.log('State saved:', checklistState);
        }

        function loadSavedState() {
            // Note: In a real implementation, you would load from localStorage
            // For this demo, we'll start with an empty state
            console.log('State loaded');
        }

        // Close celebration modal when clicking overlay
        document.getElementById('overlay').addEventListener('click', hideCelebration);

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'a':
                        e.preventDefault();
                        markAllCompleted();
                        break;
                    case 'r':
                        e.preventDefault();
                        resetAll();
                        break;
                }
            }
        });
        