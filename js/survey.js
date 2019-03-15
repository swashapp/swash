var css = `#xxx-bt{
  position: fixed;
  right: 10px;
  bottom: 10px;
  padding: 10px;
  background: #a7a7a7;
  border : 1px solid black;
  border-radius: 5px;
  cursor: pointer;
}
.xxx-modal-wr{
  display: none;
  position: fixed;
  width: 100%;
  top: 0;
  background-color: rgba(136, 136, 136, 0.31);
  bottom: 0;
  text-align: center;
  left: 0;
  right: 0;
}
.xxx-modal{
  width: 60%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.35);
  border-radius: 3px;
  margin: 5vh auto;
}
.xxx-modal-header{
  padding: 10px 0;
  width: 100%;
  position: relative;
  border-bottom: 1px solid;
}
.xxx-times{
  padding: 5px;
  position: absolute;
  left: 10px;
  top: 5px;
  cursor: pointer;
}
.xxx-times:hover{
  color: red;
}
.xxx-inputs {
  width: 100%;
  padding: 10px 0;
  display: block;

}
.xxx-inputs input{
  outline: none;
  border: none;
  text-align: center;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);
}

.im-100{
  width: 80%;
  position: relative;
  padding: 10px 10% 0 10%;
}
.xxx-inputs label {
  position: absolute;
  left: 10%;
  transition: top .1s;
  pointer-events: none;
  top: 17px;
}
.xxx-inputs input:focus ~ label,.xxx-inputs input:valid ~ label{
  top: 0;
}
.xxx-modal-footer{
  width: 100%;
  min-height: 50px;
  border-top:1px solid rgba(0, 0, 0, 0.35);
}
.xxx-inputs select {
  width: 100%;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.35);;
  border-radius: 0;
  -webkit-appearance: none;
  text-align: right;
  align-items: center;
  outline: none;
  text-align-last: center;
  padding-right: 29px;

  /*direction: rtl;*/
}
.xxx-btX{
  width: 150px;
  margin: 5px auto;
  padding: 7px;
  background-color: #4caf50;
  border-radius: 15px;
  color: white;
  cursor: pointer;
}
.xxx-btX:hover{
  background-color: #1b5e20;
}
`;
var inputs = `<div class="im-100">
                 <div class="xxx-inputs">
                    <select required >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
</select>
                    <label>Select Option</label>
                 </div>
              </div>
              
              <div class="im-100">
                 <div class="xxx-inputs">
                    <input required type="text">
                    <label>Share a few words ...</label>
                 </div>
              </div>

`;
var btX = '<div class="xxx-btX">Send</div>'
function showButton() {
  var bt = document.createElement('div');
  bt.className = 'xxx-bt';
  bt.id = 'xxx-bt';
  bt.innerHTML = 'Survey';
  var body = document.getElementsByTagName('body')[0];
  var xsk = document.createElement('style');
  xsk.innerHTML=css;
  body.append(bt);
  body.append(xsk);
  bt.onclick = showModal;
  var modalWr = document.createElement('div');
  modalWr.className = 'xxx-modal-wr';
  modalWr.id = 'xxx-modal-wr';
  var modal = document.createElement('div');
  modal.className = 'xxx-modal';
  modal.id = 'xxx-modal';
  var modalHeader = document.createElement('div');
  modalHeader.className = 'xxx-modal-header';
  modalHeader.innerHTML = 'Take Survey';
  var times = document.createElement('span');
  times.className = 'xxx-times';
  times.innerHTML = 'X';
  times.onclick = closeModal;
  modalHeader.appendChild(times);
  modal.appendChild(modalHeader);
  var modalBody = document.createElement('div');
  modalBody.className = 'xxx-modal-body';
  modalBody.innerHTML = inputs;
  modal.appendChild(modalBody);
  var modalFooter = document.createElement('div');
  modalFooter.className = 'xxx-modal-footer';
  modalFooter.innerHTML = btX;
  modal.appendChild(modalFooter);
  modalWr.appendChild(modal);
  body.appendChild(modalWr);
}

showButton();

function showModal() {
  document.getElementById('xxx-modal-wr').style.display = 'block'
}

function closeModal() {
  document.getElementById('xxx-modal-wr').style.display = 'none'

}
