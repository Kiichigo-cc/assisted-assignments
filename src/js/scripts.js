<script>
    // Toggle Chat Interface Visibility
    function toggleChat() {
        const chatInterface = document.getElementById('chatInterface');
        if (chatInterface.style.display === 'none' || chatInterface.style.display === '') {
            chatInterface.style.display = 'block';
        } else {
            chatInterface.style.display = 'none';
        }
    }

    // Close Chat Interface
    function closeChat() {
        const chatInterface = document.getElementById('chatInterface');
        chatInterface.style.display = 'none';
    }

    // Placeholder for sending a message
    function sendMessage() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput.value.trim() !== '') {
            alert('You typed: ' + chatInput.value);
            chatInput.value = ''; // Clear input
        }
    }
</script>
