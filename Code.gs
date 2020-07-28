const sheetUrl = "Your Spread Sheet URL"

function doGet(e) {
  if(e.parameters.v){
    if(e.parameters.v == 'view') {
      return loadView(Number(e.parameters.id), e.parameters.language)
      
    } else if(e.parameters.v == 'register'){
      return loadRegister(Number(e.parameters.id), e.parameters.language)
    }
    
  } else {
    return loadHome()
  }
}

  
function getSheetName() {
  let ss = SpreadsheetApp.openByUrl(sheetUrl)
  let sheets = ss.getSheets()
  let cmdList = sheets.map(sheet => sheet.getName())
  let htmlListArray = cmdList.map(cmd => `<option value='${cmd}'>${cmd}</option>`).join("")
  
  return htmlListArray
}

  
function getSheetData(sheetName) {
  let ss = SpreadsheetApp.openByUrl(sheetUrl)
  let ws = ss.getSheetByName(sheetName)
  let data = ws.getRange(2, 1, ws.getLastRow() -1, 4).getValues()
  
  return data
}
  
 
function getRow(id, sheetName) {
  let ss = SpreadsheetApp.openByUrl(sheetUrl)
  let ws = ss.getSheetByName(sheetName)
  let row = ws.getRange(id + 1, 1, 1, 4).getValues()
//  row[0][2] = escapeHtml(row[0][2])
  
  return row[0]
}


function addRecord(sheetName, value, id = NaN) {
  let ss = SpreadsheetApp.openByUrl(sheetUrl)
  let ws = ss.getSheetByName(sheetName)
  
  if(id){
    ws.getRange(id + 1, 2, 1, 3).setValues(value)
  }else{
    ws.getRange(ws.getLastRow() + 1, 2, 1, 3).setValues(value)
    countId(ws, ws.getLastRow())
  }
}


function deleteRecord(id, sheetName) {
  let ss = SpreadsheetApp.openByUrl(sheetUrl)
  let ws = ss.getSheetByName(sheetName)
  ws.deleteRow(id + 1)
  
  countId(ws, ws.getLastRow())
  let data = ws.getRange(2, 1, ws.getLastRow() -1, 4).getValues()
  return data
}

  
function countId(sheet, lastRow) {
  for(let i = 1; i < lastRow; i++){
    sheet.getRange(i + 1,1).setValue(i)
  }
}


function loadView(objId, language) {
  let data = getRow(objId, language)
  
  let dataObj = {}
  dataObj.purpose = data[1]
  dataObj.cmdId = objId
  dataObj.code = escapeHtml(data[2])
  dataObj.description = data[3]
  dataObj.language = language
  
  return render("cmdView", dataObj)
}
  
  
function loadHome() {
  let listArray = getSheetName()
  return render("home", {list: listArray})
}

  
function loadRegister(objId = NaN, language = null) {
  let listArray = getSheetName()
  let dataObj = {}
  
  if(!objId && !language){
    dataObj.list = listArray
    dataObj.mode = "register"
    dataObj.language = ""
    dataObj.cmdId = ""
  }else{
    dataObj.list = listArray
    dataObj.mode = "edit"
    dataObj.language = language
    dataObj.cmdId = objId
  }

  return render("register", dataObj)
}
  



