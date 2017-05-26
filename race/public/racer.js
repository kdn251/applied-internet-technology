 const socket = io();

 socket.on('connect', () => {
   document.body.appendChild(document.createTextNode('connected'));
 });

 //first parameter is event name
 //second parameter will be the message that you send
 socket.emit('greeting', "hello!");

 function clickHandler1(evt) {
   evt.preventDefault();
   const player = document.body.querySelector('.racer player1');
   player.classList.toggle('player1')
 }

 function clickHandler2(evt) {
   evt.preventDefault();
   const player = document.querySelector('#message').value;
   const user = document.querySelector('#user').value;
 }

 function main() {
   const player1Btn = document.querySelector('.player1Btn');
   player1Btn.addEventListener('click', clickHandler1);
   const player2Btn = document.querySelector('.player2Btn');
   player2Btn.addEventListener('click', clickHandler2);
 }

 document.addEventListener("DOMContentLoaded", main);
