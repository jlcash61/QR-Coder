const shareButton = document.getElementById('shareButton');
  shareButton.classList.add('hidden'); // Ensure share button is hidden initially

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

  shareButton.classList.remove('hidden'); // Show share button
}

document.getElementById('qrForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const qrText = document.getElementById('text').value;
  const pixelShape = document.getElementById('pixelShape').value;
  const includeBasic = document.getElementById('includeBasic').checked;
  generateQRCode(qrText, pixelShape, includeBasic);
});

document.getElementById('shareButton').addEventListener('click', async () => {
  const qrResultBasic = document.getElementById('qrcode');
  const qrResultStyled = document.getElementById('qrcodeStyled');
  const filesArray = [];

  if (qrResultBasic.querySelector('img')) {
      const basicQRImage = qrResultBasic.querySelector('img').src;
      const response = await fetch(basicQRImage);
      const blob = await response.blob();
      filesArray.push(new File([blob], 'basic_qrcode.png', {
          type: blob.type,
      }));
  }

  if (qrResultStyled.querySelector('canvas')) {
      const styledQRCanvas = qrResultStyled.querySelector('canvas').toDataURL();
      const response = await fetch(styledQRCanvas);
      const blob = await response.blob();
      filesArray.push(new File([blob], 'styled_qrcode.png', {
          type: blob.type,
      }));
  }

  if (filesArray.length === 0) {
      alert('Please generate a QR code first.');
      return;
  }

  try {
      if (navigator.share) {
          await navigator.share({
              title: 'QR Code',
              text: 'Here are the QR codes I generated:',
              files: filesArray,
          });
      } else {
          filesArray.forEach(file => {
              saveQrCode(URL.createObjectURL(file));
          });
      }
  } catch (error) {
      console.error('Error sharing QR code:', error);
  }
});

function saveQrCode(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'qrcode.png';
  link.click();
}

document.getElementById('shareButton').addEventListener('contextmenu', (event) => {
  event.preventDefault();
  const qrResultBasic = document.getElementById('qrcode');
  const qrResultStyled = document.getElementById('qrcodeStyled');
  const emailBody = [];

  if (qrResultBasic.querySelector('img')) {
      const basicQRImage = qrResultBasic.querySelector('img').src;
      emailBody.push(`Basic QR Code: ${basicQRImage}`);
  }

  if (qrResultStyled.querySelector('canvas')) {
      const styledQRCanvas = qrResultStyled.querySelector('canvas').toDataURL();
      emailBody.push(`Styled QR Code: ${styledQRCanvas}`);
  }

  if (emailBody.length === 0) {
      alert('Please generate a QR code first.');
      return;
  }

  window.location.href = `mailto:?subject=QR Code&body=${encodeURIComponent(emailBody.join('\n\n'))}`;
});
