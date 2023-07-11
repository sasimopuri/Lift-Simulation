var floorscount;
var liftscount;
var liftCalledQueue=[];
var liftsFree=undefined;
var liftsCurrentPosition=[];
const btn=document.querySelector("#submit")
const formContainer=document.querySelector("#form-container")
btn.addEventListener("click",getFormDetails)
function getFormDetails(e){
    e.preventDefault()
    floorscount=document.querySelector("#floorscount").value;
    liftscount=document.querySelector("#liftscount").value;
    console.log("f,l",floorscount,liftscount);
    next_step()
}
function next_step(){
    formContainer.style.display="none"
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
            const floorNumber=document.createElement("span");
            floorNumber.innerHTML=`${i} floor`;
            floorNumber.classList.add("floor-number");
            floor.appendChild(floorNumber);
            floors.appendChild(floor);
            const upbtn=document.createElement("button");
            upbtn.innerHTML="up";
            upbtn.classList.add(`upbtn-${i}`);
            upbtn.classList.add("up");

            const downbtn=document.createElement("button");
            downbtn.innerHTML="down";
            downbtn.classList.add(`downbtn-${i}`);
            downbtn.classList.add("down");

            upbtn.addEventListener("click",lift)
            downbtn.addEventListener("click",lift)

            if(i!=floorscount)
                floor.appendChild(upbtn);
            if(i!=0)
                floor.appendChild(downbtn);
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
    var transitionTimer= Math.abs(liftCurrentPosition-floorPosition)*1
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
    leftDoor.style.backgroundColor="#fff"
    leftDoor.style.transitionDuration="2.5s"
    leftDoor.style.transform="translateX(-50px)"

    rightDoor.style.backgroundColor="#fff"
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
