
let addbtn = document.querySelector(".add-btn");
let removebtn=document.querySelector(".remove-btn");
let modalcont = document.querySelector(".modal");
let maincont=document.querySelector(".main-cont");
let textarea=document.querySelector(".textarea");
let toolboxcolors=document.querySelectorAll(".color");
let color=["purple","pink","red","mustard"];
let priorityclr=document.querySelectorAll(".priority-color");
let modalpriclr=color[color.length-1];
let addflag = false;
let removeflag=false;
let lockclose="fa-lock";
let lockopen="fa-lock-open";
let ticketsarr=[];

if(localStorage.getItem("JIRRA_ticket")){
    //retrive and display data
    ticketsarr=JSON.parse(localStorage.getItem("JIRRA_ticket"));
    ticketsarr.forEach((ticketobj)=>{
        createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
    })
}


for(let i=0; i<toolboxcolors.length; i++){
    toolboxcolors[i].addEventListener("click", (e)=>{
        let currtoolboxcolor=toolboxcolors[i].classList[1];
       let filteredticket= ticketsarr.filter((ticketobj,idx)=>{
            return currtoolboxcolor===ticketobj.ticketcolor;
        })
        //removed tickets
        let alltickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<alltickets.length;i++){
            alltickets[i].remove();
        }
        //add filtered ticket
        filteredticket.forEach((ticketobj,idx)=>{
              createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid);
        })
    })
    toolboxcolors[i].addEventListener("dblclick", (e)=>{
        let alltickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<alltickets.length;i++){
            alltickets[i].remove();
        }
        ticketsarr.forEach((ticketobj,idx)=>{
            createticket(ticketobj.ticketcolor,ticketobj.tickettask,ticketobj.ticketid)

        })
    })
}

//listner for modal priority color
priorityclr.forEach((colorsele,idx)=>{
   colorsele.addEventListener("click", (e)=>{
       priorityclr.forEach((colorpri, idx)=>{
           colorpri.classList.remove("border");
       })
       colorsele.classList.add("border");
       modalpriclr=colorsele.classList[1];
   })
   //modalpriclr=color[color.length-1];
})
addbtn.addEventListener("click", (e) => {
    // display modal
    //generate ticket

    //if addflag=true /display modal
    //if addflag=false /remove modal
    addflag = !addflag;
    if (addflag) {
        modalcont.style.display = "flex";
    }
    else {

        modalcont.style.display = "none";
    }
})
removebtn.addEventListener("click", (e)=>{
    removeflag=!removeflag;
    
   
})

modalcont.addEventListener("keydown",(e)=>{
    let key=e.key;
    if(key==="Shift"){
        createticket(modalpriclr,textarea.value);
        modalcont.style.display="none";
        textarea.value=" ";

    }
})
function createticket(ticketcolor,tickettask,ticketid) {
    let id =ticketid || shortid();
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class","ticket-cont");
    ticketcont.innerHTML = `
    <div class="ticket-color ${ticketcolor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-cont">${tickettask}</div>
    <div class="ticket-lock">
    <i class="fa-solid fa-lock"></i></div>
    `
   maincont.appendChild(ticketcont);
   //createw object of ticket and add to array
   if(!ticketid){

       ticketsarr.push({ticketcolor,tickettask,ticketid:id});
       localStorage.setItem("JIRRA_ticket",JSON.stringify(ticketsarr));
   }
   handelremoval(ticketcont,id);
   handellock(ticketcont,id);
   handelcolor(ticketcont,id);
}

function handelremoval(ticket,id){
    ticket.addEventListener("click", (e)=>{

        if(!removeflag)return;
        let idx=getticketidx(id);
        ticketsarr.splice(idx,1);
        let stringticketarr=JSON.stringify(ticketsarr);
        localStorage.setItem("JIRRA_ticket",stringticketarr);
            ticket.remove();
        
    })
    
}
function handellock(ticket,id){
    let lockelem=ticket.querySelector(".ticket-lock");
    let ticketlock=lockelem.children[0];
    let tickettaskarea=ticket.querySelector(".task-cont");
    ticketlock.addEventListener("click", (e)=>{
        let ticketidx=getticketidx(id);
        if(ticketlock.classList.contains(lockclose)){
             ticketlock.classList.remove(lockclose);
             ticketlock.classList.add(lockopen);
             tickettaskarea.setAttribute("contenteditable","true");
        }else{
            ticketlock.classList.remove(lockopen);
             ticketlock.classList.add(lockclose);
             tickettaskarea.setAttribute("contenteditable","false");
        }
        //modify data in local storage(ticket task)
        ticketsarr[ticketidx].tickettask=tickettaskarea.innerText;
        localStorage.setItem("JIRRA_ticket",JSON.stringify(ticketsarr));
    })
}
function handelcolor(ticket,id){

    let tktcolor=ticket.querySelector(".ticket-color");
    tktcolor.addEventListener("click", (e)=>{
        let ticketidx=getticketidx(id);
        let currentcolor=tktcolor.classList[1];
        //each ticket color index
 
 
        let ticketcoloridx= color.findIndex((colors)=>{
                 return currentcolor===colors;
        })
        ticketcoloridx++;
        let newticketcoloridx=ticketcoloridx%color.length;
        let newticketcolor=color[newticketcoloridx];
        tktcolor.classList.remove(currentcolor);
        tktcolor.classList.add(newticketcolor);
        //modify data in local storage
        ticketsarr[ticketidx].ticketcolor=newticketcolor;
        localStorage.setItem("JIRRA_ticket",JSON.stringify(ticketsarr))
    })
}
function getticketidx(id){
 let ticketidx=ticketsarr.findIndex((ticketobj)=>{
     return ticketobj.ticketid===id;
 })
 return ticketidx;
}