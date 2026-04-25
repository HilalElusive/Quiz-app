import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";

const makePlayer = () => ({
  name: "",
  value: 0,
  questions: [
    { text: "", options: ["", "", "", ""], correct: 0 },
    { text: "", options: ["", "", "", ""], correct: 0 },
  ],
  bonus: { text: "", options: ["", "", "", ""], correct: 0 },
});

const EXEMPLE = [
  {
    name: "Alice",
    value: 4,
    questions: [
      { text: "Quelle est la capitale de la France ?", options: ["Paris", "Londres", "Berlin", "Madrid"], correct: 0 },
      { text: "Quel est le plus grand océan ?", options: ["Atlantique", "Pacifique", "Indien", "Arctique"], correct: 1 },
    ],
    bonus: { text: "Combien y a-t-il de continents ?", options: ["5", "6", "7", "8"], correct: 2 },
  },
  {
    name: "Bruno",
    value: 7,
    questions: [
      { text: "En quelle année s'est terminée la Seconde Guerre mondiale ?", options: ["1943", "1944", "1945", "1946"], correct: 2 },
      { text: "Qui a écrit « 1984 » ?", options: ["Huxley", "Orwell", "Bradbury", "Asimov"], correct: 1 },
    ],
    bonus: { text: "Qui a peint la Joconde ?", options: ["De Vinci", "Michel-Ange", "Raphaël", "Donatello"], correct: 0 },
  },
  {
    name: "Carole",
    value: 2,
    questions: [
      { text: "Combien font 7 × 8 ?", options: ["54", "56", "64", "58"], correct: 1 },
      { text: "Racine carrée de 144 ?", options: ["10", "11", "12", "13"], correct: 2 },
    ],
    bonus: { text: "Combien font 15 % de 200 ?", options: ["20", "25", "30", "35"], correct: 2 },
  },
  {
    name: "David",
    value: 9,
    questions: [
      { text: "Quel élément a pour symbole « Au » ?", options: ["Argent", "Or", "Aluminium", "Argon"], correct: 1 },
      { text: "Planète la plus proche du Soleil ?", options: ["Vénus", "Terre", "Mercure", "Mars"], correct: 2 },
    ],
    bonus: { text: "Substance naturelle la plus dure ?", options: ["Fer", "Diamant", "Quartz", "Titane"], correct: 1 },
  },
  {
    name: "Ève",
    value: 3,
    questions: [
      { text: "Langue avec le plus de locuteurs natifs ?", options: ["Anglais", "Espagnol", "Mandarin", "Hindi"], correct: 2 },
      { text: "Pays le plus peuplé ?", options: ["Inde", "Chine", "États-Unis", "Indonésie"], correct: 0 },
    ],
    bonus: { text: "Fleuve le plus long ?", options: ["Amazone", "Nil", "Yangtsé", "Mississippi"], correct: 1 },
  },
];

const pad2 = (n) => String(n).padStart(2, "0");

const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');

