const GlobalChat = {
    endpoint: "https://ntfy.sh/",
    topic: GLOBAL_CHAT_TOPIC,
    source: null,
    connected: false,
    connecting: false,
    status: "Offline",
    messages: [],
    seen: {},
    name: "",

    init(){
        let savedName = localStorage.getItem(GLOBAL_CHAT_NAME_KEY);
        if(savedName)
            this.name = this.cleanName(savedName);
        if(!this.name)
            this.name = "Chaser" + floor(random(100,999));
        this.addSystem("Global chat is public. Keep it short and storm-safe.");
    },

    cleanName(name){
        name = (name || "").replace(/[^\w .-]/g,"").trim();
        if(name.length > 18) name = name.slice(0,18);
        return name;
    },

    cleanText(text){
        text = (text || "").replace(/\s+/g," ").trim();
        if(text.length > 180) text = text.slice(0,180);
        return text;
    },

    setName(name){
        name = this.cleanName(name);
        if(!name) name = this.name || "Chaser";
        this.name = name;
        localStorage.setItem(GLOBAL_CHAT_NAME_KEY,name);
        return name;
    },

    connect(){
        if(this.connected || this.connecting) return;
        if(typeof EventSource === "undefined"){
            this.status = "EventSource unsupported";
            this.addSystem("This browser cannot open the live chat stream.");
            return;
        }
        this.connecting = true;
        this.status = "Connecting...";
        this.source = new EventSource(this.endpoint + this.topic + "/sse");
        this.source.onopen = ()=>{
            this.connected = true;
            this.connecting = false;
            this.status = "Online";
        };
        this.source.addEventListener("message",e=>this.receive(e.data));
        this.source.onmessage = e=>this.receive(e.data);
        this.source.onerror = ()=>{
            if(this.connected)
                this.status = "Reconnecting...";
            else
                this.status = "Connection failed";
            this.connected = false;
            this.connecting = false;
        };
    },

    disconnect(){
        if(this.source){
            this.source.close();
            this.source = null;
        }
        this.connected = false;
        this.connecting = false;
        this.status = "Offline";
    },

    receive(raw){
        let envelope;
        try{
            envelope = JSON.parse(raw);
        }catch(e){
            return;
        }
        if(!envelope || envelope.event && envelope.event !== "message") return;
        let payload;
        try{
            payload = JSON.parse(envelope.message || "");
        }catch(e){
            return;
        }
        if(!payload || payload.app !== "cyclone-sim-but-chaos" || payload.type !== "chat") return;
        if(payload.id && this.seen[payload.id]) return;
        if(payload.id) this.seen[payload.id] = true;
        this.addMessage(payload.name,payload.text,payload.time,payload.sender === this.clientId());
    },

    clientId(){
        let id = localStorage.getItem("cyclone-sim-global-chat-client");
        if(!id){
            id = Date.now().toString(36) + "-" + floor(random(100000,999999)).toString(36);
            localStorage.setItem("cyclone-sim-global-chat-client",id);
        }
        return id;
    },

    addSystem(text){
        this.messages.push({
            system: true,
            text,
            time: Date.now()
        });
        this.trimMessages();
    },

    addMessage(name,text,time,mine){
        name = this.cleanName(name) || "Chaser";
        text = this.cleanText(text);
        if(!text) return;
        this.messages.push({
            name,
            text,
            time: time || Date.now(),
            mine: !!mine
        });
        this.trimMessages();
    },

    trimMessages(){
        while(this.messages.length > GLOBAL_CHAT_MAX_MESSAGES)
            this.messages.shift();
    },

    async send(text,name){
        text = this.cleanText(text);
        if(!text) return false;
        if(!this.connected){
            this.addSystem("Connect before sending.");
            return false;
        }
        name = this.setName(name);
        let payload = {
            app: "cyclone-sim-but-chaos",
            type: "chat",
            id: Date.now().toString(36) + "-" + floor(random(100000,999999)).toString(36),
            sender: this.clientId(),
            name,
            text,
            time: Date.now(),
            version: VERSION_NUMBER
        };
        try{
            let res = await fetch(this.endpoint + this.topic,{
                method: "POST",
                headers: {
                    "Cache": "no",
                    "Firebase": "no",
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(payload)
            });
            if(!res.ok) throw new Error("HTTP " + res.status);
            return true;
        }catch(e){
            console.error(e);
            this.addSystem("Message failed to send.");
            return false;
        }
    }
};
