var floorscount;
var liftscount;
var liftCalledQueue=[];
var liftsFree=undefined;
var liftsCurrentPosition=[];
const btn=document.querySelector("#submit")
const formContainer=document.querySelector("#form-container")
btn.addEventListener("click",getFormDetails)
var screenSize;
var generate=document.querySelector("#generate")
generate.addEventListener("click",generateNew)  
function generateNew(){
    location.reload()
}
window.onload = ()=>{
    screenSize=screen.width;
    console.log(screenSize);
    var formInputLift=document.querySelector("#liftscount");
    var formInputFloor=document.querySelector("#floorscount");
    var formContainer=document.querySelector("#form-container")
    if(screenSize<500){
        formInputLift.placeholder="Max 2 lifts"
        formInputFloor.placeholder="Max 5 floors"
    }
    if(screenSize>500 && screenSize<1000){
        formInputLift.placeholder="Max 3 lifts"
        formInputFloor.placeholder="Max 5 floors"
        // formContainer.style.minWidth="600px"
        // formContainer.style.minHeight="400px"
        // formContainer.style.fontSize="26px"
        // formInputFloor.style.width="30%"
        // formInputFloor.style.height="30px"
        // formInputLift.style.width="30%"
        // formInputLift.style.height="30px"
    }
    if(screenSize>1000 && screenSize<1400){
        formInputLift.placeholder="Max 6 lifts"
        formInputFloor.placeholder="Max 12 floors"
    }
}


window.addEventListener('resize', function(event) {
    var changeInWidth=event.currentTarget.innerWidth;
    console.log(screenSize,changeInWidth);
    if(screenSize<500 & changeInWidth>500 || screenSize>500 && changeInWidth<500 || screenSize<1000 && changeInWidth>1000 || screenSize>1000 && changeInWidth<1000 || screenSize<1400 && changeInWidth>1400 || screenSize>1400 && changeInWidth<1400){
        this.location.reload()
    }
})

function getFormDetails(e){
    e.preventDefault()
    floorscount=document.querySelector("#floorscount").value;
    liftscount=document.querySelector("#liftscount").value;
    console.log("f,l",floorscount,liftscount);
    if(floorscount==0 || liftscount==0){
        alert("Min floors and lifts should be 1")
        return
    }
    if(screenSize<500){
        if(floorscount>5 || liftscount>2){
            alert("Max floors should be less than 5 and max lifts should be less than 3")
        }
        else{
            next_step()
        }
    }
    else if(screenSize<1000 && screenSize>500){
        if(floorscount>5 || liftscount>3){
            alert("Max floors should be less than 5 and max lifts should be less than 3")
        }
        else{
            next_step()
        }
    }
    else if(screenSize>1000 && screenSize<1400){
        if(floorscount>12 || liftscount>6){
            alert("Max floors should be <= 12 and max lifts <= 6")
        }
        else{
            next_step()
        }
    }
    else{
        if(floorscount>15 || liftscount>12){
            alert("Max floors 15 and max lifts 12")
        }
        else{
            next_step()
        }
    }
    
}
function next_step(){
    formContainer.style.display="none"
    generate.style.display="flex"
    var body=document.querySelector("body")
    body.style.display="flex"
    body.style.flexDirection="column"
    body.style.alignItems="center"
    body.style.justifyContent="center"
    
    liftCalledQueue=new Array()
    console.log(liftscount);
    liftsFree=new Array(parseInt(liftscount))
    console.log(liftsFree);
    liftsFree.fill(true)
    console.log(liftsFree);
    liftsCurrentPosition=new Array(parseInt(liftscount))
    liftsCurrentPosition.fill(0)
    console.log(liftsCurrentPosition);
    generateLiftsFloorsUI()
}
var floors=document.querySelector(".floors")
console.log(floors);
// generateLiftsFloorsUI()

