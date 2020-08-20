//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogIMG, happyDogIMG;
database = firebase.database;
var feed;
var fedTime;
var lastFed;
var foodObj;
var addFoodBtn;
var changeState;
var readState;
var bedroom, garden, washroom;
var currentTime;
var gameState;

function preload()
{
  dogIMG = loadAnimation("images/Dog.png");
  happyDog = loadAnimation("images/happydog.png");

  bedroom = loadAnimation("images/virtual pet images/Bed Room.png");
  garden = loadAnimation("images/virtual pet images/Garden.png");
  washroom = loadAnimation("images/virtual pet images/Wash Room.png");
}

function setup() {
  database = firebase.database();
  createCanvas(500, 500);
  
  dog = createSprite(250,300,40,40)
  dog.addAnimation("dog",dogIMG);
  dog.addAnimation("dogHappy",happyDog);
  dog.scale = 0.25;

  foodObj = new Food();

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  /*addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFood);*/

  addFoodBtn = createButton("Food");
  addFoodBtn.position(800, 95);
  addFoodBtn.mousePressed(addFood);

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87)

  textSize(12);
  fill("white");
  stroke(2);

  //foodObj.display();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  text("Note: Press UP_ARROW Key To Feed Drago Milk!",120,480);

  fedTime = database.ref('FeedTime')
  fedTime.on("value", function(data){
    lastFed = data.val();
  })

  fill(255,255.254);
  textSize(15);
  if (lastFed >= 12){
    text("Last Fed" + lastFed%12 + "PM", 350, 30);
  }
  else if (lastFed==0){
    text("Last Fed : 12 AM", 350, 30);
  }
  else {
    text("Last Fed" + lastFed + "AM", 350, 30);
  }

  if(gameState != "Hungry"){
    feed.hide();
    addFoodBtn.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFoodBtn.show();
    //dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed + 2)){
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }

  drawSprites();
  //add styles here
}

function readStock(data){
  foodS = data.val();
  console.log(foodS)
}

function writeStock(x){
  console.log("x"+ x)
  if(x <= 0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref("/").update({
    Food:x
  })
}

function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.changeAnimation("dogHappy",happyDog);
  var fs = foodObj.getFoodStock()-1;
  console.log("fs" + fs);
  foodObj.updateFoodStock(fs);
  database.ref('/').update({
    Food:fs,
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

