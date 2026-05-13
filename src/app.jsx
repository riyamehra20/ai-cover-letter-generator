import { useState } from 'react'
import { generateCoverLetter, generateTemplate } from './gemini.js'
import styles from './App.module.css'

const INITIAL_FORM = {
  name: '',
  role: '',
  company: '',
  experience: '',
  jobDescription: '',
}

export default function App() {
  // ── Form State ──────────────────────────────────────────────
  const [form, setForm] = useState(INITIAL_FORM)
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [mode, setMode] = useState('ai') // 'ai' | 'template'

  // ── Output State ────────────────────────────────────────────
  const [output, setOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  // ── Form Handlers ───────────────────────────────────────────
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = skillInput.trim().replace(/,$/, '')
      if (val && !skills.includes(val) && skills.length < 10) {
        setSkills(prev => [...prev, val])
      }
      setSkillInput('')
    }
  }

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
    if (!form.name.trim()) return 'Please enter your name.'
    if (!form.role.trim()) return 'Please enter the job role.'
    if (!form.company.trim()) return 'Please enter the target company.'
    if (skills.length === 0) return 'Please add at least one key skill.'
    return null
  }

  // ── Generate Handler ─────────────────────────────────────────
  const handleGenerate = async () => {
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setError('')
    setOutput('')
    setIsGenerating(true)

    const formData = { ...form, skills }

    try {
      let letter
      if (mode === 'ai') {
        letter = await generateCoverLetter(formData)
      } else {
        // Phase 1 — simulate delay then use template
        await new Promise(r => setTimeout(r, 500))
        letter = generateTemplate(formData)
      }
      setOutput(letter)
      setWordCount(letter.split(/\s+/).filter(Boolean).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setForm(INITIAL_FORM)
    setSkills([])
    setSkillInput('')
    setOutput('')
    setError('')
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <span className={styles.badge}>✦ AI-Powered</span>
          </div>
          <h1 className={styles.title}>Cover Letter Generator</h1>
          <p className={styles.subtitle}>
            Fill in your details — get a professional, tailored cover letter in seconds.
          </p>
        </header>

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'ai' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('ai')}
          >
             AI Mode (Gemini)
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'template' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('template')}
          >
            Template Mode
          </button>
        </div>

        {mode === 'template' && (
          <p className={styles.modeNote}>
            Template mode fills a structured template instantly — no API call. Good for testing offline.
          </p>
        )}

        {/* Form */}
        <div className={styles.card}>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">Your Name</label>
              <input
                className={styles.input}
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={form.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="role">Job Role</label>
              <input
                className={styles.input}
                id="role"
                name="role"
                type="text"
                placeholder="e.g. Senior Product Manager"
                value={form.role}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="company">Target Company</label>
              <input
                className={styles.input}
                id="company"
                name="company"
                type="text"
                placeholder="e.g. Google"
                value={form.company}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="experience">Years of Experience</label>
              <input
                className={styles.input}
                id="experience"
                name="experience"
                type="text"
                placeholder="e.g. 4"
                value={form.experience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="jobDescription">
              Job Description <span className={styles.optional}>(optional — improves output)</span>
            </label>
            <textarea
              className={styles.textarea}
              id="jobDescription"
              name="jobDescription"
              placeholder="Paste the job description here for a more tailored letter..."
              value={form.jobDescription}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="skillInput">
              Key Skills <span className={styles.optional}>(press Enter to add)</span>
            </label>
            <input
              className={styles.input}
              id="skillInput"
              type="text"
              placeholder="e.g. React, Node.js, Team Leadership..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
            />
            {skills.length > 0 && (
              <div className={styles.tags}>
                {skills.map((s, i) => (
                  <span key={i} className={styles.tag}>
                    {s}
                    <button
                      className={styles.tagRemove}
                      onClick={() => removeSkill(i)}
                      aria-label={`Remove ${s}`}
                    >×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className={styles.error}>
            <span>⚠ {error}</span>
          </div>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.btnPrimary}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className={styles.spinner} aria-hidden="true" /> Generating...
              </>
            ) : (
              <> ✦ Generate Cover Letter</>
            )}
          </button>
          <button className={styles.btnSecondary} onClick={handleClear}>
            ↺ Clear
          </button>
        </div>

        {/* Output */}
        {(isGenerating || output) && (
          <div className={styles.outputSection}>
            <div className={styles.outputHeader}>
              <div className={styles.outputMeta}>
                <span className={styles.outputLabel}>Generated Letter</span>
                {output && (
                  <span className={styles.wordCount}>{wordCount} words</span>
                )}
              </div>
              {output && (
                <div className={styles.outputActions}>
                  <button className={styles.iconBtn} onClick={handleCopy}>
                    {copied ? '✓ Copied!' : '⎘ Copy'}
                  </button>
                  <button className={styles.iconBtn} onClick={handleGenerate}>
                    ↺ Regenerate
                  </button>
                </div>
              )}
            </div>

            {isGenerating ? (
              <div className={styles.generatingState}>
                <div className={styles.dots}>
                  <span /><span /><span />
                </div>
                <p>Generating your cover letter with Gemini AI...</p>
              </div>
            ) : (
              <div className={styles.outputBody}>
                <pre className={styles.outputText}>{output}</pre>
                <div className={styles.outputFooter}>
                  <span className={styles.pill}>🏢 {form.company}</span>
                  <span className={styles.pill}>💼 {form.role}</span>
                  <span className={styles.pill}>{mode === 'ai' ? ' Gemini AI' : ' Template'}</span>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
