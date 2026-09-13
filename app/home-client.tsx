 "use client";
import {useEffect,useState} from "react";

const CATEGORIES=["Action Sound", "Alarm & Chime", "Ambience", "Animals", "Arcade Noises", "Beep", "Bell", "Bugs", "build up", "Button", "Camera", "Chime", "Clicks", "clock", "Construction & Tools", "Crowd & People", "Digital", "Electric", "Epic Cinematic Trailer Impact - Pack 2", "error", "ESFX", "Evolve Audio - Epic Drama SFX", "Evolve Audio - Essential Transitions FREE", "Explosions", "Fart", "Feeling", "Fire & Fireworks", "Firearms", "Food", "FW sounds", "Games", "Gear", "Glitch", "Hits", "Horn", "i phone", "Keyboard & Mouse", "knife", "liquid", "Logo Animation", "Mechanical", "Meme SFX", "Miscellaneous", "Money", "Musical", "Negative", "Notifications", "other", "Paper Sound Effects", "pen click", "Percussion", "Phone", "Positive", "Ringtones", "Risers", "Sci-Fi", "shining", "Sports", "Swishes", "Switch", "Swoosh", "Tone", "Ui Sound", "Vehicles", "Vibes", "Water", "Wind", "Wooshes", "Unorganised", "Alien", "Arcade", "Bolt", "Bowling", "Brick", "Broom", "Bubbles", "Cable", "Cards", "Cartoon", "Cartoonish", "Chain", "Chalkboard", "Champagne", "Coin", "Crash", "Creak", "Dice", "Discord", "Door", "Drawer", "Duffle Bag", "DVD & CD", "Electric Timer", "Golf", "Hatch", "Hinge", "Lego", "Light", "Magic", "Marker", "Metal", "Mud", "Paper & book", "Pay Phone", "PC Mouse", "Pen", "Poker Chips", "Pop", "Punch", "Radio", "Register", "Roblox", "Spongebob", "Writing"];

type Sound={id:number,title:string,category:string,description:string,file_url:string,trending:boolean};

export default function Home(){
 const [tab,setTab]=useState("home"),[cat,setCat]=useState(""),[sounds,setSounds]=useState<Sound[]>([]),[search,setSearch]=useState(""),[busy,setBusy]=useState(false),[msg,setMsg]=useState("");

 async function load(c=cat,t=tab,q=search){
   setBusy(true);
   let p=new URLSearchParams();
   if(c)p.set("category",c);
   if(t==="trending")p.set("trending","true");
   if(q)p.set("search",q);
   let r=await fetch("/api/sounds?"+p);
   setSounds(await r.json());
   setBusy(false);
 }

 useEffect(()=>{if(tab!=="upload")load(tab==="categories"?cat:"",tab,"")},[tab,cat]);

 async function upload(e:any){
   e.preventDefault();setMsg("");setBusy(true);
   let fd=new FormData(e.currentTarget);
   fd.set("trending",fd.get("trending")?"true":"false");
   let r=await fetch("/api/sounds",{method:"POST",body:fd}),d=await r.json();
   setBusy(false);
   if(!r.ok){setMsg(d.error||"Upload failed");return}
   setMsg("Uploaded successfully!");e.currentTarget.reset()
 }

 const open=(c:string)=>{setCat(c);setTab("categories");load(c,"categories","")};

 return <>
  <header className="header">
   <nav className="nav">
    <button className="brand" onClick={()=>{setTab("home");setCat("")}}>
      <span className="brandIcon">S</span><span>SFXVault</span>
    </button>
    <div className="navLinks">
      <button onClick={()=>{setTab("home");setCat("")}}>Home</button>
      <button onClick={()=>{setTab("categories");setCat("")}}>Categories</button>
      <button onClick={()=>{setTab("trending");setCat("")}}>Trending</button>
      <button className="uploadBtn" onClick={()=>setTab("upload")}>Upload</button>
    </div>
   </nav>
  </header>

  <main className="container">
   {tab==="home"&&<section className="homePage">
    <section className="hero">
      <div className="eyebrow">SOUND EFFECT LIBRARY</div>
      <h1>Find the perfect sound for your edit</h1>
      <p>Search, upload and download sound effects for your creative projects.</p>
      <div className="searchBox">
        <input value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load("","home",search)} placeholder="Search sound effects..."/>
      </div>
    </section>

    <section className="section">
      <div className="sectionTitle"><h2>Categories</h2></div>
      <div className="chips">
        {CATEGORIES.slice(0,6).map(c=><button className="chip" key={c} onClick={()=>open(c)}>{c}</button>)}
      </div>
    </section>

    <section className="section">
      <div className="sectionTitle"><h2>Latest Sounds</h2><span>{busy?"":`${sounds.length} results`}</span></div>
      <SoundList sounds={sounds} busy={busy}/>
    </section>

    <UploadCard upload={upload} busy={busy} msg={msg}/>
   </section>}

   {tab==="categories"&&<section className="pageSection">
     <h1>{cat||"Categories"}</h1>
     {!cat?<div className="categoryGrid">{CATEGORIES.map(c=><button className="categoryCard" key={c} onClick={()=>open(c)}>{c}</button>)}</div>:<>
       <button className="backBtn" onClick={()=>setCat("")}>← All Categories</button>
       <SoundList sounds={sounds} busy={busy}/>
     </>}
   </section>}

   {tab==="trending"&&<section className="pageSection">
     <h1>Trending</h1>
     <SoundList sounds={sounds} busy={busy}/>
   </section>}

   {tab==="upload"&&<section className="pageSection uploadPage">
     <h1>Upload Sound</h1>
     <UploadCard upload={upload} busy={busy} msg={msg}/>
   </section>}
  </main>
 </>
}

function UploadCard({upload,busy,msg}:{upload:(e:any)=>void,busy:boolean,msg:string}){
 return <section className="uploadCard">
   <h2>Upload a sound</h2>
   <p className="uploadHint">MP3, WAV, M4A or OGG · max 25 MB</p>
   <form onSubmit={upload} className="form">
     <input name="title" placeholder="Sound title" required/>
     <select name="category" required defaultValue="">
       <option value="" disabled>Select category</option>
       {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
     </select>
     <textarea name="description" placeholder="Description (optional)" rows={2}/>
     <input name="file" type="file" accept="audio/*" required/>
     <label className="checkbox"><input name="trending" type="checkbox"/> Mark as Trending 🔥</label>
     <button className="uploadSubmit" disabled={busy}>{busy?"Uploading...":"Upload Sound"}</button>
   </form>
   {msg&&<p className={msg.includes("success")?"success":"error"}>{msg}</p>}
 </section>
}

function SoundList({sounds,busy}:{sounds:Sound[],busy:boolean}){
 if(busy)return <p className="muted">Loading...</p>;
 if(!sounds.length)return <p className="muted">No sounds found.</p>;
 return <div className="soundGrid">
   {sounds.map(s=><div className="soundCard" key={s.id}>
     <div className="soundTop">
       <div><span className="soundCategory">{s.category}</span><h3>{s.title}</h3></div>
       <span className="downloads">⌄ 0</span>
     </div>
     {s.description&&<p className="muted">{s.description}</p>}
     <audio controls src={s.file_url}/>
     <div className="soundBottom">
       <a className="downloadBtn" href={s.file_url} download>Download</a>
       {s.trending&&<span className="trendBadge">🔥 Trending</span>}
     </div>
   </div>)}
 </div>
}
