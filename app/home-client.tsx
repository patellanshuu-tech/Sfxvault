 "use client";

import { useMemo, useState } from "react";

type Sound = {
  id: number;
  title: string;
  category: string;
  file_url: string;
  file_name: string;
  downloads: number;
};

const fallback = [
  {id:-1,title:"Demo Whoosh",category:"Whoosh",file_url:"",file_name:"",downloads:0},
  {id:-2,title:"Demo Impact",category:"Impact",file_url:"",file_name:"",downloads:0},
  {id:-3,title:"Demo Pop",category:"Pop",file_url:"",file_name:"",downloads:0}
];

export default function HomeClient({ initialSounds }: { initialSounds: Sound[] }) {
  const [query, setQuery] = useState("");
  const [sounds, setSounds] = useState<Sound[]>(initialSounds);
  const shown = useMemo(() => {
    const q = query.toLowerCase().trim();
    return (sounds.length ? sounds : fallback as Sound[]).filter(s =>
      !q || `${s.title} ${s.category}`.toLowerCase().includes(q)
    );
  }, [query, sounds]);

  return (
    <main>
      <header className="header">
        <div className="brand"><span className="logo">S</span><b>SFXVault</b></div>
        <nav><a href="/">Home</a><a href="#categories">Categories</a><a href="#trending">Trending</a><a href="#upload">Upload</a></nav>
      </header>

      <section className="hero">
        <p className="eyebrow">SOUND EFFECT LIBRARY</p>
        <h1>Find the perfect sound for your edit</h1>
        <p className="sub">Search, upload and download sound effects for your creative projects.</p>
        <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search sound effects..." />
      </section>

      <section id="categories" className="section">
        <h2>Categories</h2>
        <div className="chips">{["Whoosh","Impact","Pop","Transition","Funny","Cinematic"].map(c =>
          <button key={c} onClick={()=>setQuery(c)}>{c}</button>
        )}</div>
      </section>

      <section id="trending" className="section">
        <div className="row"><h2>Latest Sounds</h2><span>{shown.length} results</span></div>
        <div className="grid">
          {shown.map(sound => <article className="card" key={sound.id}>
            <div className="cardtop"><span className="badge">{sound.category}</span><span>↗ {sound.downloads}</span></div>
            <h3>{sound.title}</h3>
            {sound.file_url ? <audio controls preload="none" src={sound.file_url} /> : <div className="demo">Demo card — upload a sound to activate audio.</div>}
            {sound.file_url && <a className="download" href={sound.file_url} download={sound.file_name}>Download</a>}
          </article>)}
        </div>
      </section>

      <section id="upload" className="uploadbox">
        <h2>Upload a sound</h2>
        <p>MP3, WAV, M4A or OGG · max 25 MB</p>
        <UploadForm onUploaded={(s)=>setSounds(prev=>[s,...prev])}/>
      </section>
    </main>
  );
}

function UploadForm({onUploaded}:{onUploaded:(s:Sound)=>void}) {
  const [title,setTitle]=useState("");
  const [category,setCategory]=useState("Whoosh");
  const [file,setFile]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [msg,setMsg]=useState("");

  async function submit(e:React.FormEvent) {
    e.preventDefault();
    if(!file || !title.trim()) return setMsg("Title aur audio file dono select karo.");
    setBusy(true); setMsg("");
    const fd=new FormData();
    fd.append("title",title.trim()); fd.append("category",category); fd.append("file",file);
    const res=await fetch("/api/sounds",{method:"POST",body:fd});
    const data=await res.json();
    if(res.ok){ onUploaded(data.sound); setTitle(""); setFile(null); setMsg("Sound successfully upload ho gaya!"); }
    else setMsg(data.error || "Upload failed.");
    setBusy(false);
  }

  return <form onSubmit={submit}>
    <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Sound title" />
    <select value={category} onChange={e=>setCategory(e.target.value)}>
      {["Whoosh","Impact","Pop","Transition","Funny","Cinematic","Other"].map(c=><option key={c}>{c}</option>)}
    </select>
    <input type="file" accept="audio/*" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
    <button disabled={busy}>{busy ? "Uploading..." : "Upload Sound"}</button>
    {msg && <p className="message">{msg}</p>}
  </form>
}