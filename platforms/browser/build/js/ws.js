var conn = new ab.Session('ws://localhost:8080',
    function() {
        conn.subscribe('leads', function(topic, data) {
            console.log(data.data);
        });
    },
    function() {
        console.warn('WebSocket connection closed');
    },
    {'skipSubprotocolCheck': true}
);