(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', event => {
    let connectButton = document.querySelector("#connect");
    let statusDisplay = document.querySelector('#status');
    let port;

    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = 'Connected';
        connectButton.textContent = 'Disconnect';
///////////////////////////////////////////////////////////////////////////////
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          let decodedString = textDecoder.decode(data);

          //console.log(decodedString);
          if (handleDecodedString(decodedString, "s", "f")) {
           console.log("Обработка завершена");
            
          }

        
        };
////////////////////////////////////////////////////////////////////////////////
        port.onReceiveError = error => {
          console.error('Receive error:', error);
        };
      }).catch(error => {
        statusDisplay.textContent = 'Connection error: ' + error;
        console.error('Connection error:', error);
      });
    }

    connectButton.addEventListener('click', function () {
      if (port) {
        port.disconnect().then(() => {
          connectButton.textContent = 'Connect';
          statusDisplay.textContent = 'Disconnected';
          port = null;
        }).catch(error => {
          statusDisplay.textContent = 'Disconnection error: ' + error;
          console.error('Disconnection error:', error);
        });
      } else {
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect();
        }).catch(error => {
          statusDisplay.textContent = 'Request port error: ' + error;
          console.error('Request port error:', error);
        });
      }
    });

    serial.getPorts().then(ports => {
      if (ports.length === 0) {
        statusDisplay.textContent = 'No device found.';
      } else {
        statusDisplay.textContent = 'Connecting...';
        port = ports[0];
        connect();
      }
    }).catch(error => {
      statusDisplay.textContent = 'Get ports error: ' + error;
      console.error('Get ports error:', error);
    });

  });
})();