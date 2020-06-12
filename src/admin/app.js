$(function () {
  $.qrCodeReader.jsQRpath =
    "https://cdn.staticaly.com/gh/mauntrelio/qrcode-reader/master/dist/js/jsQR/jsQR.min.js";
  $.qrCodeReader.beepPath =
    "https://cdn.staticaly.com/gh/mauntrelio/qrcode-reader/master/dist/audio/beep.mp3";

  $(".qrcode-reader").qrCodeReader();

  generateQRCode = function (event) {
    event.preventDefault();
    $("#qrcodeholder").empty();

    const renderObj = $(".form-control")
      .serializeArray()
      .reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
      }, {});

    const qrRenderData = `Entered Employee Details:\u000A
  Name: ${renderObj.empName}\u000A 
  Phone Number: ${renderObj.empPhone}\u000A
  Home Address: ${renderObj.empAddress}`;

    $("#qrcodeholder").qrcode({
      text: qrRenderData,
      render: "canvas", // 'canvas' or 'table'. Default value is 'canvas'
      background: "#ffffff",
      id: "myAVS",
      foreground: "#000000",
      width: 150,
      height: 150,
    });

    renderTable(renderObj, $("#qrcodeholder"));
  };

  const btn = document.getElementById("qrGenerateBtn");

  btn.addEventListener("click", generateQRCode);

  renderTable = function (data, qrDiv) {
    $("#noRow").hide();
    var canvas = document.querySelector("canvas");
    var img = canvas.toDataURL("image/png");
    $("#exportTable").last().append(`<tr>
    <td>
    <span><strong>Employee Name:</strong> ${data.empName}</span><br>
    <span><strong>Employee Phone:</strong> ${data.empPhone}</span><br>  
    </td>
    <td><img src="${img}"></img></td>
    </tr>`);
  };

  $("#pdf").click(function (event) {
    var doc = new jsPDF();
    doc.text("QR CODE PDF", 35, 25);
    doc.autoTable({
      html: "#exportTable",
      styles: {
        fontSize: 18,
        overflow: "linebreak",
      },
      startY: 40,
      pageBreak: "auto",
      margin: {
        top: 40,
      },
      bodyStyles: { minCellHeight: 20 },
      didDrawCell: function (data) {
        if (data.column.index === 1 && data.cell.section === "body") {
          var td = data.cell.raw;
          var img = td.getElementsByTagName("img")[0];
          var dim = data.cell.height - data.cell.padding("vertical");
          var textPos = data.cell.textPos;
          doc.addImage(img.src, textPos.x, textPos.y, dim, dim);
        }
      },
    });

    doc.save("QR_CODE.pdf");
  });
});
