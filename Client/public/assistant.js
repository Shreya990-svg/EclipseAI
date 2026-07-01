(function () {


    // userData

    const script =
        document.currentScript ||
        document.querySelector(
            'script[src*="assistant.js"]'
        );

    const userId = script?.dataset?.userId

    const SCRIPT_BASE = new URL(script.src).origin;

    const SERVER_URL =
        window.location.hostname === "localhost"
            ? "http://localhost:8000"
            : "https://eclipseai-server.onrender.com";

    const theme = "dark"

    let assistantConfig = null


    // load CSS

    const link = document.createElement("link")

    link.rel = "stylesheet"

    link.href = `${SCRIPT_BASE}/assistant.css`;

    document.head.appendChild(link)


    // Create PopUp

    const popup = document.createElement("div")

    popup.className = `Eclipse-popup theme-${theme}`

    popup.innerHTML = `
    <div class="Eclipse-overlay"></div>

    <div class="Eclipse-content">

       <div class="Eclipse-top">
            <div class="Eclipse-orb-wrap">

                <div class="Eclipse-orb-glow"></div>

                <div class="Eclipse-orb"></div>

            </div>

            <h2 class="Eclipse-title">
                Hello! I'm Eclipse AI
            </h2>

            <p class="Eclipse-sub">
                Your smart voice assistant.
                <br />
                Ask anything about your website.
            </p>


            <div class="Eclipse-status">
                Tap button to Speak
            </div>

            <div class="Eclipse-wave">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <!-- User Text -->
            <div class="Eclipse-user-text">
            </div>

            <!-- AI Text -->
            <div class="Eclipse-ai-text">
            </div>
  
        </div>


        <div class="Eclipse-bottom">
            
            <button class="Eclipse-mic">

               <img 
               src="${SCRIPT_BASE}/mic.svg"
               alt="mic"
               class="Eclipse-mic-icon"/>
            </button>
        </div>
    </div>
    
    `;

    document.body.appendChild(popup);

    // floating Button

    const button = document.createElement("button")

    button.className = `Eclipse-btn theme-${theme}`

    button.innerHTML = `
    <img 
    src="${SCRIPT_BASE}/logo.png"
    alt="logo"
    />`;
    document.body.appendChild(button)




    // toggle popup

    let open = false

    button.onclick = () => {
        open = !open;
        popup.style.display = open ? "flex" : "none";
    }


    // load Assistant

    const loadAssistant = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/api/assistant/config/${userId}`)

            const data = await res.json()

            if (data) {
                assistantConfig = data.user
                applyConfig()
            }

        } catch (error) {
            console.log(
                "Assistant Load Error:",
                error
            );
        }
    }

    const applyConfig = () => {
        if (!assistantConfig) return;

        popup.className = `Eclipse-popup theme-${assistantConfig.theme}`

        button.className = `Eclipse-btn theme-${assistantConfig.theme}`

        const title = popup.querySelector(".Eclipse-title")

        title.innerHTML = `Hello! I'm ${assistantConfig.assistantName}`;

        const subTitle = popup.querySelector(".Eclipse-sub")
        subTitle.innerHTML = `
    Welcome to
    ${assistantConfig.businessName}.
    <br />
    Ask anything about your website.
  `;


    }

    loadAssistant()


    // Element


    const status =
        popup.querySelector(
            ".Eclipse-status"
        );

    const wave =
        popup.querySelector(
            ".Eclipse-wave"
        );

    const userText =
        popup.querySelector(
            ".Eclipse-user-text"
        );

    const aiText =
        popup.querySelector(
            ".Eclipse-ai-text"
        );

    const mic =
        popup.querySelector(
            ".Eclipse-mic"
        );



    // text-speech

    const speak = (text) => {
        window.speechSynthesis.cancel();

        // Show AI response
        aiText.innerText =
            text;

        status.innerText =
            "AI Speaking...";

        const speech = new SpeechSynthesisUtterance(text)

        speech.lang =
            "hi-IN";

        speech.rate = 1;

        speech.pitch = 1;

        speech.volume = 1;

        // Voice end
        speech.onend = () => {

            status.innerText =
                "Tap button to Speak";

            wave.style.opacity =
                "0";
        };

        // Start speaking
        window.speechSynthesis.speak(
            speech
        );
    }


    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition


    if(SpeechRecognition){

        const recognition = new SpeechRecognition();

        recognition.lang =
      "en-US";

    recognition.continuous =
      false;

    recognition.interimResults =
      false;


      mic.onclick=()=>{
        wave.style.opacity =
        "1";

      status.innerText =
        "Listening...";

      userText.innerText =
        "";

      aiText.innerText =
        "";

      recognition.start();
      }


      recognition.onresult = (e)=>{
        const text = e.results[0][0].transcript

        userText.innerText = "You: " + text;

        recognition.stop();


        setTimeout( async () => {
            try {
                status.innerText = "Thinking...";
                

                const res = await fetch(`${SERVER_URL}/api/assistant/ask` , {
                    method:"POST",
                    headers:{
                        "Content-Type":
                      "application/json",
                    } ,
                    body:JSON.stringify({
                        message:text,
                        userId
                    })
                })

                const data = await res.json()
                console.log(data)

                if(data.success){

                    if(data.action === "navigate"){
                        speak(data.response)

                        setTimeout(()=>{
                            window.location.href = data.path

                        },1500)

                    }else{
                        speak(data.aiResponse)
                    }

                }else{
                    speak("Response Error please Check your plan")

                }



            } catch (error) {
                console.log(error)
                speak("AI Server Error")
                
            }
        },600)
      };

      recognition.onerror = ()=>{
        status.innerText =
          "Tap button to Speak";

        wave.style.opacity =
          "0";
      }


    }
    else{
        status.innerText =
      "Speech Recognition not supported";
    }


})();