function generateLiftsFloorsUI(){
    if(floorscount!=0 || liftscount!=0)
    {
        for(let i=floorscount;i>=0;i--){
            console.log(i);
            const floor = document.createElement("div");
            floor.classList.add("floor-container");
            const floorBtns=document.createElement("div")
            floorBtns.classList.add("floorBtns")
            floor.appendChild(floorBtns)
            const floorNumber=document.createElement("div");
            floorNumber.innerHTML=`${i} floor`;
            floorNumber.classList.add("floor-number");
            floorBtns.appendChild(floorNumber);
            floors.appendChild(floor);
            const btns=document.createElement("div")
            btns.classList.add("btns")
            floorBtns.appendChild(btns)
            const upbtn=document.createElement("button");
            upbtn.innerHTML="^";
            upbtn.classList.add(`upbtn-${i}`);
            upbtn.classList.add("up");

            const downbtn=document.createElement("button");
            downbtn.innerHTML="^";
            downbtn.classList.add(`downbtn-${i}`);
            downbtn.classList.add("down");

            upbtn.addEventListener("click",lift)
            downbtn.addEventListener("click",lift)

            if(i!=floorscount)
                btns.appendChild(upbtn);
            if(i!=0)
                btns.appendChild(downbtn);
            floor.style.width="100%"
            floor.style.height="100px"
            // upbtn.addEventListener("click",callLift)
            var liftContainer=document.createElement("div")
            liftContainer.classList.add("lift-container")
            floor.appendChild(liftContainer)
            
            if(i==0){
                for(let i=1;i<=liftscount;i++){
                    const liftBox=document.createElement("div")
                    liftBox.classList.add("lift-box")
                    liftBox.classList.add(`lift-${i}`)
                    liftContainer.appendChild(liftBox)
                    
                    var leftDoor=document.createElement("div");
                    leftDoor.classList.add("leftdoor");
                    leftDoor.classList.add(`leftdoor-${i}`);
                    liftBox.appendChild(leftDoor)

                    var rightDoor=document.createElement("div");
                    rightDoor.classList.add("rightdoor");
                    rightDoor.classList.add(`rightdoor-${i}`);
                    liftBox.appendChild(rightDoor)
                }
            }
        }
    }
}

// function generateLifts(){
//     for(let i=1;i<=liftscount;i++){
//         const liftContainer=document.createElement("div")
//         liftContainer.classList.add("lift-box")
//         liftContainer.classList.add(`lift-${i}`)
//     }
// }

function lift(e){
    calledFloor=e.target.classList[0].split("-")[1]
    liftCalledQueue.push(calledFloor)
    console.log(liftCalledQueue);
    checkAvailability()

}

async function moveLift(floorPosition){
    var nearestLift= await getNearestLift(floorPosition);
    var liftCurrentPosition=liftsCurrentPosition[nearestLift-1]
    // console.log("nearest",nearestLift,"flooe",floorPosition);
    // console.log(typeof(floorPosition));
    // console.log(typeof(liftCurrentPosition));
    var transitionTimer= Math.abs(liftCurrentPosition-floorPosition)*2
    // console.log("t",transitionTimer);
    // console.log("ooo",liftCurrentPosition,floorPosition);
    liftsFree[nearestLift-1]=false
    var distance=await liftCurrentPosition*100+(floorPosition-liftCurrentPosition)*100
    var liftToMove=document.querySelector(`.lift-${nearestLift}`)
    liftToMove.style.transitionDuration=`${transitionTimer}s`
    liftToMove.style.transform=`translateY(${-distance}px)`
    liftsCurrentPosition[nearestLift-1]=floorPosition;
    setTimeout(()=>{
        console.log("tt",transitionTimer);
        console.log("opend");
        openDoors(nearestLift)
    },transitionTimer*1000)

}

function getNearestLift(floorPosition){
    var maxPosition=99999;
    var minPosition=99999;
    console.log(liftsCurrentPosition);
    for(let i=0;i<liftscount;i++){
        console.log("i",i);
        console.log(liftsFree[i]);
        if(floorPosition-liftsCurrentPosition[i] < minPosition && liftsFree[i] )
        {
            liftNeedToMove=i
            minPosition=Math.abs(floorPosition-liftsCurrentPosition[i])
        }
    }
    console.log(liftNeedToMove);
    return liftNeedToMove+1
}

function checkAvailability() {
    if (liftCalledQueue.length > 0 && liftsFree.includes(true)) {
        moveLift(liftCalledQueue.shift())
        checkAvailability();
    } else {
        let allbusy = setInterval(() => {
        let liftavailable = liftsFree.includes(true);
        if (liftavailable && liftCalledQueue.length > 0) {
            moveLift(liftCalledQueue.shift())
        }
      }, 1000);
      if (liftCalledQueue.length == 0) {
        clearInterval(allbusy);
      }
    }
  }

function openDoors(lift){
    console.log("lift",lift);
    var leftDoor=document.querySelector(`.leftdoor-${lift}`)
    var rightDoor=document.querySelector(`.rightdoor-${lift}`)
    console.log(leftDoor);
    leftDoor.style.backgroundColor="gray"
    leftDoor.style.transitionDuration="2.5s"
    leftDoor.style.transform="translateX(-50px)"

    rightDoor.style.backgroundColor="gray"
    rightDoor.style.transitionDuration="2.5s"
    rightDoor.style.transform="translateX(50px)"
    setTimeout(()=>{
        leftDoor.style.transitionDuration="2.5s"
        leftDoor.style.transform="translateX(0px)"
    },2500)
    setTimeout(()=>{
        rightDoor.style.transitionDuration="2.5s"
        rightDoor.style.transform="translateX(0px)"
    },2500)
    setTimeout(()=>{
        liftsFree[lift-1]=true;
    },5000)
}
