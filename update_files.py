import re

# 1. Update app.module.css
with open('/home/hassan/Desktop/tot/src/app/app/app.module.css', 'r') as f:
    css_content = f.read()

css_content = css_content.replace('var(--color-primary)', 'var(--amber)')
css_content = css_content.replace('var(--color-surface)', 'var(--surface-1)')
css_content = css_content.replace('var(--color-border)', 'var(--border-subtle)')
css_content = css_content.replace('var(--color-text)', 'var(--white-90)')

with open('/home/hassan/Desktop/tot/src/app/app/app.module.css', 'w') as f:
    f.write(css_content)

# 2. Update page.js
with open('/home/hassan/Desktop/tot/src/app/app/page.js', 'r') as f:
    js = f.read()

# Fix CSS vars
js = js.replace('var(--color-primary)', 'var(--amber)')
js = js.replace('var(--color-surface)', 'var(--surface-1)')
js = js.replace('var(--color-border)', 'var(--border-subtle)')
js = js.replace('var(--color-text)', 'var(--white-90)')
# Wait, page.js has var(--color-text-muted) which we might not have a replacement for, let's leave it or replace it? The instructions only specified the 4 above.

# Add imports
js = js.replace("import styles from './app.module.css';", "import styles from './app.module.css';\nimport Logo from '@/components/Logo';\nimport { useRouter } from 'next/navigation';")
js = js.replace("import { categories, readingStyles, contentVibes, readingTimes } from '@/data/categories';", "import { categories as allCategories, readingStyles, contentVibes, readingTimes } from '@/data/categories';")
js = js.replace("categories.map(cat => {", "allCategories.map(cat => {")

# Add auth state & router
js = js.replace("const [isReady, setIsReady] = useState(false);", "const [isReady, setIsReady] = useState(false);\n  const [isAuthChecked, setIsAuthChecked] = useState(false);\n  const router = useRouter();")

# Update useEffect
old_use_effect = """  useEffect(() => {
    // Initial load check
    const savedProfile = localStorage.getItem('tot_profile');"""

new_use_effect = """  useEffect(() => {
    const userStr = localStorage.getItem('tot_user');
    let loggedInUser = null;
    try {
      if (userStr) loggedInUser = JSON.parse(userStr);
    } catch (e) {}

    if (!loggedInUser || !loggedInUser.loggedIn) {
      router.push('/login');
      return;
    }
    
    setIsAuthChecked(true);

    // Initial load check
    const savedProfile = localStorage.getItem('tot_profile');"""
js = js.replace(old_use_effect, new_use_effect)

# Pre-return check
js = js.replace("  // ----- Screens ----- //\n", "  // ----- Screens ----- //\n\n  if (!isAuthChecked) return null;\n")

# Replace logos
js = js.replace('<img src="/logo.png" alt="TOT Logo" className={styles.splashLogo} onError={(e) => { e.target.style.display = \'none\'; }} />', '<Logo size={100} glow className={styles.splashLogo} />')
js = js.replace('<img src="/logo.png" alt="TOT Logo" style={{ width: 80, height: 80, borderRadius: \'50%\', marginBottom: \'2rem\' }} onError={(e) => { e.target.style.display = \'none\'; }} />', '<Logo size={80} />')
js = js.replace('<img src="/logo.png" alt="TOT Logo" className={`${styles.homeLogo} ${isReady ? \'animate-glow\' : \'\'}`} onError={(e) => { e.target.style.display = \'none\'; }} />', '<Logo size={80} glow={isReady} className={styles.homeLogo} />')

# Fix style.name to style.label
js = js.replace('<h3 className="t-heading-2">{style.name}</h3>', '<h3 className="t-heading-2">{style.label}</h3>')
js = js.replace('<h3 className="t-heading-2">{vibe.name}</h3>', '<h3 className="t-heading-2">{vibe.label}</h3>')
# Wait, for readingTimes, it uses time.name. Let's see if that needs to be time.label. Instructions didn't say.

# Reading screen fixes
old_reading_start = """  if (screen === 'reading') {
    if (!topic) return null; // Safety fallback
    
    return (
      <div className={styles.container} style={{ padding: 0, overflowY: 'auto', height: '100dvh' }} onScroll={handleScroll}>"""

new_reading_start = """  if (screen === 'reading') {
    if (!topic) return null; // Safety fallback
    
    const cat = allCategories.find(c => c.id === topic.categoryId);
    
    return (
      <div className={styles.container} style={{ padding: 0, overflowY: 'auto', height: '100dvh' }} onScroll={handleScroll}>"""
js = js.replace(old_reading_start, new_reading_start)

js = js.replace("{topic.categoryEmoji || '✨'} {topic.categoryName || 'Topic'}", "{cat?.emoji || '✨'} {cat?.name || 'Topic'}")

js = js.replace("topic.content", "topic.body")
js = js.replace("{topic.body ? (", "{topic.body ? (") # just to be sure it replaced

# Wrapper
def wrap_return(match):
    content = match.group(1)
    # determine screen by looking slightly before the match if possible, but actually we can just check if it contains styles.readingContainer
    if "styles.readingContainer" in content:
        inner_class = "reading-desktop"
    else:
        inner_class = "app-desktop-card"
        
    return f'return (\n      <div className="app-desktop-shell">\n        <div className="{inner_class}">\n          {content.strip()}\n        </div>\n      </div>\n    );'

js = re.sub(r'return\s*\(\s*([\s\S]*?)(?:;\s*\}|\n    \);)', wrap_return, js)
# Wait, this regex might be too brittle. Let's do it with replace.

with open('/home/hassan/Desktop/tot/src/app/app/page.js', 'w') as f:
    f.write(js)
