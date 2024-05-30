function generateQRCode(text, shape, includeBasic) {
    document.getElementById('qrcode').innerHTML = '';
    document.getElementById('qrcodeStyled').innerHTML = '';

    if (includeBasic) {
      const basicQRContainer = document.createElement('div');
      basicQRContainer.style.backgroundColor = '#ffffff';
      basicQRContainer.style.padding = '10px';
      basicQRContainer.style.border = '2px solid #ffffff';
      basicQRContainer.style.borderRadius = '5px';

      new QRCode(basicQRContainer, {
        text: text,
        width: 300,
        height: 300,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });

      document.getElementById('qrcode').appendChild(basicQRContainer);
      document.getElementById('basicQRBox').style.display = 'flex'; // Show the basic QR code box
    }

    const qrCodeStyled = new QRCodeStyling({
      width: 300,
      height: 300,
      data: text,
      margin: 10,
      qrOptions: {
        errorCorrectionLevel: 'Q'
      },
      dotsOptions: {
        color: "#000000",
        type: shape,
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      cornersSquareOptions: {
        color: "#000000",
        type: (shape === 'square' || shape === 'dots') ? 'square' : 'rounded',
      }
    });
    qrCodeStyled.append(document.getElementById('qrcodeStyled'));
    document.getElementById('styledQRBox').style.display = 'flex'; // Show the styled QR code box
  }

  document.getElementById('qrForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const qrText = document.getElementById('text').value;
    const pixelShape = document.getElementById('pixelShape').value;
    const includeBasic = document.getElementById('includeBasic').checked;
    generateQRCode(qrText, pixelShape, includeBasic);
  });