function createPDF(){
  var doc = new jsPDF('l', 'pt', 'letter');
  
  var IDtable = document.getElementById('table');
        var sourceTable = doc.autoTableHtmlToJson(IDtable);
        var sourceTableData = sourceTable.data;
        var sourceTableColums = sourceTable.columns;

        doc.autoTable(sourceTableColums, sourceTableData, 
                      {startY: doc.autoTableEndPosY() + 40, theme: 'grid', 
                        drawRow: function (row, sourceTableColums) {
                        if (row.index === 0) {
                        doc.setTextColor(0, 0, 255);
                        doc.rect(sourceTableColums.settings.margin.left, row.y, sourceTableColums.table.width, 20, 'S');
                        doc.autoTableText(
                            "colspan", sourceTableColums.settings.margin.left + sourceTableColums.table.width / 2, row.y + row.height / 2, {
                            halign: 'center',
                            valign: 'middle'
                            }
                        );
                        sourceTableColums.cursor.y += 20;
                        } 
                        }
                      });
  
  
  //doc.text(60,60, 'hi there!')
  doc.save("file.pdf")
}
