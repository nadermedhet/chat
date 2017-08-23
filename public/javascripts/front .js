(function () {
    $('.btn').click( function(){
        $('.chat-body').removeClass('hidden');
        $('.name ').addClass(" hidden ")
    })
    
                var getNod = function (s) {
                    return document.querySelector(s);
                }
    
                var status = getNod('.chat-status ');
                var textarea = getNod('.message-area');
                var Chatname = getNod('.chat-name ');
                var messages = getNod('.chat-messages');
    
                var statusdefult = status.textContent;
    
                var serStatus = function (s) {
                    status.textContent = s;
                    if (s !== statusdefult) {
                        var delay = setTimeout(() => {
                            serStatus(statusdefult);
                            clearInterval(delay)
                        }, 3000)
                    }
                }
    
                serStatus('testing');
                try {
                    var socket = io.connect("http://127.0.0.1:8080");
    
                } catch (e) {
                    console.log(e)
                }
                if (socket !== undefined) {
                    socket.on('output', (data) => {
                        if( data.length){
                            for ( var v =0 ; v < data.length ; v++){
                                var message = document.createElement('div');
                                message.setAttribute('class' , 'message');
                                message.textContent= data[v].name + '  :  ' + data[v].message;
    
                                messages.appendChild(message);
                            }
                        }
                    })
                    socket.on('status', (data) => {
                        serStatus((typeof data === 'object') ? data.message : data);
                        if (data.clear === true) {
                            textarea.value = '';
                        }
    
                    })
                }
                textarea.addEventListener('keydown', (event) => {
                    var self = textarea.value,
                        name = Chatname.value;
    
                    if (event.which === 13 && event.shiftKey === false) {
                        socket.emit('input', {
                            name: name,
                            message: self
                        })
                        event.preventDefault();
    
                    }
                })
    
            })();