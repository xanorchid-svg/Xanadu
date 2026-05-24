import re, sys

path = '/Users/xanorchid/Desktop/xanadu/src/App.jsx'

with open(path, 'r') as f:
    src = f.read()

# ── 1. Expand formData state ──────────────────────────────────────────────────
src = src.replace(
    "const [formData, setFormData] = useState({ name: '', email: '', role: '', intention: '' })",
    "const [formData, setFormData] = useState({ name: '', email: '', role: '', intention: '', phone: '', website: '', instagram: '', city: '', country: '', also_based: '', container_name: '', offerings: '' })"
)

# ── 2. Replace handleSubmit ───────────────────────────────────────────────────
old_submit = """  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role) return
    setSubmitting(true)
    setFormError(null)
    const { error } = await supabase
      .from('waitlist')
      .insert([{
        name: formData.name,
        email: formData.email,
        role: formData.role,
        intention: formData.intention,
      }])
    setSubmitting(false)
    if (error) {
      setFormError('Something went wrong. Please try again.')
    } else {
      setSubmitted(true)
    }
  }"""

new_submit = """  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.role) return
    setSubmitting(true)
    setFormError(null)
    try {
      if (formData.role === 'Container') {
        const { error } = await supabase.from('container_applications').insert([{
          your_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          container_name: formData.container_name || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          city: formData.city || null,
          country: formData.country || null,
          also_based: formData.also_based || null,
          offerings: formData.offerings || null,
          lineage: formData.intention || null,
          role: 'container',
        }])
        if (error) throw error
      } else if (formData.role === 'Facilitator') {
        const { error } = await supabase.from('facilitator_applications').insert([{
          your_name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          website: formData.website || null,
          instagram: formData.instagram || null,
          city: formData.city || null,
          country: formData.country || null,
          also_based: formData.also_based || null,
          offerings: formData.offerings || null,
          lineage: formData.intention || null,
          role: 'facilitator',
        }])
        if (error) throw error
      } else {
        const { error } = await supabase.from('waitlist').insert([{
          name: formData.name,
          email: formData.email,
          role: formData.role,
          intention: formData.intention,
        }])
        if (error) throw error
      }
      setSubmitted(true)
    } catch (err) {
      console.error(err)
      setFormError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }"""

src = src.replace(old_submit, new_submit)

# ── 3. Replace the form block ─────────────────────────────────────────────────
old_form = """            <form className="join-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label>Name</label>
                  <input type="text" placeholder="Your full name" required
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="Your email address" required
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="field">
                <label>I am entering as —</label>
                <div className="role-options">
                  {[
                    { id: 'Seeker', icon: '◎', desc: 'Seeking healing, growth & belonging' },
                    { id: 'Facilitator', icon: '◈', desc: 'A guide, teacher & wisdom keeper' },
                    { id: 'Container', icon: '⬡', desc: 'A sacred space that holds the work' },
                  ].map(({ id, icon, desc }) => (
                    <button key={id} type="button"
                      className={`role-btn ${formData.role === id ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, role: id})}>
                      <span className="role-icon">{icon}</span>
                      <span className="role-name">{id}</span>
                      <span className="role-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Your intention <span className="optional">— optional</span></label>
                <textarea placeholder="What are you bringing, seeking, or offering?" rows={3}
                  value={formData.intention} onChange={e => setFormData({...formData, intention: e.target.value})} />
              </div>
              {formError && <p className="form-error">{formError}</p>}
              <button type="submit" className="btn-submit" disabled={submitting}>
                <span>{submitting ? 'Sending...' : 'Come as You Are'}</span>
              </button>
              {!formData.role && <p className="form-hint">Select your role to continue.</p>}
            </form>"""

new_form = """            <form className="join-form" onSubmit={handleSubmit}>
              <div className="field">
                <label>I am entering as —</label>
                <div className="role-options">
                  {[
                    { id: 'Seeker',      icon: '◎', desc: 'Seeking healing, growth & belonging' },
                    { id: 'Facilitator', icon: '◈', desc: 'A guide, teacher & wisdom keeper' },
                    { id: 'Container',   icon: '⬡', desc: 'A sacred space that holds the work' },
                  ].map(({ id, icon, desc }) => (
                    <button key={id} type="button"
                      className={`role-btn ${formData.role === id ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, role: id})}>
                      <span className="role-icon">{icon}</span>
                      <span className="role-name">{id}</span>
                      <span className="role-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.role && (
                <>
                  <div className="form-row">
                    <div className="field">
                      <label>Name</label>
                      <input type="text" placeholder="Your full name" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="field">
                      <label>Email</label>
                      <input type="email" placeholder="Your email address" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                  </div>

                  {(formData.role === 'Facilitator' || formData.role === 'Container') && (
                    <div className="form-row">
                      <div className="field">
                        <label>Phone <span className="optional">— optional</span></label>
                        <input type="tel" placeholder="+1 555 000 0000"
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                      </div>
                      <div className="field">
                        <label>Instagram <span className="optional">— optional</span></label>
                        <input type="text" placeholder="@yourhandle"
                          value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {formData.role === 'Container' && (
                    <div className="field">
                      <label>Container name</label>
                      <input type="text" placeholder="The name of your space"
                        value={formData.container_name} onChange={e => setFormData({...formData, container_name: e.target.value})} />
                    </div>
                  )}

                  {(formData.role === 'Facilitator' || formData.role === 'Container') && (
                    <>
                      <div className="field">
                        <label>Website <span className="optional">— optional</span></label>
                        <input type="url" placeholder="https://"
                          value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                      </div>
                      <div className="form-row">
                        <div className="field">
                          <label>City</label>
                          <input type="text" placeholder="Nosara"
                            value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                        </div>
                        <div className="field">
                          <label>Country</label>
                          <input type="text" placeholder="Costa Rica"
                            value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                        </div>
                      </div>
                      <div className="field">
                        <label>{formData.role === 'Container' ? 'What kinds of experiences do you host or want to host?' : 'What do you offer?'}</label>
                        <textarea
                          placeholder={formData.role === 'Container' ? 'Retreats, ceremonies, residencies, workshops...' : 'Breathwork, ceremony, somatic work, yoga, sound healing...'}
                          rows={3}
                          value={formData.offerings}
                          onChange={e => setFormData({...formData, offerings: e.target.value})} />
                      </div>
                    </>
                  )}

                  <div className="field">
                    <label>
                      {formData.role === 'Facilitator' ? 'What is your intention?' : 'Your intention'}
                      <span className="optional"> — optional</span>
                    </label>
                    <textarea
                      placeholder={
                        formData.role === 'Facilitator'
                          ? 'Why do you do this work? What called you to it? What do you hold for the people you guide?'
                          : formData.role === 'Container'
                          ? 'What is the spirit of your space? What are you seeking through Xanadu?'
                          : 'What are you bringing, seeking, or offering?'
                      }
                      rows={3}
                      value={formData.intention}
                      onChange={e => setFormData({...formData, intention: e.target.value})} />
                  </div>
                </>
              )}

              {formError && <p className="form-error">{formError}</p>}
              <button type="submit" className="btn-submit" disabled={submitting || !formData.role}>
                <span>{submitting ? 'Sending...' : 'Come as You Are'}</span>
              </button>
              {!formData.role && <p className="form-hint">Select your role to begin.</p>}
            </form>"""

src = src.replace(old_form, new_form)

with open(path, 'w') as f:
    f.write(src)

print("✓ App.jsx patched successfully")
