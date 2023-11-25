// public/client-script.js
$(document).ready(function () {
    // Cargar el historial de chat al cargar la página
    const chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    renderChatHistory(chatHistory);
    
    $('#chat-form').submit(function (e) {
        e.preventDefault();
        
        // Deshabilitar el botón mientras se realiza la solicitud
        $('#send-button').prop('disabled', true);
        //$('#send-button').text('Espere un momento...');
        $('#send-button').addClass("loading");
        
        const userMessage = $('#user-message').val();

        // Enviar la consulta al servidor mediante AJAX
        $.post('/chat', { userMessage }, function (data) {
            // Agregar dinámicamente la respuesta a la lista de chat
            chatHistory.push({ user: userMessage, gpt: data.gpt });
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));

            renderChatHistory(chatHistory);

            // Limpiar el campo de entrada
            $('#user-message').val('');

            // Restaurar el estado del botón después de la respuesta
            $('#send-button').prop('disabled', false);
            $('#send-button').removeClass("loading");

            // Actualizar la visibilidad del botón de limpiar chat
            updateClearButtonVisibility();
        }).fail(function () {
            // En caso de fallo en la solicitud, también restaurar el estado del botón
            $('#send-button').prop('disabled', false);
            $('#send-button').text('Enviar');
        });
    });

    $('#clear-history-button').click(function () {
        // Limpiar historial y vaciar la lista de chat
        localStorage.removeItem('chatHistory');
        $('#chat-display').empty();
        location.reload()

        // Actualizar la visibilidad del botón de limpiar chat
        updateClearButtonVisibility();
    });

    // Función para renderizar el historial de chat
    function renderChatHistory(history) {
        $('#chat-display').empty();
        history.forEach(chat => {
            $('#chat-display').append(`
                <li class="timeline-item">
                    <div class="timeline-info">
                        <span>Tu: ${chat.user}</span>
                    </div>
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <p>GPT: ${formatGPTResponse(chat.gpt)}</p>
                    </div>
                </li>
            `);
        });

        // Actualizar la visibilidad del botón de limpiar chat
        updateClearButtonVisibility();
    }
    
    function formatGPTResponse(response) {
        // Reemplaza los saltos de línea con etiquetas <br>
        return response.replace(/\n/g, '<br>');
    }

    // Función para actualizar la visibilidad del botón de limpiar chat
    function updateClearButtonVisibility() {
        if (chatHistory.length > 0) {
            $('#clear-history-button').show();
        }
    }
});