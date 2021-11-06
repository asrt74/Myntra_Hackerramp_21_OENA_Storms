
import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  productName: "React Unity WebGL game",
  companyName: "OENA Storms",
  loaderUrl: "/MyntraGame3/Build/MyntraGame3.loader.js",
  dataUrl: "/MyntraGame3/Build/MyntraGame3.data",
  frameworkUrl: "/MyntraGame3/Build/MyntraGame3.framework.js",
  codeUrl: "/MyntraGame3/Build/MyntraGame3.wasm",
  //streamingAssetsUrl: "Build/streamingassets",

  webglContextAttributes: {
    preserveDrawingBuffer: true,
  },
});

function App() {

  /////////////

  const[GainedScore, setGainedScore] = useState(0);
  const[message, setMessage] = useState("Keep Playing Games to earn Reward");

  useEffect(() => {
    setGainedScore(JSON.parse(window.localStorage.getItem('count')));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('count', GainedScore);
  }, [GainedScore]);

  function giftCard(){
    if(GainedScore >= 10 && GainedScore < 15){
      setMessage("Here's your BRONZE coupon code: OENA_Storms_110");
    } else if(GainedScore >= 15 && GainedScore < 20){
      setMessage("Here's your SILVER coupon code: OENA_Storms_111");
    } else if(GainedScore >= 20 && GainedScore < 25){
      setMessage("Here's your GOLD coupon code: OENA_Storms_112");
    }else if(GainedScore >= 25){
      setMessage("Here's your PLATINUM coupon code: OENA_Storms_113");
    } else{
      setMessage("Sorry, you do not have enough points");
    }
  }

  function defaultReward(){
    setMessage("Keep Playing Games to earn Reward");
  }

  function resetPoints(){
    setGainedScore(GainedScore * 0);
  }

  ////////////////
  

  ////////////////

  const [isUnityMounted, setIsUnityMounted] = useState(true);
  const [progression, setProgression] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [has_returned_score, sethasReturnScore] = useState("0");

  useEffect(function () {
    unityContext.on("ReturnScore", handleScoreCount);
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);

  useEffect(function () {
    unityContext.on("canvas", function (canvas) {
      canvas.width = 100;
      canvas.height = 50;
    });
  }, []);

  useEffect(() => {
    unityContext.on("progress", handleOnUnityProgress);
    unityContext.on("loaded", handleOnUnityLoaded);
    unityContext.on("canvas", handleOnUnityCanvas);
    //unityContext.on("score", handleOnUnityScores);
    
    return function () {
      unityContext.removeAllEventListeners();
    };
  }, []);



  function handleScoreCount(score) {
    sethasReturnScore(score);
  }

  function handleOnUnityCanvas(canvas) {
    canvas.setAttribute("role", "unity-canvas");
  }

  function handleOnUnityProgress(progression) {
    setProgression(progression);
  }

  function handleOnUnityLoaded() {
    setIsLoaded(true);
  }

  function handleOnClickUnMountUnity() {
    if (isLoaded === true) {
      setIsLoaded(false);
      setGainedScore(GainedScore + parseInt(has_returned_score,10));
    }
    setIsUnityMounted(isUnityMounted === false);
    // className="wrapper"
    
  }

  return (
    
    <Fragment>

      <div className="wrapper">
        {/* Introduction text */}
        <h1>OENA_Storms</h1>
        {/* The Unity container */}
        <button onClick={() => {handleOnClickUnMountUnity(); defaultReward();}}>(Un)mount Unity</button>
        <button  onClick = {giftCard} > Generate</button >
        <button  onClick = {() => {resetPoints(); defaultReward();}}> Reset Points</button >
        {/* <button onClick={handleOnClickFullscreen}>Fullscreen</button> */}
        

        <p > Total Gained Points: <b>{GainedScore} </b> </p>
        <p > <b> {message} </b> </p>
        


        {isUnityMounted === true && (
          <Fragment>
            <div className="unity-container">
              {/* The loading screen will be displayed here. */}
              {isLoaded === false && (
                <div className="loading-overlay">
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: progression * 100 + "%" }}
                    />
                  </div>
                  
                </div>
              )}
              {/* The Unity app will be rendered here. */}
              <p>Loading {progression * 100} percent...</p>
               {/* {isGameOver === true && <p>{`Game Over! ${score} points`}</p>} */}
                 
                
              <Unity className="unity-canvas" 
              unityContext={unityContext}
              matchWebGLToCanvasSize={false}
              style={{ width: "600px", height: "338.03px"}} />
            </div>
            {/* Displaying some output values */}
            <p style={{fontSize:20}}>
              Points: <b>{has_returned_score}</b>
            </p>
          </Fragment>
        )}
        
      </div>
    </Fragment>
  );
}

export default App;
