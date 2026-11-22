import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home, BookOpen, BookText, Zap, ClipboardCheck, ChartNoAxesColumnIncreasing,
  Search, Menu, X, Moon, Sun, Bookmark, Volume2, ChevronRight, ChevronLeft,
  GraduationCap, Layers, Languages, Filter, CheckCircle2, RotateCcw, ExternalLink
} from 'lucide-react'
import { topics, vocabulary, grammarLessons, easyRules, quizQuestions } from './data'
import { n4Vocabulary } from './n4-vocabulary'

const nav = [
  ['/', 'হোম', Home], ['/vocabulary','Vocabulary',BookOpen], ['/grammar','Grammar Lessons',BookText],
  ['/easy-grammar','Easy Grammar',Zap], ['/quiz','Quiz & Practice',ClipboardCheck],
  ['/progress','My Progress',ChartNoAxesColumnIncreasing]
]
const formLabels = {dictionary:'Dictionary',masu:'Masu',masen:'Masen',te:'Te',ta:'Ta',nai:'Nai',nakatta:'Nakatta'}
const kanaOnly = s => !/[\u4E00-\u9FFF\u3400-\u4DBF]/.test(s || '')
function speak(text) {
  if (!('speechSynthesis' in window)) return alert('এই ব্রাউজারে Speech Synthesis সমর্থিত নয়।')
  const u = new SpeechSynthesisUtterance(text); u.lang = 'ja-JP'; window.speechSynthesis.speak(u)
}
function useSaved(key, initial) {
  const [value,setValue] = useState(() => { try { return JSON.parse(localStorage.getItem(key)) ?? initial } catch { return initial } })
  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key,value])
  return [value,setValue]
}
function App() {
  const [page,setPage] = useState('Home')
  const [level,setLevel] = useState('N5')
  const [dark,setDark] = useSaved('na-dark',false)
  const [favorites,setFavorites] = useSaved('na-favorites',[])
  const [completed,setCompleted] = useSaved('na-completed',[])
  const [scores,setScores] = useSaved('na-scores',[])
  const [customWords,setCustomWords] = useSaved('na-custom-words',[])
  const [mobileOpen,setMobileOpen] = useState(false)
  const [globalSearch,setGlobalSearch] = useState('')
  const [selectedLesson,setSelectedLesson] = useState(1)
  const [selectedTopic,setSelectedTopic] = useState('Verbs')
  const [selectedWord,setSelectedWord] = useState(null)
  const [vMode,setVMode] = useState('lesson')
  const [gLevel,setGLevel] = useState('N5')
  const [easyCategory,setEasyCategory] = useState('Verb')
  const [easyForm,setEasyForm] = useState('Te Form')
  const [easyLevel,setEasyLevel] = useState('N5')
  const [grammarLevel,setGrammarLevel] = useState('N5')
  const [quizLevel,setQuizLevel] = useState('N5')
  const [quizIndex,setQuizIndex] = useState(0)
  const [quizAnswer,setQuizAnswer] = useState(null)
  const [quizDone,setQuizDone] = useState(false)
  const [quizCount,setQuizCount] = useState(0)
  const [quizCorrect,setQuizCorrect] = useState(0)
  const navigate = useNavigate()
  const setRoute = (name,path) => { setPage(name); setMobileOpen(false); setSelectedWord(null); navigate(path) }
  const toggleFav = id => setFavorites(old => old.includes(id) ? old.filter(x=>x!==id) : [...old,id])
  const markDone = id => setCompleted(old => old.includes(id) ? old : [...old,id])
  const allVocabulary = [...vocabulary, ...n4Vocabulary, ...customWords]
  const words = allVocabulary.filter(v=>v.level===level)
  const lessons = Array.from({length:25},(_,i)=>level==='N5'?i+1:i+26)
  const matchingWords = words.filter(v => vMode==='lesson' ? v.lesson===selectedLesson : v.topics?.includes(selectedTopic))
  const searchResults = useMemo(() => {
    const q=globalSearch.trim().toLowerCase()
    if(!q) return []
    return [
      ...allVocabulary.filter(v=>[v.japanese,v.hiragana,v.kanji,v.romaji,v.english,v.bangla].join(' ').toLowerCase().includes(q)).map(v=>({...v,kind:'Vocabulary'})),
      ...grammarLessons.filter(g=>[g.title,g.pattern,g.bangla,g.english].join(' ').toLowerCase().includes(q)).map(g=>({...g,kind:'Grammar'}))
    ].slice(0,12)
  },[globalSearch,customWords])
  const progress = Math.round((completed.length/25)*100)
  const lessonWords = allVocabulary.filter(v=>v.level===level && v.lesson===selectedLesson)
  const easyCategoryRules = easyRules.filter(r=>r.category===easyCategory && r.level===easyLevel && (easyCategory!=='Verb' || r.form===easyForm))
  const currentQuestions = quizQuestions.filter(q=>q.level===quizLevel)
  const currentQ = currentQuestions[quizIndex % Math.max(currentQuestions.length,1)]
  const pageTitle = page==='Home'?'শেখা শুরু করুন':page
  const chooseWord = word => {setSelectedWord(word);setPage('Vocabulary detail')}
  return <div className={dark?'app dark':'app'}>
    <aside className={mobileOpen?'sidebar open':'sidebar'}>
      <div className="brand"><div className="brand-mark">日</div><div><b>Afsar's easy Nihonogo</b><small>Japanese Learning</small></div><button className="icon-btn mobile-close" onClick={()=>setMobileOpen(false)}><X size={18}/></button></div>
      <div className="side-label">LEARNING MENU</div>
      {nav.map(([path,label,Icon])=><NavLink key={path} to={path} onClick={()=>{setPage(label==='হোম'?'Home':label);setMobileOpen(false);setSelectedWord(null)}} className={({isActive})=>'nav-item '+(isActive?'active':'')}><Icon size={18}/><span>{label}</span>{label==='Easy Grammar'&&<span className="new-tag">NEW</span>}</NavLink>)}
      <div className="sidebar-bottom"><div className="mini-progress"><div className="mini-progress-top"><span>আপনার অগ্রগতি</span><b>{progress}%</b></div><div className="progress-track"><i style={{width:progress+'%'}}/></div><small>{completed.length} / 25 N5 grammar lessons completed</small></div><button className="theme-toggle" onClick={()=>setDark(!dark)}>{dark?<Sun size={17}/>:<Moon size={17}/>} {dark?'Light Mode':'Dark Mode'}</button></div>
    </aside>
    {mobileOpen&&<div className="scrim" onClick={()=>setMobileOpen(false)}/>}
    <main className="main">
      <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="crumb">Afsar's easy Nihonogo <ChevronRight size={14}/> <b>{pageTitle}</b></div><div className="top-actions"><div className="searchbox"><Search size={16}/><input value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} placeholder="শব্দ বা Grammar খুঁজুন..."/>{globalSearch&&<button onClick={()=>setGlobalSearch('')}><X size={14}/></button>}</div><button className="level-pill" onClick={()=>setLevel(level==='N5'?'N4':'N5')}>{level} <ChevronRight size={14}/></button></div></header>
      {globalSearch.trim() ? <section className="content"><div className="section-head"><div><span className="eyebrow">SEARCH</span><h1>Search Results</h1><p>“{globalSearch}” এর জন্য ফলাফল</p></div></div>{searchResults.length?<div className="list-card">{searchResults.map(r=><button className="result-row" key={r.id} onClick={()=>r.kind==='Vocabulary'?chooseWord(r):setPage('Grammar Lessons')}><span className="result-kind">{r.kind}</span><span className="result-main"><b>{r.japanese||r.title}</b><small>{r.romaji||r.bangla}</small></span><ChevronRight/></button>)}</div>:<Empty text="কোনো ফলাফল পাওয়া যায়নি।" />}</section>
      : page==='Home' ? <HomePage setRoute={setRoute} setLevel={setLevel} completed={completed} progress={progress} favorites={favorites}/>
      : page==='Vocabulary' ? <VocabularyPage level={level} setLevel={setLevel} lessons={lessons} mode={vMode} setMode={setVMode} selectedLesson={selectedLesson} setSelectedLesson={setSelectedLesson} topic={selectedTopic} setTopic={setSelectedTopic} words={matchingWords} chooseWord={chooseWord} favorites={favorites} toggleFav={toggleFav} addWord={word=>setCustomWords(old=>[...old,word])}/>
      : page==='Vocabulary detail' ? <WordDetail word={selectedWord} back={()=>setPage('Vocabulary')} favorites={favorites} toggleFav={toggleFav}/>
      : page==='Grammar Lessons' ? <GrammarPage level={grammarLevel} setLevel={setGrammarLevel} completed={completed} markDone={markDone}/>
      : page==='Easy Grammar' ? <EasyGrammarPage category={easyCategory} setCategory={setEasyCategory} form={easyForm} setForm={setEasyForm} level={easyLevel} setLevel={setEasyLevel}/>
      : page==='Quiz & Practice' ? <QuizPage level={quizLevel} setLevel={setQuizLevel} question={currentQ} answer={quizAnswer} setAnswer={setQuizAnswer} done={quizDone} setDone={setQuizDone} index={quizIndex} setIndex={setQuizIndex} count={quizCount} setCount={setQuizCount} correct={quizCorrect} setCorrect={setQuizCorrect} saveScore={s=>setScores(old=>[...old,s])}/>
      : page==='My Progress' ? <ProgressPage completed={completed} scores={scores} favorites={favorites} reset={()=>{if(confirm('সব Progress ও Favorites মুছে ফেলবেন?')){setCompleted([]);setFavorites([]);setScores([])}}}/>
      : <AboutPage/>}
      <footer className="footer">日本語を いっしょに べんきょうしましょう。 <span>© Afsar's easy Nihonogo · Version 1.1</span></footer>
    </main>
  </div>
}
function HomePage({setRoute,setLevel,completed,progress,favorites}) {
  return <section className="content">
    <div className="hero"><div className="hero-copy"><span className="eyebrow light">WELCOME TO AFSAR'S EASY NIHONOGO</span><h1>জাপানিজ শেখা হোক<br/><em>আরও সহজ।</em></h1><p>N5 থেকে N4 — Vocabulary, Grammar ও Practice এক জায়গায়। নিজের গতিতে শিখুন, অনুশীলন করুন এবং অগ্রগতি দেখুন।</p><div className="hero-actions"><button className="btn white" onClick={()=>setRoute('Vocabulary','/vocabulary')}>শেখা শুরু করুন <ChevronRight size={17}/></button><button className="btn outline-light" onClick={()=>setRoute('Easy Grammar','/easy-grammar')}>Easy Grammar</button></div></div><div className="hero-art"><div className="sun-disc"/><div className="kanji-art">日本語</div><div className="hero-note">Learn · Practice · Progress</div></div></div>
    <div className="stats-grid"><Stat icon={BookOpen} value="25" label="N5 Lessons"/><Stat icon={Bookmark} value={favorites.length} label="Favorite শব্দ"/><Stat icon={CheckCircle2} value={completed.length} label="Completed lessons"/><Stat icon={ChartNoAxesColumnIncreasing} value={progress+'%'} label="Learning progress"/></div>
    <div className="section-head"><div><span className="eyebrow">CHOOSE YOUR LEVEL</span><h2>আপনার শেখার যাত্রা শুরু করুন</h2><p>আপনার বর্তমান লেভেল নির্বাচন করুন।</p></div></div>
    <div className="level-cards"><button className="level-card n5" onClick={()=>{setLevel('N5');setRoute('Vocabulary','/vocabulary')}}><div className="level-symbol">N5</div><div><span className="tag red">BEGINNER</span><h3>প্রাথমিক জাপানিজ</h3><p>Vocabulary ও Grammar Lesson 01–25</p><b>শুরু করুন <ChevronRight size={16}/></b></div></button><button className="level-card n4" onClick={()=>{setLevel('N4');setRoute('Vocabulary','/vocabulary')}}><div className="level-symbol">N4</div><div><span className="tag blue">ELEMENTARY</span><h3>প্রাথমিকের পরের ধাপ</h3><p>Vocabulary ও Grammar Lesson 26–50</p><b>শুরু করুন <ChevronRight size={16}/></b></div></button></div>
    <div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>যেভাবে শিখতে চান</h2></div></div><div className="feature-grid"><Feature icon={BookOpen} title="Vocabulary" text="Lesson ও Topic অনুযায়ী শব্দ শিখুন" onClick={()=>setRoute('Vocabulary','/vocabulary')}/><Feature icon={BookText} title="Grammar Lessons" text="ধাপে ধাপে Grammar বুঝুন" onClick={()=>setRoute('Grammar Lessons','/grammar')}/><Feature icon={Zap} title="Easy Grammar" text="একই ধরনের Grammar Rule এক জায়গায়" onClick={()=>setRoute('Easy Grammar','/easy-grammar')}/><Feature icon={ClipboardCheck} title="Quiz & Practice" text="নিজের জ্ঞান যাচাই করুন" onClick={()=>setRoute('Quiz & Practice','/quiz')}/></div>
  </section>
}
function Stat({icon:Icon,value,label}){return <div className="stat-card"><div className="stat-icon"><Icon size={19}/></div><div><b>{value}</b><small>{label}</small></div></div>}
function Feature({icon:Icon,title,text,onClick}){return <button className="feature-card" onClick={onClick}><div className="feature-icon"><Icon/></div><b>{title}</b><p>{text}</p><ChevronRight className="feature-arrow" size={17}/></button>}
function LevelSwitch({level,setLevel}){return <div className="segmented"><button className={level==='N5'?'selected':''} onClick={()=>setLevel('N5')}>N5 <small>01–25</small></button><button className={level==='N4'?'selected':''} onClick={()=>setLevel('N4')}>N4 <small>26–50</small></button></div>}
function VocabularyPage({level,setLevel,lessons,mode,setMode,selectedLesson,setSelectedLesson,topic,setTopic,words,chooseWord,favorites,toggleFav,addWord}) {
  const [q,setQ]=useState('')
  const [showAdd,setShowAdd]=useState(false)
  const filtered=words.filter(w=>[w.japanese,w.kanji,w.romaji,w.english,w.bangla].join(' ').toLowerCase().includes(q.toLowerCase()))
  useEffect(()=>setSelectedLesson(level==='N5'?1:26),[level])
  return <section className="content"><PageHead eyebrow="VOCABULARY" title="Vocabulary" subtitle="Lesson অনুযায়ী অথবা Topic অনুযায়ী জাপানিজ শব্দ শিখুন."/><LevelSwitch level={level} setLevel={setLevel}/>
    <div className="mode-tabs"><button className={mode==='lesson'?'active':''} onClick={()=>setMode('lesson')}><BookOpen size={17}/> Lesson Based</button><button className={mode==='topic'?'active':''} onClick={()=>setMode('topic')}><Layers size={17}/> Topic Based</button></div>
    {mode==='lesson'?<><div className="lesson-grid">{lessons.map(n=><button key={n} onClick={()=>setSelectedLesson(n)} className={'lesson-chip '+(selectedLesson===n?'active':'')}>Lesson {String(n).padStart(2,'0')}</button>)}</div><div className="section-head compact"><div><h2>Lesson {String(selectedLesson).padStart(2,'0')} Vocabulary</h2><p>{level} · {level==='N4'&&selectedLesson<=30?'তোমার দেওয়া সম্পূর্ণ শব্দতালিকা':'Vocabulary lesson'}</p></div><div className="vocab-head-actions"><span className="count-pill">{filtered.length} words</span><button className="btn primary add-word-btn" onClick={()=>setShowAdd(true)}>＋ নতুন শব্দ যোগ করুন</button></div></div></>:<><div className="section-head compact"><div><h2>Choose a Topic</h2><p>{level} level-এর বিষয়ভিত্তিক শব্দ</p></div></div><div className="topic-grid">{topics.map(t=><button key={t} className={'topic-chip '+(topic===t?'active':'')} onClick={()=>setTopic(t)}>{t}</button>)}</div><div className="section-head compact"><div><h2>{topic}</h2><p>{level} · সব সংশ্লিষ্ট Lesson থেকে</p></div><span className="count-pill">{filtered.length} words</span></div></>}
    <div className="table-toolbar"><div className="inline-search"><Search size={16}/><input placeholder="এই তালিকায় খুঁজুন..." value={q} onChange={e=>setQ(e.target.value)}/></div><span className="muted small">বইয়ের Lesson reference · বাংলা অর্থসহ</span></div>
    {filtered.length?<div className="vocab-list">{filtered.map(w=><div className="vocab-row" key={w.id}><div className="vocab-jp" onClick={()=>chooseWord(w)}><b>{w.japanese}</b><small>{w.kanji?`Kanji: ${w.kanji} · `:''}{w.romaji}</small></div><div className="vocab-meaning"><b>{w.bangla||'বাংলা অর্থ যোগ করা হয়নি'}</b><small>{w.english}</small>{w.example&&<div className="vocab-example-preview"><span>{w.example.jp}</span><small>{w.example.romaji}</small><small>{w.example.en}</small></div>}</div><div className="vocab-meta"><span className="tiny-tag">{w.type}</span>{w.verbGroup&&<span className="tiny-tag violet">{w.verbGroup}</span>}<small>Lesson {w.lesson}</small></div><div className="row-actions"><button className="icon-btn" title="উচ্চারণ শুনুন" onClick={()=>speak(w.hiragana||w.japanese)}><Volume2 size={17}/></button><button className={'icon-btn '+(favorites.includes(w.id)?'fav-on':'')} title="Favorite" onClick={()=>toggleFav(w.id)}><Bookmark size={17}/></button><button className="icon-btn" onClick={()=>chooseWord(w)}><ChevronRight size={18}/></button></div></div>)}</div>:<Empty text="এই Lesson/Topic-এ এখনো কোনো শব্দ যোগ করা হয়নি।"/>}
    {showAdd&&<AddWordModal level={level} lesson={selectedLesson} onClose={()=>setShowAdd(false)} onSave={word=>{addWord(word);setShowAdd(false);setQ('')}}/>}
  </section>
}
function WordDetail({word,back,favorites,toggleFav}) {
  if(!word)return <section className="content"><Empty text="শব্দ নির্বাচন করুন।"/><button className="btn primary" onClick={back}>ফিরে যান</button></section>
  return <section className="content"><button className="back-link" onClick={back}><ChevronLeft size={17}/> Vocabulary-তে ফিরুন</button><div className="detail-card"><div className="detail-top"><span className="tag red">{word.level} · LESSON {word.lesson}</span><button className={'icon-btn '+(favorites.includes(word.id)?'fav-on':'')} onClick={()=>toggleFav(word.id)}><Bookmark/></button></div><h1 className="detail-jp">{word.japanese}</h1>{word.kanji&&<p className="detail-kanji">Kanji: {word.kanji}</p>}<p className="detail-romaji">{word.romaji}</p><div className="meaning-pair"><div><small>বাংলা অর্থ</small><b>{word.bangla||'এখনো যোগ করা হয়নি'}</b></div><div><small>English</small><b>{word.english}</b></div></div>{word.example&&<div className="example-card vocab-example-detail"><span className="eyebrow">EXAMPLE SENTENCE</span><b>{word.example.jp}</b><small>{word.example.romaji}</small><p>{word.example.en}</p><button className="icon-btn" title="উদাহরণ বাক্য শুনুন" onClick={()=>speak(word.example.jp)}><Volume2 size={16}/></button></div>}<button className="btn secondary" onClick={()=>speak(word.hiragana||word.japanese)}><Volume2 size={17}/> উচ্চারণ শুনুন</button>
    {(word.type==='Verb'||word.type==='Verbs')&&<><div className="section-head compact"><div><span className="eyebrow">VERB CONJUGATION</span><h2>Verb Forms</h2></div><span className="tag violet">{word.verbGroup||'Group not assigned'}</span></div><p className="info-note">নিচের ফর্মগুলো ডেমো ডেটা। প্রতিটি Verb-এর সঠিক রূপ যাচাই করে JSON-এ সংরক্ষণ করুন।</p><div className="form-table">{Object.entries(word.forms||{}).map(([k,v])=><div key={k}><span>{formLabels[k]||k}</span><b>{v}</b><button className="icon-btn" onClick={()=>speak(v)}><Volume2 size={15}/></button></div>)}</div></>}
    <div className="topic-tags">{word.topics?.map(t=><span className="tiny-tag" key={t}>{t}</span>)}</div></div></section>
}
function AddWordModal({level,lesson,onClose,onSave}) {
  const [form,setForm]=useState({japanese:'',bangla:'',english:'',romaji:'',kanji:''})
  const update=(key,value)=>setForm(old=>({...old,[key]:value}))
  const submit=e=>{e.preventDefault();onSave({id:`custom-${Date.now()}`,level,lesson,japanese:form.japanese.trim(),hiragana:form.japanese.trim(),bangla:form.bangla.trim(),english:form.english.trim(),romaji:form.romaji.trim(),kanji:form.kanji.trim(),type:'Custom',topics:['Custom']})}
  return <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><form className="add-word-modal" onSubmit={submit}><div className="modal-heading"><div><span className="eyebrow">ADD VOCABULARY</span><h2>নতুন শব্দ যোগ করুন</h2><p>{level} · Lesson {lesson}</p></div><button type="button" className="icon-btn" onClick={onClose}><X/></button></div><label>Japanese Word<input required value={form.japanese} onChange={e=>update('japanese',e.target.value)} placeholder="例：たべます"/></label><label>Kanji<input value={form.kanji} onChange={e=>update('kanji',e.target.value)} placeholder="例：食べます (ঐচ্ছিক)"/></label><label>Romaji<input required value={form.romaji} onChange={e=>update('romaji',e.target.value)} placeholder="Tabemasu"/></label><label>Bangla Meaning<input required value={form.bangla} onChange={e=>update('bangla',e.target.value)} placeholder="বাংলা অর্থ"/></label><label>English Meaning<input required value={form.english} onChange={e=>update('english',e.target.value)} placeholder="to eat"/></label><div className="modal-actions"><button type="button" className="btn secondary" onClick={onClose}>বাতিল</button><button type="submit" className="btn primary">সংরক্ষণ করুন</button></div></form></div>
}
function GrammarPage({level,setLevel,completed,markDone}) {
  const [lesson,setLesson]=useState(null)
  const items=grammarLessons.filter(g=>g.level===level)
  const nums=Array.from({length:25},(_,i)=>level==='N5'?i+1:i+26)
  const current=items.find(g=>g.lesson===lesson)
  return <section className="content"><PageHead eyebrow="GRAMMAR LESSONS" title="Grammar Lessons" subtitle="Lesson অনুযায়ী Grammar শিখুন, উদাহরণ দেখুন ও সম্পন্ন হিসেবে চিহ্নিত করুন."/><LevelSwitch level={level} setLevel={v=>{setLevel(v);setLesson(null)}}/>
    {!current?<><div className="lesson-grid">{nums.map(n=><button key={n} className={'lesson-chip '+(items.some(x=>x.lesson===n)?'has-content':'')} onClick={()=>setLesson(n)}>Lesson {String(n).padStart(2,'0')} {completed.includes('g'+level+n)&&'✓'}</button>)}</div><div className="info-note">এই সংস্করণে N5 Grammar notes সাজানো আছে; N4 Grammar পরবর্তী ধাপে যোগ করা যাবে।</div></>:<div className="detail-card"><button className="back-link" onClick={()=>setLesson(null)}><ChevronLeft size={17}/> Lesson list</button><span className="tag red">{current.level} · LESSON {current.lesson}</span><h2>{current.title}</h2><div className="grammar-pattern">{current.pattern}</div><p>{current.bangla}</p><p className="muted">{current.english}</p>{current.usage&&<><h3>ব্যবহার</h3><p>{current.usage}</p></>}<h3>উদাহরণ</h3>{current.examples.map((e,i)=><div className="example-card" key={i}><b>{e.jp}</b><small>{e.romaji}</small><p>{e.bn}</p><small>{e.en}</small><button className="icon-btn" onClick={()=>speak(e.jp)}><Volume2 size={16}/></button></div>)}<button className="btn primary" onClick={()=>markDone('g'+current.level+current.lesson)}><CheckCircle2 size={17}/> সম্পন্ন হিসেবে চিহ্নিত করুন</button></div>}
  </section>
}
function EasyGrammarPage({category,setCategory,form,setForm,level,setLevel}) {
  const categories=['Verb','Particle','Adverb','Conjunction / Connectors']
  const forms=['Masu Form','Te Form','Plain Form','Ta Form','Nai Form','Dictionary Form','Potential Form','Passive Form','Causative Form','Volitional Form','Conditional Form']
  const filtered=easyRules.filter(r=>r.category===category&&r.level===level&&(category!=='Verb'||r.form===form))
  const [showKanaWarning,setShowKanaWarning]=useState(false)
  useEffect(()=>setShowKanaWarning(easyRules.filter(r=>r.category===category).some(r=>!kanaOnly([r.title,r.kana,...r.examples.map(e=>e.jp)].join(' ')))),[category])
  return <section className="content"><PageHead eyebrow="SPECIAL REFERENCE" title="Easy Grammar" subtitle="একই ধরনের Grammar Rule এক জায়গায় — সহজ বাংলা ব্যাখ্যা ও উদাহরণসহ."/><div className="notice"><Zap size={19}/><div><b>Kana Only Mode</b><p>এই সেকশনের জাপানিজ Rule ও Example-এ Kanji ব্যবহার করা হবে না। Hiragana / Katakana ব্যবহার করুন।</p></div><span className="tag green">ON</span></div>
    <div className="category-grid">{categories.map((c,i)=><button key={c} className={'category-card '+(category===c?'active':'')} onClick={()=>setCategory(c)}><span className="category-icon">{['文','は','あ','つ'][i]}</span><b>{c}</b><small>{['Verb Forms','Particles','Adverbs','Sentence Connectors'][i]}</small></button>)}</div>
    {category==='Verb'&&<div className="form-selector"><b>Choose Verb Form</b><div className="topic-grid">{forms.map(f=><button key={f} className={'topic-chip '+(form===f?'active':'')} onClick={()=>setForm(f)}>{f}</button>)}</div></div>}
    <LevelSwitch level={level} setLevel={setLevel}/>
    {showKanaWarning&&<div className="notice warning">কিছু ডেমো কনটেন্টে Kanji পাওয়া গেছে। JSON-এর Easy Grammar Japanese text-এ শুধু Kana ব্যবহার করুন।</div>}
    <div className="section-head compact"><div><h2>{category} {category==='Verb'?'— '+form:''}</h2><p>{level} · {level==='N5'?'Lesson 01–25':'Lesson 26–50'} থেকে সাজানো নিয়ম</p></div><span className="count-pill">{filtered.length} rules</span></div>
    {filtered.length?<div className="rule-stack">{filtered.map(r=><article className="rule-card" key={r.id}><div className="rule-top"><span className="tag red">{r.level}</span><span className="muted small">Related lesson: {r.lessonRefs?.join(', ')||'—'}</span></div><h3>{r.title}</h3><div className="kana-box"><b>{r.kana}</b><small>{r.romaji}</small></div><h4>বাংলা ব্যাখ্যা</h4><p>{r.bangla}</p><h4>ব্যবহার (Usage)</h4><p>{r.usage}</p><h4>উদাহরণ (Examples)</h4>{r.examples.map((e,i)=><div className="rule-example" key={i}><div><b>{e.jp}</b><small>{e.romaji}</small><span>{e.bn}</span></div><button className="icon-btn" onClick={()=>speak(e.jp)}><Volume2 size={16}/></button></div>)}{!kanaOnly([r.title,r.kana,...r.examples.map(e=>e.jp)].join(' '))&&<div className="warning-text">Kana-only validation failed: এই রুলে Kanji আছে। প্রকাশের আগে সংশোধন করুন।</div>}</article>)}</div>:<Empty text="এই Level ও Form-এর জন্য এখনো কোনো Rule যোগ করা হয়নি। easyRules ডেটায় যাচাই করা Rule যোগ করুন।"/>}
  </section>
}
function QuizPage({level,setLevel,question,answer,setAnswer,done,setDone,index,setIndex,count,setCount,correct,setCorrect,saveScore}) {
  const total=quizQuestions.filter(q=>q.level===level).length
  if(!question)return <section className="content"><Empty text="এই লেভেলে এখনো Quiz প্রশ্ন নেই।"/></section>
  const submit=()=>{if(answer===null)return;setDone(true);setCount(count+1);if(answer===question.answer)setCorrect(correct+1)}
  const next=()=>{if(index+1>=total){saveScore({level,score:correct+(answer===question.answer?1:0),total,at:new Date().toISOString()});setIndex(0);setAnswer(null);setDone(false);setCount(0);setCorrect(0);alert('Quiz শেষ! Progress-এ ফলাফল দেখা যাবে।')}else{setIndex(index+1);setAnswer(null);setDone(false)}}
  return <section className="content"><PageHead eyebrow="PRACTICE" title="Quiz & Practice" subtitle="Vocabulary ও Grammar অনুশীলন করুন।"/><LevelSwitch level={level} setLevel={v=>{setLevel(v);setIndex(0);setAnswer(null);setDone(false);setCount(0);setCorrect(0)}}/><div className="quiz-card"><div className="quiz-meta"><span className="tag red">{level} QUIZ</span><span>Question {index+1} / {total}</span></div><div className="progress-track"><i style={{width:((index+1)/total*100)+'%'}}/></div><h2>{question.question}</h2><div className="choice-list">{question.choices.map((c,i)=><button key={i} disabled={done} className={'choice '+(answer===i?'chosen ':'')+(done&&i===question.answer?' correct ':'')+(done&&answer===i&&i!==question.answer?' incorrect':'')} onClick={()=>setAnswer(i)}><span>{String.fromCharCode(65+i)}</span>{c}{done&&i===question.answer&&<CheckCircle2 size={18}/>}</button>)}</div>{done&&<div className={answer===question.answer?'feedback good':'feedback bad'}>{answer===question.answer?'সঠিক উত্তর!':'সঠিক উত্তরটি চিহ্নিত করা হয়েছে।'}<p>{question.explanation}</p></div>}{!done?<button className="btn primary full" disabled={answer===null} onClick={submit}>উত্তর যাচাই করুন</button>:<button className="btn primary full" onClick={next}>{index+1>=total?'ফলাফল সংরক্ষণ করুন':'পরবর্তী প্রশ্ন'} <ChevronRight size={17}/></button>}</div></section>
}
function ProgressPage({completed,scores,favorites,reset}){return <section className="content"><PageHead eyebrow="YOUR LEARNING" title="My Progress" subtitle="আপনার শেখার অগ্রগতি এই ডিভাইসের Browser-এ সংরক্ষিত থাকে।"/><div className="stats-grid"><Stat icon={CheckCircle2} value={completed.length} label="Completed"/><Stat icon={Bookmark} value={favorites.length} label="Favorites"/><Stat icon={ClipboardCheck} value={scores.length} label="Quiz attempts"/><Stat icon={ChartNoAxesColumnIncreasing} value={Math.min(100,Math.round(completed.length/25*100))+'%'} label="Overall progress"/></div><div className="panel"><h3>Completed items</h3>{completed.length?completed.map(x=><div className="simple-row" key={x}><CheckCircle2 size={17}/>{x}</div>):<Empty text="এখনো কোনো Lesson সম্পন্ন করা হয়নি।"/>}</div><div className="panel"><h3>Quiz History</h3>{scores.length?scores.map((s,i)=><div className="simple-row" key={i}>{s.level} Quiz <b>{s.score}/{s.total}</b><small>{new Date(s.at).toLocaleDateString()}</small></div>):<Empty text="এখনো Quiz History নেই।"/>}</div><button className="btn danger-outline" onClick={reset}><RotateCcw size={16}/> Reset Progress & Favorites</button></section>}
function AboutPage(){return <section className="content"><PageHead eyebrow="ABOUT" title="Afsar's easy Nihonogo" subtitle="বাংলাভাষীদের জন্য জাপানিজ শেখার একটি সহজ ও সাজানো প্ল্যাটফর্ম।"/><div className="panel"><h3>এই সংস্করণ সম্পর্কে</h3><p>এটি একটি Static Website। কোনো Backend বা User Account প্রয়োজন নেই। আপনার Favorites ও Progress ব্রাউজারের LocalStorage-এ সংরক্ষিত হয়।</p><p>N5 Lesson 01–25-এর ১,০২৭টি vocabulary entry, প্রতিটির বাংলা অর্থ, Vocabulary Type/Topic এবং Kana-only example sentence (Romaji ও English meaning-সহ) যুক্ত করা হয়েছে। তোমার নিজের তৈরি N4 Lesson 26–30-এর ২৫০টি শব্দও অন্তর্ভুক্ত আছে।</p><p>প্রতিটি N5 শব্দের উদাহরণ বাক্য Hiragana/Katakana-তে লেখা হয়েছে।</p><p>Easy Grammar-এর Japanese text-এ Hiragana ও Katakana ব্যবহারের নিয়ম রাখা হয়েছে। নতুন কনটেন্ট যোগ করার আগে Kana-only validator দিয়ে পরীক্ষা করুন।</p></div></section>}
function PageHead({eyebrow,title,subtitle}){return <div className="section-head page-head"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div></div>}
function Empty({text}){return <div className="empty-state"><div>日本語</div><p>{text}</p></div>}

export default App;