.page { background: #E8DFCB; color: #1A1815; font-family: 'Instrument Sans', system-ui, sans-serif; }
.page-dark { background: #1A1815; color: #E8DFCB; font-family: 'Instrument Sans', system-ui, sans-serif; }
.serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; }
.mono { font-family: 'JetBrains Mono', ui-monospace, monospace; font-feature-settings: "tnum"; }
.tracked { letter-spacing: 0.18em; text-transform: uppercase; font-weight: 500; }

.ink-input {
  background: transparent;
  border: none;
  border-bottom: 1.5px solid #1A1815;
  padding: 6px 0;
  color: #1A1815;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  width: 100%;
  outline: none;
  transition: border-color 0.15s;
}
.ink-input::placeholder { color: #8B8478; font-style: italic; }
.ink-input:focus { border-bottom-color: #B8432D; border-bottom-width: 2px; padding-bottom: 5px; }

.num-input {
  background: transparent;
  border: 1.5px solid #1A1815;
  padding: 6px 8px;
  color: #1A1815;
  font-family: 'JetBrains Mono', monospace;
  text-align: center;
  width: 64px;
  outline: none;
}
.num-input:focus { border-color: #B8432D; }

.sq-radio {
  appearance: none;
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border: 1.5px solid #1A1815;
  background: transparent;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
  margin: 0;
  display: inline-block;
}
.sq-radio:checked::after {
  content: '';
  position: absolute;
  top: 2px; left: 2px; right: 2px; bottom: 2px;
  background: #B8432D;
}
.sq-radio:focus-visible { outline: 2px solid #B8432D; outline-offset: 2px; }

.option-row {
  border: 1.5px solid #1A1815;
  background: transparent;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.12s;
  margin: -0.75px;
}
.option-row:hover { background: rgba(26, 24, 21, 0.04); }
.option-row.selected { background: rgba(184, 67, 45, 0.08); border-color: #B8432D; z-index: 1; position: relative; }

.btn-primary {
  background: #1A1815; color: #E8DFCB;
  border: 1.5px solid #1A1815;
  padding: 14px 28px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-primary:hover { background: #B8432D; border-color: #B8432D; }

.btn-secondary {
  background: transparent; color: #1A1815;
  border: 1.5px solid #1A1815;
  padding: 10px 18px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-secondary:hover { background: #1A1815; color: #E8DFCB; }

.btn-accent {
  background: #B8432D; color: #E8DFCB;
  border: 1.5px solid #B8432D;
  padding: 14px 28px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-accent:hover { background: #1A1815; border-color: #1A1815; }

.btn-ghost-light {
  background: transparent; color: #E8DFCB;
  border: 1.5px solid #E8DFCB;
  padding: 14px 28px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-ghost-light:hover { background: #E8DFCB; color: #1A1815; }

.answer-btn {
  background: transparent;
  border: 1.5px solid #1A1815;
  padding: 18px 20px;
  text-align: left;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  gap: 16px;
  color: #1A1815;
  width: 100%;
}
.answer-btn:hover { background: #1A1815; color: #E8DFCB; }
.answer-btn .letter {
  width: 32px; height: 32px;
  border: 1.5px solid currentColor;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}
.answer-btn-dark {
  background: transparent;
  border: 1.5px solid #E8DFCB;
  color: #E8DFCB;
  padding: 18px 20px;
  text-align: left;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.answer-btn-dark:hover { background: #E8DFCB; color: #1A1815; }
.answer-btn-dark .letter {
  width: 32px; height: 32px;
  border: 1.5px solid currentColor;
  display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.rule { height: 1.5px; background: #1A1815; width: 100%; }
.rule-light { height: 1.5px; background: #E8DFCB; width: 100%; opacity: 0.4; }
.rule-thin { height: 1px; background: #1A1815; width: 100%; opacity: 0.3; }

.err-box {
  border: 1.5px solid #B8432D;
  background: rgba(184, 67, 45, 0.08);
  padding: 12px 16px;
  color: #1A1815;
  font-size: 14px;
}

.link-underline {
  background: none; border: none; padding: 0;
  color: inherit; cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-family: inherit;
  font-size: 13px;
}
`;

export default function QuizApp() {
  const [phase, setPhase] = useState("editor");
  const [players, setPlayers] = useState(() => Array.from({ length: 5 }, makePlayer));
  const [editorError, setEditorError] = useState("");

  const [playerIdx, setPlayerIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState([null, null]);
  const [scores, setScores] = useState(Array(5).fill(0));
  const [missed, setMissed] = useState([]);
  const [bonusQueueIdx, setBonusQueueIdx] = useState(0);
  const [playerOutcome, setPlayerOutcome] = useState(null);
  const [bonusOutcome, setBonusOutcome] = useState(null);

  const totalPossible = players.reduce((s, p) => s + (Number(p.value) || 0), 0);
  const totalEarned = scores.reduce((a, b) => a + b, 0);

  const updatePlayer = (i, patch) =>
    setPlayers(prev => prev.map((p, idx) => idx === i ? { ...p, ...patch } : p));
  const updateQ = (pI, qI, patch) =>
    setPlayers(prev => prev.map((p, i) => i !== pI ? p : {
      ...p, questions: p.questions.map((q, j) => j === qI ? { ...q, ...patch } : q)
    }));
  const updateOpt = (pI, qI, oI, val) =>
    setPlayers(prev => prev.map((p, i) => i !== pI ? p : {
      ...p, questions: p.questions.map((q, j) => j !== qI ? q : {
        ...q, options: q.options.map((o, k) => k === oI ? val : o)
      })
    }));
  const updateBonus = (pI, patch) =>
    setPlayers(prev => prev.map((p, i) => i !== pI ? p : { ...p, bonus: { ...p.bonus, ...patch } }));
  const updateBonusOpt = (pI, oI, val) =>
    setPlayers(prev => prev.map((p, i) => i !== pI ? p : {
      ...p, bonus: { ...p.bonus, options: p.bonus.options.map((o, k) => k === oI ? val : o) }
    }));

  const validate = () => {
    for (const p of players) {
      if (!p.name.trim()) return "Chaque joueur doit avoir un nom.";
      if (!p.value || p.value <= 0) return `${p.name} doit avoir une valeur de points supérieure à 0.`;
      for (let i = 0; i < 2; i++) {
        const q = p.questions[i];
        if (!q.text.trim()) return `${p.name} : la question ${i + 1} est manquante.`;
        if (q.options.some(o => !o.trim())) return `${p.name} : la question ${i + 1} a une option vide.`;
      }
      if (!p.bonus.text.trim()) return `${p.name} n'a pas de question bonus.`;
      if (p.bonus.options.some(o => !o.trim())) return `${p.name} : la question bonus a une option vide.`;
    }
    return null;
  };

  const startQuiz = () => {
    const err = validate();
    if (err) { setEditorError(err); return; }
    setEditorError("");
    setPlayerIdx(0); setQIdx(0);
    setCurrentAnswers([null, null]);
    setScores(Array(5).fill(0));
    setMissed([]); setBonusQueueIdx(0);
    setPlayerOutcome(null); setBonusOutcome(null);
    setPhase("intro");
  };

  const beginQuestions = () => {
    setQIdx(0);
    setCurrentAnswers([null, null]);
    setPhase("question");
  };

  const submitAnswer = (ansIdx) => {
    const newAnswers = [...currentAnswers];
    newAnswers[qIdx] = ansIdx;
    setCurrentAnswers(newAnswers);
    if (qIdx === 0) {
      setQIdx(1);
    } else {
      const p = players[playerIdx];
      const ok = newAnswers[0] === p.questions[0].correct && newAnswers[1] === p.questions[1].correct;
      if (ok) {
        setScores(prev => prev.map((s, i) => i === playerIdx ? p.value : s));
        setPlayerOutcome("won");
      } else {
        setPlayerOutcome("lost");
        setMissed(prev => [...prev, playerIdx]);
      }
      setPhase("playerResult");
    }
  };

  const nextPlayer = () => {
    if (playerIdx < 4) {
      setPlayerIdx(playerIdx + 1);
      setPhase("intro");
    } else {
      setPhase("summary");
    }
  };

  const startBonus = () => { setBonusQueueIdx(0); setPhase("bonusIntro"); };

  const submitBonus = (ansIdx) => {
    const pI = missed[bonusQueueIdx];
    const p = players[pI];
    if (ansIdx === p.bonus.correct) {
      setScores(prev => prev.map((s, i) => i === pI ? p.value : s));
      setBonusOutcome("won");
    } else {
      setBonusOutcome("lost");
    }
    setPhase("bonusResult");
  };

  const nextBonus = () => {
    if (bonusQueueIdx < missed.length - 1) {
      setBonusQueueIdx(bonusQueueIdx + 1);
      setPhase("bonusIntro");
    } else {
      setPhase("final");
    }
  };

  const reset = () => setPhase("editor");
  const loadSample = () => { setPlayers(JSON.parse(JSON.stringify(EXEMPLE))); setEditorError(""); };
  const clearAll = () => { setPlayers(Array.from({ length: 5 }, makePlayer)); setEditorError(""); };

  const Header = ({ label }) => (
    <div className="flex items-center justify-between mb-8">
      <span className="tracked text-xs">Le Quiz</span>
      <span className="tracked text-xs">{label}</span>
    </div>
  );

  // ---------- EDITOR ----------
  if (phase === "editor") {
    return (
      <div className="page min-h-screen">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10">
          <Header label="Édition" />
          <div className="rule mb-6"></div>

          <div className="mb-10">
            <h1 className="serif text-6xl md:text-7xl leading-none mb-3">Concepteur<br/><em>de Quiz</em></h1>
            <p className="text-sm mt-4 max-w-md leading-relaxed" style={{color: "#5A5244"}}>
              Cinq joueurs, deux questions chacun, des valeurs personnalisables, puis un tour bonus pour les perdants.
            </p>
          </div>

          <div className="flex gap-3 mb-10">
            <button onClick={loadSample} className="btn-secondary">Charger un exemple</button>
            <button onClick={clearAll} className="btn-secondary">Tout effacer</button>
          </div>

          {players.map((p, pI) => (
            <div key={pI} className="mb-12">
              <div className="rule-thin mb-6"></div>
              <div className="flex items-baseline gap-6 mb-6 flex-wrap">
                <span className="serif text-5xl">N°&nbsp;{pad2(pI + 1)}</span>
                <div className="flex-1 min-w-[180px]">
                  <label className="tracked text-xs block mb-1" style={{color: "#5A5244"}}>Nom du joueur</label>
                  <input
                    className="ink-input serif"
                    style={{fontSize: "22px"}}
                    placeholder="Entrez le nom…"
                    value={p.name}
                    onChange={e => updatePlayer(pI, { name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="tracked text-xs block mb-1" style={{color: "#5A5244"}}>Points</label>
                  <input
                    type="number" min="1"
                    className="num-input"
                    placeholder="00"
                    value={p.value || ""}
                    onChange={e => updatePlayer(pI, { value: Number(e.target.value) })}
                  />
                </div>
              </div>

              {p.questions.map((q, qI) => (
                <div key={qI} className="mb-6 pl-6" style={{borderLeft: "1.5px solid #1A1815"}}>
                  <p className="tracked text-xs mb-2" style={{color: "#5A5244"}}>Question {qI + 1}</p>
                  <input
                    className="ink-input mb-4"
                    placeholder="Énoncé de la question…"
                    value={q.text}
                    onChange={e => updateQ(pI, qI, { text: e.target.value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {q.options.map((o, oI) => (
                      <label key={oI} className={`option-row ${q.correct === oI ? "selected" : ""}`}>
                        <input
                          type="radio"
                          className="sq-radio"
                          name={`p${pI}q${qI}`}
                          checked={q.correct === oI}
                          onChange={() => updateQ(pI, qI, { correct: oI })}
                        />
                        <span className="mono text-xs" style={{color: "#5A5244"}}>{String.fromCharCode(65 + oI)}</span>
                        <input
                          className="flex-1 bg-transparent outline-none min-w-0 text-sm"
                          placeholder={`Option ${String.fromCharCode(65 + oI)}`}
                          value={o}
                          onChange={e => updateOpt(pI, qI, oI, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                  <p className="text-xs mt-2 italic serif" style={{color: "#5A5244"}}>
                    Cochez la bonne réponse.
                  </p>
                </div>
              ))}

              <div className="pl-6" style={{borderLeft: "1.5px solid #B8432D"}}>
                <p className="tracked text-xs mb-2" style={{color: "#B8432D"}}>Question bonus · si {p.name || "le joueur"} se trompe</p>
                <input
                  className="ink-input mb-4"
                  placeholder="Énoncé de la question bonus…"
                  value={p.bonus.text}
                  onChange={e => updateBonus(pI, { text: e.target.value })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {p.bonus.options.map((o, oI) => (
                    <label key={oI} className={`option-row ${p.bonus.correct === oI ? "selected" : ""}`}>
                      <input
                        type="radio"
                        className="sq-radio"
                        name={`p${pI}bonus`}
                        checked={p.bonus.correct === oI}
                        onChange={() => updateBonus(pI, { correct: oI })}
                      />
                      <span className="mono text-xs" style={{color: "#5A5244"}}>{String.fromCharCode(65 + oI)}</span>
                      <input
                        className="flex-1 bg-transparent outline-none min-w-0 text-sm"
                        placeholder={`Option ${String.fromCharCode(65 + oI)}`}
                        value={o}
                        onChange={e => updateBonusOpt(pI, oI, e.target.value)}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <div className="rule mb-6"></div>

          {editorError && <div className="err-box mb-5">{editorError}</div>}

          <div className="flex items-baseline justify-between mb-6 flex-wrap gap-3">
            <div>
              <p className="tracked text-xs mb-1" style={{color: "#5A5244"}}>Objectif score parfait</p>
              <p className="serif text-3xl"><span className="mono">{pad2(totalPossible)}</span> points</p>
            </div>
            <button onClick={startQuiz} className="btn-primary">Démarrer le quiz →</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- PLAYER INTRO ----------
  if (phase === "intro") {
    const p = players[playerIdx];
    return (
      <div className="page min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <Header label={`Joueur ${pad2(playerIdx + 1)} / 05`} />
          <div className="rule"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            <p className="tracked text-xs mb-6" style={{color: "#5A5244"}}>À vous de jouer</p>
            <h1 className="serif text-6xl md:text-8xl leading-none mb-8 break-words">{p.name}</h1>
            <p className="serif italic text-xl mb-12 max-w-md" style={{color: "#5A5244"}}>
              Répondez correctement aux deux questions pour gagner votre numéro.
            </p>
            <button onClick={beginQuestions} className="btn-primary">Je suis prêt·e →</button>
            <div className="mt-10">
              <button onClick={reset} className="link-underline" style={{color: "#5A5244"}}>
                Retour à l'éditeur
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- QUESTION ----------
  if (phase === "question") {
    const p = players[playerIdx];
    const q = p.questions[qIdx];
    return (
      <div className="page min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <Header label={`${p.name} · Question ${qIdx + 1} / 02`} />
          <div className="rule"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="max-w-3xl w-full">
            <p className="tracked text-xs mb-4" style={{color: "#5A5244"}}>Question {pad2(qIdx + 1)}</p>
            <h2 className="serif text-3xl md:text-5xl leading-tight mb-10">{q.text}</h2>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((o, i) => (
                <button key={i} onClick={() => submitAnswer(i)} className="answer-btn">
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- PLAYER RESULT ----------
  if (phase === "playerResult") {
    const p = players[playerIdx];
    const won = playerOutcome === "won";
    return (
      <div className="page min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <Header label={`${p.name} · Résultat`} />
          <div className="rule"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            {won ? (
              <>
                <p className="tracked text-xs mb-2" style={{color: "#B8432D"}}>Bravo, {p.name} — votre numéro</p>
                <div className="serif mono" style={{fontSize: "clamp(140px, 28vw, 320px)", lineHeight: "1", color: "#B8432D"}}>
                  {pad2(p.value)}
                </div>
                <p className="serif italic text-xl mt-4" style={{color: "#5A5244"}}>
                  Retenez bien ce numéro.
                </p>
              </>
            ) : (
              <>
                <h1 className="serif italic" style={{fontSize: "clamp(96px, 20vw, 220px)", lineHeight: "1"}}>
                  Oups…
                </h1>
                <p className="serif text-xl mt-6" style={{color: "#5A5244"}}>
                  Tentez votre chance au tour bonus, {p.name}.
                </p>
              </>
            )}
            <div className="mt-12">
              <button onClick={nextPlayer} className="btn-primary">
                {playerIdx < 4 ? "Joueur suivant →" : "Voir les résultats →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- SUMMARY ----------
  if (phase === "summary") {
    return (
      <div className="page min-h-screen">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <Header label="Résultats intermédiaires" />
          <div className="rule mb-8"></div>
          <h1 className="serif text-5xl md:text-6xl mb-2">Résultats</h1>
          <p className="serif italic text-lg mb-10" style={{color: "#5A5244"}}>Tour principal terminé.</p>

          <div style={{border: "1.5px solid #1A1815"}} className="mb-8">
            {players.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4" style={{borderBottom: i < players.length - 1 ? "0.75px solid #1A1815" : "none"}}>
                <div className="flex items-baseline gap-4">
                  <span className="mono text-xs" style={{color: "#5A5244"}}>N°{pad2(i + 1)}</span>
                  <span className="serif text-2xl">{p.name}</span>
                </div>
                {scores[i] > 0
                  ? <span className="mono serif text-3xl" style={{color: "#B8432D"}}>{pad2(scores[i])}</span>
                  : <span className="serif italic text-lg" style={{color: "#8B8478"}}>raté</span>}
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4" style={{borderTop: "1.5px solid #1A1815", background: "#1A1815", color: "#E8DFCB"}}>
              <span className="tracked text-sm">Total</span>
              <span className="mono serif text-3xl">{pad2(totalEarned)} <span style={{opacity: 0.5}}>/ {pad2(totalPossible)}</span></span>
            </div>
          </div>

          {missed.length > 0 ? (
            <button onClick={startBonus} className="btn-accent w-full">
              Tour bonus · {missed.length} joueur{missed.length > 1 ? "s" : ""} →
            </button>
          ) : (
            <div className="text-center">
              <p className="serif text-3xl mb-6" style={{color: "#B8432D"}}>Score parfait.</p>
              <button onClick={reset} className="btn-secondary">Retour à l'éditeur</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- BONUS INTRO ----------
  if (phase === "bonusIntro") {
    const p = players[missed[bonusQueueIdx]];
    return (
      <div className="page-dark min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <span className="tracked text-xs">Le Quiz · Bonus</span>
            <span className="tracked text-xs">{pad2(bonusQueueIdx + 1)} / {pad2(missed.length)}</span>
          </div>
          <div className="rule-light"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-2xl w-full">
            <p className="tracked text-xs mb-6" style={{color: "#B8432D"}}>Question bonus</p>
            <h1 className="serif text-6xl md:text-8xl leading-none mb-8 break-words">{p.name}</h1>
            <p className="serif italic text-xl mb-12 max-w-md" style={{opacity: 0.7}}>
              Répondez correctement pour récupérer votre numéro.
            </p>
            <button onClick={() => setPhase("bonusQuestion")} className="btn-ghost-light">
              Je suis prêt·e →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- BONUS QUESTION ----------
  if (phase === "bonusQuestion") {
    const p = players[missed[bonusQueueIdx]];
    const q = p.bonus;
    return (
      <div className="page-dark min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <span className="tracked text-xs">Bonus · {p.name}</span>
            <span className="tracked text-xs">{pad2(bonusQueueIdx + 1)} / {pad2(missed.length)}</span>
          </div>
          <div className="rule-light"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="max-w-3xl w-full">
            <p className="tracked text-xs mb-4" style={{color: "#B8432D"}}>Question bonus</p>
            <h2 className="serif text-3xl md:text-5xl leading-tight mb-10">{q.text}</h2>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((o, i) => (
                <button key={i} onClick={() => submitBonus(i)} className="answer-btn-dark">
                  <span className="letter">{String.fromCharCode(65 + i)}</span>
                  <span>{o}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- BONUS RESULT ----------
  if (phase === "bonusResult") {
    const p = players[missed[bonusQueueIdx]];
    const won = bonusOutcome === "won";
    const last = bonusQueueIdx >= missed.length - 1;
    return (
      <div className="page-dark min-h-screen flex flex-col">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-3xl mx-auto px-6 py-10 w-full">
          <div className="flex items-center justify-between mb-8">
            <span className="tracked text-xs">Bonus · Résultat</span>
            <span className="tracked text-xs">{pad2(bonusQueueIdx + 1)} / {pad2(missed.length)}</span>
          </div>
          <div className="rule-light"></div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 text-center">
          <div>
            {won ? (
              <>
                <p className="tracked text-xs mb-2" style={{color: "#B8432D"}}>Rattrapé, {p.name}</p>
                <div className="serif mono" style={{fontSize: "clamp(140px, 28vw, 320px)", lineHeight: "1", color: "#B8432D"}}>
                  {pad2(p.value)}
                </div>
                <p className="serif italic text-xl mt-4" style={{opacity: 0.7}}>
                  Récupéré au tour bonus.
                </p>
              </>
            ) : (
              <>
                <h1 className="serif italic" style={{fontSize: "clamp(96px, 20vw, 220px)", lineHeight: "1"}}>
                  Oups…
                </h1>
                <p className="serif text-xl mt-6" style={{opacity: 0.7}}>
                  Pas de chance, {p.name}.
                </p>
              </>
            )}
            <div className="mt-12">
              <button onClick={nextBonus} className="btn-ghost-light">
                {last ? "Résultats finaux →" : "Bonus suivant →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- FINAL ----------
  if (phase === "final") {
    const fullMark = totalEarned === totalPossible;
    return (
      <div className="page min-h-screen">
        <Analytics />
        <style>{STYLE}</style>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <Header label="Score final" />
          <div className="rule mb-8"></div>
          <h1 className="serif text-5xl md:text-6xl mb-2">Score final</h1>
          {fullMark
            ? <p className="serif italic text-2xl mb-10" style={{color: "#B8432D"}}>Score parfait.</p>
            : <p className="serif italic text-lg mb-10" style={{color: "#5A5244"}}>Quiz terminé.</p>}

          <div style={{border: "1.5px solid #1A1815"}} className="mb-8">
            {players.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-4" style={{borderBottom: i < players.length - 1 ? "0.75px solid #1A1815" : "none"}}>
                <div className="flex items-baseline gap-4">
                  <span className="mono text-xs" style={{color: "#5A5244"}}>N°{pad2(i + 1)}</span>
                  <span className="serif text-2xl">{p.name}</span>
                </div>
                <span className="mono serif text-3xl" style={{color: scores[i] > 0 ? "#B8432D" : "#8B8478"}}>
                  {pad2(scores[i])}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between px-5 py-4" style={{borderTop: "1.5px solid #1A1815", background: "#1A1815", color: "#E8DFCB"}}>
              <span className="tracked text-sm">Total</span>
              <span className="mono serif text-3xl">{pad2(totalEarned)} <span style={{opacity: 0.5}}>/ {pad2(totalPossible)}</span></span>
            </div>
          </div>

          <button onClick={reset} className="btn-secondary w-full">Retour à l'éditeur</button>
        </div>
      </div>
    );
  }

  return null;
